-- AlterEnum
ALTER TYPE "MessageCategory" ADD VALUE 'image';

-- CreateTable
CREATE TABLE "PerformanceMetric" (
    "id" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "valueMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerformanceMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteHit" (
    "id" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'GET',
    "status" INTEGER NOT NULL DEFAULT 200,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RouteHit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIRequestLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "tokensIn" INTEGER NOT NULL,
    "tokensOut" INTEGER NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "traceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIRequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PerformanceMetric_route_idx" ON "PerformanceMetric"("route");

-- CreateIndex
CREATE INDEX "PerformanceMetric_metric_idx" ON "PerformanceMetric"("metric");

-- CreateIndex
CREATE INDEX "PerformanceMetric_createdAt_idx" ON "PerformanceMetric"("createdAt");

-- CreateIndex
CREATE INDEX "RouteHit_route_idx" ON "RouteHit"("route");

-- CreateIndex
CREATE INDEX "RouteHit_createdAt_idx" ON "RouteHit"("createdAt");

-- CreateIndex
CREATE INDEX "AIRequestLog_userId_idx" ON "AIRequestLog"("userId");

-- CreateIndex
CREATE INDEX "AIRequestLog_feature_idx" ON "AIRequestLog"("feature");

-- CreateIndex
CREATE INDEX "AIRequestLog_createdAt_idx" ON "AIRequestLog"("createdAt");
