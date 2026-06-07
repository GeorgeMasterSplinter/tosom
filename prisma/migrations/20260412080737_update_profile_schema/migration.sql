/*
  Warnings:

  - You are about to drop the column `calmVsIntense` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `dailyLife` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `dayRhythm` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `dealbreakers` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `emotionalVsLogical` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `energyDrainers` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `energySources` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `expectations` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `fears` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `futureVision` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `partnerHope` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `proudOf` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `relationshipStatus` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `relaxStyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `selfView` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `structureVsSpontaneity` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `wantChildren` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `wantCohabitation` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `wantMarriage` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `whatIGive` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `whatINeed` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `workingOn` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "calmVsIntense",
DROP COLUMN "dailyLife",
DROP COLUMN "dayRhythm",
DROP COLUMN "dealbreakers",
DROP COLUMN "email",
DROP COLUMN "emotionalVsLogical",
DROP COLUMN "energyDrainers",
DROP COLUMN "energySources",
DROP COLUMN "expectations",
DROP COLUMN "fears",
DROP COLUMN "futureVision",
DROP COLUMN "height",
DROP COLUMN "location",
DROP COLUMN "partnerHope",
DROP COLUMN "phone",
DROP COLUMN "proudOf",
DROP COLUMN "relationshipStatus",
DROP COLUMN "relaxStyle",
DROP COLUMN "selfView",
DROP COLUMN "structureVsSpontaneity",
DROP COLUMN "wantChildren",
DROP COLUMN "wantCohabitation",
DROP COLUMN "wantMarriage",
DROP COLUMN "whatIGive",
DROP COLUMN "whatINeed",
DROP COLUMN "workingOn",
ADD COLUMN     "ambitionLevel" TEXT,
ADD COLUMN     "boundaryStyle" TEXT,
ADD COLUMN     "communicationStyle" TEXT,
ADD COLUMN     "dealbreaker" TEXT,
ADD COLUMN     "emotionalPace" TEXT,
ADD COLUMN     "energyStyle" TEXT,
ADD COLUMN     "futureWish" TEXT,
ADD COLUMN     "giveStyle" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "intimacyStyle" TEXT,
ADD COLUMN     "lifeDirection" TEXT,
ADD COLUMN     "lifePace" TEXT,
ADD COLUMN     "lifeRhythm" TEXT,
ADD COLUMN     "livingSituation" TEXT,
ADD COLUMN     "longTermExpectation" TEXT,
ADD COLUMN     "needStyle" TEXT,
ADD COLUMN     "physicalComfort" TEXT,
ADD COLUMN     "physicalImportance" TEXT,
ADD COLUMN     "preferredAgeMax" INTEGER,
ADD COLUMN     "preferredAgeMin" INTEGER,
ADD COLUMN     "relationshipExpectation" TEXT,
ADD COLUMN     "structureStyle" TEXT;
