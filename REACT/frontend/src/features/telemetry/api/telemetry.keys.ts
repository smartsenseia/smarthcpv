// src/features/telemetry/api/telemetry.keys.ts

/**
 * Query keys da feature Telemetry
 * -------------------------------
 * Centraliza todas as keys do React Query relacionadas à telemetria.
 *
 * Benefícios:
 * - evita strings mágicas espalhadas
 * - facilita invalidação/refetch
 * - mantém consistência entre hooks
 *
 * Convenção:
 * - arrays hierárquicos
 * - sempre começar pelo nome da feature
 */

export const telemetryKeys = {
  /** Namespace raiz */
  all: ["telemetry"] as const,

  /** Snapshot latest */
  latest: (assetId: string) =>
    [...telemetryKeys.all, "latest", assetId] as const,

  /** Histórico (range) */
  range: (params: {
    assetId: string;
    sensor: string;
    from: string;
    to: string;
  }) =>
    [
      ...telemetryKeys.all,
      "range",
      params.assetId,
      params.sensor,
      params.from,
      params.to,
    ] as const,
};
