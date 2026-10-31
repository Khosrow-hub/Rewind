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
        <Link to="/decisions/new" className="btn-primary">
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
        <div className="mt-10 rounded-card border border-line bg-white/40 p-card">
          <h2 className="text-lg font-semibold tracking-tight">
            No decisions yet
          </h2>
          <p className="mt-2 text-sm text-inkSoft">
            Every record starts with a decision. Write it down once, set a
            review date, and Rewind brings it back to you when the outcome is
            known. That is the loop.
          </p>
          <Link to="/decisions/new" className="btn-primary mt-6 inline-flex">
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