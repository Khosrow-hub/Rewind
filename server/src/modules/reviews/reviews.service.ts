import { prisma } from "../../db/prisma.js";
import type { CreateReviewInput } from "./reviews.schema.js";

export async function getReplayContext(userId: string, decisionId: string) {
  const decision = await prisma.decision.findFirst({
    where: { id: decisionId, userId },
    select: {
      id: true,
      title: true,
      importance: true,
      reviewAt: true,
      status: true,
      options: {
        orderBy: { position: "asc" },
        select: { id: true, label: true, position: true }
      }
    }
  });
  if (!decision) throw new Error("NOT_FOUND");
  if (decision.status !== "PENDING") throw new Error("ALREADY_REVIEWED");
  return decision;
}

export async function submitReplayChoice(
  userId: string,
  decisionId: string,
  replayChoice: string
) {
  const decision = await prisma.decision.findFirst({
    where: { id: decisionId, userId },
    include: { options: true, events: { where: { type: "REPLAY_SUBMITTED" } } }
  });
  
  if (!decision) throw new Error("NOT_FOUND");
  if (decision.status !== "PENDING") throw new Error("ALREADY_REVIEWED");
  
  if (decision.events.length > 0) {
    throw new Error("REPLAY_ALREADY_SUBMITTED");
  }

  const validOption = decision.options.find(o => o.label === replayChoice);
  if (!validOption) {
    throw new Error("INVALID_OPTION");
  }

  await prisma.decisionEvent.create({
    data: {
      decisionId,
      type: "REPLAY_SUBMITTED",
      payload: { choice: replayChoice }
    }
  });

  return { success: true };
}

export async function revealSnapshot(userId: string, decisionId: string) {
  const decision = await prisma.decision.findFirst({
    where: { id: decisionId, userId },
    select: {
      id: true,
      title: true,
      reasoning: true,
      expectedOutcome: true,
      probability: true, // Changed from confidence
      importance: true,
      snapshotAt: true,
      assumptions: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          description: true,
          importance: true,
          confidence: true,
          verifyAt: true,
          result: true,
          resultNote: true
        }
      },
      events: {
        where: { type: "REPLAY_SUBMITTED" },
        take: 1
      }
    }
  });
  if (!decision) throw new Error("NOT_FOUND");
  if (decision.events.length === 0) throw new Error("REPLAY_REQUIRED");
  return decision;
}

export async function createReview(
  userId: string,
  decisionId: string,
  input: CreateReviewInput
) {
  const decision = await prisma.decision.findFirst({
    where: { id: decisionId, userId },
    select: { id: true, status: true }
  });
  if (!decision) throw new Error("NOT_FOUND");
  if (decision.status !== "PENDING") throw new Error("ALREADY_REVIEWED");

  const replayEvent = await prisma.decisionEvent.findFirst({
    where: { decisionId, type: "REPLAY_SUBMITTED" }
  });
  if (!replayEvent) throw new Error("REPLAY_REQUIRED");

  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.decisionReview.create({
      data: {
        decisionId,
        kind: input.kind,
        whatHappened: input.whatHappened,
        outcomeMet: input.outcomeMet,
        processSound: input.processSound,
        wouldDecideAgain: input.wouldDecideAgain,
        lesson: input.lesson ?? null
      }
    });

    if (input.assumptionResults && input.assumptionResults.length > 0) {
      for (const ar of input.assumptionResults) {
        await tx.assumption.updateMany({
          where: { id: ar.assumptionId, decisionId },
          data: { result: ar.result, resultNote: ar.resultNote ?? null }
        });
        await tx.decisionEvent.create({
          data: {
            decisionId,
            type: "ASSUMPTION_RESOLVED",
            payload: { assumptionId: ar.assumptionId, result: ar.result }
          }
        });
      }
    }

    await tx.decisionEvent.create({
      data: {
        decisionId,
        type: input.kind === "FINAL" ? "FINAL_REVIEW_ADDED" : "INTERIM_REVIEW_ADDED",
        payload: { reviewId: review.id, outcomeMet: input.outcomeMet }
      }
    });

    if (input.kind === "FINAL") {
      await tx.decision.update({
        where: { id: decisionId },
        data: { status: "REVIEWED", reviewedAt: new Date() }
      });
      await tx.decisionEvent.create({
        data: {
          decisionId,
          type: "STATUS_CHANGED",
          payload: { from: "PENDING", to: "REVIEWED" }
        }
      });
    }

    return review;
  });

  return result;
}