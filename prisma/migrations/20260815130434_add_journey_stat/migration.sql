-- CreateTable
CREATE TABLE "JourneyStat" (
    "id" TEXT NOT NULL,
    "endedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "outcome" TEXT NOT NULL,
    "daysCompleted" INTEGER NOT NULL,
    "messageCount" INTEGER NOT NULL,
    "bothActive" BOOLEAN NOT NULL,
    "resonanceLevel" TEXT NOT NULL,
    "ageBandA" TEXT NOT NULL,
    "ageBandB" TEXT NOT NULL,
    "distanceBand" TEXT NOT NULL,
    "usedBliKjent" BOOLEAN NOT NULL,

    CONSTRAINT "JourneyStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JourneyStat_endedAt_idx" ON "JourneyStat"("endedAt");

-- CreateIndex
CREATE INDEX "JourneyStat_outcome_idx" ON "JourneyStat"("outcome");
