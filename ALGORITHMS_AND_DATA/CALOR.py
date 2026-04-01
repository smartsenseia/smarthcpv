# -*- coding: utf-8 -*-
import requests
from .Config_modbus import MODBUS_CONFIG

try:
    from CoolProp.CoolProp import PropsSI  # propriedades de água do permeado
except Exception:
    PropsSI = None

class Q:
    API_URL = "http://localhost:8000/api/v1/endpoints/"  # GET

    def __init__(self,
                 modbus_kw=MODBUS_CONFIG,
                 unit_id=1, addr=0, count=4,
                 rho=997.0, G=9.80665, AB=0.058,
                 params=None):
        # NÃO ABRA Modbus aqui; Q não precisa do FP.
        self.params = params or {
            "_sort": "id",
            "_order": "desc",
            "_limit": 1
        }

    # ---- leitura sempre fresca da API ----
    def get_temperaturas(self):
        """
        Retorna dict padronizado com:
        Teh, Tsh, Tec, Tsc (°C) e fluxo_permeado (L/h)
        """
        r = requests.get(self.API_URL, params=self.params, timeout=2.0)
        if r.status_code != 200:
            print(f"Erro ao buscar os dados. Código de status: {r.status_code}")
            return None
        data = r.json()
        if not data:
            print("Nenhum dado encontrado na API.")
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

    # ---- correlação densidade salmoura (DWT 2010.1079) → retorna float ----
    def densidade_salina(self) -> float | None:
        data_s = self.get_temperaturas()
        if not data_s:
            return None

        # normaliza chaves (evita 'Tec ' com espaço)
        data_s = {str(k).strip(): v for k, v in data_s.items()}
        try:
            Teh = float(data_s["Teh"])
            Tsh = float(data_s["Tsh"])
        except (KeyError, TypeError, ValueError) as e:
            print(f"Erro ao ler Teh/Tsh do dicionário retornado por get_temperaturas: {e}")
            return None

        S = 235.0  # g/kg
        T = (Teh + Tsh) / 2.0  # °C

        RHOw = (
            999.842594
            + 6.793952e-2 * T
            - 9.09529e-3  * T**2
            + 1.001685e-4 * T**3
            - 1.120083e-6 * T**4
            + 6.536336e-9 * T**5
        )
        A = (0.824493 - 4.0899e-3*T + 7.6438e-5*T**2 - 8.2467e-7*T**3 + 5.3875e-9*T**4)
        B = -5.72466e-3 + 1.0227e-4*T - 1.6546e-6*T**2
        C = 4.8314e-4

        RHOSw = RHOw + A*S + B*(S**1.5) + C*(S**2)
        return RHOSw  # kg/m³

    # ---- correlação cp salmoura (DWT 2010.1079) → retorna float ----
    def cp_salino(self) -> float | None:
        data_s = self.get_temperaturas()
        if not data_s:
            return None
        data_s = {str(k).strip(): v for k, v in data_s.items()}
        try:
            Teh = float(data_s["Teh"])
            Tsh = float(data_s["Tsh"])
        except (KeyError, TypeError, ValueError) as e:
            print(f"Erro ao ler Teh/Tsh do dicionário retornado por get_temperaturas: {e}")
            return None

        S = 235.0
        T = (Teh + Tsh) / 2.0
        TK = T + 273.15

        Ac = 5.328 - 9.76e-2*S + 4.04e-4*S**2
        Bc = -6.913e-3 + 7.351e-4*S - 3.15e-6*S**2
        Cc = 9.6e-6 - 1.927e-6*S + 8.23e-9*S**2
        Dc = 2.5e-9 + 1.666e-9*S - 7.125e-12*S**2

        c_sw = (Ac + Bc*TK + Cc*TK**2 + Dc*TK**3) * 1000.0  # J/(kg·K)
        return c_sw

    def Q(self):
        data_s = self.get_temperaturas()
        if not data_s:
            print("Erro: não foi possível obter temperaturas (get_temperaturas retornou None).")
            return None

        data_s = {str(k).strip(): v for k, v in data_s.items()}  # normaliza chaves
        try:
            Teh = float(data_s["Teh"])
            Tsh = float(data_s["Tsh"])
            Tec = float(data_s["Tec"])
            Tsc = float(data_s["Tsc"])
            fluxo_permeado = data_s.get("fluxo_permeado")  # pode ser None
            fluxo_permeado = 0.0 if fluxo_permeado is None else float(fluxo_permeado)
        except (KeyError, TypeError, ValueError) as e:
            print(f"Erro ao ler temperaturas/fluxo do dicionário retornado por get_temperaturas: {e}")
            return None

        # Correções
        TCEH = 0.0084*Teh + 1.0374 + Teh
        TCSH = 0.0103*Tsh + 0.9666 + Tsh
        TCEC = 0.0066*Tec + 1.017  + Tec
        TCSC = 0.0132*Tsc + 0.9686 + Tsc

        # Permeado: propriedades via CoolProp (se disponível)
        TP = ((TCEH + TCSH)/2.0 + (TCEC + TCSC)/2.0) / 2.0  # °C
        if PropsSI is not None:
            try:
                RHOP = PropsSI("D", "T", TP + 273.15, "P", 101325, "Water")      # kg/m³
                CPP  = PropsSI("C", "T", TP + 273.15, "P", 101325, "Water")      # J/(kg·K)
            except Exception:
                RHOP, CPP = 1000.0, 4186.0
        else:
            RHOP, CPP = 1000.0, 4186.0
        
        print("fluxo", fluxo_permeado)
        # Vazão permeado: ml/s → m³/s
        VP = (fluxo_permeado/1000)/3600
        MP = VP * RHOP  # kg/s

        # Salmoura (lado quente): correlações originais
        RHOSw = self.densidade_salina()
        c_sw  = self.cp_salino()
        if RHOSw is None or c_sw is None:
            return None

        # Vazão concentrado (fixo no seu código original): 150 L/h
        V = 150.0 / (1000.0 * 3600.0)  # m³/s

        # Calor trocado (mantendo sua expressão original)
        Q = -((V * RHOSw * c_sw * TCEH) - (V * RHOSw * c_sw * TCSH) - (MP * CPP * TCSH) - (MP * CPP * TP))
        print(Q)
        # (Opcional) frio:
        # cp_c ≈ CPP (água) ou PropsSI no lado frio se desejar

        return {"Q": float(Q)}
