-- CreateTable
CREATE TABLE "JourneyTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JourneyTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JourneyTask" ADD CONSTRAINT "JourneyTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
