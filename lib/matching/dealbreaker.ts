// lib/matching/dealbreaker.ts — Harde filtre for matching
// Dealbreakere er essensielle mismatch som automatisk avvise en kandidat
//
// Inaktive filtre (kodet og testet, men ingen datasource i dagens onboarding):
// livsrytme-konflikt og eksplisitte preferanser/matchTags. De aktiveres
// automatisk når dataene finnes.

import { ProfileData } from "./types";
import { haversineKm } from "./distance";

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
 * checkSecurityLevelGap — sikkerhetsnivå er en AKTIV dealbreaker
 * hvis det er en stor uoverensstemmelse (gap >= 2).
 *
 * ToSom-filosofi: et stort sikkerhetsnivå-gap betyr at to personer har helt
 * ulik trygghetsprofil. Det skaper risiko for misforståelser, utrygghet og
 * dårlig match. Matching-motoren skal beskytte brukerne, ikke gamble.
 *
 * Verdiene har historisk blandet staving (engelsk/tysk: secure/unsicher,
 * norsk legacy: sikker/trygg, usikker/ukomfortabel) → normaliseres.
 * Ukjent/manglende verdi → blokkerer IKKE (forsvarlig, samme mønster som radius).
 */
// Tilknytningsnivåer: usikker (1) → ambivalent (2) → sikker (3)
const SECURITY_LEVELS: Record<string, number> = {
  secure: 3, sikker: 3, trygg: 3,
  ambivalent: 2, ambivalert: 2,
  usikker: 1, unsicher: 1, ukomfortabel: 1,
};

export function securityLevelToNum(level: string): number | null {
  return SECURITY_LEVELS[level.trim().toLowerCase()] ?? null;
}

function checkSecurityLevelGap(a: ProfileData, b: ProfileData): DealbreakerResult {
  const levelA = a.securityLevel ? securityLevelToNum(a.securityLevel) : null;
  const levelB = b.securityLevel ? securityLevelToNum(b.securityLevel) : null;
  // Ukjent eller manglende verdi → kan ikke sjekke, ikke blokkér
  if (levelA == null || levelB == null) return { hasDealbreaker: false };

  const gap = Math.abs(levelA - levelB);
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
 * B1.4: checkRadius — tosidig radius-sjekk (dealbreaker, IKKE scoringsdimensjon).
 *
 * En aktiv preferanse: om brukeren har satt 30 km, er 800 km feil, ikke "litt dårligere".
 * Manglende data (én eller begge mangler koordinater) → IKKE blokkér (unngår å
 * utestenge alle eksisterende brukere som ennå ikke har postnummer). Logges i stedet.
 */
function checkRadius(a: ProfileData, b: ProfileData): DealbreakerResult {
  // Mangler begge koordinater → kan ikke sjekke, ikke blokkér
  if (a.latitude == null || a.longitude == null || b.latitude == null || b.longitude == null) {
    // Logg omfanget av manglende geo-data (hjelp til å vite hvor mange som ikke kan matches på avstand)
    console.log(`[matching] Radius: mangler geo for ${a.userId} lat=${a.latitude} lon=${a.longitude} | ${b.userId} lat=${b.latitude} lon=${b.longitude} — ikke blokkert`);
    return { hasDealbreaker: false };
  }

  const distKm = haversineKm(a.latitude, a.longitude, b.latitude, b.longitude);

  // TOSIDIG: blokkér hvis over A SIN grense ELLER B SIN grense
  if (a.distancePref != null && distKm > a.distancePref) {
    return {
      hasDealbreaker: true,
      reason: `For langt bort (${Math.round(distKm)} km > ${a.distancePref} km grense for ${a.userId})`,
    };
  }
  if (b.distancePref != null && distKm > b.distancePref) {
    return {
      hasDealbreaker: true,
      reason: `For langt bort (${Math.round(distKm)} km > ${b.distancePref} km grense for ${b.userId})`,
    };
  }
  return { hasDealbreaker: false };
}

/**
 * checkGenderSeeking — kjønnspreferanse er en AKTIV dealbreaker (bidireksjonell).
 *
 * Steg 1 i onboarding spør om kjønn og hvem du søker. En bruker som søker
 * kvinner skal ikke matches med en bruker som ikke søker menn — det bryter
 * kjerneløftet om én god match. Åpne valg («Alle kjønner», «Kjemisk
 * tiltrekning» og legacy «begge») matcher ethvert kjent kjønn.
 * Manglende/ukjent verdi → blokkerer IKKE (forsvarlig, samme mønster som radius).
 */
// Kjente kjønn-verdier: UI-et (Mann/Kvinne/Ikke-binær/Genderfluid),
// legacy-onboarding (man/kvinne/annen) og seed-data (male/female) normaliseres.
const GENDER_ALIASES: Record<string, 'man' | 'kvinne' | 'annen'> = {
  man: 'man', mann: 'man', male: 'man',
  kvinne: 'kvinne', female: 'kvinne',
  'ikke-binær': 'annen', 'ikke binær': 'annen', 'non-binær': 'annen', nonbinær: 'annen',
  genderfluid: 'annen', annen: 'annen', annet: 'annen',
};
// Åpne søk-verdier: matcher ethvert kjent kjønn.
const SEEKING_OPEN_ALIASES: Record<string, true> = {
  'alle-kjon': true, 'alle kjønner': true, alle: true, begge: true,
  'kjemisk-tiltrekning': true, 'kjemisk tiltrekning': true,
};

export function normalizeGender(raw: unknown): 'man' | 'kvinne' | 'annen' | null {
  if (typeof raw !== 'string') return null;
  return GENDER_ALIASES[raw.trim().toLowerCase()] ?? null;
}

export function normalizeSeeking(raw: unknown): 'man' | 'kvinne' | 'annen' | 'open' | null {
  if (typeof raw !== 'string') return null;
  const key = raw.trim().toLowerCase();
  // Åpent søk — inkludert legacy «annen»/«annet» (ikke spesifisert)
  if (SEEKING_OPEN_ALIASES[key] || key === 'annen' || key === 'annet') return 'open';
  return GENDER_ALIASES[key] ?? null;
}

function checkGenderSeekingOneWay(seeker: ProfileData, partner: ProfileData): string | null {
  const seekingRaw =
    typeof seeker.lifeSituation?.seekingGender === 'string' ? seeker.lifeSituation.seekingGender : null;
  const seeking = seekingRaw ? normalizeSeeking(seekingRaw) : null;
  // Ukjent/ikke oppgitt søk, eller åpent søk → blokkerer ikke
  if (!seeking || seeking === 'open') return null;

  const partnerRaw =
    typeof partner.lifeSituation?.gender === 'string' ? partner.lifeSituation.gender : null;
  const partnerGender = partnerRaw ? normalizeGender(partnerRaw) : null;
  // Partnerens kjønn ukjent/ikke oppgitt → blokkerer ikke (forsvarlig)
  if (!partnerGender) return null;

  if (partnerGender === seeking) return null;
  return `Kjønnspreferanse: søker «${seekingRaw}», men kandidaten er «${partnerRaw}» (${seeker.userId})`;
}

function checkGenderSeeking(a: ProfileData, b: ProfileData): DealbreakerResult {
  // TOSIDIG: begge parters eksplisitte valg må akseptere den andre
  const reason = checkGenderSeekingOneWay(a, b) ?? checkGenderSeekingOneWay(b, a);
  if (reason) return { hasDealbreaker: true, reason };
  return { hasDealbreaker: false };
}

/**
 * checkAgePreference — alderspreferanse er en AKTIV dealbreaker (bidireksjonell).
 *
 * Steg 1 lar brukeren velge min/maks alder (agePrefMin/agePrefMax i
 * deepProfileData). Kandidatens alder (Profile.age) må ligge i begge parters
 * intervall. Manglende/ugyldig preferanse eller alder → blokkerer IKKE
 * (forsvarlig, samme mønster som radius).
 */
export function toAgeNumber(raw: unknown): number | null {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  if (typeof raw === 'string' && raw.trim() !== '') {
    const n = Number(raw);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function checkAgePreferenceOneWay(seeker: ProfileData, partner: ProfileData): string | null {
  const min = toAgeNumber(seeker.deepProfileData?.agePrefMin);
  const max = toAgeNumber(seeker.deepProfileData?.agePrefMax);
  if (min == null && max == null) return null; // ingen preferanse satt → blokkerer ikke

  const age = toAgeNumber(partner.age);
  if (age == null) return null; // ukjent alder → blokkerer ikke (forsvarlig)

  if (min != null && age < min) {
    return `Alderspreferanse: kandidat er ${age} år, under minste alder ${min} for ${seeker.userId}`;
  }
  if (max != null && age > max) {
    return `Alderspreferanse: kandidat er ${age} år, over maks alder ${max} for ${seeker.userId}`;
  }
  return null;
}

function checkAgePreference(a: ProfileData, b: ProfileData): DealbreakerResult {
  // TOSIDIG: begge parters aldersintervall gjelder
  const reason = checkAgePreferenceOneWay(a, b) ?? checkAgePreferenceOneWay(b, a);
  if (reason) return { hasDealbreaker: true, reason };
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
  // 1. Kjønnspreferanse — det eksplisitte valget fra steg 1 (bidireksjonell)
  let result = checkGenderSeeking(queryUser, candidate);
  if (result.hasDealbreaker) return result;

  // 2. Alderspreferanse — min/maks alder fra steg 1 (bidireksjonell)
  result = checkAgePreference(queryUser, candidate);
  if (result.hasDealbreaker) return result;

  // 3. Modenhets-gap
  result = checkMaturityGap(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  // 4. Livsrytme-konflikt
  result = checkLifeRhythmConflict(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  // 5. Eksplisitte preferanser
  result = checkExplicitPreferences(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  // 6. Grenser
  result = checkBoundaries(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  // 7. Radius — B1.4: aktiv preferanse, tosidig blokkering
  result = checkRadius(queryUser, candidate);
  if (result.hasDealbreaker) return result;

  // 8. Security level — AKTIV dealbreaker ved gap >= 2
  result = checkSecurityLevelGap(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  return { hasDealbreaker: false };
}