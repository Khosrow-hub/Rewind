import { useDecisions } from "../decisions/useDecisions";
import { usePatterns } from "../patterns/usePatterns";

export function useDashboard() {
  const decisionsQuery = useDecisions();
  const patternsQuery = usePatterns();

  const decisions = decisionsQuery.data?.decisions ?? [];
  
  const dueCount = decisions.filter((d) => d.reviewState === "due").length;
  const overdueCount = decisions.filter((d) => d.reviewState === "overdue").length;
  const pendingCount = decisions.filter((d) => d.reviewState === "pending" || d.reviewState === "upcoming").length;
  
  const needsAttention = decisions.filter(
    (d) => d.reviewState === "due" || d.reviewState === "overdue"
  );

  return {
    isLoading: decisionsQuery.isLoading || patternsQuery.isLoading,
    isError: decisionsQuery.isError || patternsQuery.isError,
    metrics: {
      dueCount,
      overdueCount,
      pendingCount,
      attentionCount: dueCount + overdueCount,
    },
    needsAttention,
    patterns: patternsQuery.data,
    recentDecisions: decisions.filter(d => d.status === "REVIEWED").slice(0, 3)
  };
}