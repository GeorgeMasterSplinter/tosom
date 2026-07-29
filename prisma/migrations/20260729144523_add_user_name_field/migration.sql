/*
  Warnings:

  - Made the column `age` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "age" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT;
