import type { Request, Response } from "express";
import { env } from "../../config/env.js";
import * as authService from "./auth.service.js";
import { signupSchema, loginSchema } from "./auth.schema.js";

function setCookie(res: Response, token: string, expiresAt: Date) {
  const isProd = env.NODE_ENV === "production";
  res.cookie(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    expires: expiresAt,
    path: "/"
  });
}

function clearCookie(res: Response) {
  const isProd = env.NODE_ENV === "production";
  res.clearCookie(env.SESSION_COOKIE_NAME, {
    path: "/",
    sameSite: isProd ? "none" : "lax",
    secure: isProd
  });
}

export async function signup(req: Request, res: Response) {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const user = await authService.signup(parsed.data.email, parsed.data.password);
    const session = await authService.createSession(user.id);
    setCookie(res, session.token, session.expiresAt);
    return res.status(201).json({ user });
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_TAKEN") return res.status(409).json({ error: "Email already registered" });
    return res.status(500).json({ error: "Server error" });
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const user = await authService.login(parsed.data.email, parsed.data.password);
    const session = await authService.createSession(user.id);
    setCookie(res, session.token, session.expiresAt);
    return res.json({ user });
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_CREDENTIALS") return res.status(401).json({ error: "Invalid email or password" });
    return res.status(500).json({ error: "Server error" });
  }
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.[env.SESSION_COOKIE_NAME];
  if (token && typeof token === "string") {
    await authService.destroySession(token);
  }
  clearCookie(res);
  return res.status(204).send();
}

export async function me(req: Request, res: Response) {
  const userId = (req as Request & { userId?: string }).userId;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  return res.json({ userId });
}

// NEW: Get sessions
export async function getSessions(req: Request, res: Response) {
  const userId = (req as Request & { userId?: string }).userId;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  
  const sessions = await authService.getUserSessions(userId);
    // Print to Render logs
  console.log(`[SESSIONS] User ${userId} has ${sessions.length} active sessions.`);
  return res.json({ sessions });
}

// NEW: Revoke others
export async function revokeOthers(req: Request, res: Response) {
  const userId = (req as Request & { userId?: string }).userId;
  const token = req.cookies?.[env.SESSION_COOKIE_NAME];
  
  if (!userId || !token) return res.status(401).json({ error: "Not authenticated" });
  
  await authService.revokeOtherSessions(userId, token);
  return res.status(204).send();
}