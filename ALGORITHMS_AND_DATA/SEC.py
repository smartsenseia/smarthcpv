# -*- coding: utf-8 -*-
import requests
# Importações necessárias para a classe SEC (se for o caso)
# from .Config_modbus import MODBUS_CONFIG 
from .CALOR import Q as QClass 

class SEC:
    """
    Classe para calcular o Consumo Específico de Energia (SEC).
    """
    API_URL = "http://localhost:8000/api/v1/endpoints/"

    def __init__(self, params=None):
        self.params = params or {"_sort": "id", "_order": "desc", "_limit": 1}
        self.q_obj = QClass()
        self.Q_hot = self._get_Q_hot()
        print("Objeto SEC inicializado com sucesso.")

    def _get_Q_hot(self):
        """
        Obtém o valor de Q (calor) da classe QClass.
        Método privado, não deve ser chamado diretamente.
        """
        q_res = self.q_obj.Q()
        if isinstance(q_res, dict):
            try:
                return float(q_res.get("Q", 0.0))
            except (TypeError, ValueError):
                return 0.0
        elif isinstance(q_res, (int, float)):
            return float(q_res)
        return 0.0

    def get_fluxo(self):
        """
        Busca o fluxo de permeado da API e retorna como um float.
        """
        try:
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

            return f(d.get("fluxo_permeado"), default=None)

        except requests.RequestException as e:
            print(f"Erro ao buscar os dados da API: {e}")
            return None

    def calcular_sec(self):
        """
        Calcula o Consumo Específico de Energia (SEC).
        A unidade de Q_hot é J/s, e o fluxo de permeado é L/h.
        O SEC será em J/m³.
        """
        # Obter o fluxo de permeado da API
        fluxo_permeado = self.get_fluxo()

        if fluxo_permeado is None or fluxo_permeado <= 0:
            print("Não foi possível obter um valor válido de fluxo de permeado ou o valor é zero.")
            return None
        
         # 1. Calcular a Área (A)

        L = 0.29 # Comprimento em metros
        H = 0.2 # Altura em metros

        A = L * H

        # Convertendo o fluxo de L/h para m³/s
      
        fluxo = fluxo_permeado * A


        # O cálculo do SEC é a energia total (Q_hot) dividida pela vazão volumétrica
        # Q_hot (J/s) / vazao_volumetrica (m³/s) = J/m³
        
        SEC_value = self.Q_hot / (fluxo*1000)

        print(f"SEC: {SEC_value:.4f} J/m³")

        # A área (A) e as variáveis L e H não são necessárias neste cálculo de SEC
        # porque a vazão volumétrica (V) já é fornecida.

        return SEC_value

# Exemplo de uso:
if __name__ == "__main__":
    sec_calculator = SEC()
    sec_result = sec_calculator.calcular_sec()

    if sec_result is not None:
        print(f"\nResultado final do SEC: {sec_result:.4f} J/m³")