# -*- coding: utf-8 -*-
from __future__ import annotations

from typing import Optional
from collections import deque
from inspect import signature
import time

from pymodbus.client import ModbusSerialClient
from pymodbus.exceptions import ModbusIOException

from .Config_modbus import MODBUS_CONFIG

try:
    from pymodbus.framer import ModbusRtuFramer
except Exception:
    try:
        from pymodbus.framer.rtu import ModbusRtuFramer
    except Exception:
        try:
            from pymodbus.framer import ModbusRtuFramer
        except Exception:
            ModbusRtuFramer = None


class FP:
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
        noise_threshold: float = 3.0,
        init_window: int = 5,
        init_tolerance: float = 2.0,
        min_valid_fp: float = 0.5,   # evita aceitar zero/quase zero como referência inicial
        reacquire_window: int = 5,   # buffer para tentar sair de valor travado
    ):
        base = dict(MODBUS_CONFIG)
        if modbus_kw:
            base.update(modbus_kw)
        self.modbus_kw = base

        self.unit_id = unit_id
        self.addr = addr
        self.count = count

        self.rho = float(rho)
        self.G = float(G)
        self.AB = float(AB)

        self.noise_threshold = float(noise_threshold)
        self.init_window = int(init_window)
        self.init_tolerance = float(init_tolerance)
        self.min_valid_fp = float(min_valid_fp)

        self._initialized = False
        self._init_buffer = deque(maxlen=self.init_window)

        self.queue = deque(maxlen=maxlen)
        self.fp_history = deque(maxlen=5)

        self.last_valid_fp_raw: float | None = None
        self.last_fp: float | None = None
        self.last_dt_s: float = 0.0

        # usado para tentar sair de um valor travado
        self._reacquire_buffer = deque(maxlen=reacquire_window)

        self._fail_count: int = 0
        self._backoff_until: float = 0.0

        self._owns_client: bool = client is None
        self.client: Optional[ModbusSerialClient] = client or self._create_client(self.modbus_kw)

        if self._owns_client:
            self._ensure_connection()

    @staticmethod
    def _create_client(modbus_kw: dict) -> ModbusSerialClient:
        params = signature(ModbusSerialClient.__init__).parameters
        kw = dict(modbus_kw)

        if "framer" in params and ModbusRtuFramer is not None:
            return ModbusSerialClient(framer=ModbusRtuFramer, **kw)
        elif "method" in params:
            return ModbusSerialClient(method="rtu", **kw)
        else:
            return ModbusSerialClient(**kw)

    def _ensure_connection(self) -> bool:
        if not self._owns_client:
            return True
        if self.client is None:
            self.client = self._create_client(self.modbus_kw)
        try:
            ok = self.client.connect()
        except Exception:
            ok = False
        return bool(ok)

    def _serial_flush(self):
        if not self._owns_client:
            return
        try:
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
        try:
            return client.read_holding_registers(address=self.addr, count=self.count, unit=self.unit_id)
        except TypeError:
            return client.read_holding_registers(address=self.addr, count=self.count, slave=self.unit_id)

    def _read_pressao_permeado(self) -> float | None:
        now = time.time()
        if self._fail_count >= 3 and now < self._backoff_until:
            return None

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

            self._fail_count = 0

            pressao_p = float(regs[3])
            return pressao_p * 0.0519 - 5.4404

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

    def _calc_fp_from_queue(self) -> float | None:
        if len(self.queue) < 2:
            self.last_dt_s = 0.0
            return None

        dt_s = self.queue[-1][0] - self.queue[0][0]
        self.last_dt_s = dt_s

        if dt_s <= 0:
            return None

        P0 = float(self.queue[0][1])
        P1 = float(self.queue[-1][1])

        fator = (100.0 / (self.rho * self.G)) * 0.0105 * 1000.0
        V0 = P0 * fator
        V1 = P1 * fator
        return (((V1 - V0) / dt_s) * 3600.0) / self.AB

    def _try_initialize_reference(self, fp_val: float) -> float | None:
        self._init_buffer.append(fp_val)

        if len(self._init_buffer) < self.init_window:
            print("⏳ FP aguardando estabilização inicial...")
            return None

        fp_min = min(self._init_buffer)
        fp_max = max(self._init_buffer)
        fp_avg = sum(self._init_buffer) / len(self._init_buffer)

        # não aceita zero/quase zero como referência válida
        if abs(fp_avg) < self.min_valid_fp:
            print("⏳ FP inicial ainda muito baixo, aguardando sair da faixa próxima de zero...")
            return None

        if (fp_max - fp_min) <= self.init_tolerance:
            self.last_valid_fp_raw = fp_avg
            self.fp_history.clear()
            self.fp_history.append(fp_avg)
            self.last_fp = fp_avg
            self._initialized = True
            self._reacquire_buffer.clear()
            print(f"✅ FP inicializado com referência estável: {fp_avg:.4f}")
            return fp_avg

        print("⏳ FP ainda instável na partida, aguardando leituras consistentes...")
        return None

    def _try_reacquire_reference(self, fp_val: float) -> float | None:
        """
        Tenta sair de uma referência ruim/travada.
        Só troca a referência se encontrar várias leituras consistentes
        entre si e afastadas da referência atual.
        """
        self._reacquire_buffer.append(fp_val)

        if len(self._reacquire_buffer) < self._reacquire_buffer.maxlen:
            return self.last_valid_fp_raw

        buf_min = min(self._reacquire_buffer)
        buf_max = max(self._reacquire_buffer)
        buf_avg = sum(self._reacquire_buffer) / len(self._reacquire_buffer)

        stable = (buf_max - buf_min) <= self.init_tolerance
        far_from_current = abs(buf_avg - (self.last_valid_fp_raw or 0.0)) > self.noise_threshold
        not_near_zero = abs(buf_avg) >= self.min_valid_fp

        if stable and far_from_current and not_near_zero:
            print(f"🔄 FP reinicializado para nova referência estável: {buf_avg:.4f}")
            self.last_valid_fp_raw = buf_avg
            self.fp_history.clear()
            self.fp_history.append(buf_avg)
            return buf_avg

        return self.last_valid_fp_raw

    def _apply_noise_filter(self, fp_val: float) -> float | None:
        if not self._initialized or self.last_valid_fp_raw is None:
            return self._try_initialize_reference(fp_val)

        if abs(fp_val - self.last_valid_fp_raw) > self.noise_threshold:
            print(
                f"⚠️ Ruído detectado no FP: {fp_val:.4f} | "
                f"mantendo último aceito: {self.last_valid_fp_raw:.4f}"
            )
            return self._try_reacquire_reference(fp_val)

        self._reacquire_buffer.clear()
        self.last_valid_fp_raw = fp_val
        return fp_val

    def _update_and_compute_fp(self, pressao_permeado: float) -> float | None:
        ts = time.monotonic()
        self.queue.append((ts, float(pressao_permeado)))

        fp_val = self._calc_fp_from_queue()
        if fp_val is None:
            self.last_fp = None
            return None

        fp_filtrado = self._apply_noise_filter(fp_val)
        if fp_filtrado is None:
            return None

        self.fp_history.append(fp_filtrado)
        fp_media = sum(self.fp_history) / len(self.fp_history)

        self.last_fp = fp_media
        return fp_media

    def step(self) -> float | None:
        pperm = self._read_pressao_permeado()
        if pperm is None:
            return None
        return self._update_and_compute_fp(pperm)

    def push_value(self, pressao_permeado: float, ts: float | None = None) -> float | None:
        if ts is None:
            ts = time.monotonic()

        self.queue.append((float(ts), float(pressao_permeado)))

        fp_val = self._calc_fp_from_queue()
        if fp_val is None:
            self.last_fp = None
            return None

        fp_filtrado = self._apply_noise_filter(fp_val)
        if fp_filtrado is None:
            return None

        self.fp_history.append(fp_filtrado)
        fp_media = sum(self.fp_history) / len(self.fp_history)

        self.last_fp = fp_media
        print(f"FP: {fp_media:.4f} l/m²h")
        return fp_media