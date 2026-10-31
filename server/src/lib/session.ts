import crypto from "node:crypto";
import { env } from "../config/env.js";

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function sessionExpiryDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + env.SESSION_TTL_DAYS);
  return d;
}