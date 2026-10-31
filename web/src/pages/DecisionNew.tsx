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

export function DecisionNew() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateDecision();

  const [title, setTitle] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [importance, setImportance] = useState<Importance>("MEDIUM");
  const [reviewDays, setReviewDays] = useState(90);

  const [options, setOptions] = useState([
    { label: "" },
    { label: "" }
  ]);
  const [chosenIndex, setChosenIndex] = useState(0);
  const [tags, setTags] = useState("");

  function handleImportanceChange(val: Importance) {
    setImportance(val);
    const days = defaultDays(val);
    setReviewDays(days);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validOptions = options.filter((o) => o.label.trim().length > 0);
    if (validOptions.length < 2) return;
    if (chosenIndex >= validOptions.length) return;

    const reviewAt = new Date();
    reviewAt.setDate(reviewAt.getDate() + reviewDays);

    mutate(
      {
        title,
        reasoning,
        expectedOutcome,
        confidence,
        importance,
        options: validOptions,
        chosenOptionIndex: chosenIndex,
        reviewAt: reviewAt.toISOString(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      },
      {
        onSuccess: () => navigate("/decisions")
      }
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">New decision</h1>
        <p className="mt-1 text-sm text-inkSoft">
          Record the bet. Rewind will resurface it on the review date.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-gutter">
        {/* SECTION 1: The Situation */}
        <div className="bento space-y-5">
          <h2 className="text-lg font-semibold tracking-tight">The situation</h2>
          
          <div>
            <label className="label mb-1 block">What are you deciding?</label>
            <input
              required
              className="field"
              placeholder="Should I take the startup job?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="label mb-1 block">Reasoning</label>
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
            <label className="label mb-1 block">Importance</label>
            <div className="flex gap-2">
              {(["LOW", "MEDIUM", "HIGH", "LIFE_CHANGING"] as Importance[]).map(
                (val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleImportanceChange(val)}
                    className={`rounded-pill px-4 py-2 text-sm transition-colors ${
                      importance === val
                        ? "bg-ink text-cream"
                        : "bg-ink/5 text-inkSoft hover:bg-ink/10"
                    }`}
                  >
                    {importanceLabel(val)}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="label mb-1 block">Confidence (1 to 5)</label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full accent-ink"
            />
            <div className="mt-2 flex justify-between text-xs text-inkSoft">
              <span>1 (Guessing)</span>
              <span>3 (Fairly sure)</span>
              <span>5 (Certain)</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Options */}
        <div className="bento space-y-5">
          <h2 className="text-lg font-semibold tracking-tight">Options</h2>
          
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="radio"
                name="chosen"
                checked={chosenIndex === i}
                onChange={() => setChosenIndex(i)}
                className="h-4 w-4 accent-ink"
              />
              <input
                required={i < 2}
                className="field flex-1"
                placeholder={`Option ${i + 1}`}
                value={opt.label}
                onChange={(e) => {
                  const next = [...options];
                  next[i].label = e.target.value;
                  setOptions(next);
                }}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => {
                    setOptions(options.filter((_, idx) => idx !== i));
                    if (chosenIndex === i) setChosenIndex(0);
                  }}
                  className="text-sm text-inkSoft hover:text-ink"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <p className="text-xs text-inkSoft">
            Select the radio button next to the option you chose.
          </p>

          <button
            type="button"
            onClick={() => setOptions([...options, { label: "" }])}
            className="text-sm font-medium text-ink hover:underline"
          >
            Add option
          </button>
        </div>

        {/* SECTION 3: Expectations */}
        <div className="bento space-y-gutter">
          <h2 className="text-lg font-semibold tracking-tight">Expectations</h2>
          
          <div>
            <label className="label mb-1 block">What do you expect will happen?</label>
            <textarea
              required
              className="field resize-none"
              rows={2}
              placeholder="Salary up thirty percent and real architecture experience."
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label mb-1 block">Review in (days)</label>
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
              <label className="label mb-1 block">Tags (comma separated)</label>
              <input
                className="field"
                placeholder="career, finance"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-ink">
            {error instanceof Error ? error.message : "Could not save decision"}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-4">
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