/*
  Warnings:

  - Added the required column `targetUserId` to the `MatchRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MatchRequest" ADD COLUMN     "decision" TEXT,
ADD COLUMN     "targetUserId" TEXT NOT NULL;
