/**
 * WP2 (2026-08-24) — toOnboardingData: Profile (DB) → flat onboarding-state
 *
 * Mapperen er éin kilde for prefill ved re-inngang til onboarding.
 * Testene sikrer at alt /api/profile/setup persisterer (inkl. de additive
 * grenser-/livsstil-/relasjonsStil-nøklene) kommer tilbake i UI-ets flate
 * felt — og at tomme/manglende data ikke polluerer prefillen.
 */

import { toOnboardingData, type ProfileRow } from '@/lib/profile/toOnboardingData';

function makeProfile(overrides: Partial<ProfileRow> = {}): ProfileRow {
  return {
    identityName: null,
    age: null,
    lifeSituation: null,
    lifestyle: null,
    personality: null,
    communication: null,
    intimacy: null,
    futureVision: null,
    boundaries: null,
    emotionalNeeds: null,
    securityLevel: null,
    psychometricAnswers: null,
    deepProfileData: null,
    ...overrides,
  };
}

describe('toOnboardingData — full round-trip av persistert data', () => {
  // Konstruert slik /api/profile/setup skriver den (WP2-innhold)
  const profile = makeProfile({
    identityName: 'Astrid',
    age: 32,
    lifeSituation: { gender: 'Kvinne', seekingGender: 'Mann', city: 'Bergen' },
    lifestyle: {
      height: 168, bodyType: 'slank', lifestyleType: 'aktiv', smoking: 'ne',
      children: 'nei', wantChildren: 'ja',
      highPriority: 'helse', lowPriority: 'status', goodEveryday: 'tur',
      desiredLifestyle: 'rolig', undesiredLifestyle: 'kaféomslått',
    },
    personality: {
      selfDesc: 'Rolig og nysgjerrig', energyGiver: 'morgenkaffe',
      energyDrainer: 'støy', pressureReact: 'ta et pust', quirk: 'murmurer til planter',
    },
    communication: { calmingHelp: 'rolig tone', trigger: 'avbrudd', trustBuilder: 'trofasthet' },
    intimacy: {
      loveGive: 'klem', loveReceive: 'ord', closenessBuilder: 'deler mat',
      distanceCreator: 'trenger alenetid', smallThing: 'latter',
    },
    futureVision: {
      futureVision: 'eie eget sted', dreamGoal: 'reise', buildTogether: 'hverdag',
      experienceAlone: 'bok', experienceTogether: 'konserter',
    },
    boundaries: {
      laughterTrigger: 'absurde sammenligninger', quirkyHabit: 'sorterer bøker',
      guiltyPleasure: 'tv-serier', totallyYou: 'morgenritual', partnerWouldLaugh: 'fuglerop',
      neverCrossBoundary: 'alenetid', understandPartnersBoundaries: 'ja, viktig',
      limitations: 'ikke til barn akkurat nå', partnerMustUnderstand: 'si ifra før planer',
    },
    emotionalNeeds: {
      safetyNeed: 'forutsigbarhet', insecurityTrigger: 'svaret tar lang tid',
      sadnessNeed: 'klem uten ord', stressNeed: 'stillhet', importantBoundary: 'honnør',
    },
    securityLevel: 'secure',
    psychometricAnswers: { bfi1: 4, att_a1: 2, bfi2: '3', att_a2: 0, bfi3: 6 },
    deepProfileData: {
      distancePref: 80, agePrefMin: 28, agePrefMax: 42, religion: 'spirituell',
      politicsImportance: 6, religionImportance: 4, dietPreference: 'vegetar',
      sleepSchedule: 'natt', pets: 'katt', travelFreq: 'sjelden',
      alcoholFreq: 'aldri', ambitionLevel: 'høy', structureSpontaneity: 'struktur',
      introExtrovert: 'introvert',
      relasjonsStil: {
        relationshipSeeking: 'rolig påbygd', closenessNeed: 'middels',
        independenceBalance: 'selvstendig',
      },
    },
  });

  it('skal mappe grunnprofil (navn, alder som string, kjønn, søk, by)', () => {
    const { data, complete } = toOnboardingData(profile, true);
    expect(complete).toBe(true);
    expect(data.identityName).toBe('Astrid');
    expect(data.age).toBe('32'); // number → string (UI-et bruker string)
    expect(data.gender).toBe('Kvinne');
    expect(data.seekingGender).toBe('Mann');
    expect(data.city).toBe('Bergen');
  });

  it('skal mappe livsstil inkl. de additive 5a-grid-feltene', () => {
    const { data } = toOnboardingData(profile, true);
    expect(data.height).toBe('168'); // number → string
    expect(data.bodyType).toBe('slank');
    expect(data.lifestyle).toBe('aktiv'); // lifestyleType → lifestyle
    expect(data.smoking).toBe('ne');
    expect(data.children).toBe('nei');
    expect(data.wantChildren).toBe('ja');
    expect(data.highPriority).toBe('helse');
    expect(data.lowPriority).toBe('status');
    expect(data.goodEveryday).toBe('tur');
    expect(data.desiredLifestyle).toBe('rolig');
    expect(data.undesiredLifestyle).toBe('kaféomslått');
  });

  it('skal mappe personlighet, kjærlighet og fremtid', () => {
    const { data } = toOnboardingData(profile, true);
    expect(data.selfDesc).toBe('Rolig og nysgjerrig');
    expect(data.quirk).toBe('murmurer til planter');
    expect(data.loveGive).toBe('klem');
    expect(data.smallThing).toBe('latter');
    expect(data.futureVision).toBe('eie eget sted');
    expect(data.experienceTogether).toBe('konserter');
  });

  it('skal mappe humor + grenser fra boundaries-kolonnen', () => {
    const { data } = toOnboardingData(profile, true);
    expect(data.laughterTrigger).toBe('absurde sammenligninger');
    expect(data.partnerWouldLaugh).toBe('fuglerop');
    expect(data.neverCrossBoundary).toBe('alenetid');
    expect(data.understandPartnersBoundaries).toBe('ja, viktig');
    expect(data.limitations).toBe('ikke til barn akkurat nå');
    expect(data.partnerMustUnderstand).toBe('si ifra før planer');
  });

  it('skal mape kommunikasjon invers (calmingHelp → comfortableWith m.fl.)', () => {
    const { data } = toOnboardingData(profile, true);
    expect(data.comfortableWith).toBe('rolig tone');
    // emotionalNeeds er kanonisk; communication.trigger/trustBuilder er fallback
    expect(data.insecurityTrigger).toBe('svaret tar lang tid');
    expect(data.safetyNeed).toBe('forutsigbarhet');
    expect(data.importantBoundary).toBe('honnør');
  });

  it('skal mape deepProfileData (preferanser + aldersgrenser) og relasjonsStil', () => {
    const { data } = toOnboardingData(profile, true);
    expect(data.distancePref).toBe(80);
    expect(data.agePrefMin).toBe(28);
    expect(data.agePrefMax).toBe(42);
    expect(data.religion).toBe('spirituell');
    expect(data.politicsImportance).toBe(6);
    expect(data.structureSpontaneity).toBe('struktur');
    expect(data.introExtrovert).toBe('introvert');
    expect(data.relationshipSeeking).toBe('rolig påbygd');
    expect(data.closenessNeed).toBe('middels');
    expect(data.independenceBalance).toBe('selvstendig');
    expect(data.attachmentStyle).toBe('secure'); // ← securityLevel
  });

  it('skal mappe psykometriske svar innenfor 1–5 (inkl. streng) og utelate resten', () => {
    const { data } = toOnboardingData(profile, true);
    expect(data.bfi1).toBe(4);
    expect(data.att_a1).toBe(2);
    expect(data.bfi2).toBe(3); // '3' (string) normaliseres
    expect(data.att_a2).toBeUndefined(); // 0 — utenfor intervall
    expect(data.bfi3).toBeUndefined(); // 6 — utenfor intervall
  });
});

describe('toOnboardingData — defensive utfall', () => {
  it('skal returnere tom data for null-profil', () => {
    const result = toOnboardingData(null, false);
    expect(result.data).toEqual({});
    expect(result.complete).toBe(false);
  });

  it('skal utelate tomme/missing-felt (ingen pollusjon av prefillen)', () => {
    const sparse = makeProfile({ identityName: 'Bare Navn' });
    const { data } = toOnboardingData(sparse, false);
    expect(data).toEqual({ identityName: 'Bare Navn' });
  });

  it('skal hoppe over tomme streng- og null-verdier i JSON-kolonnene', () => {
    const empty = makeProfile({
      lifeSituation: { gender: '', seekingGender: null, city: '   ' },
      deepProfileData: { distancePref: null, agePrefMin: 'abc' },
    });
    const { data } = toOnboardingData(empty, false);
    expect(data).toEqual({});
  });

  it('skal bruke communication-fallback når emotionalNeeds mangler', () => {
    const p = makeProfile({
      communication: { calmingHelp: 'klem', trigger: 'bråk', trustBuilder: 'lov' },
    });
    const { data } = toOnboardingData(p, false);
    expect(data.comfortableWith).toBe('klem');
    expect(data.insecurityTrigger).toBe('bråk');
    expect(data.safetyNeed).toBe('lov');
  });

  it('skal ignorere ugyldig relasjonsStil (ikke-objekt)', () => {
    const p = makeProfile({ deepProfileData: { relasjonsStil: 'ikke-objekt' } });
    const { data } = toOnboardingData(p, false);
    expect(data.relationshipSeeking).toBeUndefined();
    expect(data).toEqual({});
  });

  it('skal passere complete-flagget gjennom', () => {
    expect(toOnboardingData(makeProfile({}), true).complete).toBe(true);
    expect(toOnboardingData(makeProfile({}), false).complete).toBe(false);
  });
});

describe('toOnboardingData — livssituasjon (steg 2b) fra lifeSituation-kolonnen', () => {
  it('pre-fyller alle seks livssituasjonsfelt', () => {
    const p = makeProfile({
      lifeSituation: {
        gender: 'Kvinne', seekingGender: 'Mann', city: 'Bergen',
        workType: 'anstatt-fulltid,studier',
        housingType: 'leilighet,hus',
        householdSize: '2',
        economicStability: 'stabil,sparing',
        responsibilities: 'Jeg har to barn som bor hos meg.',
        dailyRoutine: 'Jeg står opp tidlig og drikker kaffe i ro.',
      },
    });
    const { data } = toOnboardingData(p, true);
    expect(data.city).toBe('Bergen');
    // Flervalg (kommaseparert) må round-trippe helt — grid markerer begge valgte
    expect(data.workType).toBe('anstatt-fulltid,studier');
    expect(data.housingType).toBe('leilighet,hus');
    expect(data.householdSize).toBe('2');
    expect(data.economicStability).toBe('stabil,sparing');
    expect(data.responsibilities).toBe('Jeg har to barn som bor hos meg.');
    expect(data.dailyRoutine).toBe('Jeg står opp tidlig og drikker kaffe i ro.');
  });

  it('pre-fyller ikke livssituasjonsfelt når kolonnen mangler dem (legacy-profiler)', () => {
    const p = makeProfile({ lifeSituation: { gender: 'Kvinne', seekingGender: 'Mann', city: 'Bergen' } });
    const { data } = toOnboardingData(p, true);
    expect(data.city).toBe('Bergen');
    expect(data.workType).toBeUndefined();
    expect(data.housingType).toBeUndefined();
    expect(data.householdSize).toBeUndefined();
    expect(data.economicStability).toBeUndefined();
    expect(data.responsibilities).toBeUndefined();
    expect(data.dailyRoutine).toBeUndefined();
  });
});