import type { ReviewState } from "../../lib/api";
import { reviewStateClass, reviewStateLabel } from "../../lib/format";

export function StatusChip({ state }: { state: ReviewState }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-1 text-2xs font-medium uppercase tracking-wider ${reviewStateClass(
        state
      )}`}
    >
      {reviewStateLabel(state)}
    </span>
  );
}