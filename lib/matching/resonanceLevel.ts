// lib/matching/resonanceLevel.ts — Resonansnivå: tall -> ord (B1.5)
//
// I-12: ResonanceLevel beregnes aldri (alle matcher fikk GENTLE), og «Resonans 64»
// er et tall som inviterer til numerisk sammenligning. Her defineres ÉN kilde for
// (a) score->nivå med kanoniske terskler, og (b) kanonisk ord-kopi for brukeren.
//
// TERSKLER (B1.5): >=80 DEEP · 65-79 STRONG · 50-64 MODERATE · 40-49 GENTLE
// M-1: Desse tersklene er ÉN KILDE — unifiedScorer.level, cron/db (toResonanceLevel)
// og alle UI-komponenter bruker denne funksjonen. Den gamle dupliserte getMatchLevel
// (>=80/>=60/>=40) i unifiedScorer.ts er fjerna.
//
// FORSKNINGSMOTOR F-9: DESSE TERSKLERNE MÅ ETTERPRØVES ETTER BETA.
// De er kalibrerte for ordoverlapp-fordelingen. Med dei 6 skåra,
// forskningsbaserte dimensjonane (F-7/F-8) vil scorefordelinga skifte,
// og tersklene kan bli for straume eller for strenge. Fordelinga logges
// no via recordMetric i matcherunden (match.round.score_median / .level)
// slik at vi kan kalibrere tersklene på ny grunnlag i data.
// Invariant I-12 held: brukaren ser alltid ORD, aldri tall.

import { ResonanceLevel } from "@prisma/client";

/**
 * toResonanceLevel — avleser total score (0-100) og returnerer resonansnivået.
 * Nivået er KVALITATIVT: det skal beskrive resonansen, ikke rankes mot andre.
 */
export function toResonanceLevel(score: number): ResonanceLevel {
  if (score >= 80) return ResonanceLevel.DEEP;
  if (score >= 65) return ResonanceLevel.STRONG;
  if (score >= 50) return ResonanceLevel.MODERATE;
  return ResonanceLevel.GENTLE;
}

/**
 * RESONANCE_LABELS — kanonisk ord-kopi. Brukeren ser ORD, aldri tall.
 * Én kilde: alle komponenter (MatchBreakdown, ResonanceMeter, ...) bruker denne.
 */
export const RESONANCE_LABELS: Record<ResonanceLevel, string> = {
  [ResonanceLevel.DEEP]: "Dyp resonans",
  [ResonanceLevel.STRONG]: "Sterk resonans",
  [ResonanceLevel.MODERATE]: "God resonans",
  [ResonanceLevel.GENTLE]: "Rolig resonans",
};

/**
 * resonanceLabel — robust ord-kopi fra et (muligens manglende) nivåfelt.
 * Mangler/ukjent -> default til GENTLE-kopi.
 */
export function resonanceLabel(
  level: ResonanceLevel | string | null | undefined
): string {
  if (!level) return RESONANCE_LABELS[ResonanceLevel.GENTLE];
  const key = level as ResonanceLevel;
  return (
    (RESONANCE_LABELS as Record<string, string>)[key] ??
    RESONANCE_LABELS[ResonanceLevel.GENTLE]
  );
}

/**
 * toDimensionLabel — kvalitativ styrkebeskrivelse for én dimensjon (0-100).
 * Brukes i match-nedbrytningen der brukeren skal se ORD, aldri prosenttall (I-12).
 * Tersklene følger resonansnivåene (80/65/50/40) for konsistens.
 */
export function toDimensionLabel(value: number): string {
  if (value >= 80) return "Svært sterk";
  if (value >= 65) return "Sterk";
  if (value >= 50) return "God";
  if (value >= 40) return "Moderat";
  return "Svak";
}