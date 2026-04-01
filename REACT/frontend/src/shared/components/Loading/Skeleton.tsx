// src/shared/components/Loading/Skeleton.tsx

export interface SkeletonProps {
  /** Largura (px ou %) */
  width?: number | string;
  /** Altura (px) */
  height?: number;
  /** Raio de borda (px) */
  radius?: number;
}

/**
 * Skeleton
 * --------
 * Placeholder para carregamento de blocos (cards, linhas de tabela, etc.)
 */
export function Skeleton({
  width = "100%",
  height = 12,
  radius = 6,
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius: radius,
        background:
          "linear-gradient(90deg, rgba(220,220,220,0.65) 25%, rgba(235,235,235,0.9) 37%, rgba(220,220,220,0.65) 63%)",
        backgroundSize: "400% 100%",
        animation: "skeleton 1.1s ease-in-out infinite",
      }}
    >
      <style>
        {`
          @keyframes skeleton {
            0% { background-position: 100% 0; }
            100% { background-position: 0 0; }
          }
        `}
      </style>
    </div>
  );
}
