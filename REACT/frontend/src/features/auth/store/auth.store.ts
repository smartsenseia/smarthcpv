// src/features/auth/store/auth.store.ts

/**
 * Auth store (simples, sem libs externas)
 * --------------------------------------
 * Este store mantém:
 * - user
 * - accessToken
 *
 * Ele oferece:
 * - setSession / clearSession
 * - subscribe para reagir a mudanças (ex.: AuthProvider, http interceptors)
 *
 * Observação:
 * - Sem Zustand/Redux por enquanto, para manter o projeto leve.
 * - Se você decidir usar Zustand depois, o contrato aqui te ajuda a migrar.
 */

import type { User } from "../types";

export interface AuthSession {
  user: User | null;
  accessToken: string | null;
}

type Listener = (session: AuthSession) => void;

const STORAGE_TOKEN_KEY = "auth.access_token";
const STORAGE_USER_KEY = "auth.user";

let session: AuthSession = {
  user: null,
  accessToken: null,
};

const listeners = new Set<Listener>();

/**
 * Inicializa sessão a partir do localStorage (se houver).
 * Chame 1 vez no bootstrap do app (ex.: AuthProvider).
 */
export function initAuthFromStorage(): AuthSession {
  try {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const userRaw = localStorage.getItem(STORAGE_USER_KEY);

    const user = userRaw ? (JSON.parse(userRaw) as User) : null;

    session = {
      user,
      accessToken: token,
    };

    notify();
    return session;
  } catch {
    // Se storage estiver corrompido, limpa tudo.
    clearSession();
    return session;
  }
}

/**
 * Retorna sessão atual
 */
export function getSession(): AuthSession {
  return session;
}

/**
 * Atualiza sessão e persiste no localStorage
 */
export function setSession(next: AuthSession): void {
  session = next;

  if (next.accessToken) {
    localStorage.setItem(STORAGE_TOKEN_KEY, next.accessToken);
  } else {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  }

  if (next.user) {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(next.user));
  } else {
    localStorage.removeItem(STORAGE_USER_KEY);
  }

  notify();
}

/**
 * Limpa sessão (logout)
 */
export function clearSession(): void {
  session = { user: null, accessToken: null };
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
  notify();
}

/**
 * Subscreve mudanças na sessão
 * Retorna função para "unsubscribe".
 */
export function subscribeAuth(listener: Listener): () => void {
  listeners.add(listener);
  // chama imediatamente com o estado atual
  listener(session);

  return () => {
    listeners.delete(listener);
  };
}

/**
 * Helper: notifica listeners
 */
function notify() {
  for (const l of listeners) {
    l(session);
  }
}
