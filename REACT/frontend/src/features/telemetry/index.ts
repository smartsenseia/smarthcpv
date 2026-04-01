// src/features/telemetry/index.ts

// Pages
export { default as TelemetryOverviewPage } from "./pages/TelemetryOverviewPage";

// Components
export { default as TelemetryChart } from "./components/ChartCard";
export { default as DecisiveIndicatorsCard } from "./components/DecisiveIndicatorsCard";
export { default as AlertsCard } from "./components/AlertsCard";
export { default as InstructionsCard } from "./components/InstructionsCard";

// Hooks (NOVO FLUXO)
export { useMeasurementsSeries } from "./hooks/useMeasurements";
export { useMeasurementLatest } from "./hooks/useMeasurementsLatest";

// API (NOVO FLUXO)
export { getMeasurements } from "./api/telemetry.api";

// Types (somente os que ainda fazem sentido)
export type { MeasurementDTO } from "./api/telemetry.api";