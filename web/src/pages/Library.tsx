import { useState, useMemo } from "react";
import { Link } from "react-router-dom"; // Added Link
import { useDecisions } from "../features/decisions/useDecisions";
import { DecisionCard } from "../features/decisions/DecisionCard";
import type { DecisionTag } from "../lib/api";

export function Library() {
  const { data, isLoading, isError } = useDecisions();
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("all");

  const allTags = useMemo(() => {
    if (!data) return [];
    const tags = new Set<string>();
    data.decisions.forEach((d) => 
      d.tags.forEach((t: DecisionTag) => tags.add(t.tag.name))
    );
    return Array.from(tags).sort();
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.decisions.filter((d) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        d.title.toLowerCase().includes(searchLower) ||
        d.reasoning.toLowerCase().includes(searchLower) ||
        d.expectedOutcome.toLowerCase().includes(searchLower);
      
      const matchesTag =
        tagFilter === "all" || d.tags.some((t: DecisionTag) => t.tag.name === tagFilter);

      return matchesSearch && matchesTag;
    });
  }, [data, search, tagFilter]);

  return (
    <div>
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Library</h1>
          <p className="mt-1 text-sm text-inkSoft">
            Your searchable database of past decisions.
          </p>
        </div>
        {/* Added New Decision Button */}
        <Link to="/dashboard/decisions/new" className="btn-primary">
          New decision
        </Link>
      </header>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="search"
          placeholder="Search title, reasoning, or expected outcome..."
          className="field flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="field w-full md:w-64"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        >
          <option value="all">All tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-sm text-inkSoft">Loading library...</p>}
      {isError && <p className="text-sm text-ink">Could not load library.</p>}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="bento shadow-neu-pressed text-center py-12">
          <p className="text-sm font-bold text-inkSoft">
            No decisions match your search.
          </p>
          {(search || tagFilter !== "all") && (
            <button 
              onClick={() => { setSearch(""); setTagFilter("all"); }}
              className="mt-4 text-xs font-bold text-accentHover hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
        {filtered.map((d) => (
          <DecisionCard key={d.id} decision={d} />
        ))}
      </div>
    </div>
  );
}