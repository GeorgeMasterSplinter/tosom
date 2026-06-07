/*
  Warnings:

  - You are about to drop the column `endedAt` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `matchId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `completedSteps` on the `JourneyProgress` table. All the data in the column will be lost.
  - You are about to drop the column `continueA` on the `JourneyProgress` table. All the data in the column will be lost.
  - You are about to drop the column `continueB` on the `JourneyProgress` table. All the data in the column will be lost.
  - You are about to drop the column `conversationId` on the `JourneyProgress` table. All the data in the column will be lost.
  - You are about to drop the column `currentStep` on the `JourneyProgress` table. All the data in the column will be lost.
  - You are about to drop the column `totalSteps` on the `JourneyProgress` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `JourneyStep` table. All the data in the column will be lost.
  - You are about to drop the column `chatUntil` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `endedAt` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `matchQuality` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `matchScore` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `reviewed` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `Match` table. All the data in the column will be lost.
  - The `status` column on the `Match` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `body` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `activityLevel` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `ambitionLevel` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `boundaries` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `boundaryStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `children` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `communicationStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `dealbreaker` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `emotionalPace` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `energyStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `financialStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `futureWish` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `giveStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `intentions` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `intimacyStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `jobStatus` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `lifeDirection` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `lifePace` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `lifeRhythm` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `livingSituation` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `longTermExpectation` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `loveLanguage` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `needStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `needs` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `physicalComfort` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `physicalImportance` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `planningStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `relationshipExpectation` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `socialLevel` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `structureStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `travelStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `weekendStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `conversationId` on the `SystemMessage` table. All the data in the column will be lost.
  - You are about to drop the column `displayed` on the `SystemMessage` table. All the data in the column will be lost.
  - You are about to drop the column `phase` on the `SystemMessage` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hashedPassword` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `salt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `BliKjentCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JourneyTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Preference` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `JourneyProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `JourneyProgress` table without a default value. This is not possible if the table is not empty.
  - Made the column `conversationId` on table `JourneyStep` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `message` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('active', 'matched', 'expired', 'ended', 'unmatched');

-- CreateEnum
CREATE TYPE "MessageCategory" AS ENUM ('user', 'system', 'system_message', 'continue_choice');

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_matchId_fkey";

-- DropForeignKey
ALTER TABLE "JourneyProgress" DROP CONSTRAINT "JourneyProgress_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "JourneyStep" DROP CONSTRAINT "JourneyStep_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "JourneyTask" DROP CONSTRAINT "JourneyTask_userId_fkey";

-- DropForeignKey
ALTER TABLE "Preference" DROP CONSTRAINT "Preference_userId_fkey";

-- DropForeignKey
ALTER TABLE "SystemMessage" DROP CONSTRAINT "SystemMessage_conversationId_fkey";

-- DropIndex
DROP INDEX "Conversation_matchId_key";

-- DropIndex
DROP INDEX "JourneyProgress_conversationId_key";

-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "endedAt",
DROP COLUMN "matchId",
DROP COLUMN "startedAt";

-- AlterTable
ALTER TABLE "JourneyProgress" DROP COLUMN "completedSteps",
DROP COLUMN "continueA",
DROP COLUMN "continueB",
DROP COLUMN "conversationId",
DROP COLUMN "currentStep",
DROP COLUMN "totalSteps",
ADD COLUMN     "day" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "phase" SET DEFAULT 'EARLY',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "JourneyStep" DROP COLUMN "type",
ALTER COLUMN "conversationId" SET NOT NULL,
ALTER COLUMN "isSystemMessage" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "chatUntil",
DROP COLUMN "endedAt",
DROP COLUMN "matchQuality",
DROP COLUMN "matchScore",
DROP COLUMN "reviewed",
DROP COLUMN "startedAt",
ADD COLUMN     "score" DOUBLE PRECISION,
DROP COLUMN "status",
ADD COLUMN     "status" "MatchStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "readAt" TIMESTAMP(3),
ADD COLUMN     "type" "MessageCategory" NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "body",
DROP COLUMN "readAt",
DROP COLUMN "title",
ADD COLUMN     "message" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "activityLevel",
DROP COLUMN "ambitionLevel",
DROP COLUMN "boundaries",
DROP COLUMN "boundaryStyle",
DROP COLUMN "children",
DROP COLUMN "communicationStyle",
DROP COLUMN "dealbreaker",
DROP COLUMN "emotionalPace",
DROP COLUMN "energyStyle",
DROP COLUMN "financialStyle",
DROP COLUMN "futureWish",
DROP COLUMN "giveStyle",
DROP COLUMN "intentions",
DROP COLUMN "intimacyStyle",
DROP COLUMN "jobStatus",
DROP COLUMN "lifeDirection",
DROP COLUMN "lifePace",
DROP COLUMN "lifeRhythm",
DROP COLUMN "livingSituation",
DROP COLUMN "location",
DROP COLUMN "longTermExpectation",
DROP COLUMN "loveLanguage",
DROP COLUMN "needStyle",
DROP COLUMN "needs",
DROP COLUMN "physicalComfort",
DROP COLUMN "physicalImportance",
DROP COLUMN "planningStyle",
DROP COLUMN "relationshipExpectation",
DROP COLUMN "socialLevel",
DROP COLUMN "structureStyle",
DROP COLUMN "travelStyle",
DROP COLUMN "weekendStyle",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "photos" TEXT[];

-- AlterTable
ALTER TABLE "SystemMessage" DROP COLUMN "conversationId",
DROP COLUMN "displayed",
DROP COLUMN "phase";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "hashedPassword",
DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiry",
DROP COLUMN "salt",
DROP COLUMN "stripeCustomerId",
ADD COLUMN     "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT,
ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "BliKjentCard";

-- DropTable
DROP TABLE "JourneyTask";

-- DropTable
DROP TABLE "Preference";

-- DropEnum
DROP TYPE "JourneyType";

-- CreateTable
CREATE TABLE "MatchHistory" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JourneyProgress_userId_key" ON "JourneyProgress"("userId");

-- AddForeignKey
ALTER TABLE "MatchHistory" ADD CONSTRAINT "MatchHistory_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyProgress" ADD CONSTRAINT "JourneyProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyStep" ADD CONSTRAINT "JourneyStep_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
