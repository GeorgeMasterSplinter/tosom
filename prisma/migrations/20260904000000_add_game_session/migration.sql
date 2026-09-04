-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('TTT', 'RPS');
CREATE TYPE "GameStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateTable
CREATE TABLE "GameSession" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "type" "GameType" NOT NULL,
    "state" JSONB NOT NULL,
    "turn" TEXT,
    "winner" TEXT,
    "status" "GameStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameSession_conversationId_type_status_key" ON "GameSession"("conversationId", "type", "status");
CREATE INDEX "GameSession_conversationId_idx" ON "GameSession"("conversationId");
CREATE INDEX "GameSession_status_idx" ON "GameSession"("status");

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;