// config/matching.ts
export const MATCH_DELAY_HOURS = 24;
export const CHAT_PHASE_DAYS = 30;
export const DECISION_PHASE_DAYS = 30;

// 5 vekter som summerer til 1.0 — matchar weightConfig.ts
export const MATCH_WEIGHTS = {
  base: 0.4,
  resonance: 0.3,
  semantic: 0.25,
  intimacy: 0.025,
  future: 0.025,
};
