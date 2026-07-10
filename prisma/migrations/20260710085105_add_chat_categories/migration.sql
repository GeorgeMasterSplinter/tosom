-- CreateEnum
CREATE TYPE "ChatCategoryKey" AS ENUM ('TRYGGHET', 'VERDIER', 'LIVSTIL', 'PERSONLIGHET', 'RELASJONSSTIL', 'KOMMUNIKASJON', 'FRAMTID', 'SARBARHET', 'NAERHEIT', 'FELLES_REISE');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "categoryQuestionId" TEXT;

-- CreateTable
CREATE TABLE "ChatCategory" (
    "id" TEXT NOT NULL,
    "key" "ChatCategoryKey" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatQuestion" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "hint" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatCategory_key_key" ON "ChatCategory"("key");

-- CreateIndex
CREATE INDEX "ChatQuestion_categoryId_sortOrder_idx" ON "ChatQuestion"("categoryId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ChatQuestion_categoryId_text_key" ON "ChatQuestion"("categoryId", "text");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_categoryQuestionId_fkey" FOREIGN KEY ("categoryQuestionId") REFERENCES "ChatQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatQuestion" ADD CONSTRAINT "ChatQuestion_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ChatCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
