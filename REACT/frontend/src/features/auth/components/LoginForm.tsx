// src/features/auth/components/LoginForm.tsx
import React, { useState } from "react";
import type { LoginPayload } from "../types";
import { Button } from "@/shared/components/Button";
import { Spinner } from "@/shared/components/Loading";
import "./login-form.css";

export interface LoginFormProps {
  onSubmit: (payload: LoginPayload) => void;
  loading?: boolean;
  error?: string | null;
}

export function LoginForm({
  onSubmit,
  loading = false,
  error = null,
}: LoginFormProps) {
  const [form, setForm] = useState<LoginPayload>({
    username: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="loginShell">
      <div className="loginGlow" aria-hidden="true" />

      <div className="loginCard">
        <div className="loginHeader">
          <div className="loginBadge">SmartSense IA</div>
          <h1 className="loginTitle">Acessar Dashboard</h1>
          <p className="loginSubtitle">Entre com suas credenciais para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="loginForm">
          <div className="field">
            <label className="label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
              className="input"
              placeholder="seu.usuario"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="input"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="errorBox" role="alert">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? <Spinner /> : "Entrar"}
          </Button>

          <div className="loginFooter">
            <span className="hint">Dica:</span> use um usuário válido do seu
            backend/mock.
          </div>
        </form>
      </div>
    </div>
  );
}
