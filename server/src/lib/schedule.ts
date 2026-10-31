import type { Importance } from "@prisma/client";

// Suggests interim and final review offsets in days.
// These are suggestions only, the user can override.

export type ScheduleSuggestion = {
  interimDays: number[];
  finalDays: number;
};

const BASE: Record<Importance, ScheduleSuggestion> = {
  LOW: { interimDays: [], finalDays: 30 },
  MEDIUM: { interimDays: [14], finalDays: 90 },
  HIGH: { interimDays: [7, 30], finalDays: 120 },
  LIFE_CHANGING: { interimDays: [7, 30, 90], finalDays: 180 }
};

export function suggestSchedule(importance: Importance): ScheduleSuggestion {
  return BASE[importance];
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}