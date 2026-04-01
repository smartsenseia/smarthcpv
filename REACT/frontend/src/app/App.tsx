// src/app/App.tsx

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";

/**
 * App
 * ---
 * Componente raiz da aplicação.
 *
 * Responsabilidades:
 * - Envolver a aplicação com o Router
 * - Centralizar providers globais (quando existirem)
 * - Conectar layout + rotas
 *
 * Observação:
 * - Providers como QueryProvider, AuthProvider e ThemeProvider
 *   podem ser adicionados aqui sem alterar páginas ou features.
 */
export default function App() {
  return (
    <BrowserRouter>
      {/* Providers globais podem ser adicionados aqui */}
      {/* <ThemeProvider> */}
      {/* <AuthProvider> */}
      {/* <QueryProvider> */}

      <AppRoutes />

      {/* </QueryProvider> */}
      {/* </AuthProvider> */}
      {/* </ThemeProvider> */}
    </BrowserRouter>
  );
}