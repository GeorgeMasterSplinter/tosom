/*
  Warnings:

  - You are about to drop the column `chatUntil` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `locked` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `typingUpdatedAt` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `typingUserId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `breakdown` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `chatUntil` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `decideUntil` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `decision_userA` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `decision_userB` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `matchUserId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `quality` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `visibleFrom` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `activityLevel` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `ambitionLevel` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `boundaryStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `children` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `communicationStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `conflictStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `dealbreaker` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `emotionalPace` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `energyStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `financialStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `futureWish` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `giveStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `intimacyStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `jobStatus` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `lifeDirection` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `lifePace` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `lifeRhythm` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `livingSituation` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `longTermExpectation` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `loveLanguage` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `needStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `physicalComfort` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `physicalImportance` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `planningStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredAgeMax` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredAgeMin` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `relationshipExpectation` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `seeking` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `socialLevel` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `structureStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `travelStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `weekendStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `BliKjentCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Journey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JourneyTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MatchRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SystemMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ConversationUsers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userBId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Made the column `matchId` on table `Conversation` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `matchQuality` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchScore` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userBId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_matchId_fkey";

-- DropForeignKey
ALTER TABLE "Journey" DROP CONSTRAINT "Journey_userId_fkey";

-- DropForeignKey
ALTER TABLE "JourneyTask" DROP CONSTRAINT "JourneyTask_journeyId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_matchUserId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_userId_fkey";

-- DropForeignKey
ALTER TABLE "SystemMessage" DROP CONSTRAINT "SystemMessage_matchId_fkey";

-- DropForeignKey
ALTER TABLE "SystemMessage" DROP CONSTRAINT "SystemMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationUsers" DROP CONSTRAINT "_ConversationUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationUsers" DROP CONSTRAINT "_ConversationUsers_B_fkey";

-- DropIndex
DROP INDEX "Message_conversationId_createdAt_idx";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "chatUntil",
DROP COLUMN "locked",
DROP COLUMN "typingUpdatedAt",
DROP COLUMN "typingUserId",
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userAId" TEXT NOT NULL,
ADD COLUMN     "userBId" TEXT NOT NULL,
ALTER COLUMN "matchId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "breakdown",
DROP COLUMN "chatUntil",
DROP COLUMN "decideUntil",
DROP COLUMN "decision_userA",
DROP COLUMN "decision_userB",
DROP COLUMN "matchUserId",
DROP COLUMN "quality",
DROP COLUMN "score",
DROP COLUMN "userId",
ADD COLUMN     "matchQuality" TEXT NOT NULL,
ADD COLUMN     "matchScore" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userAId" TEXT NOT NULL,
ADD COLUMN     "userBId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "read",
DROP COLUMN "type",
DROP COLUMN "visibleFrom",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "activityLevel",
DROP COLUMN "ambitionLevel",
DROP COLUMN "boundaryStyle",
DROP COLUMN "children",
DROP COLUMN "communicationStyle",
DROP COLUMN "conflictStyle",
DROP COLUMN "dealbreaker",
DROP COLUMN "emotionalPace",
DROP COLUMN "energyStyle",
DROP COLUMN "financialStyle",
DROP COLUMN "futureWish",
DROP COLUMN "giveStyle",
DROP COLUMN "imageUrl",
DROP COLUMN "intimacyStyle",
DROP COLUMN "jobStatus",
DROP COLUMN "lifeDirection",
DROP COLUMN "lifePace",
DROP COLUMN "lifeRhythm",
DROP COLUMN "livingSituation",
DROP COLUMN "longTermExpectation",
DROP COLUMN "loveLanguage",
DROP COLUMN "name",
DROP COLUMN "needStyle",
DROP COLUMN "physicalComfort",
DROP COLUMN "physicalImportance",
DROP COLUMN "planningStyle",
DROP COLUMN "preferredAgeMax",
DROP COLUMN "preferredAgeMin",
DROP COLUMN "relationshipExpectation",
DROP COLUMN "seeking",
DROP COLUMN "socialLevel",
DROP COLUMN "structureStyle",
DROP COLUMN "travelStyle",
DROP COLUMN "weekendStyle",
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "hashedPassword" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "salt" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "BliKjentCard";

-- DropTable
DROP TABLE "Journey";

-- DropTable
DROP TABLE "JourneyTask";

-- DropTable
DROP TABLE "MatchRequest";

-- DropTable
DROP TABLE "SystemMessage";

-- DropTable
DROP TABLE "_ConversationUsers";

-- DropEnum
DROP TYPE "CardCategory";

-- DropEnum
DROP TYPE "MessageType";

-- CreateTable
CREATE TABLE "Preference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "minAge" INTEGER,
    "maxAge" INTEGER,
    "gender" TEXT[],
    "location" TEXT,
    "interests" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Preference_userId_key" ON "Preference"("userId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
