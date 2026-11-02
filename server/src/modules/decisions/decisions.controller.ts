import type { Request, Response } from "express";
import type { AuthedRequest } from "../../middleware/auth.js";
import * as service from "./decisions.service.js";
import {
  createDecisionSchema,
  updateDecisionSchema
} from "./decisions.schema.js";

function userIdOf(req: Request): string {
  return (req as AuthedRequest).userId;
}

export async function create(req: Request, res: Response) {
  const parsed = createDecisionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }
  try {
    const decision = await service.createDecision(userIdOf(req), parsed.data);
    return res.status(201).json({ decision });
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_CHOSEN_OPTION") {
      return res.status(400).json({ error: "Chosen option index out of range" });
    }
    if (err instanceof Error && err.message === "LIMIT_REACHED") {
      return res.status(403).json({ error: "Free tier limit reached. Upgrade to Pro to create more." });
    }
    return res.status(500).json({ error: "Server error" });
  }
}

export async function list(req: Request, res: Response) {
  const decisions = await service.listDecisions(userIdOf(req));
  return res.json({ decisions });
}

export async function detail(req: Request, res: Response) {
  try {
    const decision = await service.getDecision(userIdOf(req), req.params.id);
    return res.json({ decision });
  } catch {
    return res.status(404).json({ error: "Not found" });
  }
}

export async function update(req: Request, res: Response) {
  const parsed = updateDecisionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }
  try {
    const decision = await service.updateDecision(
      userIdOf(req),
      req.params.id,
      parsed.data
    );
    return res.json({ decision });
  } catch (err) {
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Not found" });
    }
    if (err instanceof Error && err.message === "LOCKED") {
      return res.status(409).json({ error: "Decision is locked once reviewed" });
    }
    return res.status(500).json({ error: "Server error" });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await service.deleteDecision(userIdOf(req), req.params.id);
    return res.status(204).send();
  } catch {
    return res.status(404).json({ error: "Not found" });
  }
}