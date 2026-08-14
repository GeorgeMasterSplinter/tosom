/*
  Warnings:

  - The values [pending,matched,unmatched] on the enum `MatchStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `acceptedByA` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `acceptedByB` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `rejectedByA` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `rejectedByB` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `rejectionReason` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the `MatchInsight` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ReportCategory" AS ENUM ('HARASSMENT', 'INAPPROPRIATE', 'SPAM', 'FAKE_PROFILE', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'REVIEWED', 'ACTIONED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- AlterEnum
BEGIN;
CREATE TYPE "MatchStatus_new" AS ENUM ('active', 'ended', 'expired');
ALTER TABLE "Match" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Match" ALTER COLUMN "status" TYPE "MatchStatus_new" USING ("status"::text::"MatchStatus_new");
ALTER TYPE "MatchStatus" RENAME TO "MatchStatus_old";
ALTER TYPE "MatchStatus_new" RENAME TO "MatchStatus";
DROP TYPE "MatchStatus_old";
ALTER TABLE "Match" ALTER COLUMN "status" SET DEFAULT 'active';
COMMIT;

-- DropForeignKey
ALTER TABLE "MatchInsight" DROP CONSTRAINT "MatchInsight_matchId_fkey";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "acceptedByA",
DROP COLUMN "acceptedByB",
DROP COLUMN "rejectedByA",
DROP COLUMN "rejectedByB",
DROP COLUMN "rejectionReason",
ALTER COLUMN "status" SET DEFAULT 'active',
ALTER COLUMN "type" SET DEFAULT 'standard';

-- DropTable
DROP TABLE "MatchInsight";

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reportedId" TEXT NOT NULL,
    "matchId" TEXT,
    "category" "ReportCategory" NOT NULL,
    "description" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 34900,
    "currency" TEXT NOT NULL DEFAULT 'NOK',
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT NOT NULL DEFAULT 'vipps',
    "providerRef" TEXT,
    "freeQuota" BOOLEAN NOT NULL DEFAULT false,
    "withdrawalWaiver" BOOLEAN NOT NULL DEFAULT false,
    "waiverAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_status_createdAt_idx" ON "Report"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Report_reportedId_idx" ON "Report"("reportedId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_providerRef_key" ON "Order"("providerRef");

-- CreateIndex
CREATE INDEX "Order_userId_status_idx" ON "Order"("userId", "status");

-- CreateIndex
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");

-- CreateIndex
CREATE INDEX "WebhookEvent_provider_receivedAt_idx" ON "WebhookEvent"("provider", "receivedAt");
