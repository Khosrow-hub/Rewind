import type { Request, Response } from "express";
import type { AuthedRequest } from "../../middleware/auth.js";
import * as service from "./patterns.service.js";

export async function summary(req: Request, res: Response) {
  const userId = (req as AuthedRequest).userId;
  const data = await service.getPatterns(userId);
  return res.json(data);
}