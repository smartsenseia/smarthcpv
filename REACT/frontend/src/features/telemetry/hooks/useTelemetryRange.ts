// src/features/telemetry/hooks/useTelemetryRange.ts

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTelemetryRange } from "../api/telemetry.api";
import type { TelemetryRangeParams, TelemetryRangeResponse } from "../types";
import { telemetryKeys } from "../api/telemetry.keys";

function toIso(d: Date) {
  return d.toISOString();
}

/**
 * Se o caller não passar from/to, usamos um intervalo padrão.
 * Para VCI em dashboard, "últimos 30 min" costuma funcionar bem.
 */
function normalizeRange(params: TelemetryRangeParams): TelemetryRangeParams {
  const now = new Date();

  const hasFrom = Boolean(params.from);
  const hasTo = Boolean(params.to);

  if (hasFrom && hasTo) return params;

  const to = hasTo ? new Date(params.to) : now;
  const from = hasFrom ? new Date(params.from) : new Date(to.getTime() - 30 * 60_000);

  return {
    ...params,
    from: toIso(from),
    to: toIso(to),
  };
}

/**
 * Hook para buscar histórico (range) de um sensor.
 *
 * - Encapsula loading/error/cache
 * - Usa queryKey determinística (asset + sensor + intervalo)
 * - Ideal para gráficos (TelemetryChart) e páginas de detalhe
 */
export function useTelemetryRange(options: {
  params: TelemetryRangeParams;
  enabled?: boolean;

  /**
   * Se você quiser revalidar automaticamente (ex.: a cada 10s),
   * defina um intervalo em ms.
   */
  refetchIntervalMs?: number;
}) {
  const { params, enabled = true, refetchIntervalMs } = options;

  const normalized = useMemo(() => normalizeRange(params), [params]);

  const key = useMemo(
    () =>
      telemetryKeys.range({
        assetId: normalized.asset_id,
        sensor: normalized.sensor,
        from: normalized.from,
        to: normalized.to,
      }),
    [normalized.asset_id, normalized.sensor, normalized.from, normalized.to]
  );

  const canRun =
    enabled &&
    Boolean(normalized.asset_id) &&
    Boolean(normalized.sensor) &&
    Boolean(normalized.from) &&
    Boolean(normalized.to);

  return useQuery<TelemetryRangeResponse>({
    queryKey: key,
    queryFn: () => getTelemetryRange(normalized),
    enabled: canRun,
    refetchInterval: canRun ? refetchIntervalMs : false,
    staleTime: 30_000, // histórico não precisa ser "zero"
    gcTime: 5 * 60_000, // mantém cache por 5 min (ajuste se quiser)
    retry: 1,
  });
}
