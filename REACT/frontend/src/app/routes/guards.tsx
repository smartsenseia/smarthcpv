// src/app/routes/guards.tsx

import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * RequireAuth
 * -----------
 * Guard de rota para páginas que exigem autenticação.
 *
 * Uso típico:
 * <Route
 *   path="/telemetry"
 *   element={
 *     <RequireAuth>
 *       <TelemetryOverviewPage />
 *     </RequireAuth>
 *   }
 * />
 *
 * OBS:
 * - Por enquanto a autenticação é simulada.
 * - Quando o AuthProvider existir, basta trocar `isAuthenticated`
 *   por um valor vindo do contexto.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // TODO: substituir por AuthContext / Zustand / Redux
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <>{children}</>;
}

/**
 * RequireRole
 * -----------
 * Guard de rota baseado em perfil/role.
 *
 * Exemplo de uso:
 * <RequireRole roles={["admin"]}>
 *   <AdminPage />
 * </RequireRole>
 *
 * OBS:
 * - As roles são simuladas.
 * - Integra facilmente com JWT (FastAPI) depois.
 */
export function RequireRole({
  roles,
  children,
}: {
  roles: string[];
  children: React.ReactNode;
}) {
  // TODO: obter roles reais do usuário (AuthContext)
  const userRoles = ["admin"]; // mock

  const hasAccess = roles.some((r) => userRoles.includes(r));

  if (!hasAccess) {
    return <Navigate to="/telemetry" replace />;
  }

  return <>{children}</>;
}