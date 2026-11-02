import { Link } from "react-router-dom";
import type { DecisionSummary, DecisionOption, DecisionTag } from "../../lib/api";
import { daysUntilLabel, importanceLabel } from "../../lib/format";
import { StatusChip } from "../../components/ui/StatusChip";

export function DecisionCard({ decision }: { decision: DecisionSummary }) {
  const chosen = decision.options.find((o: DecisionOption) => o.id === decision.chosenOptionId);
  const isUrgent = decision.reviewState === "due" || decision.reviewState === "overdue";

  // ALWAYS go to the detail page. We will handle the review logic there.
  const targetUrl = `/dashboard/decisions/${decision.id}`;

  return (
    <Link to={targetUrl} className={`block ${isUrgent ? "bento-interactive shadow-neu-flat border-2 border-accent/20" : "bento-interactive"}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold tracking-tight text-ink">{decision.title}</h3>
        <StatusChip state={decision.reviewState} />
      </div>

      <p className="mt-3 text-sm text-inkSoft leading-relaxed line-clamp-2">{decision.expectedOutcome}</p>

      <dl className="mt-6 grid grid-cols-2 gap-y-4 gap-x-2">
        <div>
          <dt className="label">Chosen</dt>
          <dd className="mt-1 text-sm font-semibold text-ink truncate">{chosen?.label ?? "Not set"}</dd>
        </div>
        <div>
          <dt className="label">Importance</dt>
          <dd className="mt-1 text-sm font-semibold text-ink">{importanceLabel(decision.importance)}</dd>
        </div>
        <div>
          <dt className="label">Probability</dt>
          <dd className="mt-1 text-sm font-bold text-accentHover">{decision.probability}%</dd>
        </div>
        <div>
          <dt className="label">Review</dt>
          <dd className={`mt-1 text-sm font-bold ${isUrgent ? "text-accentHover" : "text-ink"}`}>
            {daysUntilLabel(decision.reviewAt)}
          </dd>
        </div>
      </dl>

      {decision.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {decision.tags.map((t: DecisionTag) => (
            <span key={t.tagId} className="rounded-pill bg-cream px-3 py-1 text-2xs font-bold text-inkSoft shadow-neu-sm">
              {t.tag.name}
            </span>
          ))}
        </div>
      )}
      
      {isUrgent && (
        <div className="mt-5 pt-4 border-t border-ink/10">
          <p className="text-xs font-bold text-accentHover uppercase tracking-widest">Action required</p>
        </div>
      )}
    </Link>
  );
}