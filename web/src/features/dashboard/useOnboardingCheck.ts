import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export function useOnboardingCheck() {
  return useQuery({
    queryKey: ["decisions", "count"],
    queryFn: () => api<{ total: number }>("/api/decisions/count"),
    staleTime: 0,
    refetchOnMount: "always"
  });
}