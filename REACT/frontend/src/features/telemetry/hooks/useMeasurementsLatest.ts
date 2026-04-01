import { useQuery, keepPreviousData, type UseQueryResult } from "@tanstack/react-query";
import { getMeasurements, type MeasurementDTO } from "../api/telemetry.api";

export function useMeasurementLatest(options: {
  assetId: string;
  enabled?: boolean;
  refetchIntervalMs?: number;
}): UseQueryResult<MeasurementDTO | null, Error> {
  const { assetId, enabled = true, refetchIntervalMs = 2000 } = options;

  return useQuery<MeasurementDTO | null, Error>({
    queryKey: ["measurements", "latest", assetId] as const,
    queryFn: async () => {
      // ✅ pega só 1 (menor payload e mais previsível)
      const rows = await getMeasurements({ skip: 0, limit: 1, assetId });
      return rows[0] ?? null;
    },
    enabled: enabled && Boolean(assetId),
    refetchInterval: refetchIntervalMs,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}
