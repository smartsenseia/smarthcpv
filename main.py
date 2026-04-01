# -*- coding: utf-8 -*-
import os
import sys
import time
import platform
import subprocess
import signal
import shutil
from pathlib import Path
from datetime import datetime
from typing import Optional
from ALGORITHMS_AND_DATA.alarm_gpio import AlarmMonitor, AlarmConfig, DEFAULT_LIMITS
from pymodbus.client import ModbusSerialClient

from ALGORITHMS_AND_DATA.connection import ler_dados_modbus, ler_dados_serial_usb
from ALGORITHMS_AND_DATA.Config_modbus import MODBUS_CONFIG
from ALGORITHMS_AND_DATA.FP import FP
from ALGORITHMS_AND_DATA.GOR import GOR
from ALGORITHMS_AND_DATA.SEC import SEC

# ==========================================================
# Config geral
# ==========================================================
ASSET_ID = os.environ.get("ASSET_ID", "MD01BR01")
LOOP_SECONDS = float(os.environ.get("LOOP_SECONDS", "1.0"))

BASE_DIR = Path(__file__).resolve().parent
ALGO_DIR = BASE_DIR / "ALGORITHMS_AND_DATA"
FASTAPI_DIR = BASE_DIR / "FASTAPI"
SOM_SCRIPT = ALGO_DIR / "SOM.py"

PORT_FASTAPI = 8000

# ==========================================================
# Cloudflare Tunnel (igual ao seu primeiro main.py)
# ==========================================================
CLOUDFLARED_CONFIG = str(BASE_DIR / "cloudflared_config.yml")
CLOUDFLARE_TUNNEL_NAME = os.environ.get("CLOUDFLARE_TUNNEL_NAME", "smartsense-dashboard")
CLOUDFLARED_LOG = str(BASE_DIR / "logs" / "cloudflared.log")

# Opcional: caminho explícito do binário cloudflared (se not found via PATH)
CLOUDFLARED_BIN = shutil.which("cloudflared") or "/usr/local/bin/cloudflared"

# ==========================================================
# SOM
# ==========================================================
SOM_ENV = {
    "SOM_FRAME_PATH": str(ALGO_DIR / "som_frame.png"),
    "SOM_STATUS_PATH": str(ALGO_DIR / "som_status.json"),
    "SOM_REFRESH_SECONDS": "1.0",
    "SOM_ARTIFACT_DIR": str(ALGO_DIR / "MODEL"),
}

# ==========================================================
# Utils
# ==========================================================
def log(msg: str) -> None:
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}", flush=True)

def safe_call(fn, *args, **kwargs):
    try:
        return True, fn(*args, **kwargs)
    except Exception as e:
        return False, e

def ensure_dir(path: Path) -> Path:
    path.mkdir(parents=True, exist_ok=True)
    return path

def find_executable(name_or_path: str, fallback: Optional[str] = None) -> Optional[str]:
    # Se já for um caminho e existir, usa
    if name_or_path and os.path.isabs(name_or_path) and os.path.exists(name_or_path):
        return name_or_path
    # Senão tenta PATH
    p = shutil.which(name_or_path)
    if p:
        return p
    # Por fim fallback
    if fallback and os.path.exists(fallback):
        return fallback
    return None

# ==========================================================
# Processos & shutdown
# ==========================================================
_child_procs: list[subprocess.Popen] = []

def start_proc(cmd, cwd=None, env=None, stdout=None, stderr=None) -> subprocess.Popen:
    """
    Inicia subprocesso em um new process group (Linux/RPi) para matar grupo inteiro.
    """
    proc = subprocess.Popen(
        cmd,
        cwd=cwd,
        env=env,
        stdout=stdout or subprocess.DEVNULL,
        stderr=stderr or subprocess.STDOUT,
        preexec_fn=os.setsid if platform.system() != "Windows" else None,
        close_fds=(platform.system() != "Windows"),
        shell=False,
    )
    _child_procs.append(proc)
    return proc

def terminate_all_children(grace=5):
    # Encerra grupos (Linux) ou terminate (Windows)
    for proc in list(_child_procs):
        if not proc:
            continue
        try:
            if proc.poll() is not None:
                continue
            if platform.system() != "Windows":
                pgid = os.getpgid(proc.pid)
                os.killpg(pgid, signal.SIGTERM)
            else:
                proc.terminate()
        except Exception:
            pass

    deadline = time.time() + grace
    for proc in list(_child_procs):
        if not proc:
            continue
        timeout = max(0, deadline - time.time())
        try:
            proc.wait(timeout=timeout)
        except Exception:
            try:
                if proc.poll() is None:
                    if platform.system() != "Windows":
                        pgid = os.getpgid(proc.pid)
                        os.killpg(pgid, signal.SIGKILL)
                    else:
                        proc.kill()
            except Exception:
                pass

def _signal_handler(signum, frame):
    log(f"Recebido sinal {signum}. Encerrando...")
    terminate_all_children(grace=3)
    sys.exit(0)

signal.signal(signal.SIGINT, _signal_handler)
signal.signal(signal.SIGTERM, _signal_handler)

# ==========================================================
# Kill portas
# ==========================================================
def matar_processos_portas(*portas: int):
    so = platform.system()
    for porta in portas:
        try:
            if so != "Windows":
                subprocess.run(["fuser", "-k", f"{porta}/tcp"], check=True)
            else:
                out = subprocess.check_output(
                    f'netstat -ano | findstr :{porta}', shell=True
                ).decode(errors="ignore")

                pids = {
                    line.split()[-1]
                    for line in out.splitlines()
                    if line.split() and line.split()[-1].isdigit()
                }
                for pid in pids:
                    if pid != "0":
                        subprocess.run(f"taskkill /PID {pid} /F", shell=True)

            log(f"✅ Porta {porta} liberada.")
        except subprocess.CalledProcessError:
            log(f"⚠️ Nenhum processo na porta {porta}.")

# ==========================================================
# Cloudflare Tunnel
# ==========================================================
def iniciar_tunnel_cloudflare() -> subprocess.Popen:
    bin_path = find_executable(CLOUDFLARED_BIN, fallback="cloudflared")
    if not bin_path:
        raise RuntimeError("cloudflared não encontrado. Instale-o ou ajuste CLOUDFLARED_BIN.")

    ensure_dir(Path(CLOUDFLARED_LOG).parent)

    # Evita múltiplas instâncias (igual seu 1º código)
    try:
        if platform.system() != "Windows":
            subprocess.run(["pkill", "-f", "cloudflared"], check=False)
    except Exception:
        pass

    logf = open(CLOUDFLARED_LOG, "a")
    cmd = [bin_path, "tunnel", "--config", CLOUDFLARED_CONFIG, "run", CLOUDFLARE_TUNNEL_NAME]
    log(f"🌐 Iniciando cloudflared: {' '.join(cmd)} | log={CLOUDFLARED_LOG}")
    return start_proc(cmd, cwd=str(BASE_DIR), stdout=logf, stderr=logf)

# ==========================================================
# FastAPI
# ==========================================================
def iniciar_fastapi() -> subprocess.Popen:
    return start_proc(
        [
            sys.executable,
            "-m",
            "uvicorn",
            "app.main:app",
            "--host",
            "0.0.0.0",
            "--port",
            str(PORT_FASTAPI),
        ],
        cwd=str(FASTAPI_DIR),
    )

def fastapi_esta_vivo(proc: Optional[subprocess.Popen]) -> bool:
    return proc is not None and proc.poll() is None

# 1.5) Alarm monitor (GPIO 21 lendo DB)
alarm = None
db_url = os.environ.get("DB_URL", "sqlite:////home/ramon/MDIS/mdis/FASTAPI/app.db")

# (opcional) ajuste limites aqui
limits = DEFAULT_LIMITS.copy()
# limits["temp_1"] = (None, 82.0)  # exemplo

try:
    alarm = AlarmMonitor(
        AlarmConfig(
            db_url=db_url,
            gpio_pin_bcm=21,
            poll_seconds=1.0,
            relay_active_high=True,
            hysteresis=0.02,
            limits=limits,
        )
    )
    alarm.start()
except Exception as e:
    log(f"⚠️ Não consegui iniciar AlarmMonitor: {e}")

# ==========================================================
# SOM
# ==========================================================
def iniciar_som_service() -> subprocess.Popen:
    env = os.environ.copy()
    env.update(SOM_ENV)
    if not SOM_SCRIPT.exists():
        raise FileNotFoundError(f"SOM.py não encontrado: {SOM_SCRIPT}")
    return start_proc([sys.executable, str(SOM_SCRIPT)], cwd=str(ALGO_DIR), env=env)

def som_esta_vivo(proc: Optional[subprocess.Popen]) -> bool:
    return proc is not None and proc.poll() is None

# ==========================================================
# Modbus helpers
# ==========================================================
def criar_client_modbus() -> ModbusSerialClient:
    return ModbusSerialClient(**MODBUS_CONFIG)

def conectar_modbus(client: ModbusSerialClient) -> bool:
    try:
        return bool(client.connect())
    except Exception:
        return False

# ==========================================================
# Main
# ==========================================================
def main():
    ensure_dir(BASE_DIR / "logs")

    # libera porta do FastAPI
    matar_processos_portas(PORT_FASTAPI)

    # 0) Tunnel (primeiro, como no seu 1º main.py)
    tunnel_proc = None
    ok, res = safe_call(iniciar_tunnel_cloudflare)
    if ok:
        tunnel_proc = res
        log("✅ Cloudflare Tunnel iniciado.")
    else:
        log(f"⚠️ Tunnel falhou: {res}")

    time.sleep(2.0)

    # 1) FastAPI
    fastapi_proc = None
    ok, res = safe_call(iniciar_fastapi)
    if ok:
        fastapi_proc = res
        log("✅ FastAPI iniciado.")
    else:
        log(f"⚠️ FastAPI falhou: {res}")

    time.sleep(1.5)
    if fastapi_esta_vivo(fastapi_proc):
        log("✅ FastAPI está vivo.")
    else:
        log("⚠️ FastAPI parece offline (seguindo mesmo assim).")

    # 2) SOM
    som_proc = None
    ok, res = safe_call(iniciar_som_service)
    if ok:
        som_proc = res
        log("✅ SOM iniciado.")
    else:
        log(f"⚠️ SOM falhou: {res}")

    # 3) Modbus – client único
    client = criar_client_modbus()
    if not conectar_modbus(client):
        raise RuntimeError("❌ Falha ao conectar Modbus")

    time.sleep(0.5)

    fp = FP(modbus_kw=MODBUS_CONFIG, client=client)
    gor = GOR()
    sec = SEC()

    log(f"📡 Sistema ativo | asset={ASSET_ID} | loop={LOOP_SECONDS}s")

    modbus_fail_streak = 0
    MODBUS_FAIL_RECONNECT_AT = 3

    try:
        while True:
            # watchdog
            if fastapi_proc and not fastapi_esta_vivo(fastapi_proc):
                log("⚠️ FastAPI caiu. Tentando reiniciar...")
                ok, res = safe_call(iniciar_fastapi)
                if ok:
                    fastapi_proc = res

            if som_proc and not som_esta_vivo(som_proc):
                log("⚠️ SOM caiu. Tentando reiniciar...")
                ok, res = safe_call(iniciar_som_service)
                if ok:
                    som_proc = res

            if tunnel_proc and (tunnel_proc.poll() is not None):
                log("⚠️ Tunnel caiu. Tentando reiniciar...")
                ok, res = safe_call(iniciar_tunnel_cloudflare)
                if ok:
                    tunnel_proc = res

            # Serial hot
            ok_cond, condhot = safe_call(ler_dados_serial_usb)
            if not ok_cond:
                condhot = None

            # Modbus cycle
            ok_read, res = safe_call(
                ler_dados_modbus,
                client=client,
                fp=fp,
                gor=gor,
                sec=sec,
                condhot_uScm=condhot,
            )

            if not ok_read:
                modbus_fail_streak += 1
                log(f"❌ Exceção no ciclo Modbus: {res}")
            elif res is None:
                modbus_fail_streak += 1
                log("⚠️ Nenhum dado lido do Modbus (retorno None). Nada foi enviado.")
            else:
                modbus_fail_streak = 0
                log("✅ Dados lidos e enviados para API")

            if modbus_fail_streak >= MODBUS_FAIL_RECONNECT_AT:
                log("🔁 Muitas falhas seguidas no Modbus. Tentando reconectar...")
                try:
                    client.close()
                except Exception:
                    pass

                client = criar_client_modbus()
                if conectar_modbus(client):
                    log("✅ Modbus reconectado.")
                    modbus_fail_streak = 0
                    try:
                        fp.client = client
                    except Exception:
                        pass
                else:
                    log("❌ Falha ao reconectar Modbus (vou tentar de novo nos próximos ciclos).")

            time.sleep(LOOP_SECONDS)

    except KeyboardInterrupt:
        log("🛑 Encerrando sistema...")

    finally:
        try:
            client.close()
        except Exception:
            pass

        if alarm:
            try:
                alarm.stop()
            except Exception:
                pass


        log("Encerrando subprocessos...")
        terminate_all_children(grace=3)
        log("Encerrado.")

if __name__ == "__main__":
    main()
