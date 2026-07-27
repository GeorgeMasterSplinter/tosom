/*
  Warnings:

  - You are about to drop the column `continueDecisionMade` on the `JourneyProgress` table. All the data in the column will be lost.
  - You are about to drop the column `photosShared` on the `JourneyProgress` table. All the data in the column will be lost.
  - You are about to drop the column `categoryQuestionId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `ChatCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "JourneyState" ADD VALUE 'PAUSED';

-- DropForeignKey
ALTER TABLE "ChatQuestion" DROP CONSTRAINT "ChatQuestion_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_categoryQuestionId_fkey";

-- DropIndex
DROP INDEX "Match_userAId_userBId_key";

-- DropIndex
DROP INDEX "Message_conversationId_createdAt_idx";

-- AlterTable
ALTER TABLE "JourneyProgress" DROP COLUMN "continueDecisionMade",
DROP COLUMN "photosShared";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "categoryQuestionId";

-- DropTable
DROP TABLE "ChatCategory";

-- DropTable
DROP TABLE "ChatQuestion";

-- DropEnum
DROP TYPE "ChatCategoryKey";

-- CreateTable
CREATE TABLE "ConversationJourney" (
    "conversationId" TEXT NOT NULL,
    "userAProgress" "JourneyState" NOT NULL DEFAULT 'NOT_STARTED',
    "userBProgress" "JourneyState" NOT NULL DEFAULT 'NOT_STARTED',
    "day" INTEGER NOT NULL DEFAULT 1,
    "completedDaysA" INTEGER NOT NULL DEFAULT 0,
    "completedDaysB" INTEGER NOT NULL DEFAULT 0,
    "phase" "JourneyPhase" NOT NULL DEFAULT 'EARLY',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pausedAt" TIMESTAMP(3),
    "resumedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "continueA" TEXT,
    "continueB" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversationJourney_pkey" PRIMARY KEY ("conversationId")
);

-- CreateTable
CREATE TABLE "JourneyStateLog" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "fromState" "JourneyState" NOT NULL,
    "toState" "JourneyState" NOT NULL,
    "reason" TEXT,
    "triggeredBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JourneyStateLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchFeedback" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchHistory" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchQueue" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "QueueStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConversationJourney_conversationId_idx" ON "ConversationJourney"("conversationId");

-- CreateIndex
CREATE INDEX "JourneyStateLog_conversationId_idx" ON "JourneyStateLog"("conversationId");

-- CreateIndex
CREATE INDEX "JourneyStateLog_createdAt_idx" ON "JourneyStateLog"("createdAt");

-- CreateIndex
CREATE INDEX "MatchFeedback_matchId_idx" ON "MatchFeedback"("matchId");

-- CreateIndex
CREATE INDEX "MatchFeedback_rating_idx" ON "MatchFeedback"("rating");

-- CreateIndex
CREATE INDEX "MatchFeedback_userId_idx" ON "MatchFeedback"("userId");

-- CreateIndex
CREATE INDEX "MatchQueue_createdAt_idx" ON "MatchQueue"("createdAt");

-- CreateIndex
CREATE INDEX "MatchQueue_status_idx" ON "MatchQueue"("status");

-- CreateIndex
CREATE INDEX "MatchQueue_userId_idx" ON "MatchQueue"("userId");

-- AddForeignKey
ALTER TABLE "ConversationJourney" ADD CONSTRAINT "ConversationJourney_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyStateLog" ADD CONSTRAINT "JourneyStateLog_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchFeedback" ADD CONSTRAINT "MatchFeedback_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchFeedback" ADD CONSTRAINT "MatchFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchHistory" ADD CONSTRAINT "MatchHistory_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchQueue" ADD CONSTRAINT "MatchQueue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
