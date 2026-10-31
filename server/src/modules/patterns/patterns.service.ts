import { prisma } from "../../db/prisma.js";

const MIN_SAMPLE_FOR_CLAIM = 5;

type Bucket = { confidence: number; reviewed: number; metOutcome: number };

export async function getPatterns(userId: string) {
  const decisions = await prisma.decision.findMany({
    where: { userId, status: "REVIEWED" },
    select: {
      id: true,
      confidence: true,
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

  const buckets: Bucket[] = [1, 2, 3, 4, 5].map((c) => ({
    confidence: c,
    reviewed: 0,
    metOutcome: 0
  }));
  for (const d of reviewed) {
    const bucket = buckets[d.confidence - 1];
    bucket.reviewed += 1;
    if (d.reviews[0].outcomeMet === "FULLY") bucket.metOutcome += 1;
  }

  let processSoundCount = 0;
  let outcomeGoodCount = 0;
  let gapCount = 0;
  for (const d of reviewed) {
    const r = d.reviews[0];
    if (r.processSound === "YES") processSoundCount += 1;
    if (r.outcomeMet === "FULLY") outcomeGoodCount += 1;
    if (r.processSound === "YES" && r.outcomeMet !== "FULLY") gapCount += 1;
  }

  const tagStats = new Map<
    string,
    { reviewed: number; notFully: number; processFlawed: number }
  >();
  for (const d of reviewed) {
    for (const t of d.tags) {
      const entry = tagStats.get(t.tag.name) ?? {
        reviewed: 0,
        notFully: 0,
        processFlawed: 0
      };
      entry.reviewed += 1;
      if (d.reviews[0].outcomeMet !== "FULLY") entry.notFully += 1;
      if (d.reviews[0].processSound !== "YES") entry.processFlawed += 1;
      tagStats.set(t.tag.name, entry);
    }
  }

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

  const total = reviewed.length;
  const enoughForClaims = total >= MIN_SAMPLE_FOR_CLAIM;

  return {
    sample: {
      reviewedDecisions: total,
      enoughForClaims
    },
    calibration: buckets.map((b) => ({
      confidence: b.confidence,
      reviewed: b.reviewed,
      metOutcome: b.metOutcome,
      rate: b.reviewed > 0 ? Math.round((b.metOutcome / b.reviewed) * 100) : null,
      reliable: b.reviewed >= 2
    })),
    axes: {
      processSound: processSoundCount,
      outcomeGood: outcomeGoodCount,
      goodProcessBadOutcome: gapCount
    },
    blindSpots,
    regret: {
      wouldNotDecideAgain: regret,
      rate: total > 0 ? Math.round((regret / total) * 100) : null
    }
  };
}