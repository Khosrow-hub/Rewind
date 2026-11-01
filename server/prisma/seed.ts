import { PrismaClient, Importance } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");
  
  const email = "demo@rewind.com";
  const password = "password123";
  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

  await prisma.user.deleteMany({ where: { email } });

  const user = await prisma.user.create({
    data: { email, passwordHash }
  });

  console.log("Created user:", user.email);

  // Helper to create decision with timeline events
  async function createSeededDecision(data: any, daysAgo: number) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const decision = await prisma.decision.create({
      data: {
        userId: user.id,
        title: data.title,
        reasoning: data.reasoning,
        expectedOutcome: data.expectedOutcome,
        probability: data.probability,
        importance: data.importance,
        status: "REVIEWED",
        createdAt,
        updatedAt: createdAt,
        reviewAt: createdAt,
        reviewedAt: createdAt,
        options: {
          create: [
            { label: "Yes", position: 0 },
            { label: "No", position: 1 }
          ]
        }
      },
      include: { options: true }
    });

    await prisma.decision.update({
      where: { id: decision.id },
      data: { chosenOptionId: decision.options[0].id }
    });

    // ADD TIMELINE EVENTS
    await prisma.decisionEvent.createMany({
      data: [
        {
          decisionId: decision.id,
          type: "DECISION_CREATED",
          payload: { title: data.title },
          createdAt: createdAt
        },
        {
          decisionId: decision.id,
          type: "REPLAY_SUBMITTED",
          payload: { choice: "Yes" },
          createdAt: new Date(createdAt.getTime() + 1000 * 60 * 60 * 24) // 1 day later
        },
        {
          decisionId: decision.id,
          type: "FINAL_REVIEW_ADDED",
          payload: { outcomeMet: data.outcomeMet },
          createdAt: new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 7) // 7 days later
        }
      ]
    });

    await prisma.decisionReview.create({
      data: {
        decisionId: decision.id,
        kind: "FINAL",
        whatHappened: data.whatHappened,
        outcomeMet: data.outcomeMet,
        processSound: data.processSound,
        wouldDecideAgain: data.outcomeMet === "FULLY" ? "YES" : "MAYBE",
        lesson: data.lesson,
        createdAt: new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 7)
      }
    });

    if (data.tags) {
      for (const tagName of data.tags) {
        const tag = await prisma.tag.upsert({
          where: { userId_name: { userId: user.id, name: tagName } },
          create: { userId: user.id, name: tagName },
          update: {}
        });
        await prisma.decisionTag.create({
          data: { decisionId: decision.id, tagId: tag.id }
        });
      }
    }
  }

  await createSeededDecision({
    title: "Take the startup job",
    reasoning: "Faster growth and equity upside.",
    expectedOutcome: "Salary up thirty percent and real architecture experience.",
    probability: 80,
    importance: Importance.HIGH,
    tags: ["career"],
    outcomeMet: "PARTIALLY",
    whatHappened: "Good experience, but the salary was lower than expected.",
    processSound: "YES",
    lesson: "Evaluate learning and salary independently."
  }, 180);

  await createSeededDecision({
    title: "Buy the M3 MacBook Pro",
    reasoning: "My old laptop is too slow.",
    expectedOutcome: "Compile times drop by half.",
    probability: 95,
    importance: Importance.MEDIUM,
    tags: ["tech"],
    outcomeMet: "FULLY",
    whatHappened: "It is blazing fast.",
    processSound: "YES",
    lesson: "Worth the upgrade."
  }, 90);

  console.log("Seed complete. You can log in with demo@rewind.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });