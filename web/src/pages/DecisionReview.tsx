import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useReviewContext,
  useSubmitReplay,
  useRevealSnapshot,
  useSubmitReview
} from "../features/reviews/useReview";
import { useQueryClient } from "@tanstack/react-query";
import { confidenceDots } from "../lib/format";

type AssumptionResult = { id: string; result: "TRUE" | "FALSE" | "PARTIAL" };

export function DecisionReview() {
  const { id } = useParams<{ id: string }>();
  const decisionId = id!;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
  
  // State for assumption resolution
  const [assumptionResults, setAssumptionResults] = useState<Record<string, "TRUE" | "FALSE" | "PARTIAL">>({});

  const assumptions = reveal.data?.decision.assumptions || [];

  // Pre-fill assumption state when data loads
  useEffect(() => {
    if (assumptions.length > 0 && Object.keys(assumptionResults).length === 0) {
      const initial: Record<string, any> = {};
      assumptions.forEach(a => { initial[a.id] = "TRUE"; });
      setAssumptionResults(initial);
    }
  }, [assumptions]);

  if (ctx.isLoading || reveal.isLoading) {
    return <p className="text-sm text-inkSoft">Loading</p>;
  }

  if (ctx.isError || !ctx.data) {
    return (
      <div className="bento bg-white/50">
        <h2 className="text-lg font-semibold text-ink">Decision not found</h2>
        <p className="mt-2 text-sm text-inkSoft">It may have been deleted or already reviewed.</p>
        <Link to="/decisions" className="btn-ghost mt-4 inline-flex">Back to decisions</Link>
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
    
    const formattedResults = Object.entries(assumptionResults).map(([id, result]) => ({
      assumptionId: id,
      result
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
          navigate("/decisions");
        }
      }
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <p className="label text-amber">Review phase</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{ctx.data.context.title}</h1>
      </header>

      {!isRevealed && (
        <div className="space-y-gutter">
          <div className="bento bg-amber/10 border-amber/30">
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              What would you choose today?
            </h2>
            <p className="mt-2 text-sm text-inkSoft">
              To prevent memory bias, your original reasoning is hidden until you make a choice.
            </p>
          </div>

          <form onSubmit={handleReplaySubmit} className="bento space-y-4">
            {ctx.data.context.options.map((opt) => (
              <label key={opt.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="replay"
                  value={opt.label}
                  checked={replayChoice === opt.label}
                  onChange={(e) => setReplayChoice(e.target.value)}
                  className="h-4 w-4 accent-ink"
                />
                <span className="text-base text-ink">{opt.label}</span>
              </label>
            ))}
            <div className="pt-4">
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
          <div className="bento bg-ink text-cream">
            <p className="label text-cream/60">Your original reasoning</p>
            <p className="mt-2 text-lg leading-relaxed">{reveal.data!.decision.reasoning}</p>
            <div className="mt-6 flex gap-8 text-sm">
              <div>
                <p className="label text-cream/60">Confidence</p>
                <p className="mt-1 tracking-widest">{confidenceDots(reveal.data!.decision.confidence)}</p>
              </div>
              <div>
                <p className="label text-cream/60">Expected outcome</p>
                <p className="mt-1">{reveal.data!.decision.expectedOutcome}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleAutopsySubmit} className="bento space-y-8">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">The Autopsy</h2>
              <p className="text-sm text-inkSoft">Separate the quality of the decision from the outcome.</p>
            </div>

            <div>
              <label className="label mb-1 block">What actually happened?</label>
              <textarea
                required
                className="field resize-none"
                rows={3}
                placeholder="The job provided good experience, but the salary was lower."
                value={whatHappened}
                onChange={(e) => setWhatHappened(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label mb-2 block">Did the expected outcome happen?</label>
                <div className="space-y-2">
                  {(["FULLY", "PARTIALLY", "NOT_AT_ALL"] as const).map((val) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="radio"
                        checked={outcomeMet === val}
                        onChange={() => setOutcomeMet(val)}
                        className="accent-ink"
                      />
                      {val.replace("_", " ")}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="label mb-2 block">Was the process sound?</label>
                <div className="space-y-2">
                  {(["YES", "PARTIALLY", "NO"] as const).map((val) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="radio"
                        checked={processSound === val}
                        onChange={() => setProcessSound(val)}
                        className="accent-ink"
                      />
                      {val}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* NEW: Assumption Resolution */}
            {assumptions.length > 0 && (
              <div className="border-t border-line pt-6">
                <label className="label mb-4 block text-ink">Your assumptions</label>
                <div className="space-y-4">
                  {assumptions.map((a: any) => (
                    <div key={a.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-ink/5 p-3 rounded-lg">
                      <p className="text-sm text-ink flex-1">{a.description}</p>
                      <div className="flex gap-2">
                        {(["TRUE", "PARTIAL", "FALSE"] as const).map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setAssumptionResults(prev => ({ ...prev, [a.id]: val }))}
                            className={`px-3 py-1 text-xs rounded-pill transition-colors ${
                              assumptionResults[a.id] === val 
                                ? "bg-ink text-cream" 
                                : "bg-white/40 text-inkSoft hover:bg-white/60"
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
              <label className="label mb-1 block">Would you decide the same again?</label>
              <div className="flex gap-4">
                {(["YES", "MAYBE", "NO"] as const).map((val) => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      checked={wouldDecideAgain === val}
                      onChange={() => setWouldDecideAgain(val)}
                      className="accent-ink"
                    />
                    {val}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label mb-1 block">What did you learn?</label>
              <input
                className="field"
                placeholder="Evaluate learning and salary independently."
                value={lesson}
                onChange={(e) => setLesson(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-line flex justify-end">
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