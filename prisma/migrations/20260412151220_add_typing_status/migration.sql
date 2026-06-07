-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "typingUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "typingUserId" TEXT;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;
