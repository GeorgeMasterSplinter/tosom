// lib/psychometrics/scoring.ts — FORSKNINGSMOTOR F-2
//
// Rå svar (1–5) inn, trekkskårer ut. Håndterer reverserte items.
// Én kilde for all beregning av psykometriske skårer.
//
// Skala (se FORSKNINGSMOTOR-v1.0.md §5): 1=Passer ikke … 5=Passer helt.

import { BFI10, ATTACHMENT, PVQ10, ERQ6, COMMUNICATION, Item } from './instruments';

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */

export interface BigFiveScores {
  /** 1–5. Høyere = mer åpen. */
  openness: number;
  /** 1–5. Høyere = mer planmessig. */
  conscientiousness: number;
  /** 1–5. Høyere = mer utadrettet. */
  extraversion: number;
  /** 1–5. Høyere = mer medmenneskelig. */
  agreeableness: number;
  /** 1–5. Høyere = mer nevrotisk. */
  neuroticism: number;
}

export type AttachmentStyle = 'secure' | 'anxious' | 'avoidant' | 'fearful';

export interface AttachmentScores {
  /** 1–5. Høyere = mer engstelig. */
  anxiety: number;
  /** 1–5. Høyere = mer unnvikende. */
  avoidance: number;
  /** Utledet stil (se scoreAttachment). */
  style: AttachmentStyle;
}

/** Verdiprofil: ett 1–5-verdi per Schwartz-verdi. */
export type ValueProfile = Record<string, number>;

export interface ERScores {
  /** 1–5. Høyere = mer kognitiv omtydning. */
  reappraisal: number;
  /** 1–5. Høyere = mer undertrykking. */
  suppression: number;
}

/** Kommunikasjonsskår: ett 1–5-verdi per kommunikasjonstrekk. */
export type CommScores = Record<string, number>;

/** Alle utregnede skårer for én bruker. */
export interface PsychometricScores {
  bigFive: BigFiveScores;
  attachment: AttachmentScores;
  values: ValueProfile;
  emotionRegulation: ERScores;
  communication: CommScores;
}

/* ═══════════════════════════════════════════════════════════
   HJELPERE
   ═══════════════════════════════════════════════════════════ */

/** Reversér ett svar: 6 − s (1↔5, 2↔4, 3↔3). */
function reverse(s: number): number {
  return 6 - s;
}

/**
 * Gjentar ett items svar (reversert om nødvendig), gitt det røde saret.
 * Manglende svar (undefined) behandles som 3 (nøytral) for å ikke kaste.
 */
function effectiveValue(answers: Record<string, number>, item: Item): number {
  const raw = answers[item.id];
  if (raw == null) return 3;
  return item.reversed ? reverse(raw) : raw;
}

/** Gjennomsnitt av effectiveValue for alle items med ett trekk. */
function averageForTrait(
  answers: Record<string, number>,
  items: Item[],
  trait: string,
): number {
  const matching = items.filter((i) => i.trait === trait);
  if (matching.length === 0) return 3;
  const sum = matching.reduce((s, i) => s + effectiveValue(answers, i), 0);
  return Math.round((sum / matching.length) * 100) / 100;
}

/* ═══════════════════════════════════════════════════════════
   SCORING-FUNKSJONER
   ═══════════════════════════════════════════════════════════ */

/**
 * scoreBigFive — BFI-10 (10 items, 2 per trekk).
 * Returnerer 5 akser på 1–5 skala.
 */
export function scoreBigFive(answers: Record<string, number>): BigFiveScores {
  return {
    openness:          averageForTrait(answers, BFI10, 'openness'),
    conscientiousness: averageForTrait(answers, BFI10, 'conscientiousness'),
    extraversion:      averageForTrait(answers, BFI10, 'extraversion'),
    agreeableness:     averageForTrait(answers, BFI10, 'agreeableness'),
    neuroticism:       averageForTrait(answers, BFI10, 'neuroticism'),
  };
}

/**
 * scoreAttachment — 12 egne tilknytnings-items (6 angst + 6 unnvikelse).
 * Utleder tilknytningsstil fra de to akserne:
 *   - begge < 3.0        → 'secure'
 *   - angst over, unnv. under → 'anxious'
 *   - angst under, unnv. over → 'avoidant'
 *   - begge over         → 'fearful'
 */
export function scoreAttachment(answers: Record<string, number>): AttachmentScores {
  const anxiety   = averageForTrait(answers, ATTACHMENT, 'attachment_anxiety');
  const avoidance = averageForTrait(answers, ATTACHMENT, 'attachment_avoidance');

  let style: AttachmentStyle = 'secure';
  if (anxiety >= 3.0 && avoidance >= 3.0)       style = 'fearful';
  else if (anxiety >= 3.0)                      style = 'anxious';
  else if (avoidance >= 3.0)                    style = 'avoidant';
  // else secure (begge < 3.0)

  return { anxiety, avoidance, style };
}

/**
 * scoreValues — PVQ-10 (10 items, 1–3 per Schwartz-verdi).
 * Returnerer ett 1–5-verdi per verdi.
 */
export function scoreValues(answers: Record<string, number>): ValueProfile {
  const traits = Array.from(new Set(PVQ10.map((i) => i.trait)));
  const profile: ValueProfile = {};
  for (const t of traits) {
    profile[t] = averageForTrait(answers, PVQ10, t);
  }
  return profile;
}

/**
 * scoreEmotionRegulation — ERQ-6 (6 items, 3 reappraisal + 3 suppression).
 */
export function scoreEmotionRegulation(answers: Record<string, number>): ERScores {
  return {
    reappraisal: averageForTrait(answers, ERQ6, 'reappraisal'),
    suppression: averageForTrait(answers, ERQ6, 'suppression'),
  };
}

/**
 * scoreCommunication — 6 egne kommunikasjon-items (1 per trekk).
 */
export function scoreCommunication(answers: Record<string, number>): CommScores {
  const traits = Array.from(new Set(COMMUNICATION.map((i) => i.trait)));
  const scores: CommScores = {};
  for (const t of traits) {
    scores[t] = averageForTrait(answers, COMMUNICATION, t);
  }
  return scores;
}

/**
 * scoreAll — beregner alle fem skårer i ett kall.
 * Brukes ved fullført onboarding og lagres i Profilen.
 */
export function scoreAll(answers: Record<string, number>): PsychometricScores {
  return {
    bigFive:           scoreBigFive(answers),
    attachment:        scoreAttachment(answers),
    values:            scoreValues(answers),
    emotionRegulation: scoreEmotionRegulation(answers),
    communication:     scoreCommunication(answers),
  };
}