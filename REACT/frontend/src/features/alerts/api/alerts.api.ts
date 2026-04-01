// src/features/alerts/api/alerts.api.ts
import axios from "axios";
import type { Alert, AlertQueryParams, AlertAcknowledgePayload } from "../types";

/**
 * Lista alertas com filtros opcionais.
 * Os filtros são enviados como query params:
 * /api/alerts?asset_id=...&severity=...&status=...
 */
export async function getAlerts(
  params?: AlertQueryParams
): Promise<Alert[]> {
  const res = await axios.get<Alert[]>("/api/alerts", {
    params,
  });
  return res.data;
}

/**
 * Confirma (ack) um alerta.
 */
export async function acknowledgeAlert(
  payload: AlertAcknowledgePayload
) {
  const res = await axios.post("/api/alerts/ack", payload);
  return res.data;
}
