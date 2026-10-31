export type ReviewState = "pending" | "upcoming" | "due" | "overdue" | "reviewed";

type Input = {
  status: "PENDING" | "REVIEWED" | "ABANDONED";
  reviewAt: Date;
  now?: Date;
};

// due and overdue share a boundary, we treat overdue as more than 7 days late.
const OVERDUE_GRACE_DAYS = 7;

export function getReviewState(input: Input): ReviewState {
  const now = input.now ?? new Date();

  if (input.status === "REVIEWED") return "reviewed";
  if (input.status === "ABANDONED") return "pending";

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntil = (input.reviewAt.getTime() - now.getTime()) / msPerDay;

  if (daysUntil > 0) return "upcoming";
  if (daysUntil <= 0 && daysUntil >= -OVERDUE_GRACE_DAYS) return "due";
  return "overdue";
}