// lib/matching/unifiedScorer.ts — EINTILT SCORING-SYSTEM for ToSom
//
// SIKKERHET: Én kilde for all scoring. Både engine.ts (API) og findBestResonance.ts (cron)
// bruker denne motoren. Ingen duplisering, ingen inkonsistens.
//
// FORSKNINGSMOTOR F-8: Ni dimensjoner → seks, med vektene fra §7.
// Kvar dimensjon bruker psykometriske skårer når begge profiler har dei;
// ellers faller vi tilbake til dagens ordoverlapp. Ingen bruker blir utan score.
//
// Dimensjoner (6): values, attachment, personality, communication,
//   emotionRegulation, lifeSituation
//
// Skala: 0-100 (høyere = dypere resonans)

import { ProfileData } from "./types";
import { ResonanceLevel } from "@prisma/client";
// M-1: Én kilde for resonansterskler — nivået kjem frå toResonanceLevel (kanonisk 80/65/50/40).
import { toResonanceLevel } from "./resonanceLevel";
// FORSKNINGSMOTOR F-7: ein funksjon per dimensjon.
import {
  scoreAttachmentCompat,
  scorePersonalityCompat,
  scoreValueCompat,
  scoreEmotionRegCompat,
  scoreCommunicationCompat,
  scoreLifeSituationCompat,
} from "./dimensions";
import type {
  AttachmentScores,
  BigFiveScores,
  ValueProfile,
  ERScores,
  CommScores,
} from "@/lib/psychometrics/scoring";

/* ---------- OUTPUT TYPES ---------- */

export interface UnifiedBreakdown {
  values: number;            // Verdier (PVQ-10 korrelasjon)
  attachment: number;        // Tilknytning (engstelig/unnvikende-matrise)
  personality: number;       // Personlighet (BFI-10, per trekk)
  communication: number;     // Kommunikasjon (Gottman-prinsipper)
  emotionRegulation: number; // Emosjonsregulering (ERQ-6)
  lifeSituation: number;     // Livssituasjon (praktisk kompatibilitet)
}

export interface UnifiedResult {
  score: number;             // Total score [0-100]
  breakdown: UnifiedBreakdown;
  level: MatchLevel;
}

// M-1: Bruker Prisma-enumen ResonanceLevel (samme verdier som før), ikke en
// separat string-union — slik at tersklene kjem éin stad: toResonanceLevel().
export type MatchLevel = ResonanceLevel;

/* ---------- WEIGHTS (summer til 1.0) — §7 ---------- */

export const DIMENSION_WEIGHTS: Record<keyof UnifiedBreakdown, number> = {
  values:            0.25, // Verdier — sterkest prediktor for langsiktig samsvar
  attachment:        0.25, // Tilknytning — best dokumenterte funn i parforskning
  personality:       0.15, // Personlighet — reell men svakare effekt
  communication:     0.15, // Kommunikasjon — Gottmans kjerneområde
  emotionRegulation: 0.10, // Emosjonsregulering — påverkar konflikthåndtering
  lifeSituation:     0.10, // Livssituasjon — praktisk kompatibilitet
};

/* ---------- HOVEDFUNKSJON ---------- */

/**
 * unifiedScore — EINTILT SCORING for to profiler.
 * Aksepterer både ProfileData (engine.ts) og raw JSON (findBestResonance.ts).
 * Returnerer score 0-100 med breakdown i alle 6 dimensjonene.
 */
export function unifiedScore(
  a: ProfileData | Record<string, unknown>,
  b: ProfileData | Record<string, unknown>
): UnifiedResult {
  const pA = normalizeProfile(a);
  const pB = normalizeProfile(b);

  // Beregn alle 6 dimensjonene (hver [0-100]) med fallback.
  const breakdown: UnifiedBreakdown = {
    values:            dimValues(pA, pB),
    attachment:        dimAttachment(pA, pB),
    personality:       dimPersonality(pA, pB),
    communication:     dimCommunication(pA, pB),
    emotionRegulation: dimEmotionRegulation(pA, pB),
    lifeSituation:     dimLifeSituation(pA, pB),
  };

  // Vektet sum [0-100]
  const score = Math.round(
    Object.entries(DIMENSION_WEIGHTS).reduce((sum, [key, weight]) => {
      return sum + (breakdown[key as keyof UnifiedBreakdown] * weight);
    }, 0)
  );

  const clampedScore = clamp(score, 0, 100);
  // M-1: Kanonisk resonansnivå (80/65/50/40) — same funksjon som cron/db bruker.
  const level = toResonanceLevel(clampedScore);

  return { score: clampedScore, breakdown, level };
}

/* ---------- DIMENSJONSFUNKSJONER (psych-first, fallback til ordoverlapp) ---------- */

/** Verdier: PVQ-10-korrelasjon dersom begge har valueProfile, ellers ordoverlapp. */
function dimValues(a: P, b: P): number {
  const vA = readValueProfile(a);
  const vB = readValueProfile(b);
  if (vA && vB) return scoreValueCompat(vA, vB);
  // Fallback (dagens metode): sammenfall mellom kjerneverdier.
  return overlapScore(safeStrings(a.lifeSituation), safeStrings(b.lifeSituation));
}

/** Tilknytning: engstelig/unnvikende-matrise dersom begge har attachment, ellers fallback. */
function dimAttachment(a: P, b: P): number {
  const attA = readAttachment(a);
  const attB = readAttachment(b);
  if (attA && attB) return scoreAttachmentCompat(attA, attB);
  // Fallback: relasjonsstil-overlap som proxy (næraste dagens dimensjon).
  return dimensionRelationshipStyle(a, b);
}

/** Personlighet: BFI-10 per trekk dersom begge har bigFive, ellers ordoverlapp. */
function dimPersonality(a: P, b: P): number {
  const pA = readBigFive(a);
  const pB = readBigFive(b);
  if (pA && pB) return scorePersonalityCompat(pA, pB);
  const tA = safeStrings(a.personality);
  const tB = safeStrings(b.personality);
  if (!tA.length || !tB.length) return 50;
  return overlapScore(tA, tB);
}

/** Kommunikasjon: Gottman-trekk dersom begge har communicationScores, ellers ordoverlapp. */
function dimCommunication(a: P, b: P): number {
  const cA = readCommScores(a);
  const cB = readCommScores(b);
  if (cA && cB) return scoreCommunicationCompat(cA, cB);
  const cA2 = safeStrings(a.communication);
  const cB2 = safeStrings(b.communication);
  if (!cA2.length || !cB2.length) return 50;
  const styleA = extractStringProp(a.communication, 'style');
  const styleB = extractStringProp(b.communication, 'style');
  if (styleA && styleB && styleA.toLowerCase() === styleB.toLowerCase()) return 85;
  return overlapScore(cA2, cB2);
}

/** Emosjonsregulering: ERQ-6 dersom begge har emotionRegulation, ellers emosjonelle-behov-overlap. */
function dimEmotionRegulation(a: P, b: P): number {
  const eA = readER(a);
  const eB = readER(b);
  if (eA && eB) return scoreEmotionRegCompat(eA, eB);
  // Fallback: dagens emosjonelle-behov-overlap (nærmaste tilgjelde dimensjon).
  const nA = safeStrings(a.emotionalNeeds);
  const nB = safeStrings(b.emotionalNeeds);
  if (!nA.length || !nB.length) return 50;
  return overlapScore(nA, nB);
}

/** Livssituasjon: praktisk kompatibilitet. Alltid tilgjengeleg (defensiv tolking). */
function dimLifeSituation(a: P, b: P): number {
  return scoreLifeSituationCompat(a as unknown as Record<string, unknown>, b as unknown as Record<string, unknown>);
}

/* ---------- PSYCH-READERS (defensive — manglar data gir null) ---------- */

function readBigFive(p: P): BigFiveScores | null {
  const bf = p.bigFive as Record<string, unknown> | null | undefined;
  if (!bf || typeof bf !== "object") return null;
  const need: Array<keyof BigFiveScores> = [
    "openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism",
  ];
  for (const k of need) if (typeof bf[k] !== "number") return null;
  return bf as unknown as BigFiveScores;
}

function readAttachment(p: P): AttachmentScores | null {
  const att = p.attachment as Record<string, unknown> | null | undefined;
  if (!att || typeof att !== "object") return null;
  if (typeof att.style !== "string") return null;
  return {
    anxiety: typeof att.anxiety === "number" ? att.anxiety : 3,
    avoidance: typeof att.avoidance === "number" ? att.avoidance : 3,
    style: att.style as AttachmentScores["style"],
  };
}

function readValueProfile(p: P): ValueProfile | null {
  const vp = p.valueProfile as Record<string, unknown> | null | undefined;
  if (!vp || typeof vp !== "object") return null;
  const entries = Object.entries(vp).filter(([, v]) => typeof v === "number");
  if (entries.length === 0) return null;
  return Object.fromEntries(entries) as ValueProfile;
}

function readER(p: P): ERScores | null {
  const er = p.emotionRegulation as Record<string, unknown> | null | undefined;
  if (!er || typeof er !== "object") return null;
  if (typeof er.reappraisal !== "number" || typeof er.suppression !== "number") return null;
  return er as unknown as ERScores;
}

function readCommScores(p: P): CommScores | null {
  // Kommunikationsskår ligg i deepProfileData.communicationScores (F-6).
  const dpd = p.deepProfileData as Record<string, unknown> | null | undefined;
  const cs = dpd?.communicationScores as Record<string, unknown> | null | undefined;
  if (!cs || typeof cs !== "object") return null;
  const entries = Object.entries(cs).filter(([, v]) => typeof v === "number");
  if (entries.length === 0) return null;
  return Object.fromEntries(entries) as CommScores;
}

/* ---------- LEGACY FALLBACK-DIMENSJONER (dagens ordoverlapp) ---------- */

/** Relasjonsstil (fallback for tilknytning): string-match eller complementary. */
function dimensionRelationshipStyle(a: P, b: P): number {
  const sA = String(a.relationshipStyle || '').toLowerCase();
  const sB = String(b.relationshipStyle || '').toLowerCase();
  if (!sA || !sB) return 50;
  if (sA === sB) return 100;
  const pairs = [["gradual", "direct"], ["indirect", "direct"], ["independent", "connecting"]];
  for (const [x, y] of pairs) {
    if ((sA === x && sB === y) || (sA === y && sB === x)) return 70;
  }
  const wordsA = new Set(sA.split(/\s+/));
  const wordsB = new Set(sB.split(/\s+/));
  let matches = 0;
  for (const w of wordsA) { if (wordsB.has(w)) matches++; }
  return matches > 0 ? Math.min(matches * 15, 60) : 40;
}

/* ---------- HJELPEFUNKSJONER ---------- */

interface P {
  lifeSituation?: unknown;
  personality?: unknown;
  relationshipStyle?: unknown;
  communication?: unknown;
  emotionalNeeds?: unknown;
  // FORSKNINGSMOTOR F-8: psykometriske skårer
  bigFive?: unknown;
  attachment?: unknown;
  valueProfile?: unknown;
  emotionRegulation?: unknown;
  deepProfileData?: unknown;
}

function normalizeProfile(p: ProfileData | Record<string, unknown>): P {
  return p as P;
}

/** Trekk string-array frå JSON-felt (håndterer både array og objekt). */
function safeStrings(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    try { return JSON.parse(value); } catch { return [value]; }
  }
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    const arr = extractArrayProp(obj, 'values') || extractArrayProp(obj, 'traits') || extractArrayProp(obj, 'goals');
    if (arr && arr.length > 0) return arr;
    return Object.values(obj).filter(v => typeof v === 'string').map(String);
  }
  return [];
}

function extractStringProp(value: unknown, key: string): string | null {
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    return typeof obj[key] === 'string' ? obj[key] : null;
  }
  return null;
}

function extractArrayProp(value: unknown, key: string): string[] | null {
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    const arr = obj[key];
    if (Array.isArray(arr)) return arr.map(String).filter(Boolean);
  }
  return null;
}

/** Overlap-score mellom to string-arrays (0-100). */
function overlapScore(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 50; // neutral ved manglende data
  const setA = new Set(a.map(s => s.toLowerCase()));
  const setB = new Set(b.map(s => s.toLowerCase()));
  let matches = 0;
  for (const s of setA) { if (setB.has(s)) matches++; }
  const maxPossible = Math.max(setA.size, setB.size);
  return maxPossible === 0 ? 50 : (matches / maxPossible) * 100;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/* ---------- BACKWARD COMPATIBILITY ---------- */

/**
 * calculateTotalScore — wrapper for backwards-kompatibilitet med engine.ts.
 * Returnerer resultat i [0,1] skala (gamle format) med dei 5 sub-scorerne.
 * @deprecated Bruk unifiedScore() direkte for [0-100] skala.
 */
export function calculateTotalScore(
  queryProfile: ProfileData,
  candidateProfile: ProfileData
): {
  breakdown: { base: number; resonance: number; semantic: number; intimacy: number; future: number };
  totalScore: number;
  weights: Record<string, number>;
} {
  const result = unifiedScore(queryProfile, candidateProfile);

  // Kartlegg 6 nye dimensjoner til dei 5 legacy sub-scorerne.
  return {
    breakdown: {
      base:      result.score / 100,
      resonance: result.breakdown.communication / 100,
      semantic:  result.breakdown.values / 100,
      intimacy:  result.breakdown.attachment / 100,
      future:    result.breakdown.emotionRegulation / 100,
    },
    totalScore: result.score / 100,
    weights: { ...DIMENSION_WEIGHTS },
  };
}