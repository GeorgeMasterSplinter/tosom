-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';
