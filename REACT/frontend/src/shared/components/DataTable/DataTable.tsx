// src/shared/components/DataTable/DataTable.tsx

import React from "react";

/**
 * Definição de coluna genérica
 */
export interface DataTableColumn<T> {
  /** Identificador único da coluna */
  key: string;

  /** Título exibido no cabeçalho */
  header: string;

  /** Função para renderizar a célula */
  render: (row: T) => React.ReactNode;

  /** Alinhamento do conteúdo */
  align?: "left" | "right" | "center";

  /** Largura mínima da coluna */
  minWidth?: number;
}

/**
 * Props do DataTable
 */
export interface DataTableProps<T> {
  /** Dados a serem exibidos */
  data: T[];

  /** Definição das colunas */
  columns: DataTableColumn<T>[];

  /** Texto exibido quando não há dados */
  emptyMessage?: string;

  /** Mostra estado de loading */
  loading?: boolean;
}

/**
 * DataTable
 * ---------
 * Tabela genérica, desacoplada de domínio.
 *
 * - Não conhece API
 * - Não conhece paginação
 * - Não conhece filtros
 *
 * Tudo isso pode ser adicionado depois sem quebrar o contrato.
 */
export function DataTable<T>({
  data,
  columns,
  emptyMessage = "Nenhum dado disponível.",
  loading = false,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div style={containerStyle}>
        <p style={infoStyle}>Carregando dados...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={containerStyle}>
        <p style={infoStyle}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  ...thStyle,
                  textAlign: col.align ?? "left",
                  minWidth: col.minWidth,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    ...tdStyle,
                    textAlign: col.align ?? "left",
                  }}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- estilos ---------- */

const containerStyle: React.CSSProperties = {
  width: "100%",
  overflowX: "auto",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 500,
};

const thStyle: React.CSSProperties = {
  padding: "10px 8px",
  fontSize: "0.8rem",
  fontWeight: 600,
  borderBottom: "1px solid #e0e0e0",
  color: "#555",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 8px",
  fontSize: "0.85rem",
  borderBottom: "1px solid #f0f0f0",
  color: "#222",
  whiteSpace: "nowrap",
};

const infoStyle: React.CSSProperties = {
  padding: "16px",
  fontSize: "0.9rem",
  opacity: 0.7,
};
