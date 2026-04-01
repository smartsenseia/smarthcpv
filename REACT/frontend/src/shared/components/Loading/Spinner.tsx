// src/shared/components/Loading/Spinner.tsx

export interface SpinnerProps {
  /** Tamanho em px */
  size?: number;
  /** Texto opcional ao lado */
  label?: string;
}

/**
 * Spinner
 * -------
 * Indicador de carregamento simples.
 * Não depende de libs externas.
 */
export function Spinner({ size = 18, label }: SpinnerProps) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span
        aria-label="Loading"
        role="status"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "2px solid #ddd",
          borderTopColor: "#222",
          display: "inline-block",
          animation: "spin 0.9s linear infinite",
        }}
      />
      {label ? <span style={{ fontSize: 13, opacity: 0.75 }}>{label}</span> : null}

      {/* CSS local via <style> para não depender de arquivo global */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
