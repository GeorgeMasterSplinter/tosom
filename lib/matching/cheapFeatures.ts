// lib/matching/cheapFeatures.ts — F2: Prekalkulerte dealbreaker-sjekk (S1/S3-skaling)
//
// Matcherunden kjørte tidlegare sjekkAlleDealbreakers(A,B) + sjekkAlleDealbreakers(B,A)
// for KVART PAR — med normalisering per par. Med 5 000 i kø er det 12,5 mill. par,
// og normaliseringa per par var flaskehalsen.
//
// Løysinga: normaliser EN GANG per kandidat (O(n)), deretter per par kun
// billige samanlikningar. cheapSjekkAll(A, B) reproduserer NØYAKTIG same
// sekvens og same reason-strenger som:
//
//   sjekkAlleDealbreakers(A, B).reason ?? sjekkAlleDealbreakers(B, A).reason
//
// Grunn: sjekkAlleDealbreakers køyrer 8 sjekk i fast rekkjefølgje og returnerer
// den FØRSTE feilen. Kjønns/alders/modenheit/radius/sikkerheit er symmetriske
// (bilkreftige i seg selve), mens livsrytme/preferanser/grenser er retta —
// derfor 11 steg: A→B-sida si rekkjefølgje, deretter B→A si resterande del.
//
// Identitet er verifisert av __tests__/matching-score-round.test.ts
// (ekvivalens-test: same fixture-matrise gjennom gammal og ny logikk).

import { ProfileData } from './types';
import { haversineKm } from './distance';
import {
  normalizeGender,
  normalizeSeeking,
  toAgeNumber,
  securityLevelToNum,
} from './dealbreaker';

/** Prekalkulerte felt per kandidat — alt som de dyre sjekkane treng. */
export interface CheapFeatures {
  userId: string;
  // 1. Kjønn (reason treng raude strengene + normaliserte verdier)
  genderRaw: string | null;
  genderNorm: 'man' | 'kvinne' | 'annen' | null;
  seekingRaw: string | null;
  seekingNorm: 'man' | 'kvinne' | 'annen' | 'open' | null;
  // 2. Alder
  ageNum: number | null;
  agePrefMin: number | null;
  agePrefMax: number | null;
  // 3. Modenheit
  maturity: number | null;
  // 4. Livsrytme
  lifeRhythm: string | null;
  // 5. Eksplisitte preferanser (A si liste mot B si tag-sett)
  dealbreakers: string[] | null;
  matchTagSet: Set<string>;
  // 6. Grenser
  hasBoundaries: boolean;
  excludes: string[] | null;
  includes: string[];
  // 7. Radius/avstand
  lat: number | null;
  lon: number | null;
  distancePref: number | null;
  // 8. Sikkerhetsnivå
  securityRaw: string | null;
  securityNum: number | null;
}

/**
 * Bygg prekalkulatene en gong per kandidat (O(n) i heile runden,
 * ikke O(n²) per par).
 */
export function buildCheapFeatures(profile: ProfileData): CheapFeatures {
  const lifeSituation = profile.lifeSituation ?? null;
  const seekingRaw =
    lifeSituation && typeof lifeSituation.seekingGender === 'string'
      ? (lifeSituation.seekingGender as string)
      : null;
  const genderRaw =
    lifeSituation && typeof lifeSituation.gender === 'string'
      ? (lifeSituation.gender as string)
      : null;
  const securityRaw =
    typeof profile.securityLevel === 'string' && profile.securityLevel !== ''
      ? profile.securityLevel
      : null;
  const a = profile.boundaries as { excludes?: unknown; includes?: unknown } | null;

  return {
    userId: profile.userId,
    genderRaw,
    genderNorm: genderRaw ? normalizeGender(genderRaw) : null,
    seekingRaw,
    seekingNorm: seekingRaw ? normalizeSeeking(seekingRaw) : null,
    ageNum: toAgeNumber(profile.age),
    agePrefMin: toAgeNumber(profile.deepProfileData?.agePrefMin),
    agePrefMax: toAgeNumber(profile.deepProfileData?.agePrefMax),
    maturity: profile.maturityLevel ?? null,
    lifeRhythm: profile.lifeRhythm ?? null,
    dealbreakers:
      profile.preferences &&
      Array.isArray((profile.preferences as Record<string, unknown>).dealbreakers)
        ? ((profile.preferences as Record<string, unknown>).dealbreakers as string[])
        : null,
    matchTagSet: new Set(profile.matchTags ?? []),
    hasBoundaries: Boolean(profile.boundaries),
    excludes:
      a && Array.isArray(a.excludes) ? (a.excludes as string[]) : null,
    includes: a && Array.isArray(a.includes) ? (a.includes as string[]) : [],
    lat: profile.latitude ?? null,
    lon: profile.longitude ?? null,
    distancePref: profile.distancePref ?? null,
    securityRaw,
    securityNum: securityRaw ? securityLevelToNum(securityRaw) : null,
  };
}

/* ═══════════ Enkeltsjekk — same semantikk og reason-strenger som dealbreaker.ts ═══════════ */

// Same oppositt-par som checkLifeRhythmConflict i dealbreaker.ts
const LIFE_RHYTHM_OPPOSITES: Record<string, string[]> = {
  morning: ['evening'],
  evening: ['morning'],
  fast: ['slow'],
  slow: ['fast'],
};

function genderOneWay(seeker: CheapFeatures, partner: CheapFeatures): string | null {
  if (!seeker.seekingRaw || !seeker.seekingNorm || seeker.seekingNorm === 'open') return null;
  if (!partner.genderRaw || !partner.genderNorm) return null;
  if (partner.genderNorm === seeker.seekingNorm) return null;
  return `Kjønnspreferanse: søker «${seeker.seekingRaw}», men kandidaten er «${partner.genderRaw}» (${seeker.userId})`;
}

function ageOneWay(seeker: CheapFeatures, partner: CheapFeatures): string | null {
  const min = seeker.agePrefMin;
  const max = seeker.agePrefMax;
  if (min == null && max == null) return null;
  const age = partner.ageNum;
  if (age == null) return null;
  if (min != null && age < min) {
    return `Alderspreferanse: kandidat er ${age} år, under minste alder ${min} for ${seeker.userId}`;
  }
  if (max != null && age > max) {
    return `Alderspreferanse: kandidat er ${age} år, over maks alder ${max} for ${seeker.userId}`;
  }
  return null;
}

function maturityGap(a: CheapFeatures, b: CheapFeatures): string | null {
  if (!a.maturity || !b.maturity) return null;
  const gap = Math.abs(a.maturity - b.maturity);
  if (gap > 4) return `Modenhets-gap for stort (${a.maturity} vs ${b.maturity})`;
  return null;
}

function lifeRhythmOneWay(a: CheapFeatures, b: CheapFeatures): string | null {
  if (!a.lifeRhythm || !b.lifeRhythm) return null;
  const conflicting = LIFE_RHYTHM_OPPOSITES[a.lifeRhythm];
  if (conflicting && conflicting.includes(b.lifeRhythm)) {
    return `Inkompatibel livsrytme (${a.lifeRhythm} vs ${b.lifeRhythm})`;
  }
  return null;
}

function explicitPrefsOneWay(a: CheapFeatures, b: CheapFeatures): string | null {
  if (!a.dealbreakers) return null;
  for (const db of a.dealbreakers) {
    if (b.matchTagSet.has(db)) return `Dealbreaker: ${db}`;
  }
  return null;
}

function boundariesOneWay(a: CheapFeatures, b: CheapFeatures): string | null {
  if (!a.hasBoundaries || !b.hasBoundaries) return null;
  if (a.excludes) {
    for (const excluded of a.excludes) {
      if (b.includes.includes(excluded)) return `Grense brutt: ${excluded}`;
    }
  }
  return null;
}

function radiusCheck(a: CheapFeatures, b: CheapFeatures): string | null {
  if (a.lat == null || a.lon == null || b.lat == null || b.lon == null) return null;
  const distKm = haversineKm(a.lat, a.lon, b.lat, b.lon);
  if (a.distancePref != null && distKm > a.distancePref) {
    return `For langt bort (${Math.round(distKm)} km > ${a.distancePref} km grense for ${a.userId})`;
  }
  if (b.distancePref != null && distKm > b.distancePref) {
    return `For langt bort (${Math.round(distKm)} km > ${b.distancePref} km grense for ${b.userId})`;
  }
  return null;
}

function securityGap(a: CheapFeatures, b: CheapFeatures): string | null {
  if (a.securityNum == null || b.securityNum == null) return null;
  const gap = Math.abs(a.securityNum - b.securityNum);
  if (gap >= 2) {
    return `Sikkerhetsnivå-gap for stort (${a.securityRaw} vs ${b.securityRaw})`;
  }
  return null;
}

/**
 * Hovudfunksjon: reproduserer
 *   sjekkAlleDealbreakers(A, B).reason ?? sjekkAlleDealbreakers(B, A).reason
 * med prekalkulat data — ingen normalisering per par.
 *
 * Rekkefølge (må ikke endres uten ekvivalens-test):
 *   1. kjønn (bilkreftig)   2. alder (bilkreftig)   3. modenheit (symmetrisk)
 *   4. livsrytme A→B        5. preferansar A→B      6. grenser A→B
 *   7. radius (bilkreftig)  8. sikkerheit (symmetrisk)
 *   9. livsrytme B→A       10. preferansar B→A     11. grenser B→A
 *
 * @returns reason-strengen til den første dealbreakeren, eller null.
 */
export function cheapSjekkAll(a: CheapFeatures, b: CheapFeatures): string | null {
  return (
    genderOneWay(a, b) ?? genderOneWay(b, a) ??
    ageOneWay(a, b) ?? ageOneWay(b, a) ??
    maturityGap(a, b) ??
    lifeRhythmOneWay(a, b) ??
    explicitPrefsOneWay(a, b) ??
    boundariesOneWay(a, b) ??
    radiusCheck(a, b) ??
    securityGap(a, b) ??
    lifeRhythmOneWay(b, a) ??
    explicitPrefsOneWay(b, a) ??
    boundariesOneWay(b, a)
  );
}