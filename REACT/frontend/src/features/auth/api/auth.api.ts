// src/features/auth/api/auth.api.ts
import { http } from "@/shared/api/http";
import type { User } from "../types";

export type LoginResponse = {
  access_token: string;
  token_type: "bearer";
};

export type RefreshTokenResponse = {
  access_token: string;
  token_type: "bearer";
};

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const body = new URLSearchParams();
  body.set("username", username);
  body.set("password", password);

  // ✅ padronizado com prefixo /api/v1 (igual ao backend)
  const { data } = await http.post<LoginResponse>("/api/v1/auth/login", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    withCredentials: false,
  });

  return data;
}

/**
 * getMe
 * - Retorna o usuário autenticado (deve bater com o tipo User do frontend).
 * - Requer Authorization: Bearer <token> (enviado pelo interceptor do http.ts).
 */
export async function getMe(): Promise<User> {
  // ✅ padronizado com prefixo /api/v1 (igual ao backend)
  const { data } = await http.get<User>("/v1/auth/me", {
    withCredentials: false,
  });
  return data;
}

/**
 * Logout no modelo JWT local:
 * normalmente é só apagar token do storage no frontend.
 * Se você não tem endpoint de logout, esta função pode ser "no-op".
 */
export async function logout(): Promise<void> {
  // Se existir endpoint no backend, troque para:
  // await http.post("/api/v1/auth/logout");
  return;
}

/**
 * Refresh: só faz sentido se seu backend tiver refresh token.
 * Se não tiver, você pode remover o uso no app ou implementar depois.
 */
export async function refreshToken(): Promise<RefreshTokenResponse> {
  throw new Error("refreshToken não está implementado no backend ainda.");
}
