/**
 * ONBOARDING LANGUAGE & CLARITY ACT O1 — målrettede guards (OCL-01–OCL-20)
 *
 * Verifiserer at ACT-en har gjort det den lover — og at den IKKE har
 * rørt det som er låst (matching, consent, frozen biblioteker,
 * required/optional-semantikk, stegtell). Mønsteret følger
 * grand-finale-copy-truth.test.tsx: aktive copy strenges med
 * kommentarfri lesing; logikk låses med hashes og unit-asserts.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { createHash } from 'crypto';
import { join } from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const ROOT = join(__dirname, '..');

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

function sha256(rel: string): string {
  return createHash('sha256').update(read(rel)).digest('hex');
}

/**
 * Fjerner kodekommentarer slik at guards kun måler aktiv copy.
 * `//` regnes som kommentar kun når den starter linjen eller følger
 * hvitrom (slår ikke feil på «https://» i strenger).
 */
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|\s)\/\/[^\n]*/g, (m, pre: string) => pre);
}

/** Alle .ts/.tsx-filene under en mappe (rekursivt). */
function listFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...listFiles(full));
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

/** Aktiv copy (uten kommentarer) over hele onboarding-flaten. */
const ONBOARDING_DIR = join(ROOT, 'app', 'onboarding');
const onboardingCopy: string = listFiles(ONBOARDING_DIR)
  .map((f) => stripComments(readFileSync(f, 'utf-8')))
  .join('\n');

describe('ONBOARDING LANGUAGE & CLARITY ACT O1', () => {
  test('OCL-01: oppsummeringen leser canonical aldersfelt (agePrefMin/agePrefMax)', () => {
    const sum = read('app/onboarding/steps/Step9Oppsummering.tsx');
    expect(sum).toContain('agePrefMin');
    expect(sum).toContain('agePrefMax');
    // De døde legacy-feltene minAge/maxAge må ikke leses som kilde.
    expect(sum).not.toMatch(/num\(\s*['"]minAge['"]/);
    expect(sum).not.toMatch(/num\(\s*['"]maxAge['"]/);
    expect(sum).not.toMatch(/val\(\s*['"]minAge['"]/);
    expect(sum).not.toMatch(/val\(\s*['"]maxAge['"]/);
  });

  test('OCL-02: aldersspenn renderes sant — 99+ kun fra eksplisitt null (REV 1.2)', () => {
    const { formatAgePrefRange } = require('@/lib/onboarding/age-label');
    // 99+ (agePrefMax = null) = ingen øvre aldersgrense → «99+».
    expect(formatAgePrefRange(21, null)).toBe('21–99+');
    expect(formatAgePrefRange(35, null)).toBe('35–99+');
    // Endelige intervaller er alltid faktiske tall.
    expect(formatAgePrefRange('21', '40')).toBe('21–40');
    expect(formatAgePrefRange(30, 55)).toBe('30–55');
    // Manglende data → nøytral tekst, aldri et falskt intervall.
    expect(formatAgePrefRange(undefined, 40)).toBe('Ikke valgt');
    expect(formatAgePrefRange(21, undefined)).toBe('Ikke valgt');
    expect(formatAgePrefRange(undefined, null)).toBe('Ikke valgt');
    // Oppsummeringen bruker helperen (rendering dekkes ovenfor).
    const sum = read('app/onboarding/steps/Step9Oppsummering.tsx');
    expect(sum).toContain('formatAgePrefRange');
  });

  test('OCL-03: oppsummeringen påstår ikke «hele profilen» / «komplett»', () => {
    const sumActive = stripComments(
      read('app/onboarding/steps/Step9Oppsummering.tsx'),
    ).toLowerCase();
    expect(sumActive).not.toContain('hele profilen');
    expect(sumActive).not.toContain('komplett');
    expect(sumActive).not.toContain('perfekt');
    expect(sumActive).not.toContain('ferdig for alltid');
  });

  test('OCL-04: ERQ-brukeren ser følelser, ikke kjønnsroller', () => {
    const erqActive = stripComments(
      read('app/onboarding/steps/Step8ModenNysgjerrighet.tsx'),
    );
    expect(erqActive).not.toContain('Romslighet i kjønnsrelaterte roller');
    expect(erqActive).toContain('Følelser i hverdagen');
    // Internt skjemanavn må ikke sive ut i aktiv copy.
    expect(erqActive).not.toContain('ERQ-6');
    expect(erqActive).not.toContain('emosjonsregulering');
  });

  test('OCL-05: ingen aktiv «Sparar» (nynorsk loading) i onboarding', () => {
    expect(onboardingCopy).not.toContain('Sparar');
  });

  test('OCL-06: ingen korrupt «Serîg» i onboarding', () => {
    expect(onboardingCopy).not.toContain('Serîg');
    expect(onboardingCopy).not.toContain('serig langsiktig');
  });

  test('OCL-07: ingen ødelagt «Hva grense»-spørsmålstekst', () => {
    expect(onboardingCopy).not.toContain('Hva grense');
  });

  test('OCL-08: hard-boundary UI forklarer blokkerende konsekvens', () => {
    const valg = stripComments(read('app/onboarding/components/Valgvikt.tsx'));
    expect(valg).toContain('hard grense');
    expect(valg).toContain('blir dere ikke koblet');
    const step1 = stripComments(read('app/onboarding/steps/Step1Profile.tsx'));
    // Alder er en hard grense — forklart der valget skjer.
    expect(step1).toContain('hard grense: vi kobler deg ikke med noen utenfor dette spennet');
  });

  test('OCL-09: religion/livssyn hard-boundary-forklaring matcher runtimesemantikken', () => {
    const step1 = stripComments(read('app/onboarding/steps/Step1Profile.tsx'));
    expect(step1).toContain('en kobling skjer bare hvis dere er åpne for hverandre her');
    // Runtimesemantikken (tosidig akseptliste, religionOpen) er intakt.
    const deal = read('lib/matching/dealbreaker.ts');
    expect(deal).toContain('checkReligionCompat');
    expect(deal).toContain('religionOpen === true');
  });

  test('OCL-10: 18 som laveste alder er bevart (A18)', () => {
    const { MIN_AGE } = require('@/config/legal');
    expect(MIN_AGE).toBe(18);
    const step1 = stripComments(read('app/onboarding/steps/Step1Profile.tsx'));
    expect(step1).toContain('MIN_AGE');
  });

  test('OCL-11: 99+ er tilgjengelig som maks-alternativ — ærlig, åpen hjelpetekst (REV 1.2)', () => {
    const step1 = stripComments(read('app/onboarding/steps/Step1Profile.tsx'));
    expect(step1).toContain('99+');
    expect(step1).toContain('ob-age-pref-99');
    expect(step1).toContain('99+ betyr at du ikke setter noen øvre aldersgrense');
    // Må ikke implisere at minimum blir 99, eller at 99 er et endelig tak.
    expect(step1).not.toContain('99 år eller eldre');
    // REV 1.2: chippen skriver null (åpen øvre grense) — aldri en sentinel.
    expect(step1).toContain("onChange('agePrefMax', null)");
  });

  test('OCL-12: oppsummeringen renderer viktige valg fra canonical state', () => {
    const Step9Oppsummering = require('@/app/onboarding/steps/Step9Oppsummering').default;
    const html = renderToStaticMarkup(
      React.createElement(Step9Oppsummering, {
        data: {
          identityName: 'Sofia',
          age: '30',
          gender: 'Kvinne',
          seekingGender: 'Mann',
          city: 'Oslo',
          distancePref: 50,
          agePrefMin: 24,
          agePrefMax: null, // REV 1.2: 99+ (åpen øvre grense)
          religion: 'Agnostiker',
          acceptedReligions: 'Agnostiker',
          religionOpen: '',
          wantChildren: 'Ja',
          bil: 'full-el',
          bilViktig: 'ma-stemme',
          relationshipSeeking: 'langvarig parforhold',
        },
        onNext: () => undefined,
        step: 11,
        goToStep: () => undefined,
      }),
    );
    expect(html).toContain('Se over før du går videre');
    expect(html).toContain('Sofia');
    expect(html).toContain('24–99+');
    expect(html).toContain('Full lader'); // lesbar label, ikke intern verdi
    expect(html).toContain('må stemme');
    expect(html).toContain('Agnostiker');
  });

  test('OCL-13: siste handling beskriver kø-overgangen ærlig', () => {
    const step10 = stripComments(read('app/onboarding/steps/Step10StartReisen.tsx'));
    expect(step10).toContain('lagres profilen og du stilles i kø');
    expect(step10).toContain('natt til lørdag');
    expect(step10).toContain('venter du til neste runde');
    expect(step10).toContain('Lagrer og stiller deg i kø…');
  });

  test('OCL-14: ingen falsk match-garanti i onboarding', () => {
    const copy = onboardingCopy.toLowerCase();
    expect(copy).not.toContain('garanterer');
    expect(copy).not.toContain('matchgaranti');
    expect(copy).not.toContain('du får en match');
    expect(copy).not.toMatch(/match(ing)? hver uke/);
  });

  test('OCL-15: frozen content libraries er uendrede', () => {
    expect(sha256('app/questions/data/questions.ts')).toBe(
      '8a107e0a4715fd5fe934211a18495e935e75b4f9245a9622d1e1509ffd75d25e',
    );
    expect(sha256('app/chat/data/tasks.ts')).toBe(
      '04558d9a6fa4ecd064df2254dbf0815d267624f17e4cf2e2fefbb4615bf872ff',
    );
  });

  test('OCL-16: required/optional-semantikken er uendret', () => {
    const { validateAllOnboardingSteps } = require('@/lib/validation/onboarding-steps');
    const empty: Record<string, unknown> = {};
    const incomplete = validateAllOnboardingSteps(empty);
    const steps = incomplete.map((v: { step: number }) => v.step).sort((a: number, b: number) => a - b);
    // De samme stegene som før ACT-en har obligatoriske felt.
    expect(steps).toEqual([0, 1, 3, 5, 8, 10]);
    // Steg 0: nøyaktig de samme ni feltene som før.
    const s0 = incomplete.find((v: { step: number }) => v.step === 0);
    const fields = s0.errors.map((e: { field: string }) => e.field).sort();
    expect(fields).toEqual(
      [
        'age',
        'agePrefMax',
        'agePrefMin',
        'city',
        'distancePref',
        'gender',
        'identityName',
        'postalCode',
        'seekingGender',
      ].sort(),
    );
  });

  test('OCL-17: stegantall og -rekkefølge er uendret (13 steg)', () => {
    const flow = read('app/onboarding/OnboardingFlow.tsx');
    expect(flow).toContain('const totalSteps = 13');
    expect(flow).toMatch(/case 0:/);
    expect(flow).toMatch(/case 11:/);
    expect(flow).toMatch(/case 12:/);
  });

  test('OCL-18: consent-logikk og samtykkeside er uendret', () => {
    expect(sha256('app/api/consent/route.ts')).toBe(
      '423f20665ff17d613a8e6f862963875e749d27049a93176236c246d6feb54bdf',
    );
    expect(sha256('app/samtykke/page.tsx')).toBe(
      '4a202635920f91e060247014d1220619fdfd7a3e3ccf065dac04dba8ecf85fee',
    );
  });

  test('OCL-19: matching — REV 1.2 + O2 P1 er de tillatte endringene', () => {
    // Tillatte matching-endringer:
    //  (1) REV 1.2 (produktbeslutning): agePrefMax = null betyr 99+ (åpen øvre
    //      grense — ingen maks-alder-dealbreaker).
    //  (2) O2 P1 (godkjent spes): kosthold er nå flervalg (maks 2) — isKompatibel/
    //      isL2026Kompatibel generaliserer single-verdi-tjekk til én kompatibel
    //      par. Ingen ny hard grense; scoring (dimensions.ts) er uendret.
    // Atferdslinjene for alder er låst byte-nøyaktig under.
    expect(sha256('lib/matching/dealbreaker.ts')).toBe(
      '6621f2b800f3896c07d89260ee34f4e80ebd589f3f35fc40b1ecd8aff2fa25e6',
    );
    const dealbreaker = read('lib/matching/dealbreaker.ts');
    // Endelig maks blokkerer fortsatt kun ved alder > maks; minimum ved
    // alder < min; null-maks gjør ingen maks-alder-sjekk.
    expect(dealbreaker).toContain('if (min != null && age < min) {');
    expect(dealbreaker).toContain('if (max != null && age > max) {');
    // Alt annet i matchingen er uendret (identiske hashes):
    expect(sha256('lib/matching/cheapFeatures.ts')).toBe(
      '9aa2b3e79cb13f232dc57a6fd245a30f4a0a3df8b32349c2124311bcde8a1440',
    );
    expect(sha256('lib/matching/dimensions.ts')).toBe(
      'e4077caa71c933fa292695615767baee9175391e48d471c465bbcb6ed0c470c8',
    );
    expect(sha256('lib/matching/unifiedScorer.ts')).toBe(
      'e3cd79f35882a9c2f4fcb95cab0599cac338c9aed29d0bfdbad368ca8ff3e23b',
    );
    expect(sha256('lib/matching/scoreRound.ts')).toBe(
      '75261b984f241f027d04b3fba591011742c031019c5f8992e49cb54d18386a7f',
    );
    // Profilskjemaet er oppdatert NØYACT som REV 1.2 + A18 krever: agePrefMax
    // blir nullable med endelig tak 98 — og brukerens EGEN alder (maks 99)
    // er uendret. A18: minimumsalder leser MIN_AGE (18) — ingen hardkodet 21.
    expect(sha256('lib/validation/onboarding-setup.ts')).toBe(
      '98247e33f2763a6f9d82ef0a392f91b7cbd01758ed46f954af58207c85993707',
    );
    const setup = read('lib/validation/onboarding-setup.ts');
    expect(setup).toContain('agePrefMax: z.coerce.number().min(MIN_AGE).max(98).nullable(),');
    expect(setup).toContain('age: z.coerce.number().min(MIN_AGE, `Du må være minst ${MIN_AGE} år`).max(99, \'Alder kan ikke være over 99\'),');
  });

  test('OCL-20: personvern-claims unngår feil eksklusivitet', () => {
    const copy = onboardingCopy.toLowerCase();
    expect(copy).not.toContain('brukes kun');
    expect(copy).not.toContain('ser kun');
    expect(copy).not.toContain('bare matchingmotoren');
    // Det nøytrale, presise claimet er til stede i steg 1.
    expect(onboardingCopy).toContain('Svarene dine brukes i matchingen — de vises ikke offentlig.');
  });

  test('OCL-21: grensespørsmålet bruker godkjent formulering og semantikk (REV 1.1)', () => {
    const step8 = stripComments(read('app/onboarding/steps/Step8Grenser.tsx'));
    // Godkjent formulering — «skal aldri kruses» er fjernet (PRE-COMMIT
    // TRUTH CHECK): «kryss*/krus*»-ord er borte fra aktiv copy.
    expect(step8).toContain('Hvilke grenser er avgjørende for deg?');
    expect(step8.toLowerCase()).not.toContain('kryss');
    expect(step8.toLowerCase()).not.toContain('krus');
    // Semantikk: brukeren velger EGENE grenser som betyr mest (min 1,
    // maks 2) — ikke hard matchingsgrense («Hva må stemme...» ville
    // misvisse siden feltet har ingen matcheringsvirkning).
    expect(step8).toContain('Velg opptil to — det som betyr mest for deg');
    expect(step8).toContain('maxSelected={2}');
    for (const v of ['respekt', 'tid-aleine', 'venner', 'selvstende', 'sandhet']) {
      expect(step8).toContain(`value: '${v}'`);
    }
    // Matcheringsvirkning: ingen — neverCrossBoundary brukes ikke i
    // matching-motoren (verken i dealbreakers eller scoringer).
    for (const f of listFiles('lib/matching')) {
      expect(readFileSync(f, 'utf-8')).not.toContain('neverCrossBoundary');
    }
  });
});
