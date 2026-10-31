import { useState, useMemo } from "react";
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
      const matchesSearch =
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.reasoning.toLowerCase().includes(search.toLowerCase()) ||
        d.expectedOutcome.toLowerCase().includes(search.toLowerCase());
      
      const matchesTag =
        tagFilter === "all" || d.tags.some((t: DecisionTag) => t.tag.name === tagFilter);

      return matchesSearch && matchesTag;
    });
  }, [data, search, tagFilter]);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Library</h1>
        <p className="mt-1 text-sm text-inkSoft">
          Your personal database of past decisions.
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Search title, reasoning, or outcome"
          className="field max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="field w-full sm:w-auto"
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

      {isLoading && <p className="text-sm text-inkSoft">Loading</p>}
      {isError && <p className="text-sm text-ink">Could not load library.</p>}

      {!isLoading && !isError && filtered.length === 0 && (
        <p className="text-sm text-inkSoft">No decisions match this search.</p>
      )}

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
        {filtered.map((d) => (
          <DecisionCard key={d.id} decision={d} />
        ))}
      </div>
    </div>
  );
}