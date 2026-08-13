-- STEG B8 — Skjemaopprydding
-- Datamigrering FØR enum endres

-- 1. Normaliser status-verdier
UPDATE "Match" SET status = 'active'  WHERE status IN ('pending','matched');
UPDATE "Match" SET status = 'ended'   WHERE status = 'unmatched';

-- 2. Set type-felt til 'standard' der det er 'pending'
UPDATE "Match" SET type = 'standard' WHERE type = 'pending';

-- 3. Verifiser (kjør manuelt før du fortsetter):
-- SELECT status, count(*) FROM "Match" GROUP BY 1;
-- → skal vise kun: active, ended, expired