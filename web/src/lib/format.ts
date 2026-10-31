import type { Importance, ReviewState } from "./api";

export function daysUntil(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function daysUntilLabel(iso: string): string {
  const d = daysUntil(iso);
  if (d > 0) return `in ${d} ${d === 1 ? "day" : "days"}`;
  if (d === 0) return "today";
  const late = Math.abs(d);
  return `${late} ${late === 1 ? "day" : "days"} late`;
}

export function importanceLabel(i: Importance): string {
  const map: Record<Importance, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    LIFE_CHANGING: "Life changing"
  };
  return map[i];
}

export function reviewStateLabel(s: ReviewState): string {
  const map: Record<ReviewState, string> = {
    pending: "Pending",
    upcoming: "Upcoming",
    due: "Due",
    overdue: "Overdue",
    reviewed: "Reviewed"
  };
  return map[s];
}

export function reviewStateClass(s: ReviewState): string {
  const map: Record<ReviewState, string> = {
    pending: "text-inkSoft shadow-neu-sm",
    upcoming: "text-blue-500 shadow-neu-sm",
    due: "text-accentHover shadow-neu-sm",
    overdue: "text-red-500 shadow-neu-sm",
    reviewed: "text-green-600 shadow-neu-sm"
  };
  return map[s];
}

export function confidenceDots(n: number): string {
  const safe = Math.max(1, Math.min(5, n));
  return "●".repeat(safe) + "○".repeat(5 - safe);
}