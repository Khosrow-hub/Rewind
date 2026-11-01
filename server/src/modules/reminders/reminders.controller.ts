import type { Request, Response } from "express";
import * as service from "./reminders.service.js";

export async function triggerReminders(req: Request, res: Response) {
  // Security: Check for a secret header so only the cron job can trigger this
  const authHeader = req.headers.authorization;
  const secret = process.env.CRON_SECRET || "development_secret";
  
  if (authHeader !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await service.processDueReminders();
    return res.json({ success: true, message: "Reminders processed" });
  } catch (error) {
    console.error("Reminder error:", error);
    return res.status(500).json({ error: "Failed to process reminders" });
  }
}