import { useParams, Link } from "react-router-dom";
import { useDecisionDetail } from "../features/decisions/useDecisionDetail";
import { confidenceDots, importanceLabel } from "../lib/format";

export function DecisionDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useDecisionDetail(id!);

  if (isLoading) return <p className="text-sm text-inkSoft p-8">Loading</p>;
  if (isError || !data) return <p className="text-sm text-ink p-8">Decision not found</p>;

  const d = data.decision;
  const chosen = d.options.find((o) => o.id === d.chosenOptionId);
  const finalReview = d.reviews.find((r) => r.kind === "FINAL");

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <Link to="/decisions" className="text-sm text-inkSoft hover:underline mb-2 inline-block">
            Back to decisions
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">{d.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-pill bg-ink/5 px-2.5 py-1 text-2xs uppercase tracking-wider text-inkSoft border border-line">
              {d.status}
            </span>
            {d.tags.map((t) => (
              <span key={t.tag.name} className="rounded-pill bg-ink/5 px-2.5 py-1 text-2xs text-inkSoft">
                {t.tag.name}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* LEFT COLUMN: The original snapshot */}
        <div className="lg:col-span-2 space-y-gutter">
          <div className="bento">
            <h2 className="label mb-3">The original snapshot</h2>
            <p className="text-lg leading-relaxed text-ink">{d.reasoning}</p>
            
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-4">
              <div>
                <p className="label">Chosen option</p>
                <p className="mt-1 text-sm">{chosen?.label ?? "Not set"}</p>
              </div>
              <div>
                <p className="label">Confidence</p>
                <p className="mt-1 text-sm tracking-widest">{confidenceDots(d.confidence)}</p>
              </div>
              <div>
                <p className="label">Importance</p>
                <p className="mt-1 text-sm">{importanceLabel(d.importance as any)}</p>
              </div>
              <div>
                <p className="label">Expected outcome</p>
                <p className="mt-1 text-sm">{d.expectedOutcome}</p>
              </div>
            </div>
          </div>

          {finalReview && (
            <div className="bento bg-amber/10 border-amber/30">
              <h2 className="label mb-3 text-ink">The autopsy</h2>
              
              <div className="mb-4">
                <p className="text-sm font-semibold">What actually happened</p>
                <p className="mt-1 text-sm text-inkSoft">{finalReview.whatHappened}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-line pt-4">
                <div>
                  <p className="label">Expected outcome</p>
                  <p className="mt-1 text-sm font-medium">{finalReview.outcomeMet.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="label">Was process sound?</p>
                  <p className="mt-1 text-sm font-medium">{finalReview.processSound}</p>
                </div>
                <div>
                  <p className="label">Decide same again?</p>
                  <p className="mt-1 text-sm font-medium">{finalReview.wouldDecideAgain}</p>
                </div>
              </div>

              {finalReview.lesson && (
                <div className="mt-4 border-t border-line pt-4">
                  <p className="label">Lesson learned</p>
                  <p className="mt-1 text-sm text-ink">{finalReview.lesson}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: The Timeline */}
        <div className="lg:col-span-1">
          <div className="bento h-full">
            <h2 className="label mb-4">Replay timeline</h2>
            <div className="space-y-4 border-l border-line ml-2 pl-4">
              {d.events.map((evt) => (
                <div key={evt.id} className="relative">
                  <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-ink" />
                  <p className="text-xs text-inkSoft">
                    {new Date(evt.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium text-ink">
                    {evt.type.replace(/_/g, " ").toLowerCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}