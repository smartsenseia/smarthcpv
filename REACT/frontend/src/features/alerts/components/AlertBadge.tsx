// src/features/alerts/components/AlertBadge.tsx

import type { AlertSeverity, AlertStatus } from "../types";

/**
 * AlertBadge
 * ----------
 * Badge reutilizável para exibir:
 * - severidade do alerta
 * - status do alerta
 *
 * Mantém padronização visual em tabelas, cards e páginas.
 */

export interface AlertBadgeProps {
  severity?: AlertSeverity;
  status?: AlertStatus;
  size?: "sm" | "md";
}

/**
 * Componente único que decide automaticamente
 * se renderiza badge de severidade ou de status.
 */
export function AlertBadge({ severity, status, size = "sm" }: AlertBadgeProps) {
  if (!severity && !status) return null;

  const label = severity ?? status ?? "";
  const { bg, fg } = severity
    ? severityColors(severity)
    : statusColors(status as AlertStatus);

  const padding = size === "sm" ? "2px 8px" : "4px 10px";
  const fontSize = size === "sm" ? 12 : 13;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding,
        borderRadius: 999,
        fontSize,
        backgroundColor: bg,
        color: fg,
        border: "1px solid rgba(0,0,0,0.08)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

/* ---------- helpers ---------- */

function severityColors(sev: AlertSeverity): { bg: string; fg: string } {
  switch (sev) {
    case "critical":
      return { bg: "rgba(198, 40, 40, 0.14)", fg: "#8e0000" };
    case "warning":
      return { bg: "rgba(255, 143, 0, 0.16)", fg: "#8a5a00" };
    case "info":
    default:
      return { bg: "rgba(30, 136, 229, 0.14)", fg: "#0d47a1" };
  }
}

function statusColors(status: AlertStatus): { bg: string; fg: string } {
  switch (status) {
    case "open":
      return { bg: "rgba(255, 143, 0, 0.16)", fg: "#8a5a00" };
    case "acknowledged":
      return { bg: "rgba(30, 136, 229, 0.14)", fg: "#0d47a1" };
    case "closed":
    default:
      return { bg: "rgba(46, 125, 50, 0.14)", fg: "#1b5e20" };
  }
}
