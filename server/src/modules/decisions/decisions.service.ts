import { prisma } from "../../db/prisma.js";
import { getReviewState } from "../../lib/reviewState.js";
import type {
  CreateDecisionInput,
  UpdateDecisionInput
} from "./decisions.schema.js";

export async function createDecision(userId: string, input: CreateDecisionInput) {
  if (input.chosenOptionIndex >= input.options.length) {
    throw new Error("INVALID_CHOSEN_OPTION");
  }

  const decision = await prisma.$transaction(async (tx) => {
    const created = await tx.decision.create({
      data: {
        userId,
        title: input.title,
        reasoning: input.reasoning,
        expectedOutcome: input.expectedOutcome,
        confidence: input.confidence,
        importance: input.importance,
        reviewAt: new Date(input.reviewAt),
        options: {
          create: input.options.map((o, i) => ({
            label: o.label,
            position: i
          }))
        }
      },
      include: { options: { orderBy: { position: "asc" } } }
    });

    const chosen = created.options[input.chosenOptionIndex];
    await tx.decision.update({
      where: { id: created.id },
      data: { chosenOptionId: chosen.id }
    });

    await tx.decisionEvent.create({
      data: {
        decisionId: created.id,
        type: "DECISION_CREATED",
        payload: { title: created.title, confidence: created.confidence }
      }
    });

    if (input.tags && input.tags.length > 0) {
      for (const name of input.tags) {
        const tag = await tx.tag.upsert({
          where: { userId_name: { userId, name } },
          create: { userId, name },
          update: {}
        });
        await tx.decisionTag.create({
          data: { decisionId: created.id, tagId: tag.id }
        });
      }
    }

    if (input.assumptions && input.assumptions.length > 0) {
      for (const a of input.assumptions) {
        await tx.assumption.create({
          data: {
            decisionId: created.id,
            description: a.description,
            importance: input.importance,
            confidence: input.confidence,
          }
        });
        await tx.decisionEvent.create({
          data: {
            decisionId: created.id,
            type: "ASSUMPTION_ADDED",
            payload: { description: a.description }
          }
        });
      }
    }

    return tx.decision.findUniqueOrThrow({
      where: { id: created.id },
      include: {
        options: { orderBy: { position: "asc" } },
        tags: { include: { tag: true } },
        assumptions: true
      }
    });
  });

  return decision;
}

export async function listDecisions(userId: string) {
  const rows = await prisma.decision.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      options: { orderBy: { position: "asc" } },
      tags: { include: { tag: true } }
    }
  });

  const now = new Date();
  return rows.map((d) => ({
    ...d,
    reviewState: getReviewState({ status: d.status, reviewAt: d.reviewAt, now })
  }));
}

export async function getDecision(userId: string, id: string) {
  const d = await prisma.decision.findFirst({
    where: { id, userId },
    include: {
      options: { orderBy: { position: "asc" } },
      tags: { include: { tag: true } },
      assumptions: { orderBy: { createdAt: "asc" } },
      reviews: { orderBy: { createdAt: "asc" } },
      events: { orderBy: { createdAt: "asc" } }
    }
  });
  if (!d) throw new Error("NOT_FOUND");

  // SECURITY: Hide reasoning and chosen option if replay has not been submitted
  const replayEvent = d.events.find((e) => e.type === "REPLAY_SUBMITTED");
  const isRevealed = !!replayEvent || d.status === "REVIEWED";

  if (!isRevealed) {
    return {
      ...d,
      reasoning: "Hidden until replay is submitted",
      expectedOutcome: "Hidden until replay is submitted",
      chosenOptionId: null, 
      reviewState: getReviewState({ status: d.status, reviewAt: d.reviewAt })
    };
  }

  return {
    ...d,
    reviewState: getReviewState({ status: d.status, reviewAt: d.reviewAt })
  };
}

export async function updateDecision(
  userId: string,
  id: string,
  input: UpdateDecisionInput
) {
  const existing = await prisma.decision.findFirst({
    where: { id, userId },
    select: { id: true, status: true }
  });
  if (!existing) throw new Error("NOT_FOUND");
  if (existing.status !== "PENDING") throw new Error("LOCKED");

  const data: Record<string, unknown> = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.reviewAt !== undefined) data.reviewAt = new Date(input.reviewAt);

  if (Object.keys(data).length === 0) return existing;

  const updated = await prisma.decision.update({
    where: { id },
    data,
    include: {
      options: { orderBy: { position: "asc" } },
      tags: { include: { tag: true } }
    }
  });

  await prisma.decisionEvent.create({
    data: {
      decisionId: id,
      type: "DECISION_UPDATED",
      payload: { updatedFields: Object.keys(data) }
    }
  });

  return updated;
}

export async function deleteDecision(userId: string, id: string) {
  const existing = await prisma.decision.findFirst({
    where: { id, userId },
    select: { id: true }
  });
  if (!existing) throw new Error("NOT_FOUND");
  await prisma.decision.delete({ where: { id } });
}