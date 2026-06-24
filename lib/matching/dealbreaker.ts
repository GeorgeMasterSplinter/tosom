// lib/matching/dealbreaker.ts — Harde filter for matching
// Dealbreakers er essensielle mismatch som automatisk avviser ein kandidat

import { ProfileData } from "./types";

/**
 * DealbreakerResult beskriver kva som vart funnen som dealbreaker.
 */
export interface DealbreakerResult {
  hasDealbreaker: boolean;
  reason?: string;
}

/**
 * sjekkMaturityGap — viss modenheits-gapet er for stort, er det ein dealbreaker.
 * Core-definition: modenheit og trygghet er kritisk for ein trygg relasjon.
 */
function checkMaturityGap(a: ProfileData, b: ProfileData): DealbreakerResult {
  if (!a.maturityLevel || !b.maturityLevel) return { hasDealbreaker: false };
  
  const gap = Math.abs(a.maturityLevel - b.maturityLevel);
  if (gap > 4) {
    return {
      hasDealbreaker: true,
      reason: `Modenheits-gap for stort (${a.maturityLevel} vs ${b.maturityLevel})`,
    };
  }
  return { hasDealbreaker: false };
}

/**
 * sjekkLifeRhythmConflict — livsrytme må vere kompatibilit.
 * Morning vs evening er ein svak dealbreaker.
 */
function checkLifeRhythmConflict(a: ProfileData, b: ProfileData): DealbreakerResult {
  if (!a.lifeRhythm || !b.lifeRhythm) return { hasDealbreaker: false };
  
  const opposites: Record<string, string[]> = {
    morning: ["evening"],
    evening: ["morning"],
    fast: ["slow"],
    slow: ["fast"],
  };
  
  const conflicting = opposites[a.lifeRhythm];
  if (conflicting && conflicting.includes(b.lifeRhythm)) {
    return {
      hasDealbreaker: true,
      reason: `Inkompatibel livsrytme (${a.lifeRhythm} vs ${b.lifeRhythm})`,
    };
  }
  return { hasDealbreaker: false };
}

/**
 * sjekkSecurityLevelIncompatibility — sikkerheitsnivå kan vere ein dealbreaker
 * viss det er ein stor uoverensstemming (secure vs unsicher med stort gap).
 */
function checkSecurityLevelGap(a: ProfileData, b: ProfileData): DealbreakerResult {
  if (!a.securityLevel || !b.securityLevel) return { hasDealbreaker: false };
  
  // Secure er kompatible med alt, unsicher+ambivalent kan ha problem
  const levels: Record<string, number> = {
    unsicher: 1,
    ambivalent: 2,
    secure: 3,
  };
  
  const gap = Math.abs(levels[a.securityLevel] - levels[b.securityLevel]);
  if (gap >= 2) {
    // Ikje automatisk dealbreaker, men ein sterk indikator
    return {
      hasDealbreaker: false, // Merk: ikkje dealbreaker, men kan vektast lågare
      reason: `Sikkerheitsnivå-gap (${a.securityLevel} vs ${b.securityLevel})`,
    };
  }
  return { hasDealbreaker: false };
}

/**
 * sjekkPreferences — sjekk eksplisitte preferansar i Profile.preferences.
 * Format: { dealbreakers: string[] }
 */
function checkExplicitPreferences(
  a: ProfileData,
  b: ProfileData
): DealbreakerResult {
  if (!a.preferences?.dealbreakers || !Array.isArray(a.preferences.dealbreakers)) {
    return { hasDealbreaker: false };
  }
  
  // Sjekk om kandidatens matchTags overlapping med brukar sine dealbreakers
  const userTags = new Set(b.matchTags);
  for (const db of a.preferences.dealbreakers) {
    if (userTags.has(db)) {
      return {
        hasDealbreaker: true,
        reason: `Dealbreaker: ${db}`,
      };
    }
  }
  return { hasDealbreaker: false };
}

/**
 * sjekkBoundaries — sjekkar om boundaries (grenser) frå brukaren
 * blir brotne av kandidat.
 */
function checkBoundaries(a: ProfileData, b: ProfileData): DealbreakerResult {
  if (!a.boundaries || !b.boundaries) return { hasDealbreaker: false };
  
  // Sjekk om kandidat har nokon av bruker sine eksplisitte grenser
  const aBoundaries = a.boundaries as { excludes?: string[] };
  const bProfile = b.boundaries as { includes?: string[] };
  
  if (aBoundaries?.excludes && Array.isArray(aBoundaries.excludes)) {
    const bIncludes = bProfile?.includes || [];
    for (const excluded of aBoundaries.excludes) {
      if (bIncludes.includes(excluded)) {
        return {
          hasDealbreaker: true,
          reason: `Grense broten: ${excluded}`,
        };
      }
    }
  }
  
  return { hasDealbreaker: false };
}

/**
 * sjekkAlleDealbreakers — hovudfunksjon som køyrer alle dealbreaker-testar.
 * Returnerer resultatet av den første dealbreaker som blir funnen.
 */
export function sjekkAlleDealbreakers(
  queryUser: ProfileData,
  candidate: ProfileData
): DealbreakerResult {
  // 1. Modenheits-gap
  let result = checkMaturityGap(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  // 2. Livsrytme-konflikt
  result = checkLifeRhythmConflict(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  // 3. Eksplisitte preferansar
  result = checkExplicitPreferences(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  // 4. Grenser
  result = checkBoundaries(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  // 5. Security level (ikkje automatisk dealbreaker, men returnerer info)
  result = checkSecurityLevelGap(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  return { hasDealbreaker: false };
}