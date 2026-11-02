import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDecisionDetail } from "../features/decisions/useDecisionDetail";
import { importanceLabel } from "../lib/format";
import { EditDecisionModal } from "../features/decisions/EditDecisionModal";

export function DecisionDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useDecisionDetail(id!);
  const [isEditing, setIsEditing] = useState(false);

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

  let displayReasoning = d.reasoning || "";
  let displayScorecard = { evidence: "", alternatives: "", risks: "" };
  
  if (displayReasoning.includes("--- SCORECARD ---")) {
    const parts = displayReasoning.split("--- SCORECARD ---");
    displayReasoning = parts[0].trim();
    const scorecardText = parts[1].trim();
    
    const lines = scorecardText.split("\n");
    lines.forEach(line => {
      if (line.startsWith("Evidence:")) displayScorecard.evidence = line.replace("Evidence:", "").trim();
      if (line.startsWith("Alternatives:")) displayScorecard.alternatives = line.replace("Alternatives:", "").trim();
      if (line.startsWith("Risks:")) displayScorecard.risks = line.replace("Risks:", "").trim();
    });
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getEventDisplay = (type: string) => {
    switch (type) {
      case "DECISION_CREATED": return { title: "Decision logged" };
      case "REPLAY_SUBMITTED": return { title: "Replay submitted" };
      case "FINAL_REVIEW_ADDED": return { title: "Autopsy completed" };
      case "ASSUMPTION_RESOLVED": return { title: "Assumption verified" };
      default: return { title: type.replace(/_/g, " ").toLowerCase() };
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {isEditing && (
        <EditDecisionModal
          decisionId={d.id}
          initialTitle={d.title}
          initialReviewAt={d.reviewAt}
          onClose={() => setIsEditing(false)}
        />
      )}

      <header className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <Link to="/dashboard/decisions" className="text-sm font-bold text-inkSoft hover:text-accentHover mb-2 inline-block transition-colors">
            &larr; Back to decisions
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{d.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-pill bg-cream shadow-neu-sm px-4 py-1.5 text-2xs font-bold uppercase tracking-wider text-inkSoft">
              {d.status}
            </span>
            {d.tags.map((t: any) => (
              <span key={t.tag.name} className="rounded-pill bg-cream shadow-neu-sm px-4 py-1.5 text-2xs font-bold text-inkSoft">
                {t.tag.name}
              </span>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          {d.status === "PENDING" && (
            <>
              <button onClick={() => setIsEditing(true)} className="btn-ghost">
                Edit
              </button>
              <Link to={`/dashboard/decisions/${d.id}/review`} className="btn-primary">
                Start Review
              </Link>
            </>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bento">
            <h2 className="label mb-4 text-accentHover">The original snapshot</h2>
            <p className="text-lg leading-relaxed text-ink font-medium">{displayReasoning}</p>
            
            {(displayScorecard.evidence || displayScorecard.alternatives || displayScorecard.risks) && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-ink/10 pt-6">
                {displayScorecard.evidence && (
                  <div>
                    <p className="label">Evidence</p>
                    <p className="mt-1 text-sm text-ink">{displayScorecard.evidence}</p>
                  </div>
                )}
                {displayScorecard.alternatives && (
                  <div>
                    <p className="label">Alternatives</p>
                    <p className="mt-1 text-sm text-ink">{displayScorecard.alternatives}</p>
                  </div>
                )}
                {displayScorecard.risks && (
                  <div>
                    <p className="label">Risks</p>
                    <p className="mt-1 text-sm text-ink">{displayScorecard.risks}</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-ink/10 pt-6">
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
              <div className="mt-6 bg-accent/10 p-5 rounded-xl border border-accent/20">
                <p className="label text-accentHover">Pre-mortem</p>
                <p className="mt-2 text-sm font-medium text-ink leading-relaxed">{displayPreMortem}</p>
              </div>
            )}
          </div>

          {finalReview && (
            <div className="bento shadow-neu-pressed bg-cream">
              <h2 className="label mb-4 text-accentHover">The autopsy</h2>
              
              <div className="mb-6">
                <p className="text-sm font-bold text-ink">What actually happened</p>
                <p className="mt-2 text-sm text-inkSoft font-medium leading-relaxed">{finalReview.whatHappened}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 border-t border-ink/10 pt-6">
                <div>
                  <p className="label">Outcome</p>
                  <p className="mt-1 text-sm font-bold">{finalReview.outcomeMet.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="label">Process sound?</p>
                  <p className="mt-1 text-sm font-bold">{finalReview.processSound}</p>
                </div>
                <div>
                  <p className="label">Decide same again?</p>
                  <p className="mt-1 text-sm font-bold">{finalReview.wouldDecideAgain}</p>
                </div>
              </div>

              {finalReview.lesson && (
                <div className="mt-6 border-t border-ink/10 pt-6">
                  <p className="label">Lesson learned</p>
                  <p className="mt-2 text-sm font-medium text-ink leading-relaxed">{finalReview.lesson}</p>
                </div>
              )}
            </div>
          )}

          {d.assumptions && d.assumptions.length > 0 && (
            <div className="bento">
              <h2 className="label mb-4 text-accentHover">Assumption tracker</h2>
              <div className="space-y-4">
                {d.assumptions.map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between border-b border-ink/5 pb-4 last:border-0 last:pb-0">
                    <p className="text-sm font-medium text-ink flex-1 pr-4">{a.description}</p>
                    <span className={`text-xs font-bold px-3 py-1 rounded-pill ${
                      a.result === "TRUE" ? "bg-green-500/10 text-green-600" :
                      a.result === "FALSE" ? "bg-red-500/10 text-red-600" :
                      a.result === "PARTIAL" ? "bg-amber/20 text-accentHover" :
                      "bg-ink/5 text-inkSoft"
                    }`}>
                      {a.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="lg:col-span-1">
          <div className="bento h-full">
            <h2 className="label mb-6">Replay timeline</h2>
            
            <div className="relative border-l border-ink/10 ml-2 pl-6 space-y-8 pb-4">
              {d.events.map((evt: any) => {
                const display = getEventDisplay(evt.type);
                return (
                  <div key={evt.id} className="relative">
                    <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-cream shadow-neu-pressed" />
                    <p className="text-xs font-bold text-inkSoft mb-1">
                      {formatDate(evt.createdAt)}
                    </p>
                    <p className="text-sm font-bold text-ink capitalize">
                      {display.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}