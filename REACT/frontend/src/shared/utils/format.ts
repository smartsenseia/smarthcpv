// src/shared/utils/format.ts

/**
 * Utilitários de formatação
 * ------------------------
 * Funções puras para formatar valores para exibição na UI.
 * Não dependem de React nem de bibliotecas externas.
 */

/**
 * Formata um número com casas decimais fixas.
 */
export function formatNumber(
  value: number,
  decimals = 2
): string {
  if (!Number.isFinite(value)) return "-";
  return value.toFixed(decimals);
}

/**
 * Formata número respeitando locale (ex.: pt-BR, en-US).
 */
export function formatNumberLocale(
  value: number,
  options?: Intl.NumberFormatOptions,
  locale = "pt-BR"
): string {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Formata valor + unidade física.
 * Ex.: 42.35 °C | 9.72 bar
 */
export function formatWithUnit(
  value: number,
  unit: string,
  decimals = 2
): string {
  if (!Number.isFinite(value)) return "-";
  return `${value.toFixed(decimals)} ${unit}`;
}

/**
 * Formata percentual.
 * Ex.: 0.1234 -> 12.34 %
 */
export function formatPercent(
  value: number,
  decimals = 2
): string {
  if (!Number.isFinite(value)) return "-";
  return `${(value * 100).toFixed(decimals)} %`;
}

/**
 * Formata valor monetário.
 * Ex.: R$ 1.234,56
 */
export function formatCurrency(
  value: number,
  currency = "BRL",
  locale = "pt-BR"
): string {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Limita o tamanho de um texto e adiciona reticências.
 */
export function truncate(
  text: string,
  maxLength: number
): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

/**
 * Converte snake_case ou camelCase em texto amigável.
 * Ex.: "T_in_evaporator" -> "T In Evaporator"
 */
export function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
