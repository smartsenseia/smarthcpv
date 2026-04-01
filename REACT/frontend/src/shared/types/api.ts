// src/shared/types/api.ts

/**
 * Tipos genéricos de API
 * ---------------------
 * Estes tipos representam padrões comuns de respostas do backend (FastAPI).
 * São reutilizáveis por qualquer feature.
 */

/**
 * Resposta paginada padrão
 * -----------------------
 * Exemplo de uso:
 * GET /alerts?page=1&page_size=20
 */
export interface Paginated<T> {
  /** Lista de itens da página atual */
  items: T[];

  /** Página atual (1-based) */
  page: number;

  /** Tamanho da página */
  page_size: number;

  /** Total de itens disponíveis */
  total: number;
}

/**
 * Resposta simples de sucesso
 * ---------------------------
 * Útil para operações de escrita (POST/PUT/DELETE).
 */
export interface ApiSuccess {
  success: true;
}

/**
 * Erro padrão retornado pela API
 * ------------------------------
 * Compatível com FastAPI (detail).
 */
export interface ApiErrorResponse {
  detail: string;
}

/**
 * Metadados comuns de resposta
 * ----------------------------
 * Útil quando a API começa a enriquecer respostas.
 */
export interface ApiMeta {
  request_id?: string;
  timestamp?: string;
}
