# ALGORITHMS_AND_DATA/alarm_gpio.py
import time
import threading
from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Dict, Tuple

from sqlalchemy import create_engine, text

# Mais simples que RPi.GPIO direto
from gpiozero import DigitalOutputDevice


@dataclass(frozen=True)
class AlarmConfig:
    db_url: str
    gpio_pin_bcm: int = 21
    poll_seconds: float = 1.0
    relay_active_high: bool = True
    hysteresis: float = 0.02  # 2%
    limits: Dict[str, Tuple[Optional[float], Optional[float]]] = None


DEFAULT_LIMITS: Dict[str, Tuple[Optional[float], Optional[float]]] = {
    # Temperaturas (ajuste!)
    "temp_1": (None, 83.0),
    "temp_2": (None, 68),
    "temp_3": (None, 30.0),
    "temp_4": (None, 40.0),

    # Pressões (ajuste!)
    "pressao_1": (None, 5.0),
    "pressao_2": (None, 10.0),
    "pressao_3": (None, 10.0),
    "pressao_4": (None, 6.0),
    "pressao_5": (None, 40.0),
}


class AlarmMonitor:
    def __init__(self, cfg: AlarmConfig):
        self.cfg = cfg
        self.engine = create_engine(cfg.db_url, pool_pre_ping=True)
        self.relay = DigitalOutputDevice(
            cfg.gpio_pin_bcm,
            active_high=cfg.relay_active_high,
            initial_value=False,
        )
        self._stop = threading.Event()
        self._thread = threading.Thread(target=self._run, daemon=True)

        self._alarm_on = False
        self._last_id = None

        self._limits = cfg.limits if cfg.limits is not None else DEFAULT_LIMITS

    def start(self):
        print(f"[{self._ts()}] 🔔 AlarmMonitor iniciado (GPIO {self.cfg.gpio_pin_bcm})", flush=True)
        self._thread.start()

    def stop(self):
        self._stop.set()
        try:
            self._thread.join(timeout=2.0)
        except Exception:
            pass
        try:
            self.relay.off()
        except Exception:
            pass
        print(f"[{self._ts()}] 🔕 AlarmMonitor parado", flush=True)

    def _ts(self) -> str:
        return datetime.now().strftime("%H:%M:%S")

    def _get_latest_measurement(self) -> Optional[dict]:
        q = text("""
            SELECT
              id, timestamp,
              temp_1, temp_2, temp_3, temp_4, temp_5, temp_6, temp_7, temp_8,
              pressao_1, pressao_2, pressao_3, pressao_4, pressao_5
            FROM measurements
            ORDER BY timestamp DESC
            LIMIT 1
        """)
        with self.engine.connect() as conn:
            row = conn.execute(q).mappings().first()
            return dict(row) if row else None

    def _violates_limits(self, data: dict) -> Tuple[bool, str]:
        for field, (vmin, vmax) in self._limits.items():
            val = data.get(field, None)
            if val is None:
                continue

            v = float(val)

            if vmax is not None:
                max_ok = vmax * (1.0 - self.cfg.hysteresis) if self._alarm_on else vmax
                if v > max_ok:
                    return True, f"{field}={v:.3f} > {max_ok:.3f} (limite {vmax:.3f})"

            if vmin is not None:
                min_ok = vmin * (1.0 + self.cfg.hysteresis) if self._alarm_on else vmin
                if v < min_ok:
                    return True, f"{field}={v:.3f} < {min_ok:.3f} (limite {vmin:.3f})"

        return False, "OK"

    def _run(self):
        while not self._stop.is_set():
            try:
                m = self._get_latest_measurement()

                if not m:
                    if self._alarm_on:
                        self._alarm_on = False
                        self.relay.off()
                    print(f"[{self._ts()}] ⚠️ AlarmMonitor: sem dados em measurements", flush=True)
                    time.sleep(self.cfg.poll_seconds)
                    continue

                violated, reason = self._violates_limits(m)

                if violated and not self._alarm_on:
                    self._alarm_on = True
                    self.relay.on()
                    print(f"[{self._ts()}] 🚨 ALARME ON: {reason} (id={m['id']})", flush=True)

                elif (not violated) and self._alarm_on:
                    self._alarm_on = False
                    self.relay.off()
                    print(f"[{self._ts()}] ✅ ALARME OFF: normal (id={m['id']})", flush=True)

                # log leve só quando muda id (opcional)
                if m["id"] != self._last_id:
                    self._last_id = m["id"]

            except Exception as e:
                print(f"[{self._ts()}] ❌ AlarmMonitor erro: {e}", flush=True)

            time.sleep(self.cfg.poll_seconds)
