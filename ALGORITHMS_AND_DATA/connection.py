# ALGORITHMS_AND_DATA/connection.py
from __future__ import annotations

from datetime import datetime
from typing import Optional
from collections import deque

import httpx
import numpy as np
import re
import serial
from pymodbus.client import ModbusSerialClient

from .Config_serial import SERIAL_CONFIG
from .FP import FP
from .GOR import GOR
from .SEC import SEC

API_URL = "http://localhost:8000/api/v1/endpoints/post"

# histórico das 3 últimas leituras de condutividade
_cond_history = deque(maxlen=3)


# ==========================================================
# SERIAL: retorna condutividade média (uS/cm) ou None
# ==========================================================
def ler_dados_serial_usb() -> Optional[float]:
    """
    Lê uma linha da porta serial, extrai a condutividade em uS/cm
    e retorna a média das 5 últimas leituras válidas.

    Aceita 'uS/cm' e 'mS/cm' (convertendo mS/cm -> uS/cm).
    """
    try:
        # abre/fecha a cada leitura para reduzir chance de travamento da porta
        with serial.Serial(**SERIAL_CONFIG) as ser:
            raw = ser.readline()

        if not raw:
            return None

        line = raw.decode("utf-8", errors="ignore").strip()
        m = re.search(r">?\s*([0-9]+(?:[.,][0-9]+)?)\s*(uS/cm|mS/cm)", line)
        if not m:
            print("⚠️ Serial: formato de condutividade não reconhecido:", line)
            return None

        val = float(m.group(1).replace(",", "."))
        unit = m.group(2)

        if unit == "mS/cm":
            val *= 1000.0

        # armazena leitura instantânea válida
        _cond_history.append(val)

        # média das 5 últimas leituras válidas
        cond_media = sum(_cond_history) / len(_cond_history)

        print(f"Condutividade: {cond_media:.4f} uS/cm")
        return cond_media

    except Exception as e:
        print(f"❌ Serial: erro lendo condutividade: {e}")
        return None

# ==========================================================
# GOR / SEC: wrappers
# ==========================================================
def obter_gor(gor: GOR) -> Optional[float]:
    try:
        res = gor.calcular_gor()
        if not res:
            return None
        return float(res["GOR"])
    except Exception as e:
        print("⚠️ GOR: falha ao calcular:", e)
        return None


def obter_sec(sec: SEC) -> Optional[float]:
    try:
        sec_val = sec.calcular_sec()
        if sec_val is None:
            return None
        return float(sec_val)
    except Exception as e:
        print("⚠️ SEC: falha ao calcular:", e)
        return None


# ==========================================================
# MODBUS: lê, calcula e publica
# ==========================================================
def ler_dados_modbus(
    client: ModbusSerialClient,
    fp: FP,
    gor: Optional[GOR] = None,
    sec: Optional[SEC] = None,
    condhot_uScm: Optional[float] = None,  # recebido do orquestrador
) -> Optional[np.ndarray]:
    """
    Lê dados do Modbus (slave 2 e slave 1), calcula variáveis derivadas,
    monta payload e faz POST para a API.

    Retorna:
      - np.ndarray (v1) quando leitura ok
      - None quando não conseguiu ler/validar
    """

    # 0) Garante conexão (caso tenha caído)
    try:
        if not getattr(client, "connected", False):
            if not client.connect():
                print("❌ Modbus: client desconectado e não reconectou")
                return None
    except Exception as e:
        print("❌ Modbus: erro checando/reconectando:", e)
        return None

    # 1) Leituras Modbus
    try:
        # slave=2: precisamos de 9 regs (usa v1[8])
        r1 = client.read_holding_registers(address=0, count=9, slave=2)

        # slave=1: 4 regs (pressão permeado em v2[3])
        r2 = client.read_holding_registers(address=0, count=4, slave=1)

        if r1.isError() or r2.isError():
            print("❌ Modbus: erro nas leituras r1/r2:", r1, r2)
            return None

        v1 = np.array(r1.registers, dtype=float)
        v2 = np.array(r2.registers, dtype=float)

        if v1.size < 9 or v2.size < 4:
            print("❌ Modbus: registros insuficientes:", v1.size, v2.size)
            return None

    except Exception as e:
        print("❌ Modbus: exceção lendo registradores:", e)
        return None

    # 2) Processamento (mantive sua lógica)
    pressao1 = (v1[2] / 4000.0) * 100.0
    pressao2 = (v1[8] / 4000.0) * 100.0
    pressao3 = (v1[5] / 4000.0) * 100.0
    pressao4 = (v1[3] / 4000.0) * 100.0

    temp_1 = v1[1] / 33.5
    temp_2 = v1[4] / 33.5
    temp_3 = v1[6] / 33.5
    temp_4 = v1[7] / 33.5

    pressao_p = float(v2[3])
    pressao_permeado = pressao_p * 0.0519 - 5.4404

    # 3) FP (derivada no tempo)
    fp_val = fp.push_value(pressao_permeado)

    # 4) GOR / SEC
    gor_val = obter_gor(gor) if gor is not None else None
    sec_val = obter_sec(sec) if sec is not None else None

    # 5) Payload
    payload = {
        "timestamp": datetime.utcnow().isoformat(),

        "pressao_1": pressao1,
        "pressao_2": pressao2,
        "pressao_3": pressao3,
        "pressao_4": pressao4,

        "temp_1": temp_1,
        "temp_2": temp_2,
        "temp_3": temp_3,
        "temp_4": temp_4,

        "pressao_5": pressao_permeado,  # permeado
        "fluxo_permeado": fp_val,

        # agora este valor já pode vir como média das 3 últimas leituras
        "condhot": condhot_uScm,

        "gor": gor_val,
        "sec": sec_val,
    }

    # 6) POST
    try:
        resp = httpx.post(API_URL, json=payload, timeout=3.0)
        resp.raise_for_status()
    except httpx.HTTPError as e:
        print("❌ HTTP POST:", e)

    return v1