import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { PageTransition } from "../components/layout/PageTransition";

export function Landing() {
  const { user } = useAuth();

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream flex flex-col">
        {/* HEADER */}
        <header className="px-6 py-8 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-accent shadow-neu-sm flex items-center justify-center text-white font-bold text-xl">
              R
            </div>
            <span className="text-2xl font-extrabold tracking-tight">Rewind</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/auth" className="text-sm font-bold text-inkSoft hover:text-ink">Sign in</Link>
                <Link to="/auth" className="btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </header>

        {/* HERO SECTION */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto mt-12 mb-24">
          <div className="inline-block px-4 py-1.5 rounded-pill bg-cream shadow-neu-sm text-xs font-bold text-accentHover uppercase tracking-wider mb-8">
            Decision Intelligence System
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-ink leading-tight">
            A feedback loop for your judgment.
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-inkSoft max-w-2xl leading-relaxed">
            Most journals record what you did. Rewind helps you discover <strong>how you think</strong>. 
            Log the bet, replay your reasoning, and learn from the outcome.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link to="/auth" className="btn-primary px-8 py-4 text-lg">
              Start making better decisions
            </Link>
          </div>

          {/* FEATURE GRID */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
            <div className="bento">
              <h3 className="text-xl font-bold tracking-tight mb-2">1. Record the bet</h3>
              <p className="text-sm text-inkSoft leading-relaxed">
                Write down your reasoning, your expected outcome, and your probability of success. Lock it in history.
              </p>
            </div>
            <div className="bento">
              <h3 className="text-xl font-bold tracking-tight mb-2">2. The Replay Gate</h3>
              <p className="text-sm text-inkSoft leading-relaxed">
                When the review date arrives, your original reasoning is hidden. You must make the choice again to prevent hindsight bias.
              </p>
            </div>
            <div className="bento">
              <h3 className="text-xl font-bold tracking-tight mb-2">3. The Autopsy</h3>
              <p className="text-sm text-inkSoft leading-relaxed">
                Compare what you expected to what actually happened. Discover your blind spots and measure your Brier score.
              </p>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="py-8 text-center text-xs font-bold text-inkFaint">
          &copy; {new Date().getFullYear()} Rewind. All rights reserved.
        </footer>
      </div>
    </PageTransition>
  );
}