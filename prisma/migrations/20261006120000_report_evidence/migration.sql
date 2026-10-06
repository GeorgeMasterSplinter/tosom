-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "evidence" JSONB,
ADD COLUMN     "evidenceExpiresAt" TIMESTAMP(3);

