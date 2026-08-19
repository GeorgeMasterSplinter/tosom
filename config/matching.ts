// config/matching.ts — Konfigurasjon for matching og reise
// Vekter er no den eine sanne kjelda i lib/matching/weightConfig.ts
// Dette filen er ein tynn wrapper for oppskriften og reglar.

// OBSOLETT: brukes ingen steder i app/lib/components/hooks (verifisert v8 steg 2.1)
// Beholdt for bakoverkompatibilitet — ikke slett uten å sjekke alle importsteder
export const MATCH_DELAY_HOURS = 24;
export const CHAT_PHASE_DAYS = 30;
export const DECISION_PHASE_DAYS = 30;

// B6 — Kohort-basert matcherunde
// v8: senket fra 20 til 2 — ukentlig kadens krever at runden kjører selv med få i kø.
// MIN_SCORE (40) er uendret: to som scorer 22 skal ikke kobles bare fordi de er de eneste.
export const MIN_COHORT_SIZE = 2;
// M-2: MAX_QUEUE_WAIT_HOURS (72) var død logikk — under ukentlig kadens er alle >72 t,
// og porten kunne aldri produsere et par. Køalderen brukes nå som observasjon (>14 d).

// B0.3 — Minste tillatte resonansscore (0–100 skala, unifiedScore)
export const MIN_SCORE = 40;

// MATCH_WEIGHTS er no definert i lib/matching/weightConfig.ts
// og skal IKKE ha eigne verdiar her — berre eksportert for bakoverkompatibilitet
// Ny vekter (0.35, 0.25, 0.20, 0.10, 0.10) finst i weightConfig.ts
// Dette er berre ei alias for legacy-importar som krev MATCH_WEIGHTS
export const MATCH_WEIGHTS = {
  base: 0.35,
  resonance: 0.25,
  semantic: 0.20,
  intimacy: 0.10,
  future: 0.10,
};
