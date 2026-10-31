import { Link } from "react-router-dom";
import { useDashboard } from "../features/dashboard/useDashboard";
import { BentoGrid } from "../components/bento/BentoGrid";
import { BentoCard } from "../components/bento/BentoCard";
import { DecisionCard } from "../features/decisions/DecisionCard";

export function Dashboard() {
  const { isLoading, isError, metrics, needsAttention, patterns, recentDecisions } = useDashboard();

  if (isLoading) return <p className="text-sm text-inkSoft p-8">Loading dashboard</p>;
  if (isError) return <p className="text-sm text-ink p-8">Could not load dashboard.</p>;

  return (
    <div>
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-inkSoft">Welcome back. Here is the state of your judgment.</p>
        </div>
        <Link to="/decisions/new" className="btn-primary">
          New decision
        </Link>
      </header>

      <BentoGrid>
        {/* METRIC: Needs Attention */}
        <BentoCard span="twoThirds" className={metrics.attentionCount > 0 ? "bg-amber/10 border-amber/30" : ""}>
          <p className="label">Needs attention</p>
          <div className="mt-3 flex items-baseline gap-3">
            <p className="stat">{metrics.attentionCount}</p>
            <p className="stat-note">decisions are due or overdue for review.</p>
          </div>
          {metrics.attentionCount > 0 && (
            <Link to="/decisions" className="btn-primary mt-6 inline-flex">
              Review now
            </Link>
          )}
        </BentoCard>

        {/* METRIC: In Flight */}
        <BentoCard span="third">
          <p className="label">In flight</p>
          <div className="mt-3 flex items-baseline gap-3">
            <p className="stat">{metrics.pendingCount}</p>
            <p className="stat-note">active decisions waiting for their review date.</p>
          </div>
        </BentoCard>

        {/* QUICK PATTERN STAT (if unlocked) */}
        {patterns && patterns.sample.reviewedDecisions > 0 && (
          <BentoCard span="half">
            <p className="label">Calibration</p>
            <div className="mt-3">
              <p className="text-xl font-medium tracking-tight">
                {patterns.sample.enoughForClaims ? "Reliable data" : "Building sample"}
              </p>
              <p className="stat-note mt-1">
                Based on {patterns.sample.reviewedDecisions} closed loops.
              </p>
            </div>
          </BentoCard>
        )}

        {/* QUICK PATTERN STAT: Decision Quality */}
        {patterns && patterns.sample.reviewedDecisions > 0 && (
          <BentoCard span="half">
            <p className="label">Sound process, bad outcome</p>
            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-3xl font-semibold tracking-tight text-ink">
                {patterns.axes.goodProcessBadOutcome}
              </p>
              <p className="stat-note">times you made a good decision but the universe disagreed.</p>
            </div>
          </BentoCard>
        )}

        {/* ATTENTION LIST */}
        {needsAttention.length > 0 && (
          <div className="md:col-span-6 lg:col-span-12 mt-4">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Due for autopsy</h2>
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
              {needsAttention.map((d) => (
                <DecisionCard key={d.id} decision={d} />
              ))}
            </div>
          </div>
        )}

        {/* RECENT REVIEWS */}
        {recentDecisions.length > 0 && (
          <div className="md:col-span-6 lg:col-span-12 mt-4">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Recently closed</h2>
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
              {recentDecisions.map((d) => (
                <DecisionCard key={d.id} decision={d} />
              ))}
            </div>
          </div>
        )}
      </BentoGrid>
    </div>
  );
}