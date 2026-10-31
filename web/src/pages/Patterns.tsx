import { usePatterns } from "../features/patterns/usePatterns";
import { BentoGrid } from "../components/bento/BentoGrid";
import { BentoCard } from "../components/bento/BentoCard";

export function Patterns() {
  const { data, isLoading, isError } = usePatterns();

  if (isLoading) return <p className="text-sm text-inkSoft p-8">Loading</p>;
  if (isError || !data) return <p className="text-sm text-ink p-8">Could not load patterns.</p>;

  const noData = data.sample.reviewedDecisions === 0;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Patterns</h1>
        <p className="mt-1 text-sm text-inkSoft">
          Insights derived from {data.sample.reviewedDecisions} reviewed decisions.
        </p>
      </header>

      {noData ? (
        <div className="bento text-center py-16">
          <h2 className="text-lg font-semibold tracking-tight">Not enough data yet</h2>
          <p className="mt-2 text-sm text-inkSoft max-w-md mx-auto">
            Patterns unlock as you close the loop. Log a decision, wait for the review date,
            and complete the autopsy to see your calibration.
          </p>
        </div>
      ) : (
        <BentoGrid>
          {/* HEADLINE STAT: The Anti-Outcome Bias Metric */}
                    <BentoCard span="twoThirds" className="bg-[#1E201E] border-[#3C3D37]">
            <p className="label text-[#ECDFCC]/60">Decision quality</p>
            <div className="mt-4 flex items-baseline gap-4">
              <p className="text-5xl font-semibold tracking-tight text-[#ECDFCC]">
                {data.axes.goodProcessBadOutcome}
              </p>
              <p className="text-sm text-[#ECDFCC]/80 max-w-xs leading-relaxed">
                Times you made a sound decision but the outcome did not fully land. 
                A good process with a bad outcome is still a good decision.
              </p>
            </div>
          </BentoCard>

          {/* CALIBRATION SAMPLE SIZE */}
          <BentoCard span="third">
            <p className="label">Calibration</p>
            <div className="mt-4">
              <p className="stat">
                {data.sample.enoughForClaims ? "Tracked" : "Building"}
              </p>
              <p className="stat-note mt-1">
                {data.sample.reviewedDecisions} reviewed decisions. 
                {!data.sample.enoughForClaims && " More data needed for reliable claims."}
              </p>
            </div>
          </BentoCard>

          {/* CONFIDENCE CALIBRATION BARS */}
          <BentoCard span="full">
            <p className="label mb-6">Confidence vs. Reality</p>
            <div className="space-y-4">
              {data.calibration.map((c) => (
                <div key={c.confidence} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-inkSoft">Level {c.confidence}</div>
                  <div className="flex-1 h-8 bg-ink/5 rounded-md overflow-hidden relative">
                    {c.rate !== null && (
                      <div
                        className={`h-full transition-all duration-500 ${
                          c.reliable ? "bg-amber" : "bg-olive/50"
                        }`}
                        style={{ width: `${c.rate}%` }}
                      />
                    )}
                  </div>
                  <div className="w-32 text-sm text-right">
                    {c.rate !== null ? (
                      <span>
                        {c.metOutcome} of {c.reviewed} <br />
                        <span className="text-xs text-inkFaint">({c.rate}%)</span>
                      </span>
                    ) : (
                      <span className="text-inkFaint">No data</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* BLIND SPOTS */}
          <BentoCard span="half">
            <p className="label mb-4">Blind spots</p>
            {data.blindSpots.length === 0 ? (
              <p className="text-sm text-inkSoft">
                Need at least two reviews per tag to identify a blind spot.
              </p>
            ) : (
              <div className="space-y-4">
                {data.blindSpots.map((b) => (
                  <div key={b.tag} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium capitalize">{b.tag}</p>
                      <p className="text-xs text-inkSoft">
                        {b.notFully} of {b.reviewed} did not fully land
                      </p>
                    </div>
                    <div className="text-lg font-semibold text-ink">{b.rate}%</div>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>

          {/* REGRET */}
          <BentoCard span="half">
            <p className="label mb-4">Regret rate</p>
            <div className="flex items-baseline gap-2">
              <p className="stat">{data.regret.rate ?? 0}%</p>
              <p className="text-sm text-inkSoft">would not decide the same again</p>
            </div>
            <p className="mt-4 text-xs text-inkFaint">
              Based on {data.sample.reviewedDecisions} reviews.
            </p>
          </BentoCard>
        </BentoGrid>
      )}
    </div>
  );
}