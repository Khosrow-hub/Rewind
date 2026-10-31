// Leave this empty so it uses the current domain (Vercel Proxy)
const BASE = ""; 

type Options = {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(path: string, opts: Options = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? "GET",
    credentials: "include",
    headers: opts.body ? { "Content-Type": "application/json" } : undefined,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal
  });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    throw new ApiError(res.status, `Server returned an invalid response: ${text.substring(0, 50)}`);
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "error" in data && String(data.error)) ||
      `Request failed with ${res.status}`;
    throw new ApiError(res.status, message);
  }

  return data as T;
}

export type ReviewState =
  | "pending"
  | "upcoming"
  | "due"
  | "overdue"
  | "reviewed";

export type Importance = "LOW" | "MEDIUM" | "HIGH" | "LIFE_CHANGING";

export type DecisionOption = {
  id: string;
  label: string;
  position: number;
};

export type DecisionTag = {
  decisionId: string;
  tagId: string;
  tag: { id: string; name: string };
};

export type DecisionSummary = {
  id: string;
  title: string;
  reasoning: string;
  expectedOutcome: string;
  probability: number; // Changed from confidence
  importance: Importance;
  status: "PENDING" | "REVIEWED" | "ABANDONED";
  chosenOptionId: string | null;
  reviewAt: string;
  createdAt: string;
  options: DecisionOption[];
  tags: DecisionTag[];
  reviewState: ReviewState;
};