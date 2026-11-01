import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `https://rewind-mocha.vercel.app/auth?token=${token}`;

  try {
    await resend.emails.send({
      from: "Rewind <onboarding@resend.dev>", // Free tier uses this default email
      to: email,
      subject: "Reset your Rewind password",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; padding: 20px;">
          <h2>Reset your password</h2>
          <p>You recently requested to reset your password for your Rewind account.</p>
          <p>Click the button below to reset it. This link is valid for 1 hour.</p>
          <a href="${resetLink}" style="background: #1E201E; color: #ECDFCC; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 16px;">
            Reset Password
          </a>
          <p style="margin-top: 24px; font-size: 12px; color: #666;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `
    });
    console.log(`[EMAIL SENT] Password reset sent to ${email}`);
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send to ${email}:`, error);
  }
}