-- CreateTable
CREATE TABLE "Quota" (
    "id" TEXT NOT NULL,
    "used" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quota_pkey" PRIMARY KEY ("id")
);

-- F2-2 Backfill: seed 'free_users'-raden med dagens antal gratisordrar.
-- Fra dette tidspunktet er Quota.used porten for kvotegrensa; Order-taljen
-- forblir audit-loggen (admin-panelet les den framleis).
INSERT INTO "Quota" ("id", "used", "updatedAt")
SELECT 'free_users',
       (SELECT COUNT(*) FROM "Order" WHERE "freeQuota" = TRUE AND "status" = 'PAID'),
       CURRENT_TIMESTAMP
ON CONFLICT ("id") DO NOTHING;
