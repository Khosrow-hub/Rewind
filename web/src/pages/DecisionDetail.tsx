import { useParams, Link } from "react-router-dom";
import { useDecisionDetail } from "../features/decisions/useDecisionDetail";
import { importanceLabel } from "../lib/format";

export function DecisionDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useDecisionDetail(id!);

  if (isLoading) return <p className="text-sm text-inkSoft p-8">Loading</p>;
  if (isError || !data) return <p className="text-sm text-ink p-8">Decision not found</p>;

  const d = data.decision;
  const chosen = d.options.find((o) => o.id === d.chosenOptionId);
  const finalReview = d.reviews.find((r) => r.kind === "FINAL");

  let displayOutcome = d.expectedOutcome || "";
  let displayPreMortem = "";
  
  if (displayOutcome.includes("--- PRE-MORTEM ---")) {
    const parts = displayOutcome.split("--- PRE-MORTEM ---");
    displayOutcome = parts[0].trim();
    displayPreMortem = parts[1].trim();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <Link to="/decisions" className="text-sm font-bold text-inkSoft hover:text-accentHover mb-2 inline-block">
            Back to decisions
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{d.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-pill bg-cream shadow-neu-sm px-3 py-1 text-2xs font-bold uppercase tracking-wider text-inkSoft">
              {d.status}
            </span>
            {d.tags.map((t: any) => (
              <span key={t.tag.name} className="rounded-pill bg-cream shadow-neu-sm px-3 py-1 text-2xs font-bold text-inkSoft">
                {t.tag.name}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 space-y-gutter">
          <div className="bento">
            <h2 className="label mb-3">The original snapshot</h2>
            <p className="text-lg leading-relaxed text-ink font-medium">{d.reasoning}</p>
            
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-ink/10 pt-6">
              <div>
                <p className="label">Chosen option</p>
                <p className="mt-1 text-sm font-bold">{chosen?.label ?? "Not set"}</p>
              </div>
              <div>
                <p className="label">Probability</p>
                <p className="mt-1 text-sm font-bold text-accentHover">{d.probability}%</p>
              </div>
              <div>
                <p className="label">Importance</p>
                <p className="mt-1 text-sm font-bold">{importanceLabel(d.importance as any)}</p>
              </div>
              <div>
                <p className="label">Expected outcome</p>
                <p className="mt-1 text-sm font-medium">{displayOutcome}</p>
              </div>
            </div>

            {displayPreMortem && (
              <div className="mt-6 bg-accent/10 p-4 rounded-xl border border-accent/20">
                <p className="label text-accentHover">Pre-mortem</p>
                <p className="mt-1 text-sm font-medium text-ink">{displayPreMortem}</p>
              </div>
            )}
          </div>

          {finalReview && (
            <div className="bento shadow-neu-pressed bg-cream">
              <h2 className="label mb-3 text-accentHover">The autopsy</h2>
              
              <div className="mb-4">
                <p className="text-sm font-bold">What actually happened</p>
                <p className="mt-1 text-sm text-inkSoft font-medium">{finalReview.whatHappened}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-ink/10 pt-6">
                <div>
                  <p className="label">Expected outcome</p>
                  <p className="mt-1 text-sm font-bold">{finalReview.outcomeMet.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="label">Was process sound?</p>
                  <p className="mt-1 text-sm font-bold">{finalReview.processSound}</p>
                </div>
                <div>
                  <p className="label">Decide same again?</p>
                  <p className="mt-1 text-sm font-bold">{finalReview.wouldDecideAgain}</p>
                </div>
              </div>

              {finalReview.lesson && (
                <div className="mt-4 border-t border-ink/10 pt-4">
                  <p className="label">Lesson learned</p>
                  <p className="mt-1 text-sm font-medium text-ink">{finalReview.lesson}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bento h-full">
            <h2 className="label mb-4">Replay timeline</h2>
            <div className="space-y-4 border-l border-ink/20 ml-2 pl-4">
              {d.events.map((evt: any) => (
                <div key={evt.id} className="relative">
                  <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-accent" />
                  <p className="text-xs font-bold text-inkSoft">
                    {new Date(evt.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-bold text-ink capitalize">
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