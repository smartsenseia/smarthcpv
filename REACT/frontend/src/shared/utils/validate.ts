// src/shared/utils/validate.ts

/**
 * Utilitários de validação
 * -----------------------
 * Funções puras para validar valores comuns em formulários e filtros.
 * Não dependem de React nem de libs externas.
 */

/**
 * Valida se uma string não é vazia (após trim).
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Valida se um valor é número finito.
 */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Valida se um valor pode ser convertido para número finito.
 * (útil para inputs de texto)
 */
export function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const n = Number(value.replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * Valida e normaliza um asset_id simples.
 * Regras:
 * - trim
 * - remove espaços internos
 */
export function normalizeAssetId(value: string): string {
  return value.trim().replace(/\s+/g, "");
}

/**
 * Valida um sensor id "seguro" para uso em querystring/rotas.
 * Permite letras, números, underscore, hífen e ponto.
 */
export function isValidSensorId(sensor: string): boolean {
  if (!isNonEmptyString(sensor)) return false;
  return /^[a-zA-Z0-9_.-]+$/.test(sensor.trim());
}

/**
 * Valida se uma string parece ISO 8601.
 * (não é um parser completo, mas reduz erros comuns)
 */
export function isIsoDateString(value: string): boolean {
  if (!isNonEmptyString(value)) return false;
  // Ex.: 2025-12-23T14:30:00Z ou 2025-12-23T14:30:00.123Z
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value);
}

/**
 * Valida intervalo de datas (from <= to).
 * Retorna:
 * - ok: boolean
 * - message: string (quando inválido)
 */
export function validateDateRange(fromIso: string, toIso: string): {
  ok: boolean;
  message?: string;
} {
  if (!isIsoDateString(fromIso) || !isIsoDateString(toIso)) {
    return { ok: false, message: "Formato de data inválido (esperado ISO 8601 em UTC)." };
  }

  const from = new Date(fromIso).getTime();
  const to = new Date(toIso).getTime();

  if (Number.isNaN(from) || Number.isNaN(to)) {
    return { ok: false, message: "Não foi possível interpretar as datas." };
  }

  if (from > to) {
    return { ok: false, message: "Intervalo inválido: 'from' deve ser menor ou igual a 'to'." };
  }

  return { ok: true };
}
