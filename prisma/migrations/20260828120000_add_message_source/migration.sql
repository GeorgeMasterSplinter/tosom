-- CHAT-POLISH (C-2): kjelde for boble-etikett — 'bli_kjent' | 'oppgave' | null.
-- Fritt tekstfelt (ikkje enum): nye kjelder krev ingen ny migrasjon.
ALTER TABLE "Message" ADD COLUMN "source" TEXT;