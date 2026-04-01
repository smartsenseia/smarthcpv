// src/shared/components/Card/Card.tsx

import React from "react";

/**
 * Props do Card
 * -------------
 * Componente genérico de container visual.
 *
 * Uso típico:
 * - Agrupar conteúdo
 * - Envolver gráficos, tabelas, formulários
 */
export interface CardProps {
  /** Conteúdo interno */
  children: React.ReactNode;

  /** Título opcional do card */
  title?: string;

  /** Ações no cabeçalho (botões, filtros, etc.) */
  actions?: React.ReactNode;

  /** Remove padding interno */
  noPadding?: boolean;

  /** Estilo customizado */
  style?: React.CSSProperties;
}

/**
 * Card
 * ----
 * Componente puramente visual.
 * Não conhece dados, APIs ou regras de negócio.
 */
export function Card({
  children,
  title,
  actions,
  noPadding = false,
  style,
}: CardProps) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        ...style,
      }}
    >
      {(title || actions) && (
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #eaeaea",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {title && (
            <h3
              style={{
                margin: 0,
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {title}
            </h3>
          )}

          {actions && <div>{actions}</div>}
        </div>
      )}

      <div
        style={{
          padding: noPadding ? 0 : "16px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
