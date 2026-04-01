// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    server: {
      host: "127.0.0.1",          // importante pro cloudflared apontar certinho
      port: 5173,
      open: false,                // no rasp isso só atrapalha (opcional)
      strictPort: true,

      allowedHosts: [
        "dashboard.smartsenseia.org",
        "localhost",
        "127.0.0.1",
      ],

      proxy: {
        "/api": {
          target: "https://api.seudominio.com",
          changeOrigin: true,
          secure: true,
          // rewrite: (p) => p.replace(/^\/api/, ""),
        },
      },
    },

    build: {
      outDir: "dist",
      sourcemap: false,
      emptyOutDir: true,
    },

    preview: {
      port: 4173,
    },

    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV ?? ""),
    },
  };
});
