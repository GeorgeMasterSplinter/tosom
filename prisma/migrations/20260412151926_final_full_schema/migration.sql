-- AddForeignKey
ALTER TABLE "SystemMessage" ADD CONSTRAINT "SystemMessage_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;
