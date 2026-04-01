import { useEffect, useState } from "react";
import { useMeasurementLatest } from "../hooks/useMeasurementsLatest";

const ASSET_ID = "AQ21BR02" as const;

export default function AlertsCard() {
  const { data, isLoading } = useMeasurementLatest({
    assetId: ASSET_ID,
    refetchIntervalMs: 2000,
  });

  /**
   * Estado do alerta da IA
   * - null  → ainda não sabemos (primeira carga)
   * - false → operação normal
   * - true  → anomalia detectada
   */
  const [iaAlert, setIaAlert] = useState<boolean | null>(null);

  useEffect(() => {
    // 🔮 PLACEHOLDER
    // Quando a IA existir no backend, troque esta linha por algo como:
    // const detected = data?.ia_alert === true;

    const detected = false; // placeholder atual

    setIaAlert((prev) => {
      if (prev === detected) return prev;
      return detected;
    });
  }, [data]);

  const showInitialLoading = isLoading && iaAlert === null;

  return (
    <div
      style={{
        borderRadius: 14,
        padding: 16,
        background:
          iaAlert === true
            ? "rgba(255,80,80,0.10)"
            : "rgba(255,255,255,0.06)",
        marginBottom: 16,
        transition: "background 200ms ease",
      }}
    >
      {/* HEADER FIXO */}
      <div style={{ fontWeight: 700, color: "white", marginBottom: 12 }}>
        Alertas
      </div>

      {showInitialLoading ? (
        <div style={{ color: "white", opacity: 0.7, fontSize: 13 }}>
          Verificando sistema…
        </div>
      ) : (
        <div
          style={{
            color: "white",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <strong>🤖 IA:</strong>{" "}
          {iaAlert ? (
            <span style={{ color: "#ff6b6b", fontWeight: 600 }}>
              Anomalia detectada
            </span>
          ) : (
            <span style={{ color: "#36d399", fontWeight: 600 }}>
              Operação normal
            </span>
          )}
        </div>
      )}
    </div>
  );
}
