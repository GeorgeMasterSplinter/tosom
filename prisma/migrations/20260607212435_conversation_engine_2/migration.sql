-- CreateEnum
CREATE TYPE "MessageState" AS ENUM ('SENT', 'DELIVERED', 'READ', 'DELETED');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "frozenAt" TIMESTAMP(3),
ADD COLUMN     "frozenBy" TEXT,
ADD COLUMN     "lastMessageAt" TIMESTAMP(3),
ADD COLUMN     "lastMessagePreview" TEXT,
ADD COLUMN     "unreadCountA" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unreadCountB" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "editedAt" TIMESTAMP(3),
ADD COLUMN     "state" "MessageState" NOT NULL DEFAULT 'SENT';

-- CreateIndex
CREATE INDEX "Conversation_frozenAt_idx" ON "Conversation"("frozenAt");
