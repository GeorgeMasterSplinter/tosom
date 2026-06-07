-- CreateTable
CREATE TABLE "BliKjentCard" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BliKjentCard_pkey" PRIMARY KEY ("id")
);
