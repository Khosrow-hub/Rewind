import type { Request, Response } from "express";
import type { AuthedRequest } from "../../middleware/auth.js";
import * as service from "./export.service.js";

export async function json(req: Request, res: Response) {
  const userId = (req as AuthedRequest).userId;
  const data = await service.exportAll(userId);
  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="rewind-export-${Date.now()}.json"`
  );
  return res.send(JSON.stringify(data, null, 2));
}

export async function csv(req: Request, res: Response) {
  const userId = (req as AuthedRequest).userId;
  const data = await service.exportCsv(userId);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="rewind-export-${Date.now()}.csv"`
  );
  return res.send(data);
}