// src/features/alerts/hooks/useAlerts.ts

import { useQuery } from "@tanstack/react-query";
import type { Alert, AlertQueryParams } from "../types";
import { alertsKeys } from "../api/alerts.keys";
import { getAlerts } from "../api/alerts.api";

/**
 * Hook para listar alertas (com filtros).
 *
 * - Encapsula loading/error/cache
 * - Usa queryKey determinística baseada nos filtros
 * - Permite polling para alertas quase em tempo real
 */
export function useAlerts(options?: {
  params?: AlertQueryParams;
  enabled?: boolean;

  /**
   * Intervalo de atualização automática (polling) em ms.
   * Ex.: 5000 => atualiza a cada 5s.
   */
  refetchIntervalMs?: number;
}) {
  const params = options?.params;
  const enabled = options?.enabled ?? true;

  return useQuery<Alert[]>({
    queryKey: alertsKeys.list({
      asset_id: params?.asset_id,
      severity: params?.severity,
      status: params?.status,
      from: params?.from,
      to: params?.to,
    }),
    queryFn: () => getAlerts(params),
    enabled,
    refetchInterval: options?.refetchIntervalMs,
    staleTime: 10_000,
  });
}
