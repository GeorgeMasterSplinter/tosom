/*
  Warnings:

  - Made the column `name` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "bio" TEXT,
ALTER COLUMN "name" SET NOT NULL;
