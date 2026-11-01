import { PrismaClient, Importance } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");
  
  const email = "demo@rewind.com";
  const password = "password123";
  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

  console.log("Generated hash:", passwordHash);

  await prisma.user.deleteMany({ where: { email } });

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash
    }
  });

  console.log("Created user:", user.email);

  // 1. The Startup Job
  const decision1 = await prisma.decision.create({
    data: {
      userId: user.id,
      title: "Take the startup job",
      reasoning: "Faster growth and equity upside. I can tolerate the risk.",
      expectedOutcome: "Salary up thirty percent and real architecture experience.",
      probability: 80,
      importance: Importance.HIGH,
      status: "REVIEWED",
      reviewAt: new Date(),
      reviewedAt: new Date(),
      options: {
        create: [
          { label: "Join startup", position: 0 },
          { label: "Stay put", position: 1 }
        ]
      }
    },
    include: { options: true }
  });

  await prisma.decision.update({
    where: { id: decision1.id },
    data: { chosenOptionId: decision1.options[0].id }
  });

  await prisma.decisionReview.create({
    data: {
      decisionId: decision1.id,
      kind: "FINAL",
      whatHappened: "Good experience, salary lower than expected.",
      outcomeMet: "PARTIALLY",
      processSound: "YES",
      wouldDecideAgain: "MAYBE",
      lesson: "Evaluate learning and salary independently."
    }
  });

  const tag1 = await prisma.tag.upsert({
    where: { userId_name: { userId: user.id, name: "career" } },
    create: { userId: user.id, name: "career" },
    update: {}
  });

  await prisma.decisionTag.create({
    data: { decisionId: decision1.id, tagId: tag1.id }
  });

  // 2. The Laptop Purchase
  const decision2 = await prisma.decision.create({
    data: {
      userId: user.id,
      title: "Buy the M3 MacBook Pro",
      reasoning: "My old laptop is too slow for compiling large projects.",
      expectedOutcome: "Compile times drop by half and I can work on the couch.",
      probability: 95,
      importance: Importance.MEDIUM,
      status: "REVIEWED",
      reviewAt: new Date(),
      reviewedAt: new Date(),
      options: {
        create: [
          { label: "Buy it", position: 0 },
          { label: "Wait another year", position: 1 }
        ]
      }
    },
    include: { options: true }
  });

  await prisma.decision.update({
    where: { id: decision2.id },
    data: { chosenOptionId: decision2.options[0].id }
  });

  await prisma.decisionReview.create({
    data: {
      decisionId: decision2.id,
      kind: "FINAL",
      whatHappened: "It is blazing fast and the battery is incredible.",
      outcomeMet: "FULLY",
      processSound: "YES",
      wouldDecideAgain: "YES",
      lesson: "The M3 chips are definitely worth the upgrade."
    }
  });

  const tag2 = await prisma.tag.upsert({
    where: { userId_name: { userId: user.id, name: "tech" } },
    create: { userId: user.id, name: "tech" },
    update: {}
  });

  await prisma.decisionTag.create({
    data: { decisionId: decision2.id, tagId: tag2.id }
  });

  // 3. The Index Fund
  const decision3 = await prisma.decision.create({
    data: {
      userId: user.id,
      title: "Invest in the S&P 500",
      reasoning: "Historically returns 8% annually over the long term.",
      expectedOutcome: "Steady growth over 5 years.",
      probability: 90,
      importance: Importance.HIGH,
      status: "REVIEWED",
      reviewAt: new Date(),
      reviewedAt: new Date(),
      options: {
        create: [
          { label: "Invest", position: 0 },
          { label: "Keep cash", position: 1 }
        ]
      }
    },
    include: { options: true }
  });

  await prisma.decision.update({
    where: { id: decision3.id },
    data: { chosenOptionId: decision3.options[0].id }
  });

  await prisma.decisionReview.create({
    data: {
      decisionId: decision3.id,
      kind: "FINAL",
      whatHappened: "Up 12% this year.",
      outcomeMet: "FULLY",
      processSound: "YES",
      wouldDecideAgain: "YES",
      lesson: "Boring investing works."
    }
  });

  const tag3 = await prisma.tag.upsert({
    where: { userId_name: { userId: user.id, name: "finance" } },
    create: { userId: user.id, name: "finance" },
    update: {}
  });

  await prisma.decisionTag.create({
    data: { decisionId: decision3.id, tagId: tag3.id }
  });

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