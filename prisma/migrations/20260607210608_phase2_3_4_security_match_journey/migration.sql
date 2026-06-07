-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('PENDING', 'MATCHED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AdminAction" AS ENUM ('USER_BAN', 'USER_UNBAN', 'USER_VERIFY', 'USER_DEACTIVATE', 'USER_ACTIVATE', 'CONTENT_DELETE', 'JOURNEY_RESET', 'CONVERSATION_FREEZE', 'SYSTEM_ALERT', 'SETTINGS_CHANGE');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('USER_BAN', 'USER_UNBAN', 'USER_VERIFY', 'USER_DEACTIVATE', 'USER_ACTIVATE', 'CONTENT_DELETE', 'JOURNEY_RESET', 'CONVERSATION_FREEZE', 'ADMIN_LOGIN', 'TWOFA_ENABLE', 'TWOFA_DISABLE', 'ADMIN_SETTINGS_CHANGE', 'PASSWORD_RESET');

-- AlterEnum
ALTER TYPE "MatchStatus" ADD VALUE 'pending';

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "matchId" TEXT;

-- AlterTable
ALTER TABLE "JourneyProgress" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "continueA" TEXT,
ADD COLUMN     "continueB" TEXT,
ADD COLUMN     "pausedAt" TIMESTAMP(3),
ADD COLUMN     "resumedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "JourneyStep" ADD COLUMN     "dynamic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "reviewed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bannedAt" TIMESTAMP(3),
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "MatchQueue" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "QueueStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchQueue_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "JourneyMilestone" (
    "id" TEXT NOT NULL,
    "progressId" TEXT,
    "day" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JourneyMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TwoFactorSecret" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "backupCodes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TwoFactorSecret_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MatchQueue_userId_idx" ON "MatchQueue"("userId");

-- CreateIndex
CREATE INDEX "MatchQueue_status_idx" ON "MatchQueue"("status");

-- CreateIndex
CREATE INDEX "MatchQueue_createdAt_idx" ON "MatchQueue"("createdAt");

-- CreateIndex
CREATE INDEX "MatchFeedback_matchId_idx" ON "MatchFeedback"("matchId");

-- CreateIndex
CREATE INDEX "MatchFeedback_userId_idx" ON "MatchFeedback"("userId");

-- CreateIndex
CREATE INDEX "MatchFeedback_rating_idx" ON "MatchFeedback"("rating");

-- CreateIndex
CREATE INDEX "JourneyMilestone_progressId_idx" ON "JourneyMilestone"("progressId");

-- CreateIndex
CREATE INDEX "JourneyMilestone_day_idx" ON "JourneyMilestone"("day");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_tokenHash_idx" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorSecret_userId_key" ON "TwoFactorSecret"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorSecret_secret_key" ON "TwoFactorSecret"("secret");

-- CreateIndex
CREATE INDEX "AuditLog_adminId_idx" ON "AuditLog"("adminId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Conversation_userAId_userBId_idx" ON "Conversation"("userAId", "userBId");

-- CreateIndex
CREATE INDEX "Conversation_matchId_idx" ON "Conversation"("matchId");

-- CreateIndex
CREATE INDEX "Conversation_endedAt_idx" ON "Conversation"("endedAt");

-- CreateIndex
CREATE INDEX "JourneyProgress_userId_idx" ON "JourneyProgress"("userId");

-- CreateIndex
CREATE INDEX "Match_status_idx" ON "Match"("status");

-- CreateIndex
CREATE INDEX "Match_userAId_idx" ON "Match"("userAId");

-- CreateIndex
CREATE INDEX "Match_userBId_idx" ON "Match"("userBId");

-- CreateIndex
CREATE INDEX "Match_createdAt_idx" ON "Match"("createdAt");

-- CreateIndex
CREATE INDEX "Match_expiresAt_idx" ON "Match"("expiresAt");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "MatchQueue" ADD CONSTRAINT "MatchQueue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchFeedback" ADD CONSTRAINT "MatchFeedback_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchFeedback" ADD CONSTRAINT "MatchFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyMilestone" ADD CONSTRAINT "JourneyMilestone_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "JourneyProgress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TwoFactorSecret" ADD CONSTRAINT "TwoFactorSecret_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
