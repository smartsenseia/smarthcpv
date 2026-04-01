// src/app/providers/AuthProvider.tsx

import { createContext, useContext, useMemo, useState } from "react";

/**
 * Tipos básicos de autenticação
 * -----------------------------
 * Mantidos simples de propósito.
 * Integração real (JWT/FastAPI) entra depois sem refatoração grande.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

/**
 * Contexto de autenticação
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProvider
 * ------------
 * Provider global de autenticação.
 *
 * Responsabilidades:
 * - Manter estado do usuário logado
 * - Expor login/logout
 * - Expor roles/permissões
 *
 * Observação:
 * - Neste estágio o login é "local" (mock).
 * - Depois você conecta com FastAPI (JWT, refresh token, etc.)
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const login = (u: User) => {
    setUser(u);
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook de acesso ao AuthContext
 * ----------------------------
 * Garante erro explícito se usado fora do provider.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}