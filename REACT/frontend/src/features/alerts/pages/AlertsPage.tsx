// src/features/alerts/pages/AlertsPage.tsx

import { useMemo, useState } from "react";
import { useAlerts } from "../hooks/useAlerts";
import { useAckAlert } from "../hooks/useAckAlert";
import type { Alert, AlertSeverity, AlertStatus } from "../types";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import { Spinner } from "@/shared/components/Loading";
import { formatDateTime } from "@/shared/utils/dates";

/**
 * AlertsPage
 * ----------
 * Página de listagem de alertas
 * - Filtros simples (status, severidade)
 * - Tabela com actions (ACK)
 * - Polling opcional (ex.: 5s) para "quase tempo real"
 */
export default function AlertsPage() {
  const [status, setStatus] = useState<AlertStatus | "all">("open");
  const [severity, setSeverity] = useState<AlertSeverity | "all">("all");
  const [assetId, setAssetId] = useState<string>(""); // opcional

  const params = useMemo(() => {
    return {
      asset_id: assetId.trim() ? assetId.trim() : undefined,
      status: status === "all" ? undefined : status,
      severity: severity === "all" ? undefined : severity,
    };
  }, [assetId, status, severity]);

  const {
    data: alerts,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAlerts({
    params,
    refetchIntervalMs: 5000, // atualiza a cada 5s (ajuste)
  });

  const {
    mutate: ackAlert,
    isPending: ackLoading,
  } = useAckAlert();

  const columns = useMemo<DataTableColumn<Alert>[]>(() => {
    return [
      {
        key: "created_at",
        header: "Created",
        minWidth: 160,
        render: (a) => formatDateTime(a.created_at),
      },
      {
        key: "asset_id",
        header: "Asset",
        minWidth: 120,
        render: (a) => a.asset_id,
      },
      {
        key: "severity",
        header: "Severity",
        minWidth: 90,
        render: (a) => <SeverityBadge severity={a.severity} />,
      },
      {
        key: "status",
        header: "Status",
        minWidth: 120,
        render: (a) => <StatusBadge status={a.status} />,
      },
      {
        key: "sensor",
        header: "Sensor",
        minWidth: 160,
        render: (a) => a.sensor ?? "-",
      },
      {
        key: "message",
        header: "Message",
        minWidth: 320,
        render: (a) => a.message,
      },
      {
        key: "value",
        header: "Value",
        align: "right",
        minWidth: 100,
        render: (a) =>
          typeof a.value === "number"
            ? `${a.value.toFixed(2)}${a.unit ? ` ${a.unit}` : ""}`
            : "-",
      },
      {
        key: "actions",
        header: "Actions",
        align: "right",
        minWidth: 130,
        render: (a) => {
          const canAck = a.status === "open";
          return (
            <Button
              size="sm"
              variant={canAck ? "primary" : "secondary"}
              disabled={!canAck || ackLoading}
              onClick={() => {
                // Em um app real, user_id vem do AuthProvider (useAuth().user.id)
                ackAlert({
                  alert_id: a.id,
                  user_id: "user-demo",
                  comment: "ACK via UI",
                });
              }}
            >
              ACK
            </Button>
          );
        },
      },
    ];
  }, [ackAlert, ackLoading]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>Alerts</h1>
          <div style={{ marginTop: 4, opacity: 0.75 }}>
            {isFetching ? "atualizando..." : "atualizado"}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Button variant="secondary" onClick={() => refetch()} loading={isFetching}>
            Atualizar
          </Button>
        </div>
      </div>

      <Card
        title="Filters"
        actions={isFetching ? <Spinner label="sync..." /> : null}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>Asset (optional)</label>
            <input
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              placeholder="ex.: AQ21BR02"
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AlertStatus | "all")}
              style={inputStyle}
            >
              <option value="all">all</option>
              <option value="open">open</option>
              <option value="acknowledged">acknowledged</option>
              <option value="closed">closed</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as AlertSeverity | "all")}
              style={inputStyle}
            >
              <option value="all">all</option>
              <option value="info">info</option>
              <option value="warning">warning</option>
              <option value="critical">critical</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title="Alerts List">
        {isLoading ? (
          <Spinner label="Carregando alertas..." />
        ) : isError ? (
          <div style={{ color: "crimson" }}>
            Falha ao carregar alertas:{" "}
            {error instanceof Error ? error.message : "erro desconhecido"}
          </div>
        ) : (
          <DataTable<Alert>
            data={alerts ?? []}
            columns={columns}
            emptyMessage="Nenhum alerta encontrado para os filtros selecionados."
          />
        )}
      </Card>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const { bg, fg } = severityColors(severity);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        backgroundColor: bg,
        color: fg,
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {severity}
    </span>
  );
}

function StatusBadge({ status }: { status: AlertStatus }) {
  const { bg, fg } = statusColors(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        backgroundColor: bg,
        color: fg,
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {status}
    </span>
  );
}

function severityColors(sev: AlertSeverity): { bg: string; fg: string } {
  switch (sev) {
    case "critical":
      return { bg: "rgba(198, 40, 40, 0.12)", fg: "#8e0000" };
    case "warning":
      return { bg: "rgba(255, 143, 0, 0.14)", fg: "#8a5a00" };
    case "info":
    default:
      return { bg: "rgba(30, 136, 229, 0.12)", fg: "#0d47a1" };
  }
}

function statusColors(status: AlertStatus): { bg: string; fg: string } {
  switch (status) {
    case "open":
      return { bg: "rgba(255, 143, 0, 0.14)", fg: "#8a5a00" };
    case "acknowledged":
      return { bg: "rgba(30, 136, 229, 0.12)", fg: "#0d47a1" };
    case "closed":
    default:
      return { bg: "rgba(46, 125, 50, 0.12)", fg: "#1b5e20" };
  }
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.75,
};

const inputStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #ddd",
  background: "#fff",
};
