// src/app/providers/ThemeProvider.tsx

import { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * Tema simples (light/dark)
 * -------------------------
 * Este provider:
 * - mantém o tema atual
 * - aplica um atributo no <html> para facilitar CSS
 * - persiste a escolha no localStorage
 *
 * Observação:
 * - Você pode integrar depois com CSS variables (shared/styles/theme.css)
 * - Ou trocar para um design system (MUI, Chakra, Tailwind, etc.)
 */

export type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "app.theme.mode";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return "light";
  });

  useEffect(() => {
    // Persistência
    localStorage.setItem(STORAGE_KEY, mode);

    // Aplica atributo no <html> para CSS/seletores
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode,
      toggle: () => setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}