/*
  Warnings:

  - A unique constraint covering the columns `[matchId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[progressId,day]` on the table `JourneyMilestone` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,matchId]` on the table `JourneyProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matchId` to the `JourneyProgress` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JourneyUserState" AS ENUM ('IDLE', 'QUEUED', 'MATCHED', 'ON_JOURNEY', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "JourneyProgress" DROP CONSTRAINT "JourneyProgress_userId_fkey";

-- DropIndex
DROP INDEX "JourneyProgress_userId_key";

-- AlterTable: Add matchId as nullable first (existing rows need populate)
ALTER TABLE "JourneyProgress" ADD COLUMN     "bothSeenAt" TIMESTAMP(3),
ADD COLUMN     "matchId" TEXT,
ADD COLUMN     "userASeenAt" TIMESTAMP(3),
ADD COLUMN     "userBSeenAt" TIMESTAMP(3),
ALTER COLUMN "day" SET DEFAULT 0;

-- Populate matchId: link each JourneyProgress to its user's most recent active match
UPDATE "JourneyProgress" jp
SET "matchId" = sub.m_id
FROM (
  SELECT m."id" AS m_id, jp2."userId", ROW_NUMBER() OVER (PARTITION BY jp2."userId" ORDER BY m."createdAt" DESC) AS rn
  FROM "Match" m
  JOIN "JourneyProgress" jp2 ON (m."userAId" = jp2."userId" OR m."userBId" = jp2."userId")
  WHERE m."status" IN ('active', 'matched')
) sub
WHERE sub."userId" = jp."userId"
  AND sub.rn = 1
  AND jp."matchId" IS NULL;

-- Delete orphaned JourneyProgress rows with no match (cannot be linked)
DELETE FROM "JourneyMilestone" WHERE "progressId" IN (SELECT "id" FROM "JourneyProgress" WHERE "matchId" IS NULL);
DELETE FROM "JourneyProgress" WHERE "matchId" IS NULL;

-- Now make matchId NOT NULL
ALTER TABLE "JourneyProgress" ALTER COLUMN "matchId" SET NOT NULL;


-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "journeyState" "JourneyUserState" NOT NULL DEFAULT 'IDLE',
ADD COLUMN     "matchQueuedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "MatchHistory" (
    "id" TEXT NOT NULL,
    "userAId" TEXT NOT NULL,
    "userBId" TEXT NOT NULL,
    "matchId" TEXT,
    "endedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "outcomeA" TEXT,
    "outcomeB" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MatchHistory_userAId_idx" ON "MatchHistory"("userAId");

-- CreateIndex
CREATE INDEX "MatchHistory_userBId_idx" ON "MatchHistory"("userBId");

-- CreateIndex
CREATE INDEX "MatchHistory_createdAt_idx" ON "MatchHistory"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MatchHistory_userAId_userBId_key" ON "MatchHistory"("userAId", "userBId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_matchId_key" ON "Conversation"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyMilestone_progressId_day_key" ON "JourneyMilestone"("progressId", "day");

-- CreateIndex
CREATE INDEX "JourneyProgress_matchId_idx" ON "JourneyProgress"("matchId");

-- CreateIndex
CREATE INDEX "JourneyProgress_bothSeenAt_idx" ON "JourneyProgress"("bothSeenAt");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyProgress_userId_matchId_key" ON "JourneyProgress"("userId", "matchId");

-- CreateIndex
CREATE INDEX "Match_userAId_status_idx" ON "Match"("userAId", "status");

-- CreateIndex
CREATE INDEX "Match_userBId_status_idx" ON "Match"("userBId", "status");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_createdAt_idx" ON "Notification"("userId", "readAt", "createdAt");

-- CreateIndex
CREATE INDEX "User_journeyState_idx" ON "User"("journeyState");

-- CreateIndex
CREATE INDEX "User_matchQueuedAt_idx" ON "User"("matchQueuedAt");
