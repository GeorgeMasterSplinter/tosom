// lib/matching/dealbreaker.ts — Harde filtre for matching
// Dealbreakere er essensielle mismatch som automatisk avvise en kandidat
//
// Inaktive filtre (kodet og testet, men ingen datasource i dagens onboarding):
// livsrytme-konflikt og eksplisitte preferanser/matchTags. De aktiveres
// automatisk når dataene finnes.
//
// Fjernet i PL-10 (V-1): modenhets-gap (syntetiske 7/5-verdier fra ett svar)
// og sikkerhetsnivå-gap (derivert av attachmentStyle med 'secure' som
// fallback). Nøklene modenhetsgap/sikkerhetsniva ligger fortsatt i
// scoreRound.REJECT_REASON_KEYS for historikk i admin.

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
 * Steg 1 lar brukeren velge min alder (agePrefMin) og maks alder (agePrefMax)
 * i deepProfileData. Kandidatens alder (Profile.age) må ligge innenfor begge
 * parters intervall.
 *
 * REV 1.2 (produktbeslutning): agePrefMax = null er 99+ — ÅPEN øvre grense
 * (ingen øvre aldersgrense). Da er det ingen maks-alder-dealbreaker; minimum
 * gjelder uendret. Endelig maks (21–98) blokkerer som før: kandidat-alder
 * over maks. Manglende/ugyldig preferanse eller manglende kandidat-alder →
 * blokkerer IKKE (forsvarlig, samme mønster som radius).
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
 * checkChildrenWant — «Ønsker du barn?» er en AKTIV dealbreaker (PL-11,
 * D-3 = ja, symmetrisk). Verdiene fra onboarding er 'Ja'/'Usikker'/'Nei'
 * (flervalg, kommaseparert i lifestyle.wantChildren).
 *
 * Blokkerer KUN når den ene har valgt nøyaktig «Ja» og den andre nøyaktig
 * «Nei». 'Usikker', flervalg eller manglende data blokkerer aldri
 * (ærlig: vi vet ikke deres svar — forsvarlig, samme mønster som radius).
 *
 * PL-28: «Åpen for bonusfamilie» ('Bonusfamilie') svarer ikke på om brukeren
 * selv ønsker barn, og tas ut før sjekken. Ellers ville «Nei» + bonusfamilie
 * telle som flervalg og slå av D-3 mot «Ja». Ingen ny dealbreaker — D-3
 * virker som før. Bonusfamilie gir pluss i livssituasjonen (dimensions.ts).
 */
function childrenOnlyChoice(raw: unknown): 'ja' | 'nei' | null {
  if (typeof raw !== 'string' || raw.trim() === '') return null;
  const parts = raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s !== '' && s !== 'bonusfamilie');
  if (parts.length !== 1) return null;
  return parts[0] === 'ja' ? 'ja' : parts[0] === 'nei' ? 'nei' : null;
}

function checkChildrenWant(a: ProfileData, b: ProfileData): DealbreakerResult {
  const aOnly = childrenOnlyChoice(a.lifestyle?.wantChildren);
  const bOnly = childrenOnlyChoice(b.lifestyle?.wantChildren);
  if (aOnly && bOnly && aOnly !== bOnly) {
    return {
      hasDealbreaker: true,
      reason: `Ønske om barn: ${aOnly} vs ${bOnly}`,
    };
  }
  return { hasDealbreaker: false };
}

/* ─────────────────────────────────────────────────────────────
   LIVSSTIL-2026 (18.10, D-1 + D-4) — to nye dealbreakere
   ───────────────────────────────────────────────────────────── */

/**
 * D-1 (Alternativ A, besluttet 18.10): høyde er en hard standardregel.
 * Et mann–kvinne-par avvises når mannen er ≥ HEIGHT_GAP_CM kortere enn
 * kvinnen. Kun par der begge kjønn normaliserer til 'man'/'kvinne'
 * (ikke-binær/ukjent kjønn → ingen gate). Manglende høyde på én eller
 * begge → blokkerer ALDRI (forsvarlig, samme mønster som radius).
 */
export const HEIGHT_GAP_CM = 5;

function toHeightNumber(raw: unknown): number | null {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  if (typeof raw === 'string' && raw.trim() !== '') {
    const n = Number(raw);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function checkHeightRule(a: ProfileData, b: ProfileData): DealbreakerResult {
  const genderA = a.lifeSituation?.gender ? normalizeGender(a.lifeSituation.gender) : null;
  const genderB = b.lifeSituation?.gender ? normalizeGender(b.lifeSituation.gender) : null;
  // Kun mann–kvinne-par gjelder regelen
  let man: ProfileData;
  let kvinne: ProfileData;
  if (genderA === 'man' && genderB === 'kvinne') {
    man = a;
    kvinne = b;
  } else if (genderA === 'kvinne' && genderB === 'man') {
    man = b;
    kvinne = a;
  } else {
    return { hasDealbreaker: false };
  }

  const mannHoyde = toHeightNumber(man.lifestyle?.height);
  const kvinneHoyde = toHeightNumber(kvinne.lifestyle?.height);
  if (mannHoyde == null || kvinneHoyde == null) {
    // Manglende høyde → blokkerer aldri (I-12: vises heller ikke for brukeren)
    return { hasDealbreaker: false };
  }

  const gap = Math.round((kvinneHoyde - mannHoyde) * 10) / 10;
  if (gap >= HEIGHT_GAP_CM) {
    return {
      hasDealbreaker: true,
      reason: `Høyde: mannen er ${gap} cm kortere enn kvinnen (≥ ${HEIGHT_GAP_CM} cm)`,
    };
  }
  return { hasDealbreaker: false };
}

/**
 * D-4 (besluttet 18.10): vektmodellens øverste nivå «Må stemme» er en hard
 * dealbreaker. For bil/kosthold/alkohol/dyr: hvis MINST ÉN part har satt
 * «ma-stemme» og begge har verdi, og verdien ligger IKKE i den andres
 * kompatibilitetssett (i noen retning) → avvis.
 * Manglende verdi → blokkerer aldri (forsvarlig, som radius).
 */
export const LIVSSTIL2026_KOMPAT: Record<string, Record<string, string[]>> = {
  kosthold: {
    'spiser-koett': ['spiser-koett', 'fleksitar'],
    fleksitar: ['spiser-koett', 'fleksitar', 'vegetar', 'vegan', 'fisk'],
    vegetar: ['vegetar', 'fleksitar', 'vegan', 'fisk'],
    vegan: ['vegan', 'vegetar', 'fisk'],
    fisk: ['fisk', 'vegetar', 'vegan', 'fleksitar'],
  },
  bil: {
    'full-el': ['full-el', 'phev', 'esykkel-ingen'],
    phev: ['full-el', 'phev', 'bensin', 'diesel', 'esykkel-ingen'],
    bensin: ['bensin', 'diesel', 'phev', 'esykkel-ingen'],
    diesel: ['diesel', 'bensin', 'phev', 'esykkel-ingen'],
    'esykkel-ingen': ['full-el', 'phev', 'bensin', 'diesel', 'esykkel-ingen'],
  },
  alkohol: {
    aldri: ['aldri', 'sjelden'],
    sjelden: ['sjelden', 'aldri', 'helligdager'],
    helligdager: ['helligdager', 'sjelden', 'ofte'],
    ofte: ['ofte', 'helligdager'],
  },
  dyr: {
    hund: ['hund', 'annet-dyr', 'ingen'],
    katt: ['katt', 'annet-dyr', 'ingen'],
    'annet-dyr': ['hund', 'katt', 'annet-dyr', 'ingen'],
    ingen: ['hund', 'katt', 'annet-dyr', 'ingen'],
  },
  bosted: {
    sentrum: ['sentrum', 'forstad'],
    forstad: ['sentrum', 'forstad', 'land'],
    land: ['forstad', 'land'],
  },
  arbeidsrytme: {
    kontorbundet: ['kontorbundet', 'hybrid', 'hjemmearbeid'],
    hybrid: ['kontorbundet', 'hybrid', 'hjemmearbeid', 'skift'],
    hjemmearbeid: ['kontorbundet', 'hybrid', 'hjemmearbeid'],
    skift: ['hybrid', 'skift'],
  },
  skjerm: {
    mye: ['mye', 'moderat'],
    moderat: ['mye', 'moderat', 'vil-skru-ned'],
    'vil-skru-ned': ['moderat', 'vil-skru-ned'],
  },
  reiser: {
    'fjell-bobil': ['fjell-bobil', 'utlandet', 'naturen-naermest'],
    utlandet: ['fjell-bobil', 'utlandet', 'naturen-naermest'],
    'naturen-naermest': ['fjell-bobil', 'utlandet', 'naturen-naermest', 'lite-reising'],
    'lite-reising': ['naturen-naermest', 'lite-reising'],
  },
};

export interface Livsstil2026Data {
  bil: string | null;
  bilViktig: string | null;
  kosthold: string | null;
  kostholdViktig: string | null;
  alkohol: string | null;
  alkoholViktig: string | null;
  dyr: string | null;
  dyrViktig: string | null;
  bosted: string | null;
  bostedViktig: string | null;
  arbeidsrytme: string | null;
  arbeidsrytmeViktig: string | null;
  skjerm: string | null;
  skjermViktig: string | null;
  reiser: string | null;
  reiserViktig: string | null;
  aktivitet: string | null;
  aktivitetViktig: string | null;
}

/** Defensiv lesing av D-4-feltene fra preferences.livsstil2026. */
export function readLivsstil2026Gated(profile: ProfileData): Livsstil2026Data | null {
  const prefs = profile.preferences as Record<string, unknown> | null | undefined;
  const l = prefs?.livsstil2026 as Record<string, unknown> | null | undefined;
  if (!l || typeof l !== 'object' || Array.isArray(l)) return null;
  const str = (k: string): string | null => {
    const v = l[k];
    return typeof v === 'string' && v.trim() !== '' ? v.trim() : null;
  };
  return {
    bil: str('bil'),
    bilViktig: str('bilViktig'),
    kosthold: str('kosthold'),
    kostholdViktig: str('kostholdViktig'),
    alkohol: str('alkohol'),
    alkoholViktig: str('alkoholViktig'),
    dyr: str('dyr'),
    dyrViktig: str('dyrViktig'),
    bosted: str('bosted'),
    bostedViktig: str('bostedViktig'),
    arbeidsrytme: str('arbeidsrytme'),
    arbeidsrytmeViktig: str('arbeidsrytmeViktig'),
    skjerm: str('skjerm'),
    skjermViktig: str('skjermViktig'),
    reiser: str('reiser'),
    reiserViktig: str('reiserViktig'),
    aktivitet: str('aktivitet'),
    aktivitetViktig: str('aktivitetViktig'),
  };
}

function isKompatibel(felt: string, a: string, b: string): boolean {
  // aktivitet er flervalg (kommaseparert): «må stemme» krever minst én
  // felles verdi; ubestemt-verdier er håndtert av kalleren.
  if (felt === 'aktivitet') {
    const sa = new Set(a.split(',').map((s) => s.trim()).filter(Boolean));
    const sb = new Set(b.split(',').map((s) => s.trim()).filter(Boolean));
    if (sa.size === 0 || sb.size === 0) return true;
    for (const v of sa) if (sb.has(v)) return true;
    return false;
  }
  const matrise = LIVSSTIL2026_KOMPAT[felt];
  if (!matrise) return true; // ukjent felt/verdi → ikke blokkér (forsvarlig)
  // O2 P1: kosthold er flervalg (maks 2). Direkte generalisering av single-verdi-tjekk:
  // kompatibel om det finnes ÉN par (av∈A, bv∈B) som er gjensidig kompatibelt
  // (matrise[av]∋bv OG matrise[bv]∋av). For single-verdier er dette identisk med
  // dagens oppførsel (ingen regresjon); overlap brukes IKKE (bevarer hierarkiet).
  if (felt === 'kosthold') {
    const sa = a.split(',').map((s) => s.trim()).filter(Boolean);
    const sb = b.split(',').map((s) => s.trim()).filter(Boolean);
    if (sa.length === 0 || sb.length === 0) return true;
    for (const av of sa) {
      for (const bv of sb) {
        if ((matrise[av]?.includes(bv) ?? true) && (matrise[bv]?.includes(av) ?? true)) return true;
      }
    }
    return false;
  }
  return (matrise[a]?.includes(b) ?? true) && (matrise[b]?.includes(a) ?? true);
}

function checkLifestyle2026(a: ProfileData, b: ProfileData): DealbreakerResult {
  const da = readLivsstil2026Gated(a);
  const db = readLivsstil2026Gated(b);
  if (!da || !db) return { hasDealbreaker: false };

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
    if (isKompatibel(f.navn, va, vb)) continue;
    const streng = aSkalStemme ? a.userId : b.userId;
    return {
      hasDealbreaker: true,
      reason: `Hverdagsvalg: ${f.navn} (${va} vs ${vb}) for ${streng}`,
    };
  }
  return { hasDealbreaker: false };
}

/* ─────────────────────────────────────────────────────────────
   RELIGION / LIVSSYN (Lansering — hard, brukerdefinert kompatibilitet)
   ───────────────────────────────────────────────────────────── */

/**
 * Religion/livssyn er en HARD, brukerdefinert kompatibilitetsregel.
 *
 * Tosom avgjør IKKE at to religioner/livssyn er inkompatible — det gjør
 * BRUKEREN via sin eksplisitte akseptliste (opptil 4). Regelen er gjensidig:
 *   A aksepterer B  ⇔  A.acceptedReligions ∩ B.religion ≠ ∅
 *   B aksepterer A  ⇔  B.acceptedReligions ∩ A.religion ≠ ∅
 *   RELIGION_COMPATIBLE = (A aksepterer B) OG (B aksepterer A)
 *
 * Data (i deepProfileData — religion/acceptedReligions kommaseparert, samme
 * representasjon som eksisterende «religion»):
 *   - religion:          brukerens EGEN religion/livssyn (opptil 4)
 *   - acceptedReligions: religioner/livssyn brukeren er ÅPEN for (opptil 4)
 *   - religionOpen:      boolean — OPEN TO ALL (Phase 1.5): religion/livssyn
 *                        skal ikke begrense hvem brukeren kan møte
 *
 * Trygg håndtering av manglende data (mønsteret i hele filen, f.eks. D-1
 * «mangler høyde blokkerer aldri»):
 *   - Accepter uten eksplisitt akseptliste (legacy/ikke svart) → ingen
 *     religion-begrensning → blokkerer IKKE. Vi gjetter ikke brukerens ønsker.
 *   - Target uten egen religion (legacy/ikke svart) → begrensningen kan ikke
 *     evalueres → blokkerer IKKE.
 *
 * Tre teknisk distinkte tilstander for accepterende side (Phase 1.5):
 *   - MISSING:     verken religionOpen eller acceptedReligions (legacy/ikke
 *                  svart) → ingen begrensning. MISSING er IKKE «åpen for
 *                  alle» — de skiller seg ved om religionOpen-feltet eksisterer.
 *   - OPEN TO ALL: religionOpen === true → aksepterer uansett religion.
 *   - VALG:        acceptedReligions (1–4) → snitt med target sin egen religion.
 * En høy resonansscore kan aldri overstyre dette: sjekken kjører som
 * dealbreaker FØR scoring.
 */

/** Parse en kommaseparert religionsstreng til en rentet, ikke-tom liste. */
export function parseReligionList(raw: unknown): string[] {
  if (typeof raw !== 'string' || raw.trim() === '') return [];
  return raw.split(',').map((s) => s.trim()).filter((s) => s !== '');
}

/** Normaliser én religion-verdi til en sammenliknbart nøkkel (versal/blank-tolerant). */
export function religionKey(v: string): string {
  return v.trim().toLowerCase();
}

/**
 * Éin felles årsak-strenge, slik at dealbreaker.ts og cheapFeatures.ts aldri
 * divergerer (ekvivalens-testen krever byte-identiske reason-strenger).
 */
export function religionReason(accepterId: string, targetId: string, targetOwn: string[]): string {
  return `Religion/livssyn: ${accepterId} er ikke åpen for religionen/livssynet til ${targetId} (${targetOwn.join(' / ')})`;
}

/**
 * Éin retning: dekker `accepter` sin eksplisitte akseptliste minst én av
 * `target` sin egen religion/livssyn? Returnerer reason dersom NEI.
 * Manglende akseptliste eller manglende egen religion → null (blokkerer ikke).
 */
function checkReligionOneWay(accepter: ProfileData, target: ProfileData): string | null {
  const dp = accepter.deepProfileData ?? null;
  // OPEN TO ALL: brukeren har eksplisitt sagt at religion/livssyn ikke skal
  // begrense hvem vedkommende kan møte → aksepterer uansett religion.
  // (Teknisk distinkt fra MISSING: her er religionOpen eksplisitt true.)
  if (dp?.religionOpen === true) return null;
  const accepted = parseReligionList(dp?.acceptedReligions);
  // MISSING (legacy/ikke svart) → ingen religion-begrensning
  if (accepted.length === 0) return null;
  const own = parseReligionList(target.deepProfileData?.religion);
  // Target sin egen religion ukjent → kan ikke evaluere begrensinga
  if (own.length === 0) return null;

  const acceptedKeys = new Set(accepted.map(religionKey));
  for (const r of own) {
    if (acceptedKeys.has(religionKey(r))) return null; // minst éin snitt → akseptert
  }
  return religionReason(accepter.userId, target.userId, own);
}

function checkReligionCompat(a: ProfileData, b: ProfileData): DealbreakerResult {
  // TOSIDIG: begge parters eksplisitte akseptlister må dekkje den andres religion
  const reason = checkReligionOneWay(a, b) ?? checkReligionOneWay(b, a);
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

  // 3. Barn (PL-11, D-3 = ja): blokkerer kun kun-ja vs kun-nei
  result = checkChildrenWant(queryUser, candidate);
  if (result.hasDealbreaker) return result;

  // 4. Høyde (LIVSSTIL-2026, D-1): mann ≥ 5 cm kortere enn kvinne → avvis
  result = checkHeightRule(queryUser, candidate);
  if (result.hasDealbreaker) return result;

  // 5. Livsstil 2026 (LIVSSTIL-2026, D-4): «må stemme»-konflikter
  result = checkLifestyle2026(queryUser, candidate);
  if (result.hasDealbreaker) return result;

  // 6. Livsrytme-konflikt
  result = checkLifeRhythmConflict(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  // 7. Eksplisitte preferanser
  result = checkExplicitPreferences(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  // 8. Grenser
  result = checkBoundaries(queryUser, candidate);
  if (result.hasDealbreaker) return result;
  
  // 9. Radius — B1.4: aktiv preferanse, tosidig blokkering
  result = checkRadius(queryUser, candidate);
  if (result.hasDealbreaker) return result;

  // 10. Religion/livssyn — gjensidig HARD kompatibilitet (brukerdefinert
  //     akseptliste). Kjører FØR scoring: en høy score kan aldri overstyre.
  result = checkReligionCompat(queryUser, candidate);
  if (result.hasDealbreaker) return result;

  // PL-10 (V-1): modenhets-gap og sikkerhetsnivå-gap er fjernet (syntetiske
  // data). Nøklene beholdes i scoreRound.REJECT_REASON_KEYS for admin-historikk.
  return { hasDealbreaker: false };
}