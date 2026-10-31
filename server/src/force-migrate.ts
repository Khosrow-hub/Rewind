import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Forcing database schema update...");
  
  try {
    // 1. Add the probability column if it doesn't exist
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Decision" ADD COLUMN IF NOT EXISTS "probability" INTEGER NOT NULL DEFAULT 50;
    `);
    console.log("Added probability column.");

    // 2. If the old confidence column exists, copy its data to probability
    try {
      await prisma.$executeRawUnsafe(`
        UPDATE "Decision" SET "probability" = "confidence" * 20 WHERE "probability" = 50;
      `);
      console.log("Migrated old confidence data.");
    } catch (e) {
      console.log("No old confidence data to migrate (this is normal).");
    }

    // 3. Drop the old confidence column so Prisma stops complaining
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "Decision" DROP COLUMN IF EXISTS "confidence";
      `);
      console.log("Dropped old confidence column.");
    } catch (e) {
      console.log("No old confidence column to drop.");
    }

    console.log("Database is fixed.");
  } catch (error) {
    console.error("Error fixing database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();