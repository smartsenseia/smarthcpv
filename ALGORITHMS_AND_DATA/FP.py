# -*- coding: utf-8 -*-
from __future__ import annotations

from typing import Optional
from collections import deque
from inspect import signature
import time

from pymodbus.client import ModbusSerialClient
from pymodbus.exceptions import ModbusIOException

from .Config_modbus import MODBUS_CONFIG

# Compatibilidade com diferentes versões do pymodbus
# (algumas builds expõem em caminhos diferentes)
try:
    # pymodbus 3.x (mais comum)
    from pymodbus.framer import ModbusRtuFramer
except Exception:
    try:
        # variantes
        from pymodbus.framer.rtu import ModbusRtuFramer
    except Exception:
        try:
            from pymodbus.framer import ModbusRtuFramer  # fallback amplo
        except Exception:
            ModbusRtuFramer = None  # sem framer específico; usaremos defaults


class FP:
    """
    Cálculo do Fluxo de Permeado (FP).

    Dois modos de operação:
      - Modo cliente EXTERNO (recomendado): passe `client=ModbusSerialClient(...)` já gerenciado
        pelo seu main. A FP NÃO chamará connect/close/flush. Use `push_value()` para
        fornecer os valores lidos do permeado e obter o FP.
      - Modo cliente PRÓPRIO: não passe `client` no __init__. A FP criará/gerenciará
        o Modbus e você pode usar `step()` para ler e calcular automaticamente.

    Fórmula (mesma do seu código original):
      V = P * (100/(rho*G)) * AB * 1000
      FP = ((V1 - V0) / dt_s) * 3600 / AB
    """

    def __init__(
        self,
        modbus_kw: dict | None = None,
        unit_id: int = 1,
        addr: int = 0,
        count: int = 4,
        rho: float = 997.0,
        G: float = 9.80665,
        AB: float = 0.058,
        maxlen: int = 100,
        client: Optional[ModbusSerialClient] = None,
    ):
        # configurações Modbus (permite override)
        base = dict(MODBUS_CONFIG)
        if modbus_kw:
            base.update(modbus_kw)
        self.modbus_kw = base

        # parâmetros do escravo/registradores
        self.unit_id = unit_id
        self.addr = addr
        self.count = count

        # constantes físicas (iguais ao original)
        self.rho = float(rho)
        self.G = float(G)
        self.AB = float(AB)

        # fila de amostras: (ts_monotonic, pressao_permeado)
        self.queue = deque(maxlen=maxlen)
        self.last_fp: float | None = None
        self.last_dt_s: float = 0.0

        # controle de falhas para backoff apenas no modo "próprio"
        self._fail_count: int = 0
        self._backoff_until: float = 0.0

        # Se o client vier de fora, a FP NÃO é dona do cliente (não conecta/fecha/flush)
        self._owns_client: bool = client is None
        self.client: Optional[ModbusSerialClient] = client or self._create_client(self.modbus_kw)

        # Só conecta automaticamente se for dona do cliente
        if self._owns_client:
            self._ensure_connection()

    # ---------- Inicialização compatível do cliente ----------
    @staticmethod
    def _create_client(modbus_kw: dict) -> ModbusSerialClient:
        params = signature(ModbusSerialClient.__init__).parameters
        kw = dict(modbus_kw)

        # Versões novas preferem 'framer'; antigas usam 'method="rtu"'
        if "framer" in params and ModbusRtuFramer is not None:
            return ModbusSerialClient(framer=ModbusRtuFramer, **kw)
        elif "method" in params:
            return ModbusSerialClient(method="rtu", **kw)
        else:
            return ModbusSerialClient(**kw)

    def _ensure_connection(self) -> bool:
        """Conecta o cliente apenas quando a FP é dona dele."""
        if not self._owns_client:
            # Dono externo gerencia a conexão
            return True

        if self.client is None:
            self.client = self._create_client(self.modbus_kw)

        try:
            ok = self.client.connect()
        except Exception:
            ok = False
        return bool(ok)

    def _serial_flush(self):
        """Limpa buffers seriais apenas quando a FP é dona do cliente."""
        if not self._owns_client:
            return
        try:
            # pymodbus 3.x expõe "socket" (pyserial.Serial) ou "transport.serial"
            ser = getattr(self.client, "socket", None)
            if ser is None:
                transport = getattr(self.client, "transport", None)
                if transport is not None:
                    ser = getattr(transport, "serial", None)
            if ser:
                ser.reset_input_buffer()
                ser.reset_output_buffer()
        except Exception:
            pass

    def _read_holding_registers(self, client: ModbusSerialClient):
        """Compatibilidade unit/slave em diferentes versões do pymodbus."""
        try:
            return client.read_holding_registers(address=self.addr, count=self.count, unit=self.unit_id)
        except TypeError:
            return client.read_holding_registers(address=self.addr, count=self.count, slave=self.unit_id)

    def _read_pressao_permeado(self) -> float | None:
        """
        Lê a pressão do permeado diretamente do Modbus (4º registrador).
        Usado por 'step()'. Em modo cliente EXTERNO, evite usar 'step()'.
        """
        now = time.time()
        if self._fail_count >= 3 and now < self._backoff_until:
            return None

        # Apenas se a FP for dona do cliente, ela tenta (re)conectar/flush
        if self._owns_client and not self._ensure_connection():
            self._fail_count += 1
            if self._fail_count >= 3:
                self._backoff_until = time.time() + 5.0
            print("❌ Não conectou à porta serial Modbus.")
            return None

        try:
            if self._owns_client:
                self._serial_flush()

            rr = self._read_holding_registers(self.client)
            if rr.isError():
                self._fail_count += 1
                if self._fail_count >= 3:
                    self._backoff_until = time.time() + 5.0
                print(f"❌ Erro Modbus (unit={self.unit_id}): {rr}")
                return None

            regs = getattr(rr, "registers", None)
            if not regs or len(regs) < 4:
                self._fail_count += 1
                if self._fail_count >= 3:
                    self._backoff_until = time.time() + 5.0
                print("❌ Registros insuficientes retornados.")
                return None

            # sucesso: zera contador de falhas
            self._fail_count = 0

            # conversão específica do seu sensor:
            pressao_p = float(regs[3])               # 4º registrador (índice 3)
            pressao_permeado = pressao_p * 0.0519 - 5.4404
            return pressao_permeado

        except (ModbusIOException, OSError) as e:
            self._fail_count += 1
            if self._fail_count >= 3:
                self._backoff_until = time.time() + 5.0
            print("❌ Timeout/sem resposta do escravo:", e)
            return None
        except Exception as e:
            self._fail_count += 1
            if self._fail_count >= 3:
                self._backoff_until = time.time() + 5.0
            print("❌ Erro Modbus inesperado:", e)
            return None

    # ---------- Cálculo de FP a partir da fila ----------
    def _update_and_compute_fp(self, pressao_permeado: float) -> float | None:
        """
        Adiciona uma nova amostra (ts, P) e calcula FP a partir do 1º e último ponto da janela.
        Retorna None enquanto a fila não tiver base suficiente (>=2 amostras ou dt<=0).
        """
        ts = time.monotonic()
        self.queue.append((ts, float(pressao_permeado)))

        if len(self.queue) < 2:
            self.last_dt_s = 0.0
            self.last_fp = None
            return None

        dt_s = self.queue[-1][0] - self.queue[0][0]
        self.last_dt_s = dt_s

        if dt_s <= 0:
            self.last_fp = None
            return None

        P0 = float(self.queue[0][1])
        P1 = float(self.queue[-1][1])

        # V = P * (100/(rho*G)) * AB * 1000
        fator = (100.0 / (self.rho * self.G)) * 0.0105 * 1000.0
        V0 = P0 * fator
        V1 = P1 * fator

        fp_val = (((V1 - V0) / dt_s) * 3600.0) / self.AB
        self.last_fp = fp_val
        return fp_val

    # ---------- API pública ----------
    def step(self) -> float | None:
        """
        Modo PRÓPRIO: Lê Modbus, atualiza fila e retorna FP.
        Em modo cliente EXTERNO, prefira 'push_value()'.
        """
        pperm = self._read_pressao_permeado()
        if pperm is None:
            return None
        return self._update_and_compute_fp(pperm)

    def push_value(self, pressao_permeado: float, ts: float | None = None) -> float | None:
        """
        Modo EXTERNO: Alimente a FP com o valor medido de pressão do permeado.
        Se 'ts' for fornecido, usa-o como timestamp (em segundos, monotônico ou epoch).
        """
        if ts is None:
            ts = time.monotonic()

        # adiciona a amostra
        self.queue.append((float(ts), float(pressao_permeado)))

        # calcula FP com a janela atual (sem re-adicionar)
        if len(self.queue) < 2:
            self.last_dt_s = 0.0
            self.last_fp = None
            return None

        dt_s = self.queue[-1][0] - self.queue[0][0]
        self.last_dt_s = dt_s

        if dt_s <= 0:
            self.last_fp = None
            return None

        P0 = float(self.queue[0][1])
        P1 = float(self.queue[-1][1])

        fator = (100.0 / (self.rho * self.G)) * 0.0105 * 1000.0
        V0 = P0 * fator
        V1 = P1 * fator

        fp_val = (((V1 - V0) / dt_s) * 3600.0) / self.AB
        self.last_fp = fp_val

        print(f"FP: {fp_val:.4f} l/m²h")
        return fp_val

    def run(self, *, printer=print, return_info: bool = False):
        """
        Executa UMA iteração de aquisição/cálculo (sem loop) no modo PRÓPRIO.
        """
        v = self.step()  # pode ser float ou None
        if printer is not None and isinstance(v, float):
            printer(f"FP={v:.6f}  dt_s={self.last_dt_s:.3f}")

        if return_info:
            info = {
                "dt_s": self.last_dt_s,
                "queue_len": len(self.queue),
                "last_fp": self.last_fp,
                "fail_count": self._fail_count,
            }
            return v, info
        return v

    def close(self):
        """Fecha o cliente serial apenas se a FP for dona dele."""
        if not self._owns_client:
            return
        try:
            if self.client:
                self.client.close()
        except Exception:
            pass
