# -*- coding: utf-8 -*-
import requests
from collections import deque
from .CALOR import Q as QClass


class SEC:
    """
    Classe para calcular o Consumo Específico de Energia (SEC).

    Nesta versão, o valor retornado/transmitido de SEC é a média móvel
    das 3 últimas leituras calculadas de SEC.
    """
    API_URL = "http://localhost:8000/api/v1/endpoints/"

    def __init__(self, params=None):
        self.params = params or {"_sort": "id", "_order": "desc", "_limit": 1}
        self.q_obj = QClass()

        # histórico das 3 últimas leituras de SEC
        self.sec_history = deque(maxlen=5)

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

        Q_hot é obtido em J/s.
        O fluxo de permeado é lido da API.
        O valor retornado é a média das 3 últimas leituras de SEC calculadas.
        """
        fluxo_permeado = self.get_fluxo()

        if fluxo_permeado is None or fluxo_permeado <= 0:
            print("Não foi possível obter um valor válido de fluxo de permeado ou o valor é zero.")
            return None

        # Atualiza Q_hot a cada cálculo
        Q_hot = self._get_Q_hot()

        # 1. Calcular a Área (A)
        L = 0.29  # Comprimento em metros
        H = 0.2   # Altura em metros
        A = L * H

        # Mantido como no seu código original
        fluxo = fluxo_permeado * A

        # Evita divisão por zero
        if abs(fluxo * 1000) < 1e-12:
            print("Fluxo inválido para cálculo do SEC.")
            return None

        # SEC instantâneo
        sec_val = Q_hot / (fluxo * 1000)

        # armazena a leitura instantânea
        self.sec_history.append(sec_val)

        # média das 3 últimas leituras de SEC
        sec_medio = sum(self.sec_history) / len(self.sec_history)

        print(f"SEC: {sec_medio:.4f} J/m³")
        return sec_medio


# Exemplo de uso:
if __name__ == "__main__":
    sec_calculator = SEC()
    sec_result = sec_calculator.calcular_sec()

    if sec_result is not None:
        print(f"\nResultado final do SEC: {sec_result:.4f} J/m³")