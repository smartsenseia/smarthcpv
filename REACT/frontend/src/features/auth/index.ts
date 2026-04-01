// src/features/auth/index.ts

// Pages
export { default as LoginPage } from "./pages/LoginPage";

// Components
export { LoginForm } from "./components/LoginForm";

// Hooks
export { useLogin } from "./hooks/useLogin";
export { useMe } from "./hooks/useMe";

// API
export { login, logout, getMe, refreshToken } from "./api/auth.api";

// Store
export {
  initAuthFromStorage,
  getSession,
  setSession,
  clearSession,
  subscribeAuth,
} from "./store/auth.store";
export type { AuthSession } from "./store/auth.store";

// Types
export type {
  UserRole,
  User,
  LoginPayload,
  LoginResponse,
  RefreshTokenPayload,
  AuthState,
  AuthError,
  PermissionMap,
} from "./types";
