// src/app/routes/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import TelemetryOverviewPage from "@/features/telemetry/pages/TelemetryOverviewPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import ProtectedRoute from "@/features/auth/api/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* Grupo de rotas privadas */}
      <Route element={<ProtectedRoute />}>
        {/* Redirect raiz para a página principal privada */}
        <Route path="/" element={<Navigate to="/telemetry" replace />} />

        {/* Rotas privadas com layout */}
        <Route element={<AppLayout />}>
          <Route path="/telemetry" element={<TelemetryOverviewPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/telemetry" replace />} />
    </Routes>
  );
}
