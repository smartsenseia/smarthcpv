// src/shared/hooks/useInterval.ts

import { useEffect, useRef } from "react";

/**
 * useInterval
 * -----------
 * Hook para executar uma função repetidamente em um intervalo fixo,
 * de forma segura no React (sem problemas de closures).
 *
 * Casos de uso:
 * - polling manual
 * - atualização periódica de estado
 * - timers de UI
 *
 * Exemplo:
 * useInterval(() => {
 *   refetch();
 * }, 2000);
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  // Guarda sempre a versão mais recente do callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Controla o intervalo
  useEffect(() => {
    if (delay === null) return;

    function tick() {
      savedCallback.current?.();
    }

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
