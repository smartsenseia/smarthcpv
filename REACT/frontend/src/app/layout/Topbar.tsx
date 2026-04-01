import { useLocation } from "react-router-dom";

export default function Topbar({
  onToggleSidebar,
  isMobile,
}: {
  onToggleSidebar?: () => void;
  isMobile?: boolean;
}) {
  const location = useLocation();
  const title = getTitleFromPath(location.pathname);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        minWidth: 0,
      }}
    >
      {isMobile && (
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Menu"
          style={{
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            borderRadius: 10,
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      )}

      <h2
        style={{
          margin: 0,
          fontSize: "1.05rem",
          fontWeight: 600,
          color: "white",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </h2>

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: "0.85rem",
          opacity: 0.75,
          color: "white",
          whiteSpace: "nowrap",
        }}
      >
        <span>Status: conectado</span>
      </div>
    </div>
  );
}

function getTitleFromPath(pathname: string): string {
  if (pathname.startsWith("/telemetry")) return "DASHBOARD MD MONITOR";
  if (pathname.startsWith("/alerts")) return "Alerts";
  if (pathname.startsWith("/login")) return "Login";
  return "Dashboard";
}
