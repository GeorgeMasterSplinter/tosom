-- CreateEnum
CREATE TYPE "JourneyDecision" AS ENUM ('PENDING', 'FOUND_EACH_OTHER', 'NEW_JOURNEY');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN "completionA" "JourneyDecision" NOT NULL DEFAULT 'PENDING', ADD COLUMN "completionADecidedAt" TIMESTAMP(3), ADD COLUMN "completionB" "JourneyDecision" NOT NULL DEFAULT 'PENDING', ADD COLUMN "completionBDecidedAt" TIMESTAMP(3);
