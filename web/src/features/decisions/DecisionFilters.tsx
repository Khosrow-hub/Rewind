import type { ReviewState } from "../../lib/api";
import { reviewStateLabel } from "../../lib/format";

const states: ReviewState[] = [
  "due",
  "overdue",
  "upcoming",
  "pending",
  "reviewed"
];

type Props = {
  active: ReviewState | "all";
  onChange: (v: ReviewState | "all") => void;
};

export function DecisionFilters({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onChange("all")}
        className={`rounded-pill px-3 py-1.5 text-sm transition-colors ${
          active === "all"
            ? "bg-ink text-cream"
            : "text-inkSoft hover:bg-ink/5 hover:text-ink"
        }`}
      >
        All
      </button>
      {states.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`rounded-pill px-3 py-1.5 text-sm transition-colors ${
            active === s
              ? "bg-ink text-cream"
              : "text-inkSoft hover:bg-ink/5 hover:text-ink"
          }`}
        >
          {reviewStateLabel(s)}
        </button>
      ))}
    </div>
  );
}