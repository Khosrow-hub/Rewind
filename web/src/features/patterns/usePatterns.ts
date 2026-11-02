import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export type PatternsData = {
  sample: {
    reviewedDecisions: number;
    enoughForClaims: boolean;
  };
  brier: {
    score: number | null;
    rating: string;
    timeline: { date: string; brier: number }[]; // NEW
  };
  axes: {
    processSound: number;
    outcomeGood: number;
    goodProcessBadOutcome: number;
  };
  blindSpots: {
    tag: string;
    reviewed: number;
    notFully: number;
    rate: number;
  }[];
  regret: {
    wouldNotDecideAgain: number;
    rate: number | null;
  };
};

export function usePatterns() {
  return useQuery({
    queryKey: ["patterns"],
    queryFn: () => api<PatternsData>("/api/patterns")
  });
}