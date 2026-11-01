import { prisma } from "../../db/prisma.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import {
  generateSessionToken,
  hashSessionToken,
  sessionExpiryDate
} from "../../lib/session.js";

export async function signup(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) throw new Error("EMAIL_TAKEN");

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email: normalizedEmail, passwordHash },
    select: { id: true, email: true, createdAt: true }
  });
  return user;
}

export async function login(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) throw new Error("INVALID_CREDENTIALS");
  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) throw new Error("INVALID_CREDENTIALS");
  return { id: user.id, email: user.email };
}

export async function createSession(userId: string) {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = sessionExpiryDate();
  await prisma.session.create({
    data: { userId, tokenHash, expiresAt }
  });
  return { token, expiresAt };
}

export async function destroySession(token: string) {
  const tokenHash = hashSessionToken(token);
  await prisma.session.deleteMany({ where: { tokenHash } });
}

// NEW: Get all active sessions for user
export async function getUserSessions(userId: string) {
  return prisma.session.findMany({
    where: { userId, expiresAt: { gt: new Date() } },
    select: { id: true, createdAt: true, expiresAt: true }
  });
}

// NEW: Revoke all sessions except the current one
export async function revokeOtherSessions(userId: string, currentToken: string) {
  const currentHash = hashSessionToken(currentToken);
  await prisma.session.deleteMany({
    where: {
      userId,
      tokenHash: { not: currentHash }
    }
  });
}