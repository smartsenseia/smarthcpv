// src/features/alerts/components/AlertsTable.tsx

import { useMemo } from "react";
import type { Alert } from "../types";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import { Button } from "@/shared/components/Button";
import { formatDateTime } from "@/shared/utils/dates";

/**
 * Props do AlertsTable
 * --------------------
 * - Recebe a lista de alertas já carregada
 * - Recebe callback de ACK (controlado pela page/hook)
 */
export interface AlertsTableProps {
  alerts: Alert[];
  onAck: (alert: Alert) => void;
  ackLoading?: boolean;
}

/**
 * AlertsTable
 * -----------
 * Componente de tabela (UI) focado em alertas.
 * Não faz fetch.
 * Não conhece React Query.
 * Apenas renderiza.
 */
export function AlertsTable({ alerts, onAck, ackLoading = false }: AlertsTableProps) {
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
        minWidth: 130,
        render: (a) => <StatusBadge status={a.status} />,
      },
      {
        key: "sensor",
        header: "Sensor",
        minWidth: 170,
        render: (a) => a.sensor ?? "-",
      },
      {
        key: "message",
        header: "Message",
        minWidth: 360,
        render: (a) => a.message,
      },
      {
        key: "value",
        header: "Value",
        align: "right",
        minWidth: 110,
        render: (a) =>
          typeof a.value === "number"
            ? `${a.value.toFixed(2)}${a.unit ? ` ${a.unit}` : ""}`
            : "-",
      },
      {
        key: "actions",
        header: "Actions",
        align: "right",
        minWidth: 120,
        render: (a) => {
          const canAck = a.status === "open";
          return (
            <Button
              size="sm"
              variant={canAck ? "primary" : "secondary"}
              disabled={!canAck || ackLoading}
              onClick={() => onAck(a)}
            >
              ACK
            </Button>
          );
        },
      },
    ];
  }, [onAck, ackLoading]);

  return (
    <DataTable<Alert>
      data={alerts}
      columns={columns}
      emptyMessage="Nenhum alerta encontrado."
    />
  );
}

/* ---------- badges simples ---------- */

function SeverityBadge({ severity }: { severity: Alert["severity"] }) {
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

function StatusBadge({ status }: { status: Alert["status"] }) {
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

function severityColors(sev: Alert["severity"]): { bg: string; fg: string } {
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

function statusColors(status: Alert["status"]): { bg: string; fg: string } {
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
