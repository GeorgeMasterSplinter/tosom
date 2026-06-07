/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Message` table. All the data in the column will be lost.
  - Added the required column `chatUntil` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('system', 'user');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "chatUntil" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "imageUrl",
ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'user',
ADD COLUMN     "visibleFrom" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");
