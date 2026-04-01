// src/shared/components/Button/Button.tsx

import React from "react";

/**
 * Tipos de botão suportados
 */
export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

/**
 * Button
 * ------
 * Componente de botão reutilizável e genérico.
 *
 * Responsabilidades:
 * - Padronizar estilo e comportamento de botões
 * - Suportar estados comuns (loading, disabled)
 *
 * Observação:
 * - Não conhece rotas, API ou regras de negócio
 * - Pode ser usado em qualquer feature
 */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...sizeStyles[size],
        opacity: isDisabled ? 0.6 : 1,
        cursor: isDisabled ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Carregando..." : children}
    </button>
  );
}

/* ---------- estilos ---------- */

const baseStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 6,
  fontWeight: 500,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  transition: "background-color 0.15s ease, color 0.15s ease",
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    padding: "6px 10px",
    fontSize: "0.8rem",
  },
  md: {
    padding: "8px 14px",
    fontSize: "0.9rem",
  },
  lg: {
    padding: "10px 18px",
    fontSize: "1rem",
  },
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "#222",
    color: "#fff",
  },
  secondary: {
    backgroundColor: "#e0e0e0",
    color: "#222",
  },
  danger: {
    backgroundColor: "#c62828",
    color: "#fff",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#222",
  },
};
