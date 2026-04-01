// src/features/auth/types.ts

/**
 * Tipos do domínio de Autenticação
 * -------------------------------
 * Representam o contrato entre frontend e backend (FastAPI)
 * para login, sessão e autorização.
 *
 * Estes tipos NÃO dependem de React, hooks ou implementação de storage.
 */

/**
 * Papel/perfil do usuário
 */
export type UserRole = "admin" | "operator" | "viewer";

/**
 * Usuário autenticado
 */
export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;

  /** ISO 8601 */
  created_at?: string;
}

/**
 * Payload de login
 */
export interface LoginPayload {
  username: string;
  password: string;
}

/**
 * Resposta de login
 * -----------------
 * Compatível com FastAPI + OAuth2/JWT
 */
export interface LoginResponse {
  access_token: string;
  token_type: "bearer";
  expires_in?: number;

  user: User;
}

/**
 * Payload para refresh de token
 */
export interface RefreshTokenPayload {
  refresh_token: string;
}

/**
 * Estado de autenticação no frontend
 */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Erro de autenticação
 */
export interface AuthError {
  message: string;
  code?: string;
}

/**
 * Permissões derivadas (opcional)
 * -------------------------------
 * Útil para guards de rota e controle fino de UI.
 */
export interface PermissionMap {
  canViewTelemetry: boolean;
  canViewAlerts: boolean;
  canAcknowledgeAlerts: boolean;
  canManageUsers: boolean;
}
