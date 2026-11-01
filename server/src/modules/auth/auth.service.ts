import { prisma } from "../../db/prisma.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import {
  generateSessionToken,
  hashSessionToken,
  sessionExpiryDate
} from "../../lib/session.js";
import crypto from "node:crypto";
import { sendPasswordResetEmail } from "../../lib/email.js";

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

export async function getUserSessions(userId: string) {
  return prisma.session.findMany({
    where: { userId, expiresAt: { gt: new Date() } },
    select: { id: true, createdAt: true, expiresAt: true }
  });
}

export async function revokeOtherSessions(userId: string, currentToken: string) {
  const currentHash = hashSessionToken(currentToken);
  await prisma.session.deleteMany({
    where: {
      userId,
      tokenHash: { not: currentHash }
    }
  });
}

export async function createPasswordReset(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) return null; 

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); 

  await prisma.passwordReset.create({
    data: { userId: user.id, tokenHash, expiresAt }
  });

  console.log(`[PASSWORD RESET] Token for ${email}: ${token}`);
  
  try {
    await sendPasswordResetEmail(user.email, token);
    console.log(`[EMAIL SENT] Successfully sent to ${user.email}`);
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send to ${user.email}:`, error);
  }
  
  return { token, email: user.email };
}

export async function resetPassword(token: string, newPassword: string) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  
  const reset = await prisma.passwordReset.findUnique({
    where: { tokenHash },
    include: { user: true }
  });

  if (!reset) throw new Error("INVALID_TOKEN");
  if (reset.usedAt) throw new Error("TOKEN_USED");
  if (reset.expiresAt < new Date()) throw new Error("TOKEN_EXPIRED");

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: reset.userId },
      data: { passwordHash }
    }),
    prisma.passwordReset.update({
      where: { id: reset.id },
      data: { usedAt: new Date() }
    }),
    prisma.session.deleteMany({ where: { userId: reset.userId } })
  ]);
}