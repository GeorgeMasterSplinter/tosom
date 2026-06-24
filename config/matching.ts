// config/matching.ts — Konfigurasjon for matching og reise
// Vekter er no den eine sanne kjelda i lib/matching/weightConfig.ts
// Dette filen er ein tynn wrapper for oppskriften og reglar.

export const MATCH_DELAY_HOURS = 24;
export const CHAT_PHASE_DAYS = 30;
export const DECISION_PHASE_DAYS = 30;

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
