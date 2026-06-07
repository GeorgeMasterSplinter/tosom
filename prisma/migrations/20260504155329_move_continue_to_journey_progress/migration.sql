/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "JourneyType" AS ENUM ('intro', 'reflection', 'connection', 'milestone', 'system');

-- CreateEnum
CREATE TYPE "JourneyPhase" AS ENUM ('EARLY', 'BUILDING_TRUST', 'DEEPER', 'CHECKIN');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "reviewed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "activityLevel" TEXT,
ADD COLUMN     "ambitionLevel" TEXT,
ADD COLUMN     "boundaries" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "boundaryStyle" TEXT,
ADD COLUMN     "children" TEXT,
ADD COLUMN     "communicationStyle" TEXT,
ADD COLUMN     "dealbreaker" TEXT,
ADD COLUMN     "emotionalPace" TEXT,
ADD COLUMN     "energyStyle" TEXT,
ADD COLUMN     "financialStyle" TEXT,
ADD COLUMN     "futureWish" TEXT,
ADD COLUMN     "giveStyle" TEXT,
ADD COLUMN     "intentions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "intimacyStyle" TEXT,
ADD COLUMN     "jobStatus" TEXT,
ADD COLUMN     "lifeDirection" TEXT,
ADD COLUMN     "lifePace" TEXT,
ADD COLUMN     "lifeRhythm" TEXT,
ADD COLUMN     "livingSituation" TEXT,
ADD COLUMN     "longTermExpectation" TEXT,
ADD COLUMN     "loveLanguage" TEXT,
ADD COLUMN     "needStyle" TEXT,
ADD COLUMN     "needs" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "physicalComfort" TEXT,
ADD COLUMN     "physicalImportance" TEXT,
ADD COLUMN     "planningStyle" TEXT,
ADD COLUMN     "relationshipExpectation" TEXT,
ADD COLUMN     "socialLevel" TEXT,
ADD COLUMN     "structureStyle" TEXT,
ADD COLUMN     "travelStyle" TEXT,
ADD COLUMN     "weekendStyle" TEXT;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "phase" "JourneyPhase" NOT NULL,
    "displayed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyStep" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT,
    "type" "JourneyType" NOT NULL DEFAULT 'intro',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "phase" "JourneyPhase" NOT NULL,
    "isSystemMessage" BOOLEAN NOT NULL,
    "systemMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JourneyStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyProgress" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT,
    "currentStep" INTEGER NOT NULL,
    "completedSteps" INTEGER NOT NULL,
    "phase" "JourneyPhase" NOT NULL,
    "totalSteps" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "continueA" TEXT,
    "continueB" TEXT,

    CONSTRAINT "JourneyProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JourneyStep_conversationId_key" ON "JourneyStep"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyProgress_conversationId_key" ON "JourneyProgress"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemMessage" ADD CONSTRAINT "SystemMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyStep" ADD CONSTRAINT "JourneyStep_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyProgress" ADD CONSTRAINT "JourneyProgress_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
