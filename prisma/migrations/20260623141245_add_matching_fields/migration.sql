/*
  Warnings:

  - The values [system_message] on the enum `MessageCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `score` on the `Match` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `gender` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `photos` on the `Profile` table. All the data in the column will be lost.
  - The `method` column on the `RouteHit` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `feature` on the `AIRequestLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `progressId` on table `JourneyMilestone` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `normalizedScore` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Made the column `score` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `metric` on the `PerformanceMetric` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `level` on the `SystemLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DeepProfileStep" AS ENUM ('IDENTITY', 'LIFE_SITUATION', 'LIFESTYLE', 'PERSONALITY', 'RELATIONSHIP_STYLE', 'COMMUNICATION', 'INTIMACY', 'FUTURE_VISION', 'BOUNDARIES', 'SUMMARY');

-- CreateEnum
CREATE TYPE "JourneyState" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ResonanceLevel" AS ENUM ('GENTLE', 'MODERATE', 'STRONG', 'DEEP');

-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('INFO', 'WARN', 'ERROR', 'DEBUG');

-- CreateEnum
CREATE TYPE "PerfMetric" AS ENUM ('api_latency', 'db_latency');

-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE');

-- CreateEnum
CREATE TYPE "AIFeature" AS ENUM ('journeyGuidance', 'matchInsights', 'messageSuggestions', 'profileRewrite');

-- AlterEnum
BEGIN;
CREATE TYPE "MessageCategory_new" AS ENUM ('user', 'system', 'continue_choice', 'image');
ALTER TABLE "Message" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Message" ALTER COLUMN "type" TYPE "MessageCategory_new" USING ("type"::text::"MessageCategory_new");
ALTER TYPE "MessageCategory" RENAME TO "MessageCategory_old";
ALTER TYPE "MessageCategory_new" RENAME TO "MessageCategory";
DROP TYPE "MessageCategory_old";
ALTER TABLE "Message" ALTER COLUMN "type" SET DEFAULT 'user';
COMMIT;

-- DropForeignKey
ALTER TABLE "JourneyMilestone" DROP CONSTRAINT "JourneyMilestone_progressId_fkey";

-- AlterTable
ALTER TABLE "AIRequestLog" DROP COLUMN "feature",
ADD COLUMN     "feature" "AIFeature" NOT NULL;

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "imageShareAllowedAt" TIMESTAMP(3),
ADD COLUMN     "imageShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "JourneyMilestone" ALTER COLUMN "progressId" SET NOT NULL;

-- AlterTable
ALTER TABLE "JourneyProgress" ADD COLUMN     "completedDays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "nextDayAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "acceptedByA" TIMESTAMP(3),
ADD COLUMN     "acceptedByB" TIMESTAMP(3),
ADD COLUMN     "explanation" JSONB,
ADD COLUMN     "lockedAt" TIMESTAMP(3),
ADD COLUMN     "normalizedScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rejectedByA" TIMESTAMP(3),
ADD COLUMN     "rejectedByB" TIMESTAMP(3),
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "resonanceLevel" "ResonanceLevel" NOT NULL DEFAULT 'GENTLE',
ADD COLUMN     "scoringBreakdown" JSONB,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'pending',
ALTER COLUMN "score" SET NOT NULL,
ALTER COLUMN "score" SET DEFAULT 0,
ALTER COLUMN "score" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "PerformanceMetric" DROP COLUMN "metric",
ADD COLUMN     "metric" "PerfMetric" NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "gender",
DROP COLUMN "photos",
ADD COLUMN     "boundaries" JSONB,
ADD COLUMN     "communication" JSONB,
ADD COLUMN     "deepProfileData" JSONB,
ADD COLUMN     "deepProfileStep" "DeepProfileStep" NOT NULL DEFAULT 'IDENTITY',
ADD COLUMN     "emotionalNeeds" JSONB,
ADD COLUMN     "futureVision" JSONB,
ADD COLUMN     "identityName" TEXT,
ADD COLUMN     "intimacy" JSONB,
ADD COLUMN     "lifeRhythm" TEXT,
ADD COLUMN     "lifeSituation" JSONB,
ADD COLUMN     "lifestyle" JSONB,
ADD COLUMN     "matchTags" TEXT[],
ADD COLUMN     "maturityLevel" INTEGER,
ADD COLUMN     "personality" JSONB,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "preferences" JSONB,
ADD COLUMN     "relationshipStyle" TEXT,
ADD COLUMN     "securityLevel" TEXT;

-- AlterTable
ALTER TABLE "RouteHit" DROP COLUMN "method",
ADD COLUMN     "method" "HttpMethod" NOT NULL DEFAULT 'GET';

-- AlterTable
ALTER TABLE "SystemLog" DROP COLUMN "level",
ADD COLUMN     "level" "LogLevel" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deepProfileComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastMatchAt" TIMESTAMP(3),
ADD COLUMN     "lockedUntil" TIMESTAMP(3),
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "phoneVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ResonanceSession" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "emotionalTone" TEXT NOT NULL,
    "depthLevel" INTEGER NOT NULL,
    "responseQuality" TEXT NOT NULL,
    "mutualSharing" BOOLEAN NOT NULL,
    "vulnerability" BOOLEAN NOT NULL,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResonanceSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyDayContent" (
    "id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "theme" TEXT NOT NULL,
    "phase" "JourneyPhase" NOT NULL,
    "reflectionQuestion" TEXT NOT NULL,
    "conversationPrompt" TEXT NOT NULL,
    "task" TEXT,
    "resonanceGoal" TEXT NOT NULL,
    "systemMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JourneyDayContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MagicLinkToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MagicLinkToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhoneVerification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhoneVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "MatchInsight" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "strengths" TEXT NOT NULL,
    "clarity" TEXT NOT NULL,
    "starter" TEXT NOT NULL,
    "model" TEXT,
    "tokensOut" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResonanceSession_conversationId_day_idx" ON "ResonanceSession"("conversationId", "day");

-- CreateIndex
CREATE INDEX "ResonanceSession_conversationId_idx" ON "ResonanceSession"("conversationId");

-- CreateIndex
CREATE INDEX "JourneyDayContent_day_idx" ON "JourneyDayContent"("day");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyDayContent_day_key" ON "JourneyDayContent"("day");

-- CreateIndex
CREATE UNIQUE INDEX "MagicLinkToken_token_key" ON "MagicLinkToken"("token");

-- CreateIndex
CREATE INDEX "MagicLinkToken_email_idx" ON "MagicLinkToken"("email");

-- CreateIndex
CREATE INDEX "MagicLinkToken_token_idx" ON "MagicLinkToken"("token");

-- CreateIndex
CREATE INDEX "MagicLinkToken_expiresAt_idx" ON "MagicLinkToken"("expiresAt");

-- CreateIndex
CREATE INDEX "PhoneVerification_userId_idx" ON "PhoneVerification"("userId");

-- CreateIndex
CREATE INDEX "PhoneVerification_phone_idx" ON "PhoneVerification"("phone");

-- CreateIndex
CREATE INDEX "PhoneVerification_code_idx" ON "PhoneVerification"("code");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "MatchInsight_matchId_key" ON "MatchInsight"("matchId");

-- CreateIndex
CREATE INDEX "MatchInsight_matchId_idx" ON "MatchInsight"("matchId");

-- CreateIndex
CREATE INDEX "MatchInsight_createdAt_idx" ON "MatchInsight"("createdAt");

-- CreateIndex
CREATE INDEX "AIRequestLog_feature_idx" ON "AIRequestLog"("feature");

-- CreateIndex
CREATE INDEX "Conversation_lastMessageAt_idx" ON "Conversation"("lastMessageAt");

-- CreateIndex
CREATE INDEX "Conversation_imageShareAllowedAt_idx" ON "Conversation"("imageShareAllowedAt");

-- CreateIndex
CREATE INDEX "Match_score_idx" ON "Match"("score");

-- CreateIndex
CREATE INDEX "Match_normalizedScore_idx" ON "Match"("normalizedScore");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_readAt_idx" ON "Notification"("readAt");

-- CreateIndex
CREATE INDEX "PerformanceMetric_metric_idx" ON "PerformanceMetric"("metric");

-- CreateIndex
CREATE INDEX "Profile_userId_idx" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "Profile_deepProfileStep_idx" ON "Profile"("deepProfileStep");

-- CreateIndex
CREATE INDEX "Profile_matchTags_idx" ON "Profile"("matchTags");

-- CreateIndex
CREATE INDEX "SystemLog_level_idx" ON "SystemLog"("level");

-- CreateIndex
CREATE INDEX "User_lastMatchAt_idx" ON "User"("lastMatchAt");

-- CreateIndex
CREATE INDEX "User_lockedUntil_idx" ON "User"("lockedUntil");

-- AddForeignKey
ALTER TABLE "JourneyMilestone" ADD CONSTRAINT "JourneyMilestone_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "JourneyProgress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResonanceSession" ADD CONSTRAINT "ResonanceSession_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchInsight" ADD CONSTRAINT "MatchInsight_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
