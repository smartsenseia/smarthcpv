// src/features/telemetry/api/telemetry.mock.ts

/**
 * Mock de respostas da API de Telemetria
 * -------------------------------------
 * Usado enquanto o backend (FastAPI) não está conectado.
 * Simula APENAS os indicadores decisivos de VCI,
 * conforme ISO 2631-1 / NHO-09 / NR-15.
 */

import type {
  TelemetryLatestResponse,
  TelemetryRangeResponse,
} from "../types";

/**
 * Snapshot mais recente (latest)
 * - Somente indicadores consolidados (decisivos)
 * - O frontend não precisa conhecer eixos/pontos
 */
export const telemetryLatestMock: TelemetryLatestResponse = {
  asset_id: "AQ21BR02",
  timestamp: new Date().toISOString(),

  // Janela usada no cálculo dos indicadores (ex.: últimos 10 s)
  window_seconds: 10,

  // Tempo de exposição acumulado no dia (em segundos)
  exposure_seconds_today: 3 * 60 * 60 + 12 * 60, // 3h12min

  // ===== VCI – INDICADORES DECISIVOS =====
  vibration: [
    // A(8) consolidado (NR-15)
    {
      sensor: "A8_max",
      value: 0.54,
      unit: "m/s²",
    },

    // RMS ponderado máximo (ISO 2631-1)
    {
      sensor: "aw_rms_max",
      value: 0.62,
      unit: "m/s²",
    },

    // VDV máximo (choques / impactos)
    {
      sensor: "vdv_max",
      value: 10.8,
      unit: "m/s^1.75",
    },

    // Crest factor máximo (define RMS × VDV)
    {
      sensor: "crest_factor_max",
      value: 11.2,
      unit: "-",
    },
  ],
};

/**
 * Helper para gerar série temporal fake
 * Usado para gráficos históricos dos indicadores consolidados
 */
function generateSeries(
  baseValue: number,
  points = 30,
  stepMinutes = 1,
  noise = 0.08,
  decimals = 4
) {
  const now = Date.now();
  return Array.from({ length: points }).map((_, i) => {
    const t = new Date(now - (points - 1 - i) * stepMinutes * 60_000);
    const jitter = (Math.random() - 0.5) * noise * baseValue;

    return {
      timestamp: t.toISOString(),
      value: Number((baseValue + jitter).toFixed(decimals)),
    };
  });
}

/**
 * Mock de histórico (range) para um indicador decisivo de VCI
 * Ex.: A8_max, vdv_max, aw_rms_max
 */
export function telemetryRangeMock(
  sensor: "A8_max" | "aw_rms_max" | "vdv_max" | "crest_factor_max",
  unit: string,
  baseValue: number
): TelemetryRangeResponse {
  return {
    asset_id: telemetryLatestMock.asset_id,
    sensor,
    type: "vibration",
    unit,
    series: generateSeries(baseValue),
  };
}
