import type { ReviewState } from "../../lib/api";
import { reviewStateClass, reviewStateLabel } from "../../lib/format";

export function StatusChip({ state }: { state: ReviewState }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill bg-cream px-3 py-1 text-2xs font-bold uppercase tracking-widest ${reviewStateClass(
        state
      )}`}
    >
      {reviewStateLabel(state)}
    </span>
  );
}