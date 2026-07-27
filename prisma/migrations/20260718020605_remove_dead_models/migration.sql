/*
  Warnings:

  - You are about to drop the `ConversationJourney` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JourneyStep` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RateLimitLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RouteHit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConversationJourney" DROP CONSTRAINT "ConversationJourney_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "JourneyStep" DROP CONSTRAINT "JourneyStep_conversationId_fkey";

-- DropTable
DROP TABLE "ConversationJourney";

-- DropTable
DROP TABLE "JourneyStep";

-- DropTable
DROP TABLE "RateLimitLog";

-- DropTable
DROP TABLE "RouteHit";
