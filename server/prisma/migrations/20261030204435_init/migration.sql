-- CreateEnum
CREATE TYPE "Importance" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'LIFE_CHANGING');

-- CreateEnum
CREATE TYPE "DecisionStatus" AS ENUM ('PENDING', 'REVIEWED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "AssumptionResult" AS ENUM ('UNVERIFIED', 'TRUE', 'FALSE', 'PARTIAL');

-- CreateEnum
CREATE TYPE "ReviewKind" AS ENUM ('INTERIM', 'FINAL');

-- CreateEnum
CREATE TYPE "OutcomeMet" AS ENUM ('FULLY', 'PARTIALLY', 'NOT_AT_ALL');

-- CreateEnum
CREATE TYPE "ProcessSound" AS ENUM ('YES', 'PARTIALLY', 'NO');

-- CreateEnum
CREATE TYPE "WouldDecideAgain" AS ENUM ('YES', 'MAYBE', 'NO');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('DECISION_CREATED', 'OPTION_ADDED', 'ASSUMPTION_ADDED', 'ASSUMPTION_RESOLVED', 'INTERIM_REVIEW_ADDED', 'FINAL_REVIEW_ADDED', 'CORRECTION_ADDED', 'STATUS_CHANGED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionTag" (
    "decisionId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "DecisionTag_pkey" PRIMARY KEY ("decisionId","tagId")
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "expectedOutcome" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "importance" "Importance" NOT NULL,
    "status" "DecisionStatus" NOT NULL DEFAULT 'PENDING',
    "chosenOptionId" TEXT,
    "reviewAt" TIMESTAMP(3) NOT NULL,
    "snapshotAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionOption" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DecisionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assumption" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "importance" "Importance" NOT NULL,
    "confidence" INTEGER NOT NULL,
    "verifyAt" TIMESTAMP(3),
    "result" "AssumptionResult" NOT NULL DEFAULT 'UNVERIFIED',
    "resultNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionReview" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "kind" "ReviewKind" NOT NULL,
    "scheduledFor" TIMESTAMP(3),
    "replayChoice" TEXT,
    "replayRevealedAt" TIMESTAMP(3),
    "whatHappened" TEXT NOT NULL,
    "outcomeMet" "OutcomeMet" NOT NULL,
    "processSound" "ProcessSound" NOT NULL,
    "wouldDecideAgain" "WouldDecideAgain" NOT NULL,
    "lesson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DecisionReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Correction" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT NOT NULL,
    "newValue" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Correction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionEvent" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DecisionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE INDEX "Tag_userId_idx" ON "Tag"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_userId_name_key" ON "Tag"("userId", "name");

-- CreateIndex
CREATE INDEX "DecisionTag_tagId_idx" ON "DecisionTag"("tagId");

-- CreateIndex
CREATE INDEX "Decision_userId_status_idx" ON "Decision"("userId", "status");

-- CreateIndex
CREATE INDEX "Decision_userId_reviewAt_idx" ON "Decision"("userId", "reviewAt");

-- CreateIndex
CREATE INDEX "DecisionOption_decisionId_idx" ON "DecisionOption"("decisionId");

-- CreateIndex
CREATE UNIQUE INDEX "DecisionOption_decisionId_position_key" ON "DecisionOption"("decisionId", "position");

-- CreateIndex
CREATE INDEX "Assumption_decisionId_idx" ON "Assumption"("decisionId");

-- CreateIndex
CREATE INDEX "DecisionReview_decisionId_kind_idx" ON "DecisionReview"("decisionId", "kind");

-- CreateIndex
CREATE INDEX "DecisionReview_decisionId_createdAt_idx" ON "DecisionReview"("decisionId", "createdAt");

-- CreateIndex
CREATE INDEX "Correction_decisionId_createdAt_idx" ON "Correction"("decisionId", "createdAt");

-- CreateIndex
CREATE INDEX "DecisionEvent_decisionId_createdAt_idx" ON "DecisionEvent"("decisionId", "createdAt");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionTag" ADD CONSTRAINT "DecisionTag_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionTag" ADD CONSTRAINT "DecisionTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionOption" ADD CONSTRAINT "DecisionOption_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assumption" ADD CONSTRAINT "Assumption_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionReview" ADD CONSTRAINT "DecisionReview_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Correction" ADD CONSTRAINT "Correction_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionEvent" ADD CONSTRAINT "DecisionEvent_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
