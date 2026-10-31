import { useQuery } from "@tanstack/react-query";
import { api, type DecisionSummary } from "../../lib/api";

type ListResponse = { decisions: DecisionSummary[] };

export function useDecisions() {
  return useQuery({
    queryKey: ["decisions"],
    queryFn: () => api<ListResponse>("/api/decisions")
  });
}