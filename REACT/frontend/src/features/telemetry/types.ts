/**
 * Tipos do domínio de Telemetria
 * --------------------------------
 * CONTRATO entre:
 * - Backend (FastAPI)
 * - Frontend (React)
 *
 * Independente de UI, hooks ou libs externas.
 */

/**
 * Tipos de grandezas físicas suportadas
 * (agora focado em Vibração – VCI)
 */
export type TelemetryType = "vibration";

/**
 * Representa um indicador calculado de telemetria
 * Ex.: awz_rms, vdvz, A8
 */
export interface TelemetryValue {
  /** Identificador lógico do indicador */
  sensor: string;

  /** Valor numérico */
  value: number;

  /** Unidade física (m/s², m/s^1.75, s, etc.) */
  unit: string;
}

/**
 * Snapshot "latest" de telemetria para um ativo
 * Usado em dashboards e cards
 *
 * IMPORTANTE:
 * - Valores de vibração já vêm PROCESSADOS
 *   (RMS, VDV, A(8), etc.)
 */
export interface TelemetryLatestResponse {
  /** Identificador do ativo/equipamento */
  asset_id: string;

  /** Timestamp ISO 8601 da leitura */
  timestamp: string;

  /** Indicadores de vibração de corpo inteiro (VCI) */
  vibration: TelemetryValue[];

  /** Janela (s) usada para cálculo dos indicadores */
  window_seconds?: number;

  /** Tempo de exposição acumulado no dia (s) */
  exposure_seconds_today?: number;
}

/**
 * Ponto individual de uma série temporal
 * Usado em gráficos e análises históricas
 */
export interface TelemetrySeriesPoint {
  /** Timestamp ISO 8601 */
  timestamp: string;

  /** Valor numérico */
  value: number;
}

/**
 * Resposta de histórico (range) para um indicador específico
 * Ex.: awz_rms ao longo do tempo
 */
export interface TelemetryRangeResponse {
  /** Identificador do ativo */
  asset_id: string;

  /** Indicador ao qual a série pertence */
  sensor: string;

  /** Tipo da grandeza (vibration) */
  type: TelemetryType;

  /** Unidade física */
  unit: string;

  /** Série temporal */
  series: TelemetrySeriesPoint[];
}

/**
 * Filtros para consulta de histórico
 * Usado pelo frontend para montar queries
 */
export interface TelemetryRangeParams {
  asset_id: string;
  sensor: string;
  from: string; // ISO 8601
  to: string;   // ISO 8601
}