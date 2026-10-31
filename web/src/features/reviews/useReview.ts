import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

export type ReviewContext = {
  id: string;
  title: string;
  importance: string;
  reviewAt: string;
  status: string;
  options: { id: string; label: string; position: number }[];
};

export function useReviewContext(decisionId: string) {
  return useQuery({
    queryKey: ["review-context", decisionId],
    queryFn: () => api<{ context: ReviewContext }>(`/api/decisions/${decisionId}/review/context`),
    retry: false
  });
}

export function useSubmitReplay(decisionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (replayChoice: string) =>
      api(`/api/decisions/${decisionId}/review/replay`, {
        method: "POST",
        body: { replayChoice }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-reveal", decisionId] });
    }
  });
}

export type RevealSnapshot = {
  id: string;
  title: string;
  reasoning: string;
  expectedOutcome: string;
  probability: number; // Changed from confidence
  assumptions: { id: string; description: string }[];
  reviews: { replayChoice: string; replayRevealedAt: string }[];
};

export function useRevealSnapshot(decisionId: string) {
  return useQuery({
    queryKey: ["review-reveal", decisionId],
    queryFn: () => api<{ decision: RevealSnapshot }>(`/api/decisions/${decisionId}/review/reveal`),
    retry: false
  });
}

export function useSubmitReview(decisionId: string) {
  return useMutation({
    mutationFn: (data: {
      kind: "INTERIM" | "FINAL";
      whatHappened: string;
      outcomeMet: "FULLY" | "PARTIALLY" | "NOT_AT_ALL";
      processSound: "YES" | "PARTIALLY" | "NO";
      wouldDecideAgain: "YES" | "MAYBE" | "NO";
      lesson?: string;
      assumptionResults?: { assumptionId: string; result: "TRUE" | "FALSE" | "PARTIAL" }[];
    }) =>
      api(`/api/decisions/${decisionId}/review`, {
        method: "POST",
        body: data
      })
  });
}