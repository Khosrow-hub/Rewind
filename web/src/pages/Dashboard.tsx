import { Link } from "react-router-dom";
import { useDashboard } from "../features/dashboard/useDashboard";
import { BentoGrid } from "../components/bento/BentoGrid";
import { BentoCard } from "../components/bento/BentoCard";
import { DecisionCard } from "../features/decisions/DecisionCard";
import { Skeleton } from "../components/ui/skeleton";
import { Onboarding } from "../components/dashboard/Onboarding";

export function Dashboard() {
  const { isLoading, isError, metrics, needsAttention, patterns, recentDecisions } = useDashboard();

  if (isError) return <p className="text-sm font-bold text-red-500 p-8">Could not load dashboard.</p>;

  // THE FOOLPROOF CHECK:
  // If there are no recent decisions, no due reviews, and 0 pending decisions, it is a new user.
  const isNewUser = 
    !isLoading && 
    recentDecisions.length === 0 && 
    needsAttention.length === 0 && 
    metrics.pendingCount === 0;

  return (
    <div>
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-inkSoft">
            {isNewUser ? "Let's get started." : "Welcome back. Here is the state of your judgment."}
          </p>
        </div>
        {!isNewUser && (
          <Link to="/dashboard/decisions/new" className="btn-primary">
            New decision
          </Link>
        )}
      </header>

      {isLoading ? (
        <BentoGrid>
          <BentoCard span="twoThirds">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-10 w-16 mb-2" />
            <Skeleton className="h-4 w-48" />
          </BentoCard>
          <BentoCard span="third">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-10 w-16 mb-2" />
            <Skeleton className="h-4 w-32" />
          </BentoCard>
        </BentoGrid>
      ) : isNewUser ? (
        <Onboarding />
      ) : (
        <BentoGrid>
          <BentoCard span="twoThirds" className={metrics.attentionCount > 0 ? "shadow-neu-pressed border-none bg-cream" : ""}>
            <p className={`label ${metrics.attentionCount > 0 ? "text-accentHover" : ""}`}>Needs attention</p>
            <div className="mt-3 flex items-baseline gap-3">
              <p className={`stat ${metrics.attentionCount > 0 ? "text-accentHover" : ""}`}>{metrics.attentionCount}</p>
              <p className="stat-note">decisions are due or overdue for review.</p>
            </div>
            {metrics.attentionCount > 0 && (
              <Link to="/dashboard/decisions" className="btn-primary mt-6 inline-flex">
                Review now
              </Link>
            )}
          </BentoCard>

          <BentoCard span="third">
            <p className="label">In flight</p>
            <div className="mt-3 flex items-baseline gap-3">
              <p className="stat">{metrics.pendingCount}</p>
              <p className="stat-note">active decisions waiting for their review date.</p>
            </div>
          </BentoCard>

          {patterns && patterns.sample.reviewedDecisions > 0 && (
            <BentoCard span="half">
              <p className="label">Calibration</p>
              <div className="mt-3">
                <p className="text-xl font-bold tracking-tight">
                  {patterns.sample.enoughForClaims ? "Reliable data" : "Building sample"}
                </p>
                <p className="stat-note mt-1">
                  Based on {patterns.sample.reviewedDecisions} closed loops.
                </p>
              </div>
            </BentoCard>
          )}

          {patterns && patterns.sample.reviewedDecisions > 0 && (
            <BentoCard span="half">
              <p className="label">Sound process, bad outcome</p>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-3xl font-bold tracking-tight text-ink">
                  {patterns.axes.goodProcessBadOutcome}
                </p>
                <p className="stat-note">times you made a good decision but the universe disagreed.</p>
              </div>
            </BentoCard>
          )}

          {needsAttention.length > 0 && (
            <div className="md:col-span-6 lg:col-span-12 mt-6">
              <h2 className="text-xl font-bold tracking-tight mb-4">Due for autopsy</h2>
              <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
                {needsAttention.map((d) => (
                  <DecisionCard key={d.id} decision={d} />
                ))}
              </div>
            </div>
          )}

          {recentDecisions.length > 0 && (
            <div className="md:col-span-6 lg:col-span-12 mt-6">
              <h2 className="text-xl font-bold tracking-tight mb-4">Recently closed</h2>
              <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
                {recentDecisions.map((d) => (
                  <DecisionCard key={d.id} decision={d} />
                ))}
              </div>
            </div>
          )}
        </BentoGrid>
      )}
    </div>
  );
}