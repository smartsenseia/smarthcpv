// src/features/auth/hooks/useMe.ts
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/auth.api";

export type MeResponse = { username: string };

export function useMe(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;

  return useQuery<MeResponse>({
    queryKey: ["auth", "me"],
    queryFn: () => getMe(),
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}
