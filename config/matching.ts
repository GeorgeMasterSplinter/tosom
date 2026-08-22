// config/matching.ts — Konfigurasjon for matching og reise
// Vekting er no den eine sanne kjelda i lib/matching/unifiedScorer.ts (DIMENSION_WEIGHTS).

// MATCH_DELAY_HOURS: brukt i journey-engine-test (verifisert konsument).
export const MATCH_DELAY_HOURS = 24;

// B6 — Kohort-basert matcherunde
// v8: senket fra 20 til 2 — ukentlig kadens krever at runden kjører selv med få i kø.
// MIN_SCORE (40) er uendret: to som scorer 22 skal ikke kobles bare fordi de er de eneste.
export const MIN_COHORT_SIZE = 2;
// M-2: MAX_QUEUE_WAIT_HOURS (72) var død logikk — under ukentlig kadens er alle >72 t,
// og porten kunne aldri produsere et par. Køalderen brukes nå som observasjon (>14 d).

// B0.3 — Minste tillatte resonansscore (0–100 skala, unifiedScore)
export const MIN_SCORE = 40;
