import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateDecision } from "../features/decisions/useCreateDecision";
import type { Importance } from "../lib/api";
import { importanceLabel } from "../lib/format";

const defaultDays = (importance: Importance) => {
  const map: Record<Importance, number> = {
    LOW: 30,
    MEDIUM: 90,
    HIGH: 120,
    LIFE_CHANGING: 180
  };
  return map[importance];
};

type LocalOption = { id: string; label: string };
type LocalAssumption = { id: string; description: string };

export function DecisionNew() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateDecision();

  const [title, setTitle] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [importance, setImportance] = useState<Importance>("MEDIUM");
  const [reviewDays, setReviewDays] = useState(90);

  const [options, setOptions] = useState<LocalOption[]>([
    { id: crypto.randomUUID(), label: "" },
    { id: crypto.randomUUID(), label: "" }
  ]);
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [tags, setTags] = useState("");
  const [assumptions, setAssumptions] = useState<LocalAssumption[]>([]);

  function handleImportanceChange(val: Importance) {
    setImportance(val);
    const days = defaultDays(val);
    setReviewDays(days);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const validOptions = options.filter((o) => o.label.trim().length > 0);
    if (validOptions.length < 2) return;
    
    const chosenIndex = validOptions.findIndex((o) => o.id === chosenId);
    if (chosenIndex === -1) return; 

    const reviewAt = new Date();
    reviewAt.setDate(reviewAt.getDate() + reviewDays);

    const validAssumptions = assumptions
      .filter((a) => a.description.trim().length > 0)
      .map((a) => ({ description: a.description }));

    mutate(
      {
        title,
        reasoning,
        expectedOutcome,
        confidence,
        importance,
        options: validOptions.map(o => ({ label: o.label })),
        chosenOptionIndex: chosenIndex,
        reviewAt: reviewAt.toISOString(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        assumptions: validAssumptions
      },
      {
        onSuccess: () => navigate("/decisions")
      }
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">New decision</h1>
        <p className="mt-1 text-sm text-inkSoft">
          Record the bet. Rewind will resurface it on the review date.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-gutter">
        <div className="bento space-y-6">
          <h2 className="text-xl font-bold tracking-tight">The situation</h2>
          
          <div>
            <label className="label mb-2 block">What are you deciding?</label>
            <input
              required
              className="field"
              placeholder="Should I take the startup job?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="label mb-2 block">Reasoning</label>
            <textarea
              required
              className="field resize-none"
              rows={3}
              placeholder="Faster growth and equity upside. I can tolerate the risk."
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
            />
          </div>

          <div>
            <label className="label mb-2 block">Importance</label>
            <div className="flex gap-3 flex-wrap">
              {(["LOW", "MEDIUM", "HIGH", "LIFE_CHANGING"] as Importance[]).map(
                (val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleImportanceChange(val)}
                    className={`rounded-pill px-5 py-2.5 text-sm font-bold transition-all ${
                      importance === val
                        ? "shadow-neu-pressed text-accentHover bg-cream"
                        : "bg-cream shadow-neu-flat text-inkSoft hover:text-ink"
                    }`}
                  >
                    {importanceLabel(val)}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="label mb-2 block">Confidence (1 to 5)</label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="mt-3 flex justify-between text-xs font-bold text-inkSoft">
              <span>1 (Guessing)</span>
              <span>3 (Fairly sure)</span>
              <span>5 (Certain)</span>
            </div>
          </div>
        </div>

        <div className="bento space-y-6">
          <h2 className="text-xl font-bold tracking-tight">Options</h2>
          
          {options.map((opt) => (
            <div key={opt.id} className="flex items-center gap-4">
              <input
                type="radio"
                name="chosen"
                checked={chosenId === opt.id}
                onChange={() => setChosenId(opt.id)}
                className="h-5 w-5 accent-accent"
              />
              <input
                required={options.indexOf(opt) < 2}
                className="field flex-1"
                placeholder={`Option ${options.indexOf(opt) + 1}`}
                value={opt.label}
                onChange={(e) => {
                  const next = [...options];
                  const index = next.findIndex(o => o.id === opt.id);
                  next[index].label = e.target.value;
                  setOptions(next);
                }}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => {
                    setOptions(options.filter((o) => o.id !== opt.id));
                    if (chosenId === opt.id) setChosenId(null);
                  }}
                  className="text-sm font-bold text-inkSoft hover:text-accentHover"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <p className="text-xs font-medium text-inkSoft mt-2">
            Select the radio button next to the option you chose.
          </p>

          <button
            type="button"
            onClick={() => setOptions([...options, { id: crypto.randomUUID(), label: "" }])}
            className="text-sm font-bold text-ink hover:text-accentHover"
          >
            Add option
          </button>
        </div>

        <div className="bento space-y-6">
          <h2 className="text-xl font-bold tracking-tight">Expectations</h2>
          
          <div>
            <label className="label mb-2 block">What do you expect will happen?</label>
            <textarea
              required
              className="field resize-none"
              rows={2}
              placeholder="Salary up thirty percent and real architecture experience."
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label mb-2 block">Review in (days)</label>
              <input
                type="number"
                required
                min="1"
                className="field"
                value={reviewDays}
                onChange={(e) => setReviewDays(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label mb-2 block">Tags (comma separated)</label>
              <input
                className="field"
                placeholder="career, finance"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bento space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Assumptions</h2>
            <p className="text-xs font-medium text-inkSoft mt-1">
              What must be true for this decision to succeed? (Optional, but highly recommended)
            </p>
          </div>
          
          {assumptions.map((a) => (
            <div key={a.id} className="flex items-center gap-4">
              <input
                className="field flex-1"
                placeholder="e.g. The company has at least 12 months of runway"
                value={a.description}
                onChange={(e) => {
                  const next = [...assumptions];
                  const index = next.findIndex(x => x.id === a.id);
                  next[index].description = e.target.value;
                  setAssumptions(next);
                }}
              />
              <button
                type="button"
                onClick={() => setAssumptions(assumptions.filter((x) => x.id !== a.id))}
                className="text-sm font-bold text-inkSoft hover:text-accentHover"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setAssumptions([...assumptions, { id: crypto.randomUUID(), description: "" }])}
            className="text-sm font-bold text-ink hover:text-accentHover"
          >
            Add assumption
          </button>
        </div>

        {error && (
          <p className="text-sm font-bold text-red-500">
            {error instanceof Error ? error.message : "Could not save decision"}
          </p>
        )}

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/decisions")}
            className="btn-ghost"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? "Saving" : "Save decision"}
          </button>
        </div>
      </form>
    </div>
  );
}