import { useQuery, keepPreviousData, type UseQueryResult } from "@tanstack/react-query";
import { getMeasurements, type MeasurementDTO } from "../api/telemetry.api";

/**
 * ESTE HOOK CUSTOMIZADO GERENCIA A BUSCA E O PROCESSAMENTO DE DADOS DE TELEMETRIA.
 * Ele utiliza o TanStack Query para realizar chamadas assíncronas à API, tratando
 * a atualização automática (polling), o cache de dados e a transformação do formato
 * do backend (ordem decrescente) para o formato necessário nos gráficos (ordem cronológica).
 */

// 🔹 Campos válidos de medição (alinhados ao backend)
export type MeasurementField =
  | "fluxo_permeado"
  | "condhot"
  | "sec"
  | "gor"
  | "temp_1"
  | "temp_2"
  | "temp_3"
  | "temp_4"
  | "temp_5"
  | "temp_6"
  | "temp_7"
  | "temp_8"
  | "pressao_1"
  | "pressao_2"
  | "pressao_3"
  | "pressao_4"
  | "pressao_5";

// Definição do formato de um ponto individual no gráfico
type SeriesPoint = { timestamp: string; value: number };

/**
 * useMeasurementsSeries
 * Hook para buscar séries temporais de medições de um ativo específico.
 */
export function useMeasurementsSeries(options: {
  assetId: string;               // Identificador único do equipamento
  field: MeasurementField;       // Campo de processo a ser buscado
  limit?: number;                // Quantidade máxima de pontos (default: 200)
  refetchIntervalMs?: number;    // Intervalo de atualização automática (default: 10s)
}): UseQueryResult<{ series: SeriesPoint[] }, Error> {

  const { assetId, field, limit = 200, refetchIntervalMs = 10_000 } = options;

  return useQuery<{ series: SeriesPoint[] }, Error>({
    queryKey: ["measurements", "series", assetId, field, limit] as const,

    queryFn: async () => {
      const rows: MeasurementDTO[] = await getMeasurements({
        skip: 0,
        limit,
        assetId,
      });

      const series = rows
        .map((m) => {
          const v = m[field]; // acesso dinâmico, agora seguro
          return {
            timestamp: m.timestamp,
            value: typeof v === "number" ? v : NaN,
          };
        })
        .filter((p) => Number.isFinite(p.value))
        .reverse(); // DESC → ASC

      return { series };
    },

    enabled: Boolean(assetId),

    refetchInterval: refetchIntervalMs,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,

    placeholderData: keepPreviousData,
    retry: 2,
  });
}
