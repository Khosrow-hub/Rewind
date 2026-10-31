import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Importance } from "../../lib/api";

export type CreateDecisionInput = {
  title: string;
  reasoning: string;
  expectedOutcome: string;
  probability: number; // Changed from confidence
  importance: Importance;
  options: { label: string }[];
  chosenOptionIndex: number;
  reviewAt: string;
  tags: string[];
  assumptions?: { description: string }[];
};

export function useCreateDecision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDecisionInput) =>
      api("/api/decisions", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
    }
  });
}