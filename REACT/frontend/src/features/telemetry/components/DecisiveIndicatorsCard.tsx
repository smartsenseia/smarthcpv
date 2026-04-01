import { useEffect, useMemo, useState } from "react";
import { useMeasurementLatest } from "../hooks/useMeasurementsLatest";

const ASSET_ID = "AQ21BR02" as const;

type CardItem = {
  key: string;
  label: string;
  value: number;
  unit: string;
};

type LastValues = {
  gor: number | null;
  sec: number | null;
  fp: number | null;

  temp_1: number | null;
  temp_2: number | null;
  temp_3: number | null;
  temp_4: number | null;
  temp_5: number | null;
  temp_6: number | null;
  temp_7: number | null;
  temp_8: number | null;

  pressao_1: number | null;
  pressao_2: number | null;
  pressao_3: number | null;
  pressao_4: number | null;
  pressao_5: number | null;
};

export default function DecisiveIndicatorsCard() {
  const { data, isLoading } = useMeasurementLatest({
    assetId: ASSET_ID,
    refetchIntervalMs: 2000,
  });

  const [last, setLast] = useState<LastValues>({
    gor: null,
    sec: null,
    fp: null,

    temp_1: null,
    temp_2: null,
    temp_3: null,
    temp_4: null,
    temp_5: null,
    temp_6: null,
    temp_7: null,
    temp_8: null,

    pressao_1: null,
    pressao_2: null,
    pressao_3: null,
    pressao_4: null,
    pressao_5: null,
  });

  useEffect(() => {
    setLast((prev) => {
      const next = { ...prev };

      const fields: (keyof LastValues)[] = [
        "gor",
        "sec",
        "fp",
        "temp_1",
        "temp_2",
        "temp_3",
        "temp_4",
        "temp_5",
        "temp_6",
        "temp_7",
        "temp_8",
        "pressao_1",
        "pressao_2",
        "pressao_3",
        "pressao_4",
        "pressao_5",
      ];

      fields.forEach((field) => {
        let value: unknown;

        if (field === "fp") {
          value = data?.fluxo_permeado;
        } else {
          value = data?.[field as keyof typeof data];
        }

        if (typeof value === "number" && Number.isFinite(value)) {
          next[field] = value;
        }
      });

      const changed = fields.some((field) => next[field] !== prev[field]);
      return changed ? next : prev;
    });
  }, [data]);

  const indicatorItems: CardItem[] = useMemo(() => {
    const out: CardItem[] = [];

    if (typeof last.gor === "number") {
      out.push({ key: "gor", label: "GOR", value: last.gor, unit: "-" });
    }

    if (typeof last.sec === "number") {
      out.push({ key: "sec", label: "SEC", value: last.sec, unit: "kWh/m³" });
    }

    if (typeof last.fp === "number") {
      out.push({
        key: "fp",
        label: "FP (Fluxo de Permeado)",
        value: last.fp,
        unit: "kg·m⁻²·h⁻¹",
      });
    }

    return out;
  }, [last.gor, last.sec, last.fp]);

  const temperatureItems: CardItem[] = useMemo(() => {
    const labels = [
      { key: "temp_1", label: "T1 - Entrada lado quente" },
      { key: "temp_2", label: "T2 - Saída lado quente" },
      { key: "temp_3", label: "T3 - Entrada lado frio" },
      { key: "temp_4", label: "T4 - Saída lado frio" },
      { key: "temp_5", label: "T5 - Entrada refrigeração" },
      { key: "temp_6", label: "T6 - Saída refrigeração" },
      { key: "temp_7", label: "T7 - Ambiente" },
      { key: "temp_8", label: "T8 - Módulo" },
    ] as const;

    return labels
      .map((item) => {
        const value = last[item.key];
        if (typeof value !== "number") return null;

        return {
          key: item.key,
          label: item.label,
          value,
          unit: "°C",
        };
      })
      .filter(Boolean) as CardItem[];
  }, [last]);

  const pressureItems: CardItem[] = useMemo(() => {
    const labels = [
      { key: "pressao_1", label: "P1 - Entrada lado quente" },
      { key: "pressao_2", label: "P2 - Saída lado quente" },
      { key: "pressao_3", label: "P3 - Entrada lado frio" },
      { key: "pressao_4", label: "P4 - Saída lado frio" },
      { key: "pressao_5", label: "P5 - Reservatório de permeado" },
    ] as const;

    return labels
      .map((item) => {
        const value = last[item.key];
        if (typeof value !== "number") return null;

        return {
          key: item.key,
          label: item.label,
          value,
          unit: "bar",
        };
      })
      .filter(Boolean) as CardItem[];
  }, [last]);

  const showInitialLoading =
    isLoading &&
    indicatorItems.length === 0 &&
    temperatureItems.length === 0 &&
    pressureItems.length === 0;

  const renderSection = (title: string, items: CardItem[]) => {
    if (items.length === 0) return null;

    return (
      <div style={{ marginTop: 18 }}>
        <div
          style={{
            fontWeight: 600,
            color: "white",
            marginBottom: 10,
            fontSize: 14,
            opacity: 0.9,
          }}
        >
          {title}
        </div>

        {items.map((it) => (
          <div key={it.key} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.7, color: "white" }}>
              {it.label}
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "white",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {it.value.toFixed(3)}{" "}
              <span style={{ fontSize: 12, opacity: 0.7 }}>{it.unit}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        borderRadius: 14,
        padding: 16,
        background: "rgba(255,255,255,0.06)",
        marginBottom: 16,
      }}
    >
      <div style={{ fontWeight: 700, color: "white", marginBottom: 12 }}>
        Indicadores Decisivos
      </div>

      {showInitialLoading ? (
        <div style={{ color: "white", opacity: 0.7, fontSize: 13 }}>
          Carregando…
        </div>
      ) : indicatorItems.length === 0 &&
        temperatureItems.length === 0 &&
        pressureItems.length === 0 ? (
        <div style={{ color: "white", opacity: 0.7, fontSize: 13 }}>
          Sem dados no momento.
        </div>
      ) : (
        <>
          {renderSection("Temperaturas", temperatureItems)}
          {renderSection("Pressões", pressureItems)}
          {renderSection("Indicadores", indicatorItems)}
        </>
      )}
    </div>
  );
}