/**
 * resonanceScore.ts — Resonans-basert matching basert på dyp profil
 *
 * Core-definition: ToSom måler resonans — ikke match score.
 * Resonans er sammenfallende verdier, emosjonell dybde, og personlighet-kompatibilitet.
 * Ingen foto-basert scoring. Ingen offentlige profiler.
 */

import { Prisma } from "@prisma/client";

export interface ResonanceInput {
  profileA: Record<string, unknown>;
  profileB: Record<string, unknown>;
}

export interface ResonanceResult {
  resonanceScore: number;
  breakdown: {
    values: number;
    personality: number;
    relationshipStyle: number;
    communication: number;
    futureVision: number;
    boundaries: number;
    emotionalNeeds: number;
    lifeRhythm: number;
    maturity: number;
  };
  resonanceLevel: "GENTLE" | "MODERATE" | "STRONG" | "DEEP";
}

/**
 * Beregner resonans mellom to profiler basert på dype profil-dimensjoner.
 * Returnerer score 0-100 der høyere = dypere resonans.
 */
export function calculateResonance(a: Record<string, unknown>, b: Record<string, unknown>): ResonanceResult {
  let totalScore = 0;

  // 1. Verdier (values) — 25% vekt
  const valuesScore = valueResonance(a, b);
  totalScore += valuesScore * 0.25;

  // 2. Personlighet (personality) — 20% vekt
  const personalityScore = personalityResonance(a, b);
  totalScore += personalityScore * 0.20;

  // 3. Forholdsstil (relationship style) — 15% vekt
  const relStyleScore = relationshipStyleResonance(a, b);
  totalScore += relStyleScore * 0.15;

  // 4. Kommunikasjon (communication) — 15% vekt
  const commScore = communicationResonance(a, b);
  totalScore += commScore * 0.15;

  // 5. Fremtidens visjon (future vision) — 10% vekt
  const futureScore = futureVisionResonance(a, b);
  totalScore += futureScore * 0.10;

  // 6. Grenser (boundaries) — 5% vekt
  const boundaryScore = boundaryResonance(a, b);
  totalScore += boundaryScore * 0.05;

  // 7. Emosjonelle behov (emotional needs) — 5% vekt
  const emotionalScore = emotionalNeedsResonance(a, b);
  totalScore += emotionalScore * 0.05;

  // 8. Livsrytme (life rhythm) — 3% vekt
  const rhythmScore = lifeRhythmResonance(a, b);
  totalScore += rhythmScore * 0.03;

  // 9. Modenhet/trygghet (maturity) — 2% vekt
  const maturityScore = maturityResonance(a, b);
  totalScore += maturityScore * 0.02;

  // Avrund
  const resonanceScore = Math.round(totalScore);

  // Determiner resonansnivå
  const resonanceLevel = getResonanceLevel(resonanceScore);

  return {
    resonanceScore,
    breakdown: {
      values: Math.round(valuesScore),
      personality: Math.round(personalityScore),
      relationshipStyle: Math.round(relStyleScore),
      communication: Math.round(commScore),
      futureVision: Math.round(futureScore),
      boundaries: Math.round(boundaryScore),
      emotionalNeeds: Math.round(emotionalScore),
      lifeRhythm: Math.round(rhythmScore),
      maturity: Math.round(maturityScore),
    },
    resonanceLevel,
  };
}

/**
 * Verdi-resonans: sammenfall mellom kjerneverdier
 */
function valueResonance(a: Record<string, unknown>, b: Record<string, unknown>): number {
  const valuesA = parseJsonArray(a.futureVision);
  const valuesB = parseJsonArray(b.futureVision);
  if (!valuesA.length || !valuesB.length) return 50; // neutral ved manglende data

  const setA = new Set(valuesA.map((v: string) => v.toLowerCase()));
  const setB = new Set(valuesB.map((v: string) => v.toLowerCase()));

  let matches = 0;
  for (const v of setA) {
    if (setB.has(v)) matches++;
  }

  const maxPossible = Math.max(setA.size, setB.size);
  return maxPossible === 0 ? 50 : (matches / maxPossible) * 100;
}

/**
 * Personlighet-resonans: kompatibilitet mellom personlighetstrekk
 */
function personalityResonance(a: Record<string, unknown>, b: Record<string, unknown>): number {
  const traitsA = parseJsonArray(a.personality);
  const traitsB = parseJsonArray(b.personality);
  if (!traitsA.length || !traitsB.length) return 50;

  // Kompatibilitetsmønster: introvert ↔ extrovert kan fungere bra godt
  const compatibilityMap: Record<string, number[]> = {
    introvert: [1, 0.5],    // introvert passer bra med introvert (1.0) og moderat med extrovert (0.5)
    extrovert: [0.5, 1],    // extrovert passer bra med extrovert
    empathetic: [0.8, 0.8], // empatisk passer generelt bra
    analytical: [0.7, 0.9], // analytisk passer bedre med analytisk
    intuitive: [0.9, 0.7],  // intuitiv passer bedre med intuitiv
    practical: [0.6, 0.6],  // praktisk er nøytral
    philosophical: [0.7, 0.7],
  };

  let total = 0;
  let count = 0;
  for (const trait of traitsA) {
    const key = trait.toLowerCase();
    const compat = compatibilityMap[key];
    if (compat) {
      for (const traitB of traitsB) {
        const keyB = traitB.toLowerCase();
        if (compat.includes(0.7)) total += 0.7;
        if (compat.includes(0.9)) total += 0.9;
        count++;
      }
    }
  }

  return count === 0 ? 50 : (total / count) * 100;
}

/**
 * Relasjonsstil-resonans: kompatibilitet mellom relasjonspreferanser
 */
function relationshipStyleResonance(a: Record<string, unknown>, b: Record<string, unknown>): number {
  const styleA = (a.relationshipStyle as string)?.toLowerCase();
  const styleB = (b.relationshipStyle as string)?.toLowerCase();
  if (!styleA || !styleB) return 50;

  // Samme stil = høy resonans
  if (styleA === styleB) return 100;

  // Komplementære stiler
  const complementaryPairs = [
    ["gradual", "direct"],
    ["indirect", "direct"],
    ["independent", "connecting"],
  ];

  for (const [aStyle, bStyle] of complementaryPairs) {
    if ((styleA === aStyle && styleB === bStyle) || (styleA === bStyle && styleB === aStyle)) {
      return 70; // komplementært = bra, men ikke perfekt
    }
  }

  return 40; // ulik = moderat resonans
}

/**
 * Kommunikasjon-resonans: sammenfall i kommunikasjonspreferanser
 */
function communicationResonance(a: Record<string, unknown>, b: Record<string, unknown>): number {
  const commA = parseJsonArray(a.communication);
  const commB = parseJsonArray(b.communication);
  if (!commA.length || !commB.length) return 50;

  const setA = new Set(commA.map((c: string) => c.toLowerCase()));
  const setB = new Set(commB.map((c: string) => c.toLowerCase()));

  let matches = 0;
  for (const c of setA) {
    if (setB.has(c)) matches++;
  }

  const maxPossible = Math.max(setA.size, setB.size);
  return maxPossible === 0 ? 50 : (matches / maxPossible) * 100;
}

/**
 * Fremtidsvisjon-resonans: sammenfall i livsmål
 */
function futureVisionResonance(a: Record<string, unknown>, b: Record<string, unknown>): number {
  const futureA = parseJsonArray(a.futureVision);
  const futureB = parseJsonArray(b.futureVision);
  if (!futureA.length || !futureB.length) return 50;

  const setA = new Set(futureA.map((f: string) => f.toLowerCase()));
  const setB = new Set(futureB.map((f: string) => f.toLowerCase()));

  let matches = 0;
  for (const f of setA) {
    if (setB.has(f)) matches++;
  }

  const maxPossible = Math.max(setA.size, setB.size);
  return maxPossible === 0 ? 50 : (matches / maxPossible) * 100;
}

/**
 * Grense-resonans: respekt for hverandres grenser
 */
function boundaryResonance(a: Record<string, unknown>, b: Record<string, unknown>): number {
  const boundsA = parseJsonArray(a.boundaries);
  const boundsB = parseJsonArray(b.boundaries);
  if (!boundsA.length || !boundsB.length) return 50;

  // Hvis begge har "slow-pace" som grense, det er en sterk indikator på resonans
  const slowPaceMatch = boundsA.some((b: string) => b.toLowerCase().includes("slow")) &&
    boundsB.some((b: string) => b.toLowerCase().includes("slow"));

  if (slowPaceMatch) return 85;

  // Ellers sjekk overlapping
  const setA = new Set(boundsA.map((b: string) => b.toLowerCase()));
  const setB = new Set(boundsB.map((b: string) => b.toLowerCase()));

  let matches = 0;
  for (const b of setA) {
    if (setB.has(b)) matches++;
  }

  const maxPossible = Math.max(setA.size, setB.size);
  return maxPossible === 0 ? 50 : (matches / maxPossible) * 100;
}

/**
 * Emosjonelle behov-resonans: støtte hverandres behov
 */
function emotionalNeedsResonance(a: Record<string, unknown>, b: Record<string, unknown>): number {
  const needsA = parseJsonArray(a.emotionalNeeds);
  const needsB = parseJsonArray(b.emotionalNeeds);
  if (!needsA.length || !needsB.length) return 50;

  // Hvis begge trenger "depth" eller "understanding", det er en sterk resonans-indikator
  const depthMatch = needsA.some((n: string) => n.toLowerCase().includes("depth")) &&
    needsB.some((n: string) => n.toLowerCase().includes("depth"));

  if (depthMatch) return 80;

  const setA = new Set(needsA.map((n: string) => n.toLowerCase()));
  const setB = new Set(needsB.map((n: string) => n.toLowerCase()));

  let matches = 0;
  for (const n of setA) {
    if (setB.has(n)) matches++;
  }

  const maxPossible = Math.max(setA.size, setB.size);
  return maxPossible === 0 ? 50 : (matches / maxPossible) * 100;
}

/**
 * Livsrytme-resonans: samkjørte livsstiler
 */
function lifeRhythmResonance(a: Record<string, unknown>, b: Record<string, unknown>): number {
  const rhythmA = (a.lifeRhythm as string)?.toLowerCase();
  const rhythmB = (b.lifeRhythm as string)?.toLowerCase();
  if (!rhythmA || !rhythmB) return 50;

  if (rhythmA === rhythmB) return 100;

  // Komplementære rytmer (morgen/kveld)
  const complementaryRhythms = [
    ["morning", "evening"],
    ["fast", "slow"],
  ];

  for (const [aRhythm, bRhythm] of complementaryRhythms) {
    if ((rhythmA === aRhythm && rhythmB === bRhythm) || (rhythmA === bRhythm && rhythmB === aRhythm)) {
      return 60;
    }
  }

  return 40;
}

/**
 * Modenhets-resonans: kompatibilitet i modenhetsnivå/trygghet
 */
function maturityResonance(a: Record<string, unknown>, b: Record<string, unknown>): number {
  const matA = (a.maturityLevel as number);
  const matB = (b.maturityLevel as number);
  if (!matA || !matB) return 50;

  const diff = Math.abs(matA - matB);

  // Nære modenhetsnivå = høyere resonans
  if (diff <= 1) return 100;
  if (diff <= 2) return 80;
  if (diff <= 3) return 60;

  return 40;
}

/**
 * Bestem resonansnivå basert på total score
 */
function getResonanceLevel(score: number): "GENTLE" | "MODERATE" | "STRONG" | "DEEP" {
  if (score >= 80) return "DEEP";
  if (score >= 60) return "STRONG";
  if (score >= 40) return "MODERATE";
  return "GENTLE";
}

/**
 * Hjelpefunksjon for å parse JSON-felt trygt
 */
function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [value];
    } catch {
      return [value];
    }
  }
  if (typeof value === "object" && value !== null) {
    return parseJsonArray(JSON.stringify(value));
  }
  return [];
}