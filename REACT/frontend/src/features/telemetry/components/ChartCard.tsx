import { useEffect, useRef, useState } from "react";
import { useMeasurementsSeries } from "../hooks/useMeasurements";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const ASSET_ID = "AQ21BR02" as const;
const MAX_POINTS = 200;

// =======================================================
// Hook para buffer incremental (evita duplicar pontos)
// =======================================================
function useLiveSeries(
  incoming: Array<{ timestamp: string; value: number }> | undefined,
  maxPoints = MAX_POINTS
) {
  const [buf, setBuf] = useState<Array<{ timestamp: string; value: number }>>(
    []
  );
  const lastTsRef = useRef<string | null>(null);

  useEffect(() => {
    if (!incoming || incoming.length === 0) return;

    const last = incoming[incoming.length - 1];

    setBuf((prev) => {
      if (prev.length === 0) {
        lastTsRef.current = last.timestamp;
        return incoming.slice(-maxPoints);
      }

      if (lastTsRef.current === last.timestamp) return prev;

      lastTsRef.current = last.timestamp;
      return [...prev, last].slice(-maxPoints);
    });
  }, [incoming, maxPoints]);

  return buf;
}

// =======================================================
// Card de gráfico reutilizável
// =======================================================
function ChartCard({
  title,
  unit,
  series,
  loading,
}: {
  title: string;
  unit: string;
  series: Array<{ timestamp: string; value: number }>;
  loading: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        borderRadius: 14,
        padding: 16,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        minHeight: 0,
      }}
    >
      <div style={{ fontWeight: 700, color: "white", marginBottom: 8 }}>
        {title}
      </div>

      {loading && series.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            color: "white",
            opacity: 0.7,
          }}
        >
          Carregando gráfico…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.12}
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
              height={24}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
              width={70}
              domain={["auto", "auto"]}
            />
            <Tooltip
              isAnimationActive={false}
              contentStyle={{
                background: "#1a1a1a",
                border: "none",
                borderRadius: 8,
              }}
              formatter={(value: any) => {
                const num = Number(value);
                return [
                  !isNaN(num) ? `${num.toFixed(3)} ${unit}` : `- ${unit}`,
                  "",
                ];
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// =======================================================
// Página principal
// =======================================================
export default function TelemetryOverviewCharts() {
  // 🔹 Fluxo de permeado
  const fluxoQ = useMeasurementsSeries({
    assetId: ASSET_ID,
    field: "fluxo_permeado",
    refetchIntervalMs: 5_000,
    limit: MAX_POINTS,
  });

  // 🔹 Condutividade lado quente
  const condhotQ = useMeasurementsSeries({
    assetId: ASSET_ID,
    field: "condhot",
    refetchIntervalMs: 5_000,
    limit: MAX_POINTS,
  });

  const fluxoSeries = useLiveSeries(fluxoQ.data?.series, MAX_POINTS);
  const condhotSeries = useLiveSeries(condhotQ.data?.series, MAX_POINTS);

  return (
    <div
      style={{
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 16,
        minHeight: 0,
      }}
    >
      <ChartCard
        title="Fluxo de Permeado"
        unit="kg·m⁻²·h⁻¹"
        series={fluxoSeries}
        loading={fluxoQ.isLoading}
      />

      <ChartCard
        title="Condutividade — Lado Quente"
        unit="µS/cm"
        series={condhotSeries}
        loading={condhotQ.isLoading}
      />
    </div>
  );
}
