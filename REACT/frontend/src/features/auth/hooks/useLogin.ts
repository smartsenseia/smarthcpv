import { useMutation } from "@tanstack/react-query";
import { login, type LoginResponse } from "../api/auth.api";

export function useLogin() {
  return useMutation<LoginResponse, Error, { username: string; password: string }>({
    mutationFn: ({ username, password }) => login(username, password),
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
    },
  });
}
