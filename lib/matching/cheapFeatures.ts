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
// Grunn: sjekkAlleDealbreakers køyrer 7 sjekk i fast rekkjefølgje og returnerer
// den FØRSTE feilen. Kjønn/alder/barn/radius er symmetriske (bilkreftige i seg
// selve), mens livsrytme/preferanser/grenser er retta — derfor 10 steg:
// A→B-sida si rekkjefølgje, deretter B→A si resterande del.
// (PL-10: modenheit og sikkerheit er fjerna frå sjekkane — syntetiske data.)
//
// Identitet er verifisert av __tests__/matching-score-round.test.ts
// (ekvivalens-test: same fixture-matrise gjennom gammal og ny logikk).

import { ProfileData } from './types';
import { haversineKm } from './distance';
import {
  normalizeGender,
  normalizeSeeking,
  toAgeNumber,
  readLivsstil2026Gated,
  HEIGHT_GAP_CM,
  LIVSSTIL2026_KOMPAT,
  type Livsstil2026Data,
  parseReligionList,
  religionKey,
  religionReason,
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
  // 3. Barn (PL-11, D-3: kun «ja» vs «nei» blokkerer)
  wantChildren: Set<string> | null;
  // LIVSSTIL-2026 (D-1): høyde (lifestyle.height) — mann–kvinne-gate
  heightNum: number | null;
  // LIVSSTIL-2026 (D-4): «må stemme»-feltene fra preferences.livsstil2026
  livsstil2026: Livsstil2026Data | null;
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
  // Lansering: religion/livssyn — hard kompatibilitet (brukerdefinert akseptliste)
  religionOwn: string[];             // sin egen religion (target-side, for reason + snitt)
  religionOwnKeys: Set<string>;      // sin egen religion som nøkler
  religionAcceptedKeys: Set<string>; // sin akseptliste som nøkler (tom = ingen begrensning)
  religionOpen: boolean;             // OPEN TO ALL (Phase 1.5) — eksplisitt, ikke MISSING
  // PL-10 (V-1): maturity/securityRaw/securityNum fjerna — sjekkane er inaktive
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
  const a = profile.boundaries as { excludes?: unknown; includes?: unknown } | null;

  // Lansering: religion/livssyn — prekalkuler egen religion + akseptliste en gang per kandidat.
  const dp = profile.deepProfileData ?? null;
  const religionOwn = parseReligionList(dp?.religion);
  const religionAccepted = parseReligionList(dp?.acceptedReligions);

  return {
    userId: profile.userId,
    genderRaw,
    genderNorm: genderRaw ? normalizeGender(genderRaw) : null,
    seekingRaw,
    seekingNorm: seekingRaw ? normalizeSeeking(seekingRaw) : null,
    ageNum: toAgeNumber(profile.age),
    agePrefMin: toAgeNumber(profile.deepProfileData?.agePrefMin),
    agePrefMax: toAgeNumber(profile.deepProfileData?.agePrefMax),
    wantChildren:
      profile.lifestyle && typeof profile.lifestyle.wantChildren === 'string' && profile.lifestyle.wantChildren.trim() !== ''
        ? new Set(profile.lifestyle.wantChildren.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean))
        : null,
    lifeRhythm: profile.lifeRhythm ?? null,
    // LIVSSTIL-2026 (D-1): høyde fra lifestyle.height (toAgeNumber har
    // identisk semantikk: number/string → finite tall eller null)
    heightNum: toAgeNumber((profile.lifestyle as Record<string, unknown> | null)?.height),
    // LIVSSTIL-2026 (D-4): prekalkulerte «må stemme»-felt
    livsstil2026: readLivsstil2026Gated(profile),
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
    religionOwn,
    religionOwnKeys: new Set(religionOwn.map(religionKey)),
    religionAcceptedKeys: new Set(religionAccepted.map(religionKey)),
    religionOpen: dp?.religionOpen === true,
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

function childrenOnly(set: Set<string> | null): 'ja' | 'nei' | null {
  if (!set) return null;
  // PL-28: «bonusfamilie» er ikke et barneønske — tell den ikke med
  // (samme regel som childrenOnlyChoice i dealbreaker.ts).
  const valg = [...set].filter((v) => v !== 'bonusfamilie');
  if (valg.length !== 1) return null;
  if (valg[0] === 'ja') return 'ja';
  if (valg[0] === 'nei') return 'nei';
  return null;
}

function childrenConflict(a: CheapFeatures, b: CheapFeatures): string | null {
  const aOnly = childrenOnly(a.wantChildren);
  const bOnly = childrenOnly(b.wantChildren);
  if (aOnly && bOnly && aOnly !== bOnly) {
    return `Ønske om barn: ${aOnly} vs ${bOnly}`;
  }
  return null;
}

/* ─── LIVSSTIL-2026 (D-1 + D-4): høyde + «må stemme»-konflikter ─── */

/**
 * D-1: høyde-gate — same semantikk og reason-strenge som checkHeightRule
 * i dealbreaker.ts (symmetrisk: kjører én gang per par).
 */
function heightConflict(a: CheapFeatures, b: CheapFeatures): string | null {
  let man: CheapFeatures;
  let kvinne: CheapFeatures;
  if (a.genderNorm === 'man' && b.genderNorm === 'kvinne') {
    man = a;
    kvinne = b;
  } else if (a.genderNorm === 'kvinne' && b.genderNorm === 'man') {
    man = b;
    kvinne = a;
  } else {
    return null; // kun mann–kvinne-par gjelder regelen
  }
  if (man.heightNum == null || kvinne.heightNum == null) return null; // mangler → aldri blokkér
  const gap = Math.round((kvinne.heightNum - man.heightNum) * 10) / 10;
  if (gap >= HEIGHT_GAP_CM) {
    return `Høyde: mannen er ${gap} cm kortere enn kvinnen (≥ ${HEIGHT_GAP_CM} cm)`;
  }
  return null;
}

function isL2026Kompatibel(felt: string, va: string, vb: string): boolean {
  // aktivitet er flervalg (kommaseparert): minst én felles verdi kreves
  if (felt === 'aktivitet') {
    const sa = new Set(va.split(',').map((s) => s.trim()).filter(Boolean));
    const sb = new Set(vb.split(',').map((s) => s.trim()).filter(Boolean));
    if (sa.size === 0 || sb.size === 0) return true;
    for (const v of sa) if (sb.has(v)) return true;
    return false;
  }
  const matrise = LIVSSTIL2026_KOMPAT[felt];
  if (!matrise) return true; // ukjent felt/verdi → ikke blokkér (forsvarlig)
  return (matrise[va]?.includes(vb) ?? true) && (matrise[vb]?.includes(va) ?? true);
}

/**
 * D-4: «må stemme»-konflikter — same semantikk og reason-strenger som
 * checkLifestyle2026 i dealbreaker.ts (symmetrisk: kjører én gang per par).
 */
function lifestyle2026Conflict(a: CheapFeatures, b: CheapFeatures): string | null {
  const da = a.livsstil2026;
  const db = b.livsstil2026;
  if (!da || !db) return null;
  const felt: Array<{ key: keyof Livsstil2026Data; viktig: keyof Livsstil2026Data; navn: string }> = [
    { key: 'bil', viktig: 'bilViktig', navn: 'bil' },
    { key: 'kosthold', viktig: 'kostholdViktig', navn: 'kosthold' },
    { key: 'alkohol', viktig: 'alkoholViktig', navn: 'alkohol' },
    { key: 'dyr', viktig: 'dyrViktig', navn: 'dyr' },
    { key: 'bosted', viktig: 'bostedViktig', navn: 'bosted' },
    { key: 'arbeidsrytme', viktig: 'arbeidsrytmeViktig', navn: 'arbeidsrytme' },
    { key: 'skjerm', viktig: 'skjermViktig', navn: 'skjerm' },
    { key: 'reiser', viktig: 'reiserViktig', navn: 'reiser' },
    { key: 'aktivitet', viktig: 'aktivitetViktig', navn: 'aktivitet' },
  ];
  for (const f of felt) {
    const va = da[f.key];
    const vb = db[f.key];
    if (!va || !vb) continue; // mangler verdi → blokkerer aldri
    const aSkalStemme = da[f.viktig] === 'ma-stemme';
    const bSkalStemme = db[f.viktig] === 'ma-stemme';
    if (!aSkalStemme && !bSkalStemme) continue; // «må stemme» kreves (D-4)
    if (isL2026Kompatibel(f.navn, va, vb)) continue;
    const streng = aSkalStemme ? a.userId : b.userId;
    return `Hverdagsvalg: ${f.navn} (${va} vs ${vb}) for ${streng}`;
  }
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

/**
 * Lansering: religion/livssyn — samme semantikk og reason-strenge som
 * checkReligionOneWay i dealbreaker.ts. Én retning: dekker `accepter` sin
 * akseptliste `target` sin egen religion? Manglende akseptliste/egen religion → null.
 */
function religionOneWay(accepter: CheapFeatures, target: CheapFeatures): string | null {
  if (accepter.religionOpen) return null;                      // OPEN TO ALL
  if (accepter.religionAcceptedKeys.size === 0) return null;   // MISSING — ingen akseptliste
  if (target.religionOwnKeys.size === 0) return null;          // egen religion ukjent
  for (const k of target.religionOwnKeys) {
    if (accepter.religionAcceptedKeys.has(k)) return null;   // minst éin felles → akseptert
  }
  return religionReason(accepter.userId, target.userId, target.religionOwn);
}

/**
 * Hovudfunksjon: reproduserer
 *   sjekkAlleDealbreakers(A, B).reason ?? sjekkAlleDealbreakers(B, A).reason
 * med prekalkulat data — ingen normalisering per par.
 *
 * Rekkefølge (må ikke endres uten ekvivalens-test):
 *   1. kjønn (bilkreftig)   2. alder (bilkreftig)   3. barn (symmetrisk)
 *   4. høyde (LIVSSTIL-2026, D-1, symmetrisk)
 *   5. livsstil 2026 (LIVSSTIL-2026, D-4, symmetrisk)
 *   6. livsrytme A→B        7. preferansar A→B      8. grenser A→B
 *   9. radius (bilkreftig)
 *   10. religion A→B/B→A   (Lansering — gjensidig hard regel. I full logikk er
 *                           religion del av A→B-kjøret, FØR B→A-retteta sjekkar.)
 *   11. livsrytme B→A       12. preferansar B→A     13. grenser B→A
 *
 * (PL-10: modenheit og sikkerheit er fjerna frå rekkjefølgja.)
 *
 * @returns reason-strengen til den første dealbreakeren, eller null.
 */
export function cheapSjekkAll(a: CheapFeatures, b: CheapFeatures): string | null {
  return (
    genderOneWay(a, b) ?? genderOneWay(b, a) ??
    ageOneWay(a, b) ?? ageOneWay(b, a) ??
    childrenConflict(a, b) ??
    heightConflict(a, b) ??
    lifestyle2026Conflict(a, b) ??
    lifeRhythmOneWay(a, b) ??
    explicitPrefsOneWay(a, b) ??
    boundariesOneWay(a, b) ??
    radiusCheck(a, b) ??
    religionOneWay(a, b) ??
    religionOneWay(b, a) ??
    lifeRhythmOneWay(b, a) ??
    explicitPrefsOneWay(b, a) ??
    boundariesOneWay(b, a)
  );
}