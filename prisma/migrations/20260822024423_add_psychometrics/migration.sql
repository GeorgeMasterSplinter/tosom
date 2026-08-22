-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "attachment" JSONB,
ADD COLUMN     "bigFive" JSONB,
ADD COLUMN     "emotionRegulation" JSONB,
ADD COLUMN     "psychometricAnswers" JSONB,
ADD COLUMN     "psychometricVersion" TEXT,
ADD COLUMN     "valueProfile" JSONB;
