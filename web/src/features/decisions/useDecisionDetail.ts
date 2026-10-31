import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export type DecisionEvent = {
  id: string;
  type: string;
  payload: any;
  createdAt: string;
};

export type FullDecision = {
  id: string;
  title: string;
  reasoning: string;
  expectedOutcome: string;
  probability: number; // Changed
  importance: string;
  status: string;
  reviewAt: string;
  reviewedAt: string | null;
  options: { id: string; label: string; position: number }[];
  chosenOptionId: string | null;
  tags: { tag: { name: string } }[];
  assumptions: any[]; 
  reviews: {
    id: string;
    kind: "INTERIM" | "FINAL";
    replayChoice: string | null;
    whatHappened: string;
    outcomeMet: string;
    processSound: string;
    wouldDecideAgain: string;
    lesson: string | null;
    createdAt: string;
  }[];
  events: DecisionEvent[];
};

export function useDecisionDetail(id: string) {
  return useQuery({
    queryKey: ["decision", id],
    queryFn: () => api<{ decision: FullDecision }>(`/api/decisions/${id}`)
  });
}