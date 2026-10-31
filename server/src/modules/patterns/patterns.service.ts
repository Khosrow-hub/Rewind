import { prisma } from "../../db/prisma.js";

const MIN_SAMPLE_FOR_CLAIM = 5;

export async function getPatterns(userId: string) {
  const decisions = await prisma.decision.findMany({
    where: { userId, status: "REVIEWED" },
    select: {
      id: true,
      probability: true,
      importance: true,
      tags: { select: { tag: { select: { name: true } } } },
      reviews: {
        where: { kind: "FINAL" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          outcomeMet: true,
          processSound: true,
          wouldDecideAgain: true
        }
      }
    }
  });

  const reviewed = decisions.filter((d) => d.reviews.length > 0);

  // Calculate Brier Score
  let brierSum = 0;
  let brierCount = 0;
  
  let processSoundCount = 0;
  let outcomeGoodCount = 0;
  let gapCount = 0;

  const tagStats = new Map<string, { reviewed: number; notFully: number }>();

  for (const d of reviewed) {
    const r = d.reviews[0];
    
    // Convert outcome to 1 or 0 for Brier
    const actualOutcome = r.outcomeMet === "FULLY" ? 1 : 0;
    const predictedProb = d.probability / 100;
    
    brierSum += Math.pow(predictedProb - actualOutcome, 2);
    brierCount++;

    if (r.processSound === "YES") processSoundCount++;
    if (r.outcomeMet === "FULLY") outcomeGoodCount++;
    if (r.processSound === "YES" && r.outcomeMet !== "FULLY") gapCount++;

    for (const t of d.tags) {
      const entry = tagStats.get(t.tag.name) ?? { reviewed: 0, notFully: 0 };
      entry.reviewed += 1;
      if (r.outcomeMet !== "FULLY") entry.notFully += 1;
      tagStats.set(t.tag.name, entry);
    }
  }

  const brierScore = brierCount > 0 ? (brierSum / brierCount) : null;

  const blindSpots = [...tagStats.entries()]
    .map(([tag, s]) => ({
      tag,
      reviewed: s.reviewed,
      notFully: s.notFully,
      rate: s.reviewed > 0 ? Math.round((s.notFully / s.reviewed) * 100) : 0
    }))
    .filter((s) => s.reviewed >= 2)
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5);

  const regret = reviewed.filter(
    (d) => d.reviews[0].wouldDecideAgain === "NO"
  ).length;

  return {
    sample: {
      reviewedDecisions: reviewed.length,
      enoughForClaims: reviewed.length >= MIN_SAMPLE_FOR_CLAIM
    },
    brier: {
      score: brierScore !== null ? Number(brierScore.toFixed(3)) : null,
      // Brier score interpretation
      rating: brierScore === null ? "No data" :
              brierScore < 0.1 ? "Excellent" :
              brierScore < 0.2 ? "Good" :
              brierScore < 0.3 ? "Fair" : "Needs work"
    },
    axes: {
      processSound: processSoundCount,
      outcomeGood: outcomeGoodCount,
      goodProcessBadOutcome: gapCount
    },
    blindSpots,
    regret: {
      wouldNotDecideAgain: regret,
      rate: reviewed.length > 0 ? Math.round((regret / reviewed.length) * 100) : null
    }
  };
}