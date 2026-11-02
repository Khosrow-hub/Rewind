import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDecisions } from "../features/decisions/useDecisions";
import { DecisionCard } from "../features/decisions/DecisionCard";
import { DecisionFilters } from "../features/decisions/DecisionFilters";
import type { ReviewState } from "../lib/api";

export function Decisions() {
  const { data, isLoading, isError, error } = useDecisions();
  const [filter, setFilter] = useState<ReviewState | "all">("all");

  const visible = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data.decisions;
    return data.decisions.filter((d) => d.reviewState === filter);
  }, [data, filter]);

  return (
    <div>
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Decisions</h1>
          <p className="mt-1 text-sm text-inkSoft">
            Log the bet, set the review date, then come back when it is time.
          </p>
        </div>
        {/* FIXED LINK HERE */}
        <Link to="/dashboard/decisions/new" className="btn-primary">
          New decision
        </Link>
      </header>

      <div className="mt-6">
        <DecisionFilters active={filter} onChange={setFilter} />
      </div>

      {isLoading && <p className="mt-8 text-sm text-inkSoft">Loading</p>}

      {isError && (
        <p className="mt-8 text-sm text-ink">
          {error instanceof Error ? error.message : "Could not load decisions"}
        </p>
      )}

      {!isLoading && !isError && data && data.decisions.length === 0 && (
        <div className="mt-10 bento shadow-neu-pressed p-10 text-center flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-cream shadow-neu-flat flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-accent">+</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-ink">
            No decisions yet
          </h2>
          <p className="mt-3 text-sm text-inkSoft max-w-md mx-auto leading-relaxed">
            Every record starts with a decision. Write it down once, set a
            review date, and Rewind brings it back to you when the outcome is
            known. That is the loop.
          </p>
          {/* FIXED LINK HERE */}
          <Link to="/dashboard/decisions/new" className="btn-primary mt-8">
            Create your first decision
          </Link>
        </div>
      )}

      {!isLoading && !isError && visible.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-gutter md:grid-cols-2">
          {visible.map((d) => (
            <DecisionCard key={d.id} decision={d} />
          ))}
        </div>
      )}

      {!isLoading &&
        !isError &&
        data &&
        data.decisions.length > 0 &&
        visible.length === 0 && (
          <p className="mt-8 text-sm text-inkSoft">
            No decisions match this filter.
          </p>
        )}
    </div>
  );
}