import { Link } from "react-router-dom";

export function Onboarding() {
  return (
    <div className="bento shadow-neu-pressed bg-cream p-8 md:p-12 max-w-4xl mx-auto mt-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">
          Welcome to Rewind
        </h1>
        <p className="mt-3 text-base text-inkSoft max-w-lg mx-auto leading-relaxed">
          You are about to start a journey of better decision-making. 
          Here is exactly how the feedback loop works.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Step 1 */}
        <div className="bg-cream shadow-neu-flat p-6 rounded-2xl relative">
          <div className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-accent text-white font-bold flex items-center justify-center shadow-neu-sm">
            1
          </div>
          <h3 className="text-lg font-bold text-ink mt-2">Log the bet</h3>
          <p className="mt-2 text-sm text-inkSoft leading-relaxed">
            Record your reasoning, your expected outcome, and your probability of success. Set a review date.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-cream shadow-neu-flat p-6 rounded-2xl relative">
          <div className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-accent text-white font-bold flex items-center justify-center shadow-neu-sm">
            2
          </div>
          <h3 className="text-lg font-bold text-ink mt-2">Replay First</h3>
          <p className="mt-2 text-sm text-inkSoft leading-relaxed">
            When the date arrives, your original reasoning is hidden. You must make a fresh choice to prevent hindsight bias.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-cream shadow-neu-flat p-6 rounded-2xl relative">
          <div className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-accent text-white font-bold flex items-center justify-center shadow-neu-sm">
            3
          </div>
          <h3 className="text-lg font-bold text-ink mt-2">The Autopsy</h3>
          <p className="mt-2 text-sm text-inkSoft leading-relaxed">
            Unlock your snapshot, compare expectations to reality, and discover your blind spots.
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link to="/dashboard/decisions/new" className="btn-primary px-8 py-4 text-lg">
          Log your first decision
        </Link>
      </div>
    </div>
  );
}