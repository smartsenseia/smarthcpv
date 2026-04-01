// src/features/alerts/api/alerts.keys.ts

/**
 * Query keys da feature Alerts
 * ----------------------------
 * Centraliza todas as keys do React Query relacionadas a alertas.
 *
 * Benefícios:
 * - evita strings mágicas
 * - facilita invalidação/refetch
 * - mantém consistência entre hooks
 *
 * Convenção:
 * - arrays hierárquicos
 * - sempre começar pelo nome da feature
 */

export const alertsKeys = {
  /** Namespace raiz */
  all: ["alerts"] as const,

  /** Lista de alertas (com filtros) */
  list: (params?: {
    asset_id?: string;
    severity?: string;
    status?: string;
    from?: string;
    to?: string;
  }) =>
    [
      ...alertsKeys.all,
      "list",
      params?.asset_id ?? "all",
      params?.severity ?? "all",
      params?.status ?? "all",
      params?.from ?? "all",
      params?.to ?? "all",
    ] as const,

  /** Detalhe de um alerta específico */
  detail: (alertId: string) =>
    [...alertsKeys.all, "detail", alertId] as const,
};
