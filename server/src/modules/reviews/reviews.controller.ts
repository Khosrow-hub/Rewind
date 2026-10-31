import type { Request, Response } from "express";
import type { AuthedRequest } from "../../middleware/auth.js";
import * as service from "./reviews.service.js";
import {
  createReviewSchema,
  submitReplayChoiceSchema
} from "./reviews.schema.js";

function userIdOf(req: Request): string {
  return (req as AuthedRequest).userId;
}

export async function context(req: Request, res: Response) {
  try {
    const data = await service.getReplayContext(userIdOf(req), req.params.id);
    return res.json({ context: data });
  } catch (err) {
    if (err instanceof Error && err.message === "ALREADY_REVIEWED") {
      return res.status(409).json({ error: "This decision is already reviewed" });
    }
    return res.status(404).json({ error: "Not found" });
  }
}

export async function replay(req: Request, res: Response) {
  const parsed = submitReplayChoiceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }
  try {
    const data = await service.submitReplayChoice(
      userIdOf(req),
      req.params.id,
      parsed.data.replayChoice
    );
    return res.status(201).json(data);
  } catch (err) {
    if (err instanceof Error && err.message === "ALREADY_REVIEWED") {
      return res.status(409).json({ error: "This decision is already reviewed" });
    }
    return res.status(404).json({ error: "Not found" });
  }
}

export async function reveal(req: Request, res: Response) {
  try {
    const data = await service.revealSnapshot(userIdOf(req), req.params.id);
    return res.json({ decision: data });
  } catch (err) {
    if (err instanceof Error && err.message === "REPLAY_REQUIRED") {
      return res.status(409).json({ error: "Submit your replay choice first" });
    }
    return res.status(404).json({ error: "Not found" });
  }
}

export async function create(req: Request, res: Response) {
  const parsed = createReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }
  try {
    const review = await service.createReview(
      userIdOf(req),
      req.params.id,
      parsed.data
    );
    return res.status(201).json({ review });
  } catch (err) {
    if (err instanceof Error && err.message === "ALREADY_REVIEWED") {
      return res.status(409).json({ error: "This decision is already reviewed" });
    }
    return res.status(404).json({ error: "Not found" });
  }
}