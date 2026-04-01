// src/shared/utils/dates.ts

/**
 * Utilitários de data/hora
 * -----------------------
 * Funções puras para lidar com datas no frontend.
 * Não dependem de libs externas (date-fns, dayjs, etc.).
 */

/**
 * Converte Date ou string para ISO 8601 (UTC).
 */
export function toIsoString(date: Date | string): string {
  if (typeof date === "string") {
    return new Date(date).toISOString();
  }
  return date.toISOString();
}

/**
 * Formata uma data ISO para exibição simples (YYYY-MM-DD HH:mm:ss).
 */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

/**
 * Retorna um intervalo de datas (from, to) em ISO
 * Ex.: últimos N minutos.
 */
export function lastMinutes(minutes: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to.getTime() - minutes * 60_000);

  return {
    from: toIsoString(from),
    to: toIsoString(to),
  };
}

/**
 * Retorna um intervalo de datas (from, to) em ISO
 * Ex.: últimas N horas.
 */
export function lastHours(hours: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to.getTime() - hours * 60 * 60_000);

  return {
    from: toIsoString(from),
    to: toIsoString(to),
  };
}

/**
 * Retorna um intervalo de datas (from, to) em ISO
 * Ex.: últimos N dias.
 */
export function lastDays(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60_000);

  return {
    from: toIsoString(from),
    to: toIsoString(to),
  };
}

/**
 * Verifica se uma string é uma data ISO válida.
 */
export function isValidIsoDate(value: string): boolean {
  const d = new Date(value);
  return !isNaN(d.getTime());
}
