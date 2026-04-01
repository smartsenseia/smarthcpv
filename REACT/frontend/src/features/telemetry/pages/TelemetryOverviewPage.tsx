import ChartCard from "../components/ChartCard";
import DecisiveIndicatorsCard from "../components/DecisiveIndicatorsCard";
import AlertsCard from "../components/AlertsCard";

export default function TelemetryOverviewPage() {
  return (
    <div className="telemetryPage">
      <div className="telemetryGrid">
        <ChartCard />

        <aside className="telemetrySide">
          <DecisiveIndicatorsCard />
          <AlertsCard />
        </aside>
      </div>
    </div>
  );
}
