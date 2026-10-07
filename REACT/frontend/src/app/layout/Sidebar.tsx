import { memo, useMemo } from "react";
import { NavLink } from "react-router-dom";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
};

function Sidebar({ collapsed, onToggle, mobile = false }: SidebarProps) {
  const year = useMemo(() => new Date().getFullYear(), []);

  const isOpen = mobile ? !collapsed : true;

  return (
    <aside
      className="dash__sidebar"
      data-collapsed={collapsed ? "true" : "false"}
      style={{
        width: mobile ? 260 : collapsed ? 72 : 260,
        transition: "transform 180ms ease, width 180ms ease",
        overflow: "hidden",
        flex: "0 0 auto",
        willChange: mobile ? "transform" : "width",

        position: mobile ? "fixed" : undefined,
        top: mobile ? 0 : undefined,
        left: mobile ? 0 : undefined,
        height: mobile ? "100dvh" : undefined,
        zIndex: mobile ? 50 : undefined,

        transform: mobile
          ? isOpen
            ? "translateX(0)"
            : "translateX(-110%)"
          : undefined,

        boxShadow: mobile
          ? "0 18px 48px rgba(0,0,0,0.45)"
          : undefined,
      }}
    >
      {/* =========================
          BRANDING
      ========================== */}
      <div
        className="brand"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 12,
          minHeight: 44,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div className="brand__logo">S</div>

          <div
            className="brand__name"
            style={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              overflow: "hidden",
              whiteSpace: "nowrap",
              transition: "opacity 120ms ease",
            }}
          >
            MDIS
          </div>
        </div>

        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Collapse sidebar"
            title="Collapse"
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 8,
              borderRadius: 10,
              opacity: 0.9,
            }}
          >
            ⟨⟨
          </button>
        )}
      </div>

      {/* =========================
          BOTÃO EXPANDIR
      ========================== */}
      {collapsed && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 6,
          }}
        >
          <button
            type="button"
            onClick={onToggle}
            aria-label="Expand sidebar"
            title="Expand"
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 8,
              borderRadius: 10,
              opacity: 0.9,
            }}
          >
            ⟩⟩
          </button>
        </div>
      )}

      {/* =========================
          NAVIGATION
      ========================== */}
      <div
        className="navTitle"
        style={{
          opacity: collapsed ? 0 : 1,
          height: 18,
          overflow: "hidden",
          transition: "opacity 120ms ease",
        }}
      >
        NAVIGATION
      </div>

      <SidebarLink
        to="/telemetry"
        label="Dashboard"
        collapsed={collapsed}
      />

      {/* =========================
          CAMERA
      ========================== */}
      <div
        className="navTitle"
        style={{
          opacity: collapsed ? 0 : 1,
          height: collapsed ? 0 : 18,
          overflow: "hidden",
          transition: "opacity 120ms ease",
          marginTop: collapsed ? 0 : 14,
        }}
      >
        CAMERA
      </div>

      <div
        style={{
          padding: collapsed ? "8px 6px" : "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: collapsed ? 52 : "100%",
            height: collapsed ? 52 : 125,
            borderRadius: 10,
            overflow: "hidden",
            background: "#111827",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/camera"
            alt="Camera Hikvision"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* =========================
          FOOTER
      ========================== */}
      <div
        className="sidebarFooter"
        style={{
          opacity: collapsed ? 0 : 1,
          height: 18,
          overflow: "hidden",
          transition: "opacity 120ms ease",
        }}
      >
        © {year}
      </div>
    </aside>
  );
}

/* =========================
   SIDEBAR LINK
========================= */
function SidebarLink({
  to,
  label,
  disabled = false,
  collapsed = false,
}: {
  to: string;
  label: string;
  disabled?: boolean;
  collapsed?: boolean;
}) {
  const short = label.slice(0, 1).toUpperCase();

  if (disabled) {
    return (
      <div
        className="navItem"
        title={label}
        style={{
          opacity: 0.4,
          cursor: "not-allowed",
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        {collapsed ? short : label}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      title={label}
      className={({ isActive }) =>
        `navItem ${isActive ? "navItem--active" : ""}`
      }
      style={{
        display: "flex",
        justifyContent: collapsed ? "center" : "flex-start",
      }}
    >
      {collapsed ? short : label}
    </NavLink>
  );
}

export default memo(Sidebar);