import axios from "axios";
import { env } from "./env";

export const http = axios.create({
  baseURL: env.API_BASE_URL,
  withCredentials: false,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  const url = config.url ?? "";

  const isAuthRoute = url.includes("/auth/login") || url.includes("/auth/me");

  if (token && !isAuthRoute) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

console.log("API baseURL =", http.defaults.baseURL);
