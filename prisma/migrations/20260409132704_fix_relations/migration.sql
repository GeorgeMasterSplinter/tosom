/*
  Warnings:

  - You are about to drop the column `bio` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `interests` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `Preference` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CardCategory" AS ENUM ('LIGHT', 'MEDIUM', 'DEEP');

-- DropForeignKey
ALTER TABLE "Preference" DROP CONSTRAINT "Preference_userId_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "bio",
DROP COLUMN "interests",
ADD COLUMN     "activityLevel" TEXT,
ADD COLUMN     "calmVsIntense" TEXT,
ADD COLUMN     "children" TEXT,
ADD COLUMN     "conflictStyle" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dailyLife" TEXT,
ADD COLUMN     "dayRhythm" TEXT,
ADD COLUMN     "dealbreakers" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "emotionalVsLogical" TEXT,
ADD COLUMN     "energyDrainers" TEXT,
ADD COLUMN     "energySources" TEXT,
ADD COLUMN     "expectations" TEXT,
ADD COLUMN     "fears" TEXT,
ADD COLUMN     "financialStyle" TEXT,
ADD COLUMN     "futureVision" TEXT,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "loveLanguage" TEXT,
ADD COLUMN     "partnerHope" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "planningStyle" TEXT,
ADD COLUMN     "proudOf" TEXT,
ADD COLUMN     "relationshipStatus" TEXT,
ADD COLUMN     "relaxStyle" TEXT,
ADD COLUMN     "selfView" TEXT,
ADD COLUMN     "socialLevel" TEXT,
ADD COLUMN     "structureVsSpontaneity" TEXT,
ADD COLUMN     "travelStyle" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "wantChildren" TEXT,
ADD COLUMN     "wantCohabitation" TEXT,
ADD COLUMN     "wantMarriage" TEXT,
ADD COLUMN     "weekendStyle" TEXT,
ADD COLUMN     "whatIGive" TEXT,
ADD COLUMN     "whatINeed" TEXT,
ADD COLUMN     "workingOn" TEXT;

-- DropTable
DROP TABLE "Preference";

-- CreateTable
CREATE TABLE "MatchRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "matchReadyAt" TIMESTAMP(3) NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "matchUserId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "breakdown" JSONB NOT NULL,
    "quality" TEXT NOT NULL,
    "chatUntil" TIMESTAMP(3) NOT NULL,
    "decideUntil" TIMESTAMP(3) NOT NULL,
    "decision_userA" TEXT,
    "decision_userB" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "day" INTEGER NOT NULL DEFAULT 1,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Journey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyTask" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JourneyTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BliKjentCard" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "category" "CardCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BliKjentCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_matchId_key" ON "Conversation"("matchId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_matchUserId_fkey" FOREIGN KEY ("matchUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journey" ADD CONSTRAINT "Journey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyTask" ADD CONSTRAINT "JourneyTask_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
