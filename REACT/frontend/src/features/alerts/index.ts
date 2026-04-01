// src/features/alerts/index.ts

// Pages
export { default as AlertsPage } from "./pages/AlertsPage";

// Components
export { AlertsTable } from "./components/AlertsTable";
export { AlertBadge } from "./components/AlertBadge";

// Hooks
export { useAlerts } from "./hooks/useAlerts";
export { useAckAlert } from "./hooks/useAckAlert";

// API
export { alertsKeys } from "./api/alerts.keys";

// Types
export type {
  Alert,
  AlertSeverity,
  AlertStatus,
  AlertSource,
  AlertQueryParams,
  AlertAcknowledgePayload,
  AlertClosePayload,
} from "./types";
