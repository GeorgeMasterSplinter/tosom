// lib/matching/dimensions.ts — FORSKNINGSMOTOR F-7
//
// Éin funksjon per dimensjon. Alle returnerer 0–100 (høgare = dypere resonans).
// Reglane kommer fra FORSKNINGSMOTOR-v1.0.md §8 (Kompatibilitetsreglene).
//
// Likhet er ikke alltid bra — reglene er bevisst asymmetriske.

import {
  AttachmentScores,
  BigFiveScores,
  ValueProfile,
  ERScores,
  CommScores,
} from '@/lib/psychometrics/scoring';

/* ─────────────────────────────────────────────────────────────
   Hjelparar
   ───────────────────────────────────────────────────────────── */

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** Midtnormalisert verdi (1–5 → -2 … +2) for korrelasjon. */
function centered(v: number): number {
  return v - 3;
}

/* ─────────────────────────────────────────────────────────────
   TILKNYTNING (vekt 0,25) — §8
   Matrise fra stil-paret. Engstelig + unnvikende er det
   best dokumenterte negative mønsteret — gir lågast score.
   ───────────────────────────────────────────────────────────── */

const ATTACHMENT_MATRIX: Record<string, number> = {
  'secure|secure': 100,
  'anxious|secure': 75,   // trygg + engstelig — trygg partner demper
  'avoidant|secure': 75,  // trygg + unnvikende — same mekanisme
  'fearful|secure': 50,
  'anxious|anxious': 45,
  'anxious|avoidant': 25, // ← heile poenget (best dokumenterte negative mønsteret)
  'anxious|fearful': 30,
  'avoidant|avoidant': 40,
  'avoidant|fearful': 30,
  'fearful|fearful': 25,
};

function attachmentKey(a: string, b: string): string {
  // Uordnet par — sorterer slik at anxious|avoidant === avoidant|anxious
  return [a, b].sort().join('|');
}

export function scoreAttachmentCompat(
  a: AttachmentScores,
  b: AttachmentScores
): number {
  const key = attachmentKey(a.style, b.style);
  return ATTACHMENT_MATRIX[key] ?? 50;
}

/* ─────────────────────────────────────────────────────────────
   PERSONLIGHEIT (vekt 0,15) — §8, per trekk
   To sterkt nevrotiske skal ikke få full uttelling.
   ───────────────────────────────────────────────────────────── */

export function scorePersonalityCompat(
  a: BigFiveScores,
  b: BigFiveScores
): number {
  // Nevrotisisme: lav hos begge = bra. Høy hos begge = risiko.
  const avgN = (a.neuroticism + b.neuroticism) / 2;
  let neuroticism = clamp(100 - 15 * (avgN - 2), 30, 100);
  if (a.neuroticism > 3.5 && b.neuroticism > 3.5) neuroticism -= 20;

  // Medmenneskelighet: høy hos begge = bra.
  const avgAg = (a.agreeableness + b.agreeableness) / 2;
  const agreeableness = clamp((avgAg / 5) * 100, 20, 100);

  // Planmessighet: likhet — stort avvik gir hverdagsfriksjon.
  const conDiff = Math.abs(a.conscientiousness - b.conscientiousness);
  const conscientiousness = clamp(100 - conDiff * 25, 0, 100);

  // Ekstroversjon: moderat forskjell er greit — straff kun store gap.
  const extDiff = Math.abs(a.extraversion - b.extraversion);
  const extraversion = clamp(100 - Math.max(0, extDiff - 1) * 20, 0, 100);

  // Åpenhet: likhet, moderat vekt.
  const openDiff = Math.abs(a.openness - b.openness);
  const openness = clamp(100 - openDiff * 20, 0, 100);

  // Vektet gjennomsnitt (jamn vekt på de 5 trekk).
  return Math.round(
    (neuroticism + agreeableness + conscientiousness + extraversion + openness) / 5
  );
}

/* ─────────────────────────────────────────────────────────────
   VERDIER (vekt 0,25) — §8
   Korrelasjon mellom to PVQ-profiler, ikke ordtelling.
   ───────────────────────────────────────────────────────────── */

export function scoreValueCompat(a: ValueProfile, b: ValueProfile): number {
  const keys = Object.keys(a).filter((k) => k in b);
  if (keys.length < 2) {
    // For få felles akser for korrelasjon — fall tilbake til nærleik.
    if (keys.length === 0) return 50;
    const closeness = 100 - (Math.abs(a[keys[0]] - b[keys[0]]) / 4) * 100;
    return clamp(Math.round(closeness), 0, 100);
  }

  const aVals = keys.map((k) => centered(a[k]));
  const bVals = keys.map((k) => centered(b[k]));

  const meanA = aVals.reduce((s, v) => s + v, 0) / aVals.length;
  const meanB = bVals.reduce((s, v) => s + v, 0) / bVals.length;

  let cov = 0;
  let varA = 0;
  let varB = 0;
  for (let i = 0; i < keys.length; i++) {
    const da = aVals[i] - meanA;
    const db = bVals[i] - meanB;
    cov += da * db;
    varA += da * da;
    varB += db * db;
  }

  const denom = Math.sqrt(varA * varB);
  if (denom === 0) {
    // PL-08i: En av profilene er flat (ingen variasjon) — ingen
    // korrelasjon kan beregnes, og «nærhet på snitt» belønner tilfeldige
    // middeler. Nøytral 50 i stedet (ingen resonans uten data).
    return 50;
  }

  const r = clamp(cov / denom, -1, 1);
  // Mapp Pearson r fra [-1,1] til [0,100].
  return Math.round(((r + 1) / 2) * 100);
}

/* ─────────────────────────────────────────────────────────────
   EMOJSJONSREGULERING (vekt 0,10) — §8
   ───────────────────────────────────────────────────────────── */

export function scoreEmotionRegCompat(a: ERScores, b: ERScores): number {
  // Høy reappraisal hos begge = positivt.
  const avgReapp = (a.reappraisal + b.reappraisal) / 2;
  let score = clamp(40 + (avgReapp - 1) * 15, 0, 100);

  // Høy undertrykking hos begge = risiko.
  const avgSup = (a.suppression + b.suppression) / 2;
  if (avgSup > 3.5) score -= (avgSup - 3.5) * 30;

  // Stor forskjell i undertrykking = konfliktpotensial.
  const supDiff = Math.abs(a.suppression - b.suppression);
  if (supDiff > 2) score -= 15;

  return Math.round(clamp(score, 0, 100));
}

/* ─────────────────────────────────────────────────────────────
   KOMMUNIKASJON (vekt 0,15)
   Samsvar i kommunikasjonstrekk (høgare = sundare kommunikasjon).
   ───────────────────────────────────────────────────────────── */

export function scoreCommunicationCompat(
  a: CommScores,
  b: CommScores
): number {
  const keys = Object.keys(a).filter((k) => k in b);
  if (keys.length === 0) return 50;

  let total = 0;
  for (const k of keys) {
    const closeness = 100 - (Math.abs(a[k] - b[k]) / 4) * 100;
    total += clamp(closeness, 0, 100);
  }
  return Math.round(total / keys.length);
}

/* ─────────────────────────────────────────────────────────────
   LIVSSITUASJON (vekt 0,10)
   Praktisk kompatibilitet. Tolter data fra Profilen defensivt —
   mangler data gir nøytral 50.
   ───────────────────────────────────────────────────────────── */

/**
 * Trekk et felt fra ei profil som kan være Prisma-Json, Objekt, eller flate.
 * Sjekkar flere mulige stadar sidan forma varierar mellom engine.ts og cron.
 */
function pickField(profile: Record<string, unknown>, ...keys: string[]): string | null {
  for (const k of keys) {
    if (typeof profile[k] === 'string' && (profile[k] as string).trim()) {
      return (profile[k] as string).toLowerCase().trim();
    }
  }
  // Sjekk inni lifestyle / lifeSituation / basic / deepProfileData Json-objekt
  // (deepProfileData leses fortsatt for felt som ligger der; religion ble lest
  // herfra før PL-27, men inngår ikke lenger i scoren).
  for (const container of ['lifestyle', 'lifeSituation', 'basic', 'deepProfileData']) {
    const c = profile[container];
    if (c && typeof c === 'object') {
      for (const k of keys) {
        const v = (c as Record<string, unknown>)[k];
        if (typeof v === 'string' && (v as string).trim()) {
          return (v as string).toLowerCase().trim();
        }
      }
    }
  }
  return null;
}

/**
 * Kategorisk samsvar: 100 like, 0 ulike, 50 om mangler.
 * For flervalg (kommaseparert, f.eks. «kristen,katolsk») beregnes
 * Jaccard-overlapping: 100 × felles valg / alle unike valg.
 * Enkelverdi (alle eksisterende profiler) oppfører seg som før.
 */
function categoryMatch(a: string | null, b: string | null): number {
  if (!a || !b) return 50;
  const sa = new Set(a.split(',').map((s) => s.trim()).filter(Boolean));
  const sb = new Set(b.split(',').map((s) => s.trim()).filter(Boolean));
  if (sa.size === 0 || sb.size === 0) return 50;
  let common = 0;
  for (const v of sa) if (sb.has(v)) common++;
  if (common === 0) return 0;
  const union = sa.size + sb.size - common;
  return union === 0 ? 50 : Math.round((common / union) * 100);
}

/**
 * Religion / livssyn (PL-27, Georges beslutning 06.10):
 * Ulik tro gjør ikke en match mindre kompatibel. Mange har foreldre med to
 * ulike religioner, bor i et tredje land og dater på tvers — det er lov, og
 * det er vanlig. Religion er derfor ikke et samsvarskrav og inngår ikke i
 * livssituasjonsscoren: felles tro gir ikke ekstra poeng, ulik tro gir ikke
 * trekk, og det å svare gir ikke annen score enn å la feltet stå tomt.
 * (En fast nøytral verdi ville trukket scoren mot midten for alle som svarer.)
 */

/**
 * «Ønsker du barn?» (PL-28): «Åpen for bonusfamilie» betyr at brukeren er
 * åpen for en partner som har barn fra før — og for samarbeidet det
 * innebærer med tidligere partnere, besteforeldre og søsken. Verdien er
 * ikke et svar på om brukeren selv ønsker barn, og telles derfor ikke med i
 * samsvaret for wantChildren. Den gir i stedet pluss når partneren har barn.
 */
const BONUSFAMILIE = 'bonusfamilie';
const BONUSFAMILIE_PLUSS = 10;

/** Verdier i «Barn?» som betyr at personen har barn fra før. */
const HAR_BARN = new Set(['har-små-barn', 'har-barn', 'har-vaksen-barn']);

function splitValg(v: string | null): Set<string> {
  if (!v) return new Set();
  return new Set(v.split(',').map((s) => s.trim()).filter(Boolean));
}

/** wantChildren uten bonusfamilie — null hvis ingenting gjenstår. */
function barneonskeUtenBonus(v: string | null): string | null {
  const valg = splitValg(v);
  valg.delete(BONUSFAMILIE);
  return valg.size > 0 ? [...valg].join(',') : null;
}

function harBarnFraFor(children: string | null): boolean {
  for (const v of splitValg(children)) if (HAR_BARN.has(v)) return true;
  return false;
}

function erApenForBonusfamilie(wantChildren: string | null): boolean {
  return splitValg(wantChildren).has(BONUSFAMILIE);
}

export function scoreLifeSituationCompat(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): number {
  const dimensions: Array<[string[], number]> = [
    // Barn / vilje til barn er det sterkaste praktiske skille.
    [['wantChildren'], 0.4],
    [['children'], 0.2],
    [['smoking'], 0.2],
    // PL-27: religion er fjernet herfra — se kommentaren over.
    [['lifestyle', 'lifestyleType'], 0.1],
  ];

  let total = 0;
  let weightSum = 0;
  for (const [keys, weight] of dimensions) {
    let va = pickField(a, ...keys);
    let vb = pickField(b, ...keys);
    // PL-28: bonusfamilie er ikke et barneønske — sammenlign uten den.
    if (keys[0] === 'wantChildren') {
      va = barneonskeUtenBonus(va);
      vb = barneonskeUtenBonus(vb);
    }
    if (!va || !vb) continue; // hopper over om det mangler — ikke straff for tom profil
    total += categoryMatch(va, vb) * weight;
    weightSum += weight;
  }

  // PL-28: åpen for bonusfamilie + partneren har barn fra før → pluss.
  // Gjelder begge veier, men gis bare én gang (samme pluss om begge passer).
  const wantA = pickField(a, 'wantChildren');
  const wantB = pickField(b, 'wantChildren');
  const bonusPasser =
    (erApenForBonusfamilie(wantA) && harBarnFraFor(pickField(b, 'children'))) ||
    (erApenForBonusfamilie(wantB) && harBarnFraFor(pickField(a, 'children')));

  // Ingen felles praktiske data — nøytral (bonusfamilie-plusset gjelder likevel).
  const base = weightSum === 0 ? 50 : total / weightSum;
  return Math.round(clamp(base + (bonusPasser ? BONUSFAMILIE_PLUSS : 0), 0, 100));
}
