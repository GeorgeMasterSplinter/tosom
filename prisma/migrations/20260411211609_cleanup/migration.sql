-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_matchId_fkey";

-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "matchId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MatchRequest" ALTER COLUMN "targetUserId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_ConversationUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ConversationUsers_AB_unique" ON "_ConversationUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ConversationUsers_B_index" ON "_ConversationUsers"("B");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationUsers" ADD CONSTRAINT "_ConversationUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationUsers" ADD CONSTRAINT "_ConversationUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
