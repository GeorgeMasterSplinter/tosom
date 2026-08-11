// lib/matching/dealbreaker.ts — Harde filtre for matching
// Dealbreakere er essensielle mismatch som automatisk avvise en kandidat

import { ProfileData } from "./types";

/**
 * DealbreakerResult beskriver hva som ble funnet som dealbreaker.
 */
export interface DealbreakerResult {
  hasDealbreaker: boolean;
  reason?: string;
}

/**
 * sjekkMaturityGap — hvis modenhets-gapet er for stort, er det en dealbreaker.
 * Core-definition: modenhetsnivå og trygghet er kritisk for en trygg relasjon.
 */
function checkMaturityGap(a: ProfileData, b: ProfileData): DealbreakerResult {
  if (!a.maturityLevel || !b.maturityLevel) return { hasDealbreaker: false };
  
  const gap = Math.abs(a.maturityLevel - b.maturityLevel);
  if (gap > 4) {
    return {
      hasDealbreaker: true,
      reason: `Modenhets-gap for stort (${a.maturityLevel} vs ${b.maturityLevel})`,
    };
  }
  return { hasDealbreaker: false };
}

/**
 * sjekkLifeRhythmConflict — livsrytme må være kompatibilitet.
 * Morgen vs kveld er en svak dealbreaker.
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
 * sjekkSecurityLevelIncompatibility — sikkerhetsnivå er en AKTIV dealbreaker
 * hvis det er en stor uoverensstemmelse (gap >= 2).
 *
 * ToSom-filosofi: et stort sikkerhetsnivå-gap betyr at to personer har helt
 * ulik trygghetsprofil. Det skaper risiko for misforståelser, utrygghet og
 * dårlig match. Matching-motoren skal beskytte brukerne, ikke gamble.
 */
function checkSecurityLevelGap(a: ProfileData, b: ProfileData): DealbreakerResult {
  if (!a.securityLevel || !b.securityLevel) return { hasDealbreaker: false };
  
  // Tilknytningsnivåer: unsicher (1) → ambivalent (2) → secure (3)
  const levels: Record<string, number> = {
    unsicher: 1,
    ambivalent: 2,
    secure: 3,
  };
  
  const gap = Math.abs(levels[a.securityLevel] - levels[b.securityLevel]);
  if (gap >= 2) {
    // AKTIV dealbreaker: automatisk avvis ved stort trygghetsgap
    return {
      hasDealbreaker: true,
      reason: `Sikkerhetsnivå-gap for stort (${a.securityLevel} vs ${b.securityLevel})`,
    };
  }
  return { hasDealbreaker: false };
}

/**
 * sjekkPreferences — sjekk eksplisitte preferanser i Profile.preferences.
 * Format: { dealbreakers: string[] }
 */
function checkExplicitPreferences(
  a: ProfileData,
  b: ProfileData
): DealbreakerResult {
  if (!a.preferences?.dealbreakers || !Array.isArray(a.preferences.dealbreakers)) {
    return { hasDealbreaker: false };
  }
  
  // Sjekk om kandidatens matchTags overlapper med brukerens dealbreakers
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
 * sjekkBoundaries — sjekker om boundaries (grenser) fra brukeren
 * blir brutt av kandidat.
 */
function checkBoundaries(a: ProfileData, b: ProfileData): DealbreakerResult {
  if (!a.boundaries || !b.boundaries) return { hasDealbreaker: false };
  
  // Sjekk om kandidaten har noen av brukerens eksplisitte grenser
  const aBoundaries = a.boundaries as { excludes?: string[] };
  const bProfile = b.boundaries as { includes?: string[] };
  
  if (aBoundaries?.excludes && Array.isArray(aBoundaries.excludes)) {
    const bIncludes = bProfile?.includes || [];
    for (const excluded of aBoundaries.excludes) {
      if (bIncludes.includes(excluded)) {
        return {
          hasDealbreaker: true,
          reason: `Grense brutt: ${excluded}`,
        };
      }
    }
  }
  
  return { hasDealbreaker: false };
}

/**
 * sjekkAlleDealbreakers — hovedfunksjon som kjører alle dealbreaker-testene.
 * Returnerer resultatet av den første dealbreaker som blir funnet.
 */
export function sjekkAlleDealbreakers(
  queryUser: ProfileData,
  candidate: ProfileData
): DealbreakerResult {
  // 1. Modenhets-gap
  let result = checkMaturityGap(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  // 2. Livsrytme-konflikt
  result = checkLifeRhythmConflict(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  // 3. Eksplisitte preferanser
  result = checkExplicitPreferences(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  // 4. Grenser
  result = checkBoundaries(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  // 5. Security level — AKTIV dealbreaker ved gap >= 2
  result = checkSecurityLevelGap(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  return { hasDealbreaker: false };
}