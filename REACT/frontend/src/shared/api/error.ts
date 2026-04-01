// src/shared/api/error.ts

import type { AxiosError } from "axios";

/**
 * ApiError
 * --------
 * Erro padronizado para o frontend.
 * Você pode:
 * - exibir message na UI
 * - logar status/details para debug
 */
export class ApiError extends Error {
  public status?: number;
  public code?: string;
  public details?: unknown;

  constructor(message: string, opts?: { status?: number; code?: string; details?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = opts?.status;
    this.code = opts?.code;
    this.details = opts?.details;
  }
}

/**
 * Normaliza erros vindos do Axios em um formato consistente.
 *
 * Motivo:
 * - axios pode retornar erros em formatos diferentes dependendo:
 *   - timeout
 *   - rede offline
 *   - CORS
 *   - erro HTTP com payload JSON
 */
export function normalizeApiError(error: AxiosError): ApiError {
  // Caso 1: houve resposta do servidor (4xx/5xx)
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data as any;

    // Tenta extrair mensagens comuns (FastAPI costuma devolver `detail`)
    const message =
      (typeof data?.detail === "string" && data.detail) ||
      (typeof data?.message === "string" && data.message) ||
      `Request failed with status ${status}`;

    return new ApiError(message, {
      status,
      code: typeof data?.code === "string" ? data.code : undefined,
      details: data,
    });
  }

  // Caso 2: requisição foi feita, mas não houve resposta (rede, CORS, servidor off)
  if (error.request) {
    // Timeouts no axios geralmente vêm com code 'ECONNABORTED'
    if (error.code === "ECONNABORTED") {
      return new ApiError("Tempo de resposta excedido (timeout).", {
        code: error.code,
        details: { message: error.message },
      });
    }

    return new ApiError("Falha de rede ou servidor indisponível.", {
      code: error.code,
      details: { message: error.message },
    });
  }

  // Caso 3: erro ao configurar a requisição
  return new ApiError(error.message || "Erro inesperado na requisição.", {
    code: error.code,
    details: { message: error.message },
  });
}
