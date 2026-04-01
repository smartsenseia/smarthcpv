import { Outlet } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detecta mobile por largura
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // No mobile: começa fechado (overlay)
  useEffect(() => {
    if (isMobile) setSidebarCollapsed(true);
  }, [isMobile]);

  const onToggleSidebar = useCallback(() => {
    setSidebarCollapsed((v) => !v);
  }, []);

  const sidebarW = useMemo(() => {
    if (isMobile) return "0px"; // grid não reserva espaço no mobile
    return sidebarCollapsed ? "72px" : "280px";
  }, [sidebarCollapsed, isMobile]);

  return (
    <div
      className={`dash ${isMobile ? "dash--mobile" : ""}`}
      style={{ ["--sidebar-w" as any]: sidebarW }}
    >
      {/* Sidebar vira overlay no mobile */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={onToggleSidebar}
        mobile={isMobile}
      />

      {/* Backdrop para fechar ao clicar fora */}
      {isMobile && !sidebarCollapsed && (
        <div className="dash__backdrop" onClick={onToggleSidebar} />
      )}

      <div className="dash__main">
        <header className="dash__topbar">
          <Topbar onToggleSidebar={onToggleSidebar} isMobile={isMobile} />
        </header>

        <div className="dash__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
