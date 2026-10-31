/*
  Warnings:

  - You are about to drop the column `confidence` on the `Decision` table. All the data in the column will be lost.
  - Added the required column `probability` to the `Decision` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Decision" DROP COLUMN "confidence",
ADD COLUMN     "probability" INTEGER NOT NULL;
