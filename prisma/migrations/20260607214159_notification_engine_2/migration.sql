-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('MATCH', 'MESSAGE', 'JOURNEY', 'SYSTEM', 'ADMIN');

-- CreateEnum
CREATE TYPE "SystemMessageType" AS ENUM ('INFO', 'WARNING', 'ALERT');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "readAt" TIMESTAMP(3),
ADD COLUMN     "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM';

-- AlterTable
ALTER TABLE "SystemMessage" ADD COLUMN     "type" "SystemMessageType" NOT NULL DEFAULT 'INFO';

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");
