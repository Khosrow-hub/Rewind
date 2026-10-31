import { prisma } from "../../db/prisma.js";

export async function exportAll(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, email: true, createdAt: true }
  });

  const decisions = await prisma.decision.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      options: { orderBy: { position: "asc" } },
      assumptions: { orderBy: { createdAt: "asc" } },
      reviews: { orderBy: { createdAt: "asc" } },
      tags: { include: { tag: true } },
      events: { orderBy: { createdAt: "asc" } }
    }
  });

  return {
    exportedAt: new Date().toISOString(),
    user,
    decisions: decisions.map((d) => ({
      id: d.id,
      title: d.title,
      reasoning: d.reasoning,
      expectedOutcome: d.expectedOutcome,
      probability: d.probability, // CHANGED
      importance: d.importance,
      status: d.status,
      reviewAt: d.reviewAt,
      reviewedAt: d.reviewedAt,
      createdAt: d.createdAt,
      options: d.options.map((o) => ({ label: o.label, position: o.position })),
      chosenOptionId: d.chosenOptionId,
      tags: d.tags.map((t) => t.tag.name),
      assumptions: d.assumptions.map((a) => ({
        description: a.description,
        importance: a.importance,
        confidence: a.confidence,
        result: a.result,
        resultNote: a.resultNote
      })),
      reviews: d.reviews.map((r) => ({
        kind: r.kind,
        replayChoice: r.replayChoice,
        whatHappened: r.whatHappened,
        outcomeMet: r.outcomeMet,
        processSound: r.processSound,
        wouldDecideAgain: r.wouldDecideAgain,
        lesson: r.lesson,
        createdAt: r.createdAt
      })),
      timeline: d.events.map((e) => ({
        type: e.type,
        payload: e.payload,
        at: e.createdAt
      }))
    }))
  };
}

function csvEscape(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (s.includes('"') || s.includes(",") || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function exportCsv(userId: string): Promise<string> {
  const decisions = await prisma.decision.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      options: { orderBy: { position: "asc" } },
      reviews: { where: { kind: "FINAL" }, take: 1 }
    }
  });

  const header = [
    "id",
    "created_at",
    "title",
    "importance",
    "probability", // CHANGED
    "chosen_option",
    "expected_outcome",
    "review_at",
    "outcome_met",
    "process_sound",
    "would_decide_again",
    "lesson"
  ];

  const lines = [header.join(",")];
  for (const d of decisions) {
    const chosen = d.options.find((o) => o.id === d.chosenOptionId);
    const final = d.reviews[0];
    lines.push(
      [
        d.id,
        d.createdAt.toISOString(),
        csvEscape(d.title),
        d.importance,
        d.probability, // CHANGED
        csvEscape(chosen?.label ?? ""),
        csvEscape(d.expectedOutcome),
        d.reviewAt.toISOString(),
        final?.outcomeMet ?? "",
        final?.processSound ?? "",
        final?.wouldDecideAgain ?? "",
        csvEscape(final?.lesson ?? "")
      ].join(",")
    );
  }
  return lines.join("\n");
}