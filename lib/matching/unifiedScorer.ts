// lib/matching/unifiedScorer.ts — EINTILT SCORING-SYSTEM for ToSom
//
// SIKKERHET: Én kilde for all scoring. Både engine.ts (API) og findBestResonance.ts (cron)
// bruker denne motoren nå. Ingen duplisering, ingen inkonsistens.
//
// Dimensjoner (9): values, personality, relationshipStyle, communication, futureVision,
//   boundaries, emotionalNeeds, lifeRhythm, maturity
//
// Skala: 0-100 (høyere = dypere resonans)

import { ProfileData } from "./types";
import { ResonanceLevel } from "@prisma/client";
// M-1: Én kilde for resonansterskler — nivået kjem frå toResonanceLevel (kanonisk 80/65/50/40).
import { toResonanceLevel } from "./resonanceLevel";

/* ---------- OUTPUT TYPES ---------- */

export interface UnifiedBreakdown {
  values: number;            // Kjerneverdier
  personality: number;       // Personlighetstrekk
  relationshipStyle: number; // Relasjonsstil
  communication: number;     // Kommunikasjon
  futureVision: number;      // Fremtidsvisjon
  boundaries: number;        // Grenser
  emotionalNeeds: number;    // Emosjonelle behov
  lifeRhythm: number;        // Livsrytme
  maturity: number;          // Modenhet
}

export interface UnifiedResult {
  score: number;             // Total score [0-100]
  breakdown: UnifiedBreakdown;
  level: MatchLevel;
}

// M-1: Brukar Prisma-enumen ResonanceLevel (samme verdiar som før), ikkje ein
// separat string-union — slik at tersklene kjem éin stad: toResonanceLevel().
export type MatchLevel = ResonanceLevel;

/* ---------- WEIGHTS (summer til 1.0) ---------- */

const W: Record<keyof UnifiedBreakdown, number> = {
  values:            0.25, // Verdier — høyest vekt
  personality:       0.20, // Personlighet
  relationshipStyle: 0.15, // Relasjonsstil
  communication:     0.15, // Kommunikasjon
  futureVision:      0.10, // Fremtidsvisjon
  boundaries:        0.05, // Grenser
  emotionalNeeds:    0.05, // Emosjonelle behov
  lifeRhythm:        0.03, // Livsrytme
  maturity:          0.02, // Modenhet
};

/* ---------- HOVEDFUNKSJON ---------- */

/**
 * unifiedScore — EINTILT SCORING for to profiler.
 * Aksepterer både ProfileData (engine.ts) og raw JSON (findBestResonance.ts).
 * Returnerer score 0-100 med breakdown i alle 9 dimensjoner.
 */
export function unifiedScore(
  a: ProfileData | Record<string, unknown>,
  b: ProfileData | Record<string, unknown>
): UnifiedResult {
  const pA = normalizeProfile(a);
  const pB = normalizeProfile(b);

  // Beregn alle 9 dimensjoner (hver [0-100])
  const breakdown: UnifiedBreakdown = {
    values:            dimensionValues(pA, pB),
    personality:       dimensionPersonality(pA, pB),
    relationshipStyle: dimensionRelationshipStyle(pA, pB),
    communication:     dimensionCommunication(pA, pB),
    futureVision:      dimensionFutureVision(pA, pB),
    boundaries:        dimensionBoundaries(pA, pB),
    emotionalNeeds:    dimensionEmotionalNeeds(pA, pB),
    lifeRhythm:        dimensionLifeRhythm(pA, pB),
    maturity:          dimensionMaturity(pA, pB),
  };

  // Vektet sum [0-100]
  const score = Math.round(
    Object.entries(W).reduce((sum, [key, weight]) => {
      return sum + (breakdown[key as keyof UnifiedBreakdown] * weight);
    }, 0)
  );

  const clampedScore = clamp(score, 0, 100);
  // M-1: Kanonisk resonansnivå (80/65/50/40) — same funksjon som cron/db bruker.
  const level = toResonanceLevel(clampedScore);

  return { score: clampedScore, breakdown, level };
}

/* ---------- DIMENsjonsfunksjoner ---------- */

/** Verdier: sammenfall mellom kjerneverdier (lifeSituation.values) */
function dimensionValues(a: P, b: P): number {
  const vA = safeStrings(a.lifeSituation);
  const vB = safeStrings(b.lifeSituation);
  return overlapScore(vA, vB);
}

/** Personlighet: kompatibilitet mellom trekk */
function dimensionPersonality(a: P, b: P): number {
  const tA = safeStrings(a.personality);
  const tB = safeStrings(b.personality);
  if (!tA.length || !tB.length) return 50;
  // Enkel overlap med kompatibilitetsbonus for komplementære trekk
  return overlapScore(tA, tB);
}

/** Relasjonsstil: string-match eller complementary */
function dimensionRelationshipStyle(a: P, b: P): number {
  const sA = String(a.relationshipStyle || '').toLowerCase();
  const sB = String(b.relationshipStyle || '').toLowerCase();
  if (!sA || !sB) return 50;
  if (sA === sB) return 100;
  // Komplementære par
  const pairs = [["gradual", "direct"], ["indirect", "direct"], ["independent", "connecting"]];
  for (const [x, y] of pairs) {
    if ((sA === x && sB === y) || (sA === y && sB === x)) return 70;
  }
  // Delvis match basert på ord-overlap
  const wordsA = new Set(sA.split(/\s+/));
  const wordsB = new Set(sB.split(/\s+/));
  let matches = 0;
  for (const w of wordsA) { if (wordsB.has(w)) matches++; }
  return matches > 0 ? Math.min(matches * 15, 60) : 40;
}

/** Kommunikasjon: sammenfall i preferanser */
function dimensionCommunication(a: P, b: P): number {
  const cA = safeStrings(a.communication);
  const cB = safeStrings(b.communication);
  if (!cA.length || !cB.length) return 50;

  // Sjekk om communication er objekt med style-felt (ProfileData-tilfelle)
  const styleA = extractStringProp(a.communication, 'style');
  const styleB = extractStringProp(b.communication, 'style');
  if (styleA && styleB && styleA.toLowerCase() === styleB.toLowerCase()) return 85;

  return overlapScore(cA, cB);
}

/** Fremtidsvisjon: sammenfall i livsmål */
function dimensionFutureVision(a: P, b: P): number {
  const fA = safeStrings(a.futureVision);
  const fB = safeStrings(b.futureVision);
  if (!fA.length || !fB.length) return 50;

  // Sjekk om futureVision er objekt med goals-felt
  const goalsA = extractArrayProp(a.futureVision, 'goals');
  const goalsB = extractArrayProp(b.futureVision, 'goals');
  if (goalsA && goalsB) {
    // Jaccard-similaritet
    const union = new Set([...goalsA, ...goalsB]).size;
    const shared = goalsA.filter(g => goalsB.includes(g)).length;
    return union > 0 ? (shared / union) * 100 : 50;
  }

  return overlapScore(fA, fB);
}

/** Grenser: respekt for hverandres grenser */
function dimensionBoundaries(a: P, b: P): number {
  const bA = safeStrings(a.boundaries);
  const bB = safeStrings(b.boundaries);
  if (!bA.length || !bB.length) return 50;

  // "slow-pace" bonus (sterk resonans-indikator)
  const slowA = bA.some(s => s.toLowerCase().includes("slow"));
  const slowB = bB.some(s => s.toLowerCase().includes("slow"));
  if (slowA && slowB) return 85;

  // Sjekk om boundaries er objekt med preferredDistance
  const distA = extractStringProp(a.boundaries, 'preferredDistance');
  const distB = extractStringProp(b.boundaries, 'preferredDistance');
  if (distA && distB && distA.toLowerCase() === distB.toLowerCase()) return 85;

  return overlapScore(bA, bB);
}

/** Emosjonelle behov: støtte hverandres behov */
function dimensionEmotionalNeeds(a: P, b: P): number {
  const nA = safeStrings(a.emotionalNeeds);
  const nB = safeStrings(b.emotionalNeeds);
  if (!nA.length || !nB.length) return 50;

  // "depth" bonus (sterk resonans-indikator)
  const depthA = nA.some(s => s.toLowerCase().includes("depth"));
  const depthB = nB.some(s => s.toLowerCase().includes("depth"));
  if (depthA && depthB) return 80;

  // Sjekk om emotionalNeeds er objekt med needs-felt
  const needsA = extractArrayProp(a.emotionalNeeds, 'needs');
  const needsB = extractArrayProp(b.emotionalNeeds, 'needs');
  if (needsA && needsB) {
    const shared = needsA.filter(n => needsB.includes(n)).length;
    const maxPossible = Math.max(needsA.length, needsB.length);
    return maxPossible > 0 ? (shared / maxPossible) * 100 : 50;
  }

  return overlapScore(nA, nB);
}

/** Livsrytme: samkjørte livsstiler */
function dimensionLifeRhythm(a: P, b: P): number {
  const rA = String(a.lifeRhythm || '').toLowerCase();
  const rB = String(b.lifeRhythm || '').toLowerCase();
  if (!rA || !rB) return 50;
  if (rA === rB) return 100;

  // Komplementære rytmer
  const pairs = [["morning", "evening"], ["fast", "slow"]];
  for (const [x, y] of pairs) {
    if ((rA === x && rB === y) || (rA === y && rB === x)) return 60;
  }

  return 40;
}

/** Modenhet: kompatibilitet i modenhetsnivå */
function dimensionMaturity(a: P, b: P): number {
  const mA = Number(a.maturityLevel);
  const mB = Number(b.maturityLevel);
  if (!mA || !mB || isNaN(mA) || isNaN(mB)) return 50;

  const diff = Math.abs(mA - mB);
  if (diff <= 1) return 100;
  if (diff <= 2) return 80;
  if (diff <= 3) return 60;
  return 40;
}

/* ---------- HJELPEFUNKSJONER ---------- */

interface P {
  lifeSituation?: unknown;
  personality?: unknown;
  relationshipStyle?: unknown;
  communication?: unknown;
  futureVision?: unknown;
  boundaries?: unknown;
  emotionalNeeds?: unknown;
  lifeRhythm?: unknown;
  maturityLevel?: unknown;
}

function normalizeProfile(p: ProfileData | Record<string, unknown>): P {
  return p as P;
}

/** Trekk string-array fra JSON-felt (håndterer både array og objekt) */
function safeStrings(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    try { return JSON.parse(value); } catch { return [value]; }
  }
  if (typeof value === "object" && value !== null) {
    // Objekt med felt — trekk verdiene
    const obj = value as Record<string, unknown>;
    const arr = extractArrayProp(obj, 'values') || extractArrayProp(obj, 'traits') || extractArrayProp(obj, 'goals');
    if (arr && arr.length > 0) return arr;
    // Ellers trekk string-verdier fra objektet
    return Object.values(obj).filter(v => typeof v === 'string').map(String);
  }
  return [];
}

/** Hent spesifikk prop fra JSON-felt */
function extractStringProp(value: unknown, key: string): string | null {
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    return typeof obj[key] === 'string' ? obj[key] : null;
  }
  return null;
}

/** Hent spesifikk array-prop fra JSON-felt */
function extractArrayProp(value: unknown, key: string): string[] | null {
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    const arr = obj[key];
    if (Array.isArray(arr)) return arr.map(String).filter(Boolean);
  }
  return null;
}

/** Overlap-score mellom to string-arrays (0-100) */
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
 * Returnerer resultat i [0,1] skala (gamle format).
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

  // Kartlegg 9 dimensjoner til 5 sub-scorers (for backwards-kompatibilitet)
  return {
    breakdown: {
      base:      result.score / 100,         // base ≈ total score
      resonance: result.breakdown.communication / 100,
      semantic:  result.breakdown.values / 100,
      intimacy:  result.breakdown.emotionalNeeds / 100,
      future:    result.breakdown.futureVision / 100,
    },
    totalScore: result.score / 100, // [0-1] for backwards-kompatibilitet med engine.ts
    weights: W as any,
  };
}