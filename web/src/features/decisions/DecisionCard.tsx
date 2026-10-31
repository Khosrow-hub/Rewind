import { Link } from "react-router-dom";
import type { DecisionSummary, DecisionOption, DecisionTag } from "../../lib/api";
import {
  daysUntilLabel,
  importanceLabel,
  confidenceDots
} from "../../lib/format";
import { StatusChip } from "../../components/ui/StatusChip";

export function DecisionCard({ decision }: { decision: DecisionSummary }) {
  const chosen = decision.options.find((o: DecisionOption) => o.id === decision.chosenOptionId);
  const isUrgent = decision.reviewState === "due" || decision.reviewState === "overdue";

  return (
    <Link
      to={decision.status === "PENDING" ? `/decisions/${decision.id}/review` : `/decisions/${decision.id}`}
      className={`block ${isUrgent ? "bento border-amber shadow-lift" : "bento-interactive"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-ink">
          {decision.title}
        </h3>
        <StatusChip state={decision.reviewState} />
      </div>

      <p className="mt-3 text-sm text-inkSoft line-clamp-2">
        {decision.expectedOutcome}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <dt className="label">Chosen</dt>
          <dd className="mt-1 text-sm text-ink">{chosen?.label ?? "Not set"}</dd>
        </div>
        <div>
          <dt className="label">Importance</dt>
          <dd className="mt-1 text-sm text-ink">
            {importanceLabel(decision.importance)}
          </dd>
        </div>
        <div>
          <dt className="label">Confidence</dt>
          <dd className="mt-1 text-sm tracking-widest text-ink">
            {confidenceDots(decision.confidence)}
          </dd>
        </div>
        <div>
          <dt className="label">Review</dt>
          <dd className={`mt-1 text-sm font-medium ${isUrgent ? "text-amber-700 dark:text-amber" : "text-ink"}`}>
            {daysUntilLabel(decision.reviewAt)}
          </dd>
        </div>
      </dl>

      {decision.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {decision.tags.map((t: DecisionTag) => (
            <span
              key={t.tagId}
              className="rounded-pill bg-ink/5 px-2.5 py-1 text-2xs text-inkSoft"
            >
              {t.tag.name}
            </span>
          ))}
        </div>
      )}
      
      {isUrgent && (
        <div className="mt-4 pt-4 border-t border-amber/30">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber">
            Action required: Time to review this decision.
          </p>
        </div>
      )}
    </Link>
  );
}