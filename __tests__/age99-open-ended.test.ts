/**
 * 99+ PRODUKTBESLUKT (REV 1.2) — AGE99-01..13
 *
 * Produktinvariant: alderspreferanse kan være et endelig interval
 * (min 21–99, maks 21–98) ELLER åpent oppover: 99+ = INGEN øvre
 * aldersgrense. Kanonisk representasjon: agePrefMax = null (eksplisitt,
 * ingen magisk sentinel).
 *
 * Disse testene låser NØYACTE semantics for den ene tillatte
 * matching-endringen i O1: åpen øvre maks-alder. Minimum-alder og alle
 * øvrige dealbreakers er uendret (se OCL-19 og dealbreaker-testene).
 */

import { sjekkAlleDealbreakers, toAgeNumber } from '@/lib/matching/dealbreaker';
import type { ProfileData } from '@/lib/matching/types';
import { basicProfileSchema } from '@/lib/validation/onboarding-setup';
import { validateOnboardingStep } from '@/lib/validation/onboarding-steps';
import { toOnboardingData } from '@/lib/profile/toOnboardingData';
import { formatAgePrefRange } from '@/lib/onboarding/age-label';

function makeProfile(overrides: Partial<ProfileData> = {}): ProfileData {
  return {
    userId: 'test-id',
    firstName: 'Test',
    lastName: 'Person',
    age: 30,
    bio: null,
    interests: [],
    matchTags: [],
    personality: { traits: ['open'] },
    lifeSituation: null,
    relationshipStyle: 'gradual',
    communication: { style: 'direct' },
    futureVision: { goals: ['growth'] },
    boundaries: null,
    emotionalNeeds: { needs: ['trust'] },
    lifeRhythm: 'morning',
    maturityLevel: 5,
    securityLevel: 'secure',
    lifestyle: null,
    intimacy: null,
    preferences: null,
    latitude: null,
    longitude: null,
    distancePref: null,
    deepProfileData: null,
    ...overrides,
  };
}

/** Søker med alderspreferanse (min, maks — null = 99+) mot en kandidat-alder. */
function alderBlokkerer(min: number | null, max: number | null, kandidatAlder: number): boolean {
  const seeker = makeProfile({
    userId: 'seeker',
    age: 35,
    deepProfileData: { agePrefMin: min, agePrefMax: max },
  });
  const kandidat = makeProfile({ userId: 'kandidat', age: kandidatAlder });
  return sjekkAlleDealbreakers(seeker, kandidat).hasDealbreaker;
}

describe('99+ = åpen øvre grense (REV 1.2) — matching-semantikk', () => {
  test('AGE99-01: min 21 / maks 99+ (null) godtar alder 99', () => {
    expect(alderBlokkerer(21, null, 99)).toBe(false);
  });

  test('AGE99-02: min 21 / maks 99+ (null) godtar alder 100', () => {
    expect(alderBlokkerer(21, null, 100)).toBe(false);
  });

  test('AGE99-03: min 21 / maks 99+ (null) har ingen øvre aldersavvisning', () => {
    // Uansett hvor høy kandidat-alderen er, blokkerer aldri maks-alder.
    for (const alder of [99, 100, 101, 120]) {
      expect(alderBlokkerer(21, null, alder)).toBe(false);
    }
  });

  test('AGE99-04: endelig maks 40 avviser alder 41', () => {
    expect(alderBlokkerer(21, 40, 41)).toBe(true);
  });

  test('AGE99-05: endelig maks 40 godtar alder 40', () => {
    expect(alderBlokkerer(21, 40, 40)).toBe(false);
  });

  test('AGE99-06: minimum alder fungerer uendret (åpen maks)', () => {
    // Min 28, 99+: under min blokkeres; min selv godtas.
    expect(alderBlokkerer(28, null, 27)).toBe(true);
    expect(alderBlokkerer(28, null, 28)).toBe(false);
    // Og med endelig maks, akkurat som før.
    expect(alderBlokkerer(28, 45, 27)).toBe(true);
    expect(alderBlokkerer(28, 45, 28)).toBe(false);
  });

  test('AGE99-07: 35–99+ avviser alder 34', () => {
    expect(alderBlokkerer(35, null, 34)).toBe(true);
  });

  test('AGE99-08: 35–99+ godtar alder 35', () => {
    expect(alderBlokkerer(35, null, 35)).toBe(false);
  });

  test('AGE99-09: 35–99+ godtar alder 99', () => {
    expect(alderBlokkerer(35, null, 99)).toBe(false);
  });

  test('AGE99-10: 35–99+ godtar alder 100 (gyldig kandidat i runtime)', () => {
    // Profil-veien (lib/validation/profile.ts) tillater alder opptil 100,
    // så en 100-åring er en gyldig kandidat — og må IKKE blokkeres av 99+.
    expect(toAgeNumber(100)).toBe(100);
    expect(alderBlokkerer(35, null, 100)).toBe(false);
  });

  test('AGE99-13: ordinære endelige intervaller oppfører seg nøyaktig som før', () => {
    // 21–40: grensene med, utenfor blokkeres (begge sider).
    expect(alderBlokkerer(21, 40, 20)).toBe(true);
    expect(alderBlokkerer(21, 40, 21)).toBe(false);
    expect(alderBlokkerer(21, 40, 30)).toBe(false);
    expect(alderBlokkerer(21, 40, 40)).toBe(false);
    expect(alderBlokkerer(21, 40, 41)).toBe(true);
    // Manglende preferanse blokkerer fortsatt aldri (forsvarlig).
    expect(alderBlokkerer(null, null, 100)).toBe(false);
  });
});

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Step9Oppsummering from '@/app/onboarding/steps/Step9Oppsummering';

describe('99+ = åpen øvre grense (REV 1.2) — lagring, validering, prefill, visning', () => {
  const basicPayload = (agePrefMax: unknown) => ({
    identityName: 'Testbruker',
    age: 30,
    gender: 'Kvinne',
    seekingGender: 'Mann',
    height: '',
    bodyType: 'slank',
    lifestyle: 'aktiv',
    smoking: 'ne',
    religion: 'laik',
    acceptedReligions: '',
    religionOpen: false,
    children: 'nei',
    wantChildren: 'ja',
    city: 'Oslo',
    postalCode: '0150',
    distancePref: 50,
    agePrefMin: 21,
    agePrefMax,
  });

  test('AGE99-11: save/prefill roundtrip bevarer åpen tilstand', () => {
    // (a) Setup-skjemaet godtar eksplisitt null (99+) ...
    expect(basicProfileSchema.safeParse(basicPayload(null)).success).toBe(true);
    // ... og endelig 98 ...
    expect(basicProfileSchema.safeParse(basicPayload(98)).success).toBe(true);
    // ... men nekter tom streng (ikke valgt) og 99 som ENDELIG maks
    // (99 finnes kun via 99+ = null).
    expect(basicProfileSchema.safeParse(basicPayload('')).success).toBe(false);
    expect(basicProfileSchema.safeParse(basicPayload(99)).success).toBe(false);
    // Brukerens EGEN alder er uendret: 99 tillatt, 100 ikke.
    const egen99 = basicPayload(null);
    egen99.age = 99;
    expect(basicProfileSchema.safeParse(egen99).success).toBe(true);
    const egen100 = basicPayload(null);
    egen100.age = 100;
    expect(basicProfileSchema.safeParse(egen100).success).toBe(false);

    // (b) Prefill (re-inngang/redigering): null i deepProfileData må
    // komme fram som EKSPPLISITT null — ikke undefined/default.
    const tomProfil = {
      identityName: null, age: null, lifeSituation: null, lifestyle: null,
      personality: null, communication: null, intimacy: null, futureVision: null,
      boundaries: null, emotionalNeeds: null, securityLevel: null,
      psychometricAnswers: null, preferences: null,
    };
    const openPrefill = toOnboardingData(
      { ...tomProfil, deepProfileData: { agePrefMin: 21, agePrefMax: null } },
      true,
    );
    expect(openPrefill.data['agePrefMax']).toBe(null);
    expect('agePrefMax' in openPrefill.data).toBe(true);

    // (c) Endelig prefill forblir endelig.
    const finitePrefill = toOnboardingData(
      { ...tomProfil, deepProfileData: { agePrefMin: 21, agePrefMax: 40 } },
      true,
    );
    expect(finitePrefill.data['agePrefMax']).toBe(40);

    // (d) Steg-valideringen (frontend-gate) godtar null som gyldig valg,
    // og krever fortsatt et svar når feltet er tomt.
    const stepData = (max: unknown): Record<string, unknown> => ({
      identityName: 'Testbruker', age: 30, gender: 'Kvinne', seekingGender: 'Mann',
      city: 'Oslo', postalCode: '0150', distancePref: 50, agePrefMin: 21, agePrefMax: max,
    });
    const maxFeil = (max: unknown) =>
      validateOnboardingStep(0, stepData(max)).errors.filter((e) => e.field === 'agePrefMax');
    expect(maxFeil(null)).toHaveLength(0); // 99+ — gyldig
    expect(maxFeil(98)).toHaveLength(0); // endelig, innenfor
    expect(maxFeil('')).toHaveLength(1); // ikke valgt
    expect(maxFeil(99)).toHaveLength(1); // 99 finnes kun via 99+
  });

  test('AGE99-12: oppsummeringen renderer 99+ (35–99+), aldri interne verdier', () => {
    const html = renderToStaticMarkup(
      React.createElement(Step9Oppsummering, {
        data: {
          identityName: 'Sofia',
          age: '35',
          gender: 'Kvinne',
          seekingGender: 'Mann',
          city: 'Oslo',
          distancePref: 50,
          agePrefMin: 35,
          agePrefMax: null,
        },
        onNext: () => undefined,
        step: 11,
        goToStep: () => undefined,
      }),
    );
    expect(html).toContain('35–99+');
    expect(html).not.toContain('>null<');
    expect(html).not.toContain('>undefined<');
    expect(html).not.toContain('>No max<');

    // Endelig intervall renderes fortsatt som faktisk tall.
    expect(formatAgePrefRange(35, 45)).toBe('35–45');
  });
});