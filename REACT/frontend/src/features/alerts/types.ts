// src/features/alerts/types.ts

/**
 * Tipos do domínio de Alertas
 * --------------------------
 * Representam o contrato entre o backend (FastAPI)
 * e o frontend para eventos de alarme/alerta.
 *
 * Estes tipos são independentes de UI, hooks ou API clients.
 */

/**
 * Severidade do alerta
 */
export type AlertSeverity = "info" | "warning" | "critical";

/**
 * Status do alerta
 */
export type AlertStatus = "open" | "acknowledged" | "closed";

/**
 * Origem do alerta
 * Ex.: algoritmo, sensor, regra fixa, operador
 */
export type AlertSource = "rule" | "model" | "sensor" | "system";

/**
 * Representa um alerta individual
 */
export interface Alert {
  /** Identificador único do alerta */
  id: string;

  /** Asset/equipamento associado */
  asset_id: string;

  /** Sensor relacionado (opcional) */
  sensor?: string;

  /** Tipo da grandeza (temperature, pressure, etc.) */
  variable?: string;

  /** Severidade do alerta */
  severity: AlertSeverity;

  /** Status atual */
  status: AlertStatus;

  /** Origem do alerta */
  source: AlertSource;

  /** Mensagem legível para o usuário */
  message: string;

  /** Valor que disparou o alerta (se aplicável) */
  value?: number;

  /** Unidade física (se aplicável) */
  unit?: string;

  /** Limite violado (se aplicável) */
  threshold?: number;

  /** Timestamp ISO 8601 da criação */
  created_at: string;

  /** Timestamp ISO 8601 do acknowledge (se houver) */
  acknowledged_at?: string;

  /** Timestamp ISO 8601 do fechamento (se houver) */
  closed_at?: string;
}

/**
 * Filtros para consulta de alertas
 */
export interface AlertQueryParams {
  asset_id?: string;
  severity?: AlertSeverity;
  status?: AlertStatus;
  from?: string; // ISO 8601
  to?: string;   // ISO 8601
}

/**
 * Payload para acknowledge de alerta
 */
export interface AlertAcknowledgePayload {
  alert_id: string;
  user_id: string;
  comment?: string;
}

/**
 * Payload para fechamento manual de alerta
 */
export interface AlertClosePayload {
  alert_id: string;
  user_id: string;
  comment?: string;
}
