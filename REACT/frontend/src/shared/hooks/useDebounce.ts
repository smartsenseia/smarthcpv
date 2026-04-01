// src/shared/hooks/useDebounce.ts

import { useEffect, useState } from "react";

/**
 * useDebounce
 * -----------
 * Hook para atrasar a propagação de um valor até que ele
 * permaneça estável por um determinado intervalo de tempo.
 *
 * Casos de uso típicos:
 * - inputs de busca
 * - filtros
 * - sliders
 * - evitar chamadas excessivas à API
 *
 * Exemplo:
 * const debouncedSearch = useDebounce(search, 400);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
