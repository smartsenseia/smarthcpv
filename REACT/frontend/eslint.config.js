// eslint.config.js

/**
 * ESLint configuration (Flat Config)
 * ----------------------------------
 * Compatível com:
 * - Vite
 * - React
 * - TypeScript
 *
 * Este setup prioriza:
 * - código limpo
 * - tipagem correta
 * - zero ruído desnecessário
 */

import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default [
  /* -----------------------------
     Base JS
     ----------------------------- */
  js.configs.recommended,

  /* -----------------------------
     TypeScript
     ----------------------------- */
  ...tseslint.configs.recommended,

  /* -----------------------------
     React
     ----------------------------- */
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      /* React */
      "react/react-in-jsx-scope": "off", // React 17+
      "react/prop-types": "off",

      /* Hooks */
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      /* TypeScript */
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      /* Geral */
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
    },
  },

  /* -----------------------------
     Arquivos ignorados
     ----------------------------- */
  {
    ignores: [
      "dist",
      "node_modules",
      "*.config.js",
      "*.config.ts",
    ],
  },
];
