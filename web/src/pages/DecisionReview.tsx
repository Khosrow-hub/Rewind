import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useReviewContext,
  useSubmitReplay,
  useRevealSnapshot,
  useSubmitReview
} from "../features/reviews/useReview";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../features/toast/ToastContext";

export function DecisionReview() {
  const { id } = useParams<{ id: string }>();
  const decisionId = id!;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const ctx = useReviewContext(decisionId);
  const reveal = useRevealSnapshot(decisionId);
  const submitReplay = useSubmitReplay(decisionId);
  const submitReview = useSubmitReview(decisionId);

  const [replayChoice, setReplayChoice] = useState("");

  const [whatHappened, setWhatHappened] = useState("");
  const [outcomeMet, setOutcomeMet] = useState<"FULLY" | "PARTIALLY" | "NOT_AT_ALL">("PARTIALLY");
  const [processSound, setProcessSound] = useState<"YES" | "PARTIALLY" | "NO">("YES");
  const [wouldDecideAgain, setWouldDecideAgain] = useState<"YES" | "MAYBE" | "NO">("YES");
  const [lesson, setLesson] = useState("");
  
  // Allow undefined so they start unselected
  const [assumptionResults, setAssumptionResults] = useState<Record<string, "TRUE" | "FALSE" | "PARTIAL" | undefined>>({});

  const assumptions = reveal.data?.decision.assumptions || [];

  if (ctx.isLoading || reveal.isLoading) {
    return <p className="text-sm text-inkSoft">Loading</p>;
  }

  if (ctx.isError || !ctx.data) {
    return (
      <div className="bento bg-cream shadow-neu-pressed p-10 mt-10 text-center">
        <h2 className="text-xl font-bold text-ink">Decision not found</h2>
        <p className="mt-2 text-sm text-inkSoft">It may have been deleted or already reviewed.</p>
        <Link to="/decisions" className="btn-primary mt-6 inline-flex">Back to decisions</Link>
      </div>
    );
  }

  const isRevealed = reveal.isSuccess && reveal.data?.decision;

  function handleReplaySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!replayChoice) return;
    submitReplay.mutate(replayChoice, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["review-reveal", decisionId] });
      }
    });
  }

  function handleAutopsySubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Filter out any assumptions the user left blank
    const formattedResults = Object.entries(assumptionResults)
      .filter(([_, result]) => result !== undefined)
      .map(([id, result]) => ({
        assumptionId: id,
        result: result as "TRUE" | "FALSE" | "PARTIAL"
      }));

    submitReview.mutate(
      {
        kind: "FINAL",
        whatHappened,
        outcomeMet,
        processSound,
        wouldDecideAgain,
        lesson,
        assumptionResults: formattedResults
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["decisions"] });
          showToast("Autopsy completed.");
          navigate("/dashboard/decisions");
        },
        onError: (err: any) => {
          showToast(err.message || "Failed to complete review.", "error");
        }
      }
    );
  }

  // Split the expected outcome and pre-mortem for display
  let displayOutcome = reveal.data?.decision.expectedOutcome || "";
  let displayPreMortem = "";
  
  if (displayOutcome.includes("--- PRE-MORTEM ---")) {
    const parts = displayOutcome.split("--- PRE-MORTEM ---");
    displayOutcome = parts[0].trim();
    displayPreMortem = parts[1].trim();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <p className="label text-accentHover">Review phase</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{ctx.data.context.title}</h1>
      </header>

      {!isRevealed && (
        <div className="space-y-gutter">
          <div className="bento bg-cream shadow-neu-flat">
            <h2 className="text-lg font-bold tracking-tight text-ink">
              What would you choose today?
            </h2>
            <p className="mt-2 text-sm text-inkSoft leading-relaxed">
              To prevent memory bias, your original reasoning is hidden until you make a choice.
            </p>
          </div>

          <form onSubmit={handleReplaySubmit} className="bento space-y-4">
            {ctx.data.context.options.map((opt) => (
              <label key={opt.id} className="flex items-center gap-4 cursor-pointer p-3 rounded-xl hover:shadow-neu-sm transition-all">
                <input
                  type="radio"
                  name="replay"
                  value={opt.label}
                  checked={replayChoice === opt.label}
                  onChange={(e) => setReplayChoice(e.target.value)}
                  className="h-5 w-5 accent-accent"
                />
                <span className="text-base font-medium text-ink">{opt.label}</span>
              </label>
            ))}
            <div className="pt-6">
              <button
                type="submit"
                disabled={!replayChoice || submitReplay.isPending}
                className="btn-primary w-full"
              >
                {submitReplay.isPending ? "Unlocking" : "Unlock original reasoning"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isRevealed && (
        <div className="space-y-gutter">
          <div className="bento shadow-neu-pressed bg-cream border-none">
            <p className="label text-accentHover">Your original reasoning</p>
            <p className="mt-3 text-lg leading-relaxed font-medium text-ink">
              {reveal.data!.decision.reasoning}
            </p>
            
            <div className="mt-8 flex flex-col md:flex-row gap-6 md:gap-12 border-t border-ink/10 pt-6">
              <div>
                <p className="label">Probability</p>
                <p className="mt-1 text-lg text-ink font-bold">{reveal.data!.decision.probability}%</p>
              </div>
              <div>
                <p className="label">Expected outcome</p>
                <p className="mt-1 text-ink font-medium">{displayOutcome}</p>
              </div>
            </div>

            {displayPreMortem && (
              <div className="mt-6 bg-accent/10 p-4 rounded-xl border border-accent/20">
                <p className="label text-accentHover">Your Pre-mortem</p>
                <p className="mt-1 text-sm font-medium text-ink">{displayPreMortem}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleAutopsySubmit} className="bento space-y-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-ink">The Autopsy</h2>
              <p className="text-sm text-inkSoft">Separate the quality of the decision from the outcome.</p>
            </div>

            <div>
              <label className="label mb-2 block">What actually happened?</label>
              <textarea
                required
                className="field resize-none"
                rows={3}
                placeholder="The job provided good experience, but the salary was lower."
                value={whatHappened}
                onChange={(e) => setWhatHappened(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="label mb-3 block">Did the expected outcome happen?</label>
                <div className="space-y-3">
                  {(["FULLY", "PARTIALLY", "NOT_AT_ALL"] as const).map((val) => (
                    <label key={val} className="flex items-center gap-3 cursor-pointer text-sm font-medium">
                      <input
                        type="radio"
                        checked={outcomeMet === val}
                        onChange={() => setOutcomeMet(val)}
                        className="h-4 w-4 accent-accent"
                      />
                      {val.replace("_", " ")}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="label mb-3 block">Was the process sound?</label>
                <div className="space-y-3">
                  {(["YES", "PARTIALLY", "NO"] as const).map((val) => (
                    <label key={val} className="flex items-center gap-3 cursor-pointer text-sm font-medium">
                      <input
                        type="radio"
                        checked={processSound === val}
                        onChange={() => setProcessSound(val)}
                        className="h-4 w-4 accent-accent"
                      />
                      {val}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {assumptions.length > 0 && (
              <div className="border-t border-ink/10 pt-6">
                <label className="label mb-4 block text-ink">Your assumptions (Select one for each)</label>
                <div className="space-y-4">
                  {assumptions.map((a) => (
                    <div key={a.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cream p-4 rounded-xl shadow-neu-sm">
                      <p className="text-sm font-medium text-ink flex-1">{a.description}</p>
                      <div className="flex gap-2">
                        {(["TRUE", "PARTIAL", "FALSE"] as const).map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setAssumptionResults(prev => ({ ...prev, [a.id]: val }))}
                            className={`px-4 py-1.5 text-xs font-bold rounded-pill transition-all ${
                              assumptionResults[a.id] === val 
                                ? "bg-cream shadow-neu-pressed text-accentHover" 
                                : "bg-cream shadow-neu-sm text-inkSoft hover:text-ink"
                            }`}
                          >
                            {val === "TRUE" ? "True" : val === "PARTIAL" ? "Partial" : "False"}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="label mb-3 block">Would you decide the same again?</label>
              <div className="flex gap-6">
                {(["YES", "MAYBE", "NO"] as const).map((val) => (
                  <label key={val} className="flex items-center gap-3 cursor-pointer text-sm font-medium">
                    <input
                      type="radio"
                      checked={wouldDecideAgain === val}
                      onChange={() => setWouldDecideAgain(val)}
                      className="h-4 w-4 accent-accent"
                    />
                    {val}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label mb-2 block">What did you learn?</label>
              <input
                className="field"
                placeholder="Evaluate learning and salary independently."
                value={lesson}
                onChange={(e) => setLesson(e.target.value)}
              />
            </div>

            <div className="pt-6 border-t border-ink/10 flex justify-end">
              <button
                type="submit"
                disabled={submitReview.isPending}
                className="btn-primary"
              >
                {submitReview.isPending ? "Saving" : "Complete review"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}