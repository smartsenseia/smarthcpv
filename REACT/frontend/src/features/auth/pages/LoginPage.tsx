// src/features/auth/pages/LoginPage.tsx
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useLogin } from "../hooks/useLogin";
import { LoginForm } from "../components/LoginForm";
import type { LoginPayload } from "../types";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("access_token");
  if (token) {
    const from = (location.state as any)?.from ?? "/telemetry";
    return <Navigate to={from} replace />;
  }

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { mutate: login, isPending } = useLogin();

  function handleSubmit(payload: LoginPayload) {
    setErrorMsg(null);

    login(payload, {
      onSuccess: (res: any) => {
        const accessToken = res?.access_token;
        if (!accessToken) {
          setErrorMsg("Login OK, mas a API não retornou access_token.");
          return;
        }

        localStorage.setItem("access_token", accessToken);

        const from = (location.state as any)?.from ?? "/telemetry";
        navigate(from, { replace: true });
      },
      onError: (err: any) => {
        setErrorMsg(err?.message ?? "Falha no login");
      },
    });
  }

  return (
    <LoginForm
      onSubmit={handleSubmit}
      loading={isPending}
      error={errorMsg}
    />
  );
}
