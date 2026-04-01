// src/app/providers/QueryProvider.tsx

import React from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

/**
 * QueryProvider
 * -------------
 * Provider global do TanStack React Query.
 *
 * Responsabilidades:
 * - Criar e manter o QueryClient (cache de requisições)
 * - Envolver o app com QueryClientProvider
 *
 * Benefícios:
 * - cache automático
 * - loading/error padronizados
 * - refetch/polling fácil
 * - invalidação de queries por keys
 */
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cria o client uma única vez por instância do provider
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Ajuste padrões conforme o seu caso
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}