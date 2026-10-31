import type { Request, Response, NextFunction } from "express";
import { prisma } from "../db/prisma.js";
import { env } from "../config/env.js";
import { hashSessionToken } from "../lib/session.js";

export type AuthedRequest = Request & { userId: string };

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.[env.SESSION_COOKIE_NAME];
  if (!token || typeof token !== "string") {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const tokenHash = hashSessionToken(token);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    select: { id: true, userId: true, expiresAt: true }
  });

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { id: session.id } });
    return res.status(401).json({ error: "Session expired" });
  }

  (req as AuthedRequest).userId = session.userId;
  next();
}