import requests
import math
from collections import deque
import CoolProp.CoolProp as CP
from .CALOR import Q as QClass
from .Config_modbus import MODBUS_CONFIG


class GOR:
    API_URL = "http://localhost:8000/api/v1/endpoints/"

    def __init__(
        self,
        modbus_kw=MODBUS_CONFIG,
        unit_id=1,
        addr=0,
        count=4,
        rho=997.0,
        G=9.80665,
        AB=0.058,
        params=None
    ):
        self.params = params or {"_sort": "id", "_order": "desc", "_limit": 1}

        # histórico das 3 últimas leituras de GOR
        self.gor_history = deque(maxlen=5)

        print("Objeto GOR inicializado com sucesso.")

    def get_temperaturas(self):
        try:
            print("Fazendo requisição à API...")
            r = requests.get(self.API_URL, params=self.params, timeout=2.0)
            r.raise_for_status()
            data = r.json()
            if not data:
                return None

            d = data[-1] if isinstance(data, list) else data

            def f(x, default=None):
                try:
                    return float(x)
                except (TypeError, ValueError):
                    return default

            return {
                "Teh": f(d.get("temp_1")),
                "Tsh": f(d.get("temp_2")),
                "Tec": f(d.get("temp_3")),
                "Tsc": f(d.get("temp_4")),
                "fluxo_permeado": f(d.get("fluxo_permeado"), default=None),
            }

        except requests.RequestException as e:
            print(f"Erro ao buscar os dados da API: {e}")
            return None

    def _water_props_at_T(self, TC):
        try:
            T = float(TC) + 273.15
            rho = CP.PropsSI("D", "T", T, "P", 101325, "Water")
            h_v = CP.PropsSI("H", "T", T, "Q", 1, "Water")
            h_l = CP.PropsSI("H", "T", T, "Q", 0, "Water")
            return rho, (h_v - h_l)
        except Exception as e:
            print(f"Erro ao calcular propriedades da água com CoolProp: {e}")
            return None, None

    def calcular_gor(self, Teh=None, Tsh=None, Tec=None, Tsc=None, fluxo_permeado=None):
        # completa com API se algo faltou
        if None in (Teh, Tsh, Tec, Tsc, fluxo_permeado):
            t = self.get_temperaturas() or {}
            Teh = Teh if Teh is not None else t.get("Teh")
            Tsh = Tsh if Tsh is not None else t.get("Tsh")
            Tec = Tec if Tec is not None else t.get("Tec")
            Tsc = Tsc if Tsc is not None else t.get("Tsc")
            fluxo_permeado = fluxo_permeado if fluxo_permeado is not None else t.get("fluxo_permeado")

        missing = [n for n, v in [("Teh", Teh), ("Tsh", Tsh), ("Tec", Tec), ("Tsc", Tsc)] if v is None]
        if missing:
            raise KeyError(f"Faltam campos de temperatura: {', '.join(missing)}")

        # correções de temperatura
        Teh = float(Teh)
        Tsh = float(Tsh)
        Tec = float(Tec)
        Tsc = float(Tsc)

        TCEH = 0.0084 * Teh + 1.0374 + Teh
        TCSH = 0.0103 * Tsh + 0.9666 + Tsh
        TCEC = 0.0066 * Tec + 1.0170 + Tec
        TCSC = 0.0132 * Tsc + 0.9686 + Tsc

        TP = (((TCEH + TCSH) / 2.0) + ((TCEC + TCSC) / 2.0)) / 2.0

        rho, HLV = self._water_props_at_T(TP)
        if rho is None or HLV is None:
            return {"GOR": 0.0}

        # fluxo_permeado pode vir None → assume 0.0
        try:
            fluxo_lph = float(fluxo_permeado) if fluxo_permeado is not None else 0.0
        except (TypeError, ValueError):
            fluxo_lph = 0.0

        # lph → m³/s
        L = 0.29
        H = 0.2
        A = L * H
        VP = ((fluxo_lph / 1000) / 3600) * A

        M = VP * rho  # kg/s

        # CALOR: instancie Q e chame o método .Q(), depois pegue a chave "Q"
        q_obj = QClass()
        q_res = q_obj.Q()
        Q_hot = 0.0

        if isinstance(q_res, dict):
            try:
                Q_hot = float(q_res.get("Q", 0.0))
            except (TypeError, ValueError):
                Q_hot = 0.0
        elif isinstance(q_res, (int, float)):
            Q_hot = float(q_res)

        print("HLV", HLV)
        print("M", M)
        print("QHOT", Q_hot)

        gor_val = (M * HLV) / Q_hot if abs(Q_hot) > 1e-12 else 0.0
        if not math.isfinite(gor_val):
            gor_val = 0.0

        # armazena o GOR instantâneo
        self.gor_history.append(gor_val)

        # média das 3 últimas leituras de GOR
        gor_medio = sum(self.gor_history) / len(self.gor_history)

        print(f"(GOR): {gor_medio:.4f}")
        return {"GOR": gor_medio}