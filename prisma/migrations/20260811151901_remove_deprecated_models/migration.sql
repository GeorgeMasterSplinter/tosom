/*
  Warnings:

  - You are about to drop the `AIRequestLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MatchFeedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MatchHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MatchQueue` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userAId,userBId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUPPORT';

-- DropForeignKey
ALTER TABLE "MatchFeedback" DROP CONSTRAINT "MatchFeedback_matchId_fkey";

-- DropForeignKey
ALTER TABLE "MatchFeedback" DROP CONSTRAINT "MatchFeedback_userId_fkey";

-- DropForeignKey
ALTER TABLE "MatchHistory" DROP CONSTRAINT "MatchHistory_matchId_fkey";

-- DropForeignKey
ALTER TABLE "MatchQueue" DROP CONSTRAINT "MatchQueue_userId_fkey";

-- DropTable
DROP TABLE "AIRequestLog";

-- DropTable
DROP TABLE "MatchFeedback";

-- DropTable
DROP TABLE "MatchHistory";

-- DropTable
DROP TABLE "MatchQueue";

-- DropEnum
DROP TYPE "AIFeature";

-- DropEnum
DROP TYPE "QueueStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Match_userAId_userBId_key" ON "Match"("userAId", "userBId");
