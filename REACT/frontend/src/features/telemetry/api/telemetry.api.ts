// src/features/telemetry/api/telemetry.api.ts  (ajuste o caminho se necessário)
import { http } from "@/shared/api/http";

export type MeasurementDTO = {
  id: number;
  timestamp: string;
  asset_id?: string;

  gor?: number | null;
  sec?: number | null;
  fluxo_permeado?: number | null;

  // (opcional) se você usa em gráficos:
  condhot?: number | null;
};


export async function getMeasurements(params: {
  skip?: number;
  limit?: number;
  assetId?: string;
}): Promise<MeasurementDTO[]> {
  const { skip = 0, limit = 200, assetId } = params;

  // ✅ usa a instância axios com baseURL certo (api.smartsenseia.org em prod)
  const { data } = await http.get<MeasurementDTO[]>("/api/v1/endpoints/", {
    params: {
      skip,
      limit,
      ...(assetId ? { asset_id: assetId } : {}),
    },
  });

  // Se o backend não filtra por asset_id, filtra aqui
  if (assetId) return data.filter((m) => !m.asset_id || m.asset_id === assetId);

  return data;
}
