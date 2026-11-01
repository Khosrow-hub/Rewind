import { prisma } from "../../db/prisma.js";
// import { sendReminderEmail } from "../../lib/email.js"; // Uncomment when domain is ready

export async function processDueReminders() {
  console.log("[CRON] Checking for due decisions...");
  const today = new Date();
  
  // Find all PENDING decisions where the review date is today or in the past
  const dueDecisions = await prisma.decision.findMany({
    where: {
      status: "PENDING",
      reviewAt: { lte: today },
      // Optional: Prevent sending multiple emails by checking if we already sent one today
    },
    include: {
      user: { select: { email: true } }
    }
  });

  if (dueDecisions.length === 0) {
    console.log("[CRON] No due decisions found.");
    return;
  }

  for (const decision of dueDecisions) {
    console.log(`[CRON] Decision "${decision.title}" is due for ${decision.user.email}`);
    
    // TODO: When domain is ready, uncomment this to send real emails
    // await sendReminderEmail(decision.user.email, decision.title, decision.id);
    
    // We also need to update the decision so we don't email them every single day.
    // We can just update the reviewAt to tomorrow, or add a flag. 
    // For now, let's just log it.
  }

  console.log(`[CRON] Processed ${dueDecisions.length} reminders.`);
}