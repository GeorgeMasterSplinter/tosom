/**
 * ONBOARDING O2 PACKAGE 1 — målrettede guards (O2P1-01 – O2P1-35)
 *
 * Pakke 1 = forenkling + strukturerte inngang (godkjent spes):
 *   docs/ONBOARDING-O2-ACT-DESIGN-v1.0.md (FINAL SPEC TABLE er autoritet).
 *
 * Pakke 1 skal:
 *  - fjerne 11 fritekst-felt + 14 low-value/strukturede felt
 *  - love -> maks 3 (gi/motta), food -> maks 2, aktivitet/skjerm nøytrale labels
 *  - religion: BEVARE data-modell + matching (kun copy/UI-klargjøring)
 *  - IKKE innføre ny hard matching (bonus-family = Pakke 2, IKKE her)
 *  - BEVARE A18 / AGE99 / CPT / BLI KJENT / OPPGAVER / consent
 *
 * Mønsteret følger onboarding-language-clarity.test.ts: aktiv copy strenges
 * med kommentarfri lesing; logikk låses med hashes + unit-asserts.
 */

import { readFileSync } from 'fs';
import { createHash } from 'crypto';
import { join } from 'path';
import { sjekkAlleDealbreakers } from '@/lib/matching/dealbreaker';
import type { ProfileData } from '@/lib/matching/types';
import { validateOnboardingStep } from '@/lib/validation/onboarding-steps';
import { toOnboardingData } from '@/lib/profile/toOnboardingData';
import { MIN_AGE } from '@/config/legal';
import { JOURNEY_TOTAL_DAYS, PHOTO_REVEAL_DAY } from '@/config/journey';

const ROOT = join(__dirname, '..');

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

function sha256(rel: string): string {
  return createHash('sha256').update(read(rel)).digest('hex');
}

/** Fjerner kodekommentarer slik at guards kun måler aktiv kode. */
function stripComments(src: string): string {
  return src
    .replace(/\/*[\s\S]*?\*\//g, ' ')
    .replace(/(^|\s)\/\/[^\n]*/g, (_m, pre: string) => pre);
}

const STEP_FILES = [
  'app/onboarding/steps/Step1Profile.tsx',
  'app/onboarding/steps/Step2Personlighet.tsx',
  'app/onboarding/steps/Step2Livssituasjon.tsx',
  'app/onboarding/steps/Step3Tilknytning.tsx',
  'app/onboarding/steps/Step4Kjærlighetsspråk.tsx',
  'app/onboarding/steps/Step5LivsstilVerdier.tsx',
  'app/onboarding/steps/Step5Relasjonsstil.tsx',
  'app/onboarding/steps/Step6FramtidVisjon.tsx',
  'app/onboarding/steps/Step7HumorPersonlighet.tsx',
  'app/onboarding/steps/Step8Grenser.tsx',
  'app/onboarding/steps/Step8ModenNysgjerrighet.tsx',
  'app/onboarding/steps/Step10StartReisen.tsx',
];

function stepUi(): string {
  return STEP_FILES.map((f) => read(f)).join('\n');
}

const FREE_TEXT_FIELDS = [
  'selfDesc', 'quirk', 'smallThing', 'importantBoundary', 'independenceBalance',
  'limitations', 'partnerMustUnderstand', 'dreamGoal', 'buildTogether',
  'goodEveryday', 'boundary',
];

const LOW_VALUE_FIELDS = [
  'intimacySafety', 'comfortableWith', 'nearerType', 'needsTime',
  'workType', 'housingType', 'householdSize', 'economicStability',
  'responsibilities', 'dailyRoutine', 'lowPriority', 'desiredLifestyle',
  'undesiredLifestyle', 'bodyType',
];

const ALL_REMOVED_FIELDS = [...FREE_TEXT_FIELDS, ...LOW_VALUE_FIELDS];

function activeFieldRefs(src: string, field: string): number {
  const patterns = [
    `onChange('${field}'`, `getValue('${field}'`, `val('${field}'`,
    `data['${field}']`, `d['${field}']`,
  ];
  let c = 0;
  for (const p of patterns) c += src.split(p).length - 1;
  return c;
}

function makeProfile(overrides: Partial<ProfileData> = {}): ProfileData {
  return {
    userId: 'test-id', firstName: 'Test', lastName: 'Person', age: 30,
    bio: null, interests: [], matchTags: [], personality: null,
    lifeSituation: null, relationshipStyle: null, communication: null,
    futureVision: null, boundaries: null, emotionalNeeds: null,
    lifeRhythm: null, lifestyle: null, intimacy: null, preferences: null,
    deepProfileData: null, latitude: null, longitude: null, distancePref: null,
    ...overrides,
  } as ProfileData;
}

const OPEN = { gender: 'Mann', seekingGender: 'Alle kjønner' } as const;

const l2026 = (o: Record<string, unknown>) =>
  makeProfile({ lifeSituation: { ...OPEN }, preferences: { livsstil2026: o } });

const religion = (id: string, own: string | null, accepted: string | null) =>
  makeProfile({
    userId: id,
    lifeSituation: { ...OPEN },
    deepProfileData: {
      ...(own ? { religion: own } : {}),
      ...(accepted ? { acceptedReligions: accepted } : {}),
    },
  });

describe('ONBOARDING O2 PACKAGE 1 — guards (O2P1-01 – O2P1-35)', () => {
  test('O2P1-01: aktivt fritekst-inngang = 0 (ingen multiline i steg-UI)', () => {
    expect(stepUi()).not.toMatch(/\bmultiline\b/);
  });

  test('O2P1-02: structurerede påkrevde felt beholdes (love gi/motta)', () => {
    // Love gi/motta er fortsatt strukturerte valg (IKKE fritekst) og krevde av
    // Steg-4 sitt lokale validate. (Server-steget 4 kjører kun l2026-gaten.)
    const s4 = read('app/onboarding/steps/Step4Kjærlighetsspråk.tsx');
    expect(s4).toContain("field: 'loveGive'");
    expect(s4).toContain("field: 'loveReceive'");
    expect(s4).not.toMatch(/\bmultiline\b/);
  });

  test('O2P1-03: required free-text = 0 (ingen steg krevde fritekst-felt)', () => {
    for (let s = 0; s < 13; s++) {
      const { errors } = validateOnboardingStep(s, {});
      for (const f of FREE_TEXT_FIELDS) {
        expect(errors.some((e) => e.field === f)).toBe(false);
      }
    }
  });

  test('O2P1-04: selfDesc fraværende i aktiv onboarding', () => {
    expect(activeFieldRefs(stepUi(), 'selfDesc')).toBe(0);
  });

  test('O2P1-05: alle fjernede felt er fraværende som aktiv innsamling', () => {
    const ui = stepUi();
    for (const f of ALL_REMOVED_FIELDS) {
      expect(activeFieldRefs(ui, f)).toBe(0);
    }
  });

  test('O2P1-06: forkastede moden-felt + bestSelf fraværende (ERQ6 beholdes)', () => {
    const ui = stepUi();
    for (const f of ['intimacySafety', 'comfortableWith', 'nearerType', 'needsTime', 'bestSelf']) {
      expect(activeFieldRefs(ui, f)).toBe(0);
    }
    expect(ui).toContain('Følelser i hverdagen');
    expect(ui).toContain('ERQ6');
  });

  test('O2P1-07: housing (housingType) fraværende', () => {
    expect(activeFieldRefs(stepUi(), 'housingType')).toBe(0);
  });

  test('O2P1-08: household count (householdSize) fraværende', () => {
    expect(activeFieldRefs(stepUi(), 'householdSize')).toBe(0);
  });

  test('O2P1-09: responsibility (responsibilities) fraværende', () => {
    expect(activeFieldRefs(stepUi(), 'responsibilities')).toBe(0);
  });

  test('O2P1-10: skjerm strukturede felt tilstede (3 valg, single, uten ubestemt)', () => {
    const s2 = read('app/onboarding/steps/Step2Livssituasjon.tsx');
    expect(s2).toContain('Hvor mye tid bruker du på skjermen?');
    expect(s2).toContain("value: 'mye'");
    expect(s2).toContain("value: 'moderat'");
    expect(s2).toContain("value: 'vil-skru-ned'");
    expect(s2).toContain('Vil gjerne skru ned');
    const skjermBlock = s2.split('Hvor mye tid bruker du på skjermen?')[1]?.split('/>')[0] ?? '';
    expect(skjermBlock).not.toContain('ubestemt');
  });

  test('O2P1-11: egen religion/livssyn beholdes + godkjent self-copy', () => {
    const s1 = read('app/onboarding/steps/Step1Profile.tsx');
    expect(s1).toContain('Religion / livssyn');
    expect(s1).toContain("onChange('religion'");
    expect(s1).toContain('Velg det som beskriver deg.');
    expect(s1).not.toContain('Mange har røtter');
  });

  test('O2P1-12: partner-akseptliste beholdes', () => {
    const s1 = read('app/onboarding/steps/Step1Profile.tsx');
    expect(s1).toContain('Hvilke religioner/livssyn er du åpen for hos en partner?');
    expect(s1).toContain("onChange('acceptedReligions'");
  });

  test('O2P1-13: religion maks valg uendret (maxSelected={4} for egen + aksept)', () => {
    const matches = read('app/onboarding/steps/Step1Profile.tsx').match(/maxSelected=\{4\}/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  test('O2P1-14: religion matching-semantikk uendret (ANY-overlap, bilateral)', () => {
    const a = religion('a', 'Judedom', null);
    const b = religion('b', 'Kristen', 'Kristen,Ateist');
    expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(true);
    expect(sjekkAlleDealbreakers(b, a).hasDealbreaker).toBe(true);
    const a2 = religion('a2', 'Judedom,Kristen', 'Kristen');
    const b2 = religion('b2', 'Kristen', 'Kristen');
    expect(sjekkAlleDealbreakers(a2, b2).hasDealbreaker).toBe(false);
    expect(sjekkAlleDealbreakers(b2, a2).hasDealbreaker).toBe(false);
  });

  test('O2P1-15: love giving maks 3 + helper', () => {
    const s4 = read('app/onboarding/steps/Step4Kjærlighetsspråk.tsx');
    const give = s4.split('Hvordan viser du kjærlighet?')[1]?.split('/>')[0] ?? '';
    expect(give).toContain('maxSelected={3}');
    expect(give).toContain('Velg opptil tre.');
  });

  test('O2P1-16: love receiving maks 3 + helper', () => {
    const s4 = read('app/onboarding/steps/Step4Kjærlighetsspråk.tsx');
    const recv = s4.split('Hvordan ønsker du kjærlighet?')[1]?.split('/>')[0] ?? '';
    expect(recv).toContain('maxSelected={3}');
    expect(recv).toContain('Velg opptil tre.');
  });

  test('O2P1-17: gammel love-seleksjon (1-2) forblir gyldig via prefill', () => {
    const r = toOnboardingData({
      identityName: 'X', age: 30,
      lifeSituation: { gender: 'Kvinne', seekingGender: 'Mann', city: 'Oslo' },
      lifestyle: null, personality: null,
      communication: null,
      intimacy: { loveGive: 'ord,tid', loveReceive: 'tid' },
      futureVision: null, boundaries: null, emotionalNeeds: null,
      securityLevel: null, psychometricAnswers: null, deepProfileData: null, preferences: null,
    }, true);
    expect(r.data['loveGive']).toBe('ord,tid');
    expect(r.data['loveReceive']).toBe('tid');
  });

  test('O2P1-18: food maks 2', () => {
    const s5 = read('app/onboarding/steps/Step5LivsstilVerdier.tsx');
    const kosthold = s5.split('Hvordan spiser du?')[1]?.split('/>')[0] ?? '';
    expect(kosthold).toContain('maxSelected={2}');
    expect(kosthold).toContain('Velg opptil to.');
  });

  test('O2P1-19: food ugyldig kombinasjon forhindres (spiser-koett ⊕ vegetar/vegan)', () => {
    const bad = validateOnboardingStep(5, { kosthold: 'spiser-koett,vegetar' });
    expect(bad.errors.some((e) => e.field === 'kosthold')).toBe(true);
    const ok = validateOnboardingStep(5, { kosthold: 'vegetar,fisk' });
    expect(ok.errors.some((e) => e.field === 'kosthold')).toBe(false);
  });

  test('O2P1-20: food lagrede token beholdes (ingen migrasjon)', () => {
    const s5 = read('app/onboarding/steps/Step5LivsstilVerdier.tsx');
    for (const token of ['spiser-koett', 'fleksitar', 'vegetar', 'vegan', 'fisk']) {
      expect(s5).toContain(`value: '${token}'`);
    }
  });

  test('O2P1-21: activity endelige valg tilstede (5 verdier uendret, nøytralt)', () => {
    const s5 = read('app/onboarding/steps/Step5LivsstilVerdier.tsx');
    for (const token of ['gym', 'lop-turer', 'lagidrett', 'natur-fritid', 'lite']) {
      expect(s5).toContain(`value: '${token}'`);
    }
    expect(s5).toContain('Tar det rolig');
    expect(s5).not.toContain('Lite aktiv');
  });

  test('O2P1-22: activity matching-modell bevart (overlap, ≥1 felles)', () => {
    const a = l2026({ aktivitet: 'gym,lop-turer', aktivitetViktig: 'ma-stemme' });
    const b = l2026({ aktivitet: 'lop-turer,lite', aktivitetViktig: 'ma-stemme' });
    expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(false);
    const c = l2026({ aktivitet: 'gym', aktivitetViktig: 'ma-stemme' });
    const d = l2026({ aktivitet: 'lite', aktivitetViktig: 'ma-stemme' });
    expect(sjekkAlleDealbreakers(c, d).hasDealbreaker).toBe(true);
  });
  /* ── Kosthold matching (flervalg, spec-autorisert generalisering) ──── */

  test('O2P1-28b: kosthold flervalg matching — én kompatibel par er nok', () => {
    const a = l2026({ kosthold: 'vegetar', kostholdViktig: 'ma-stemme' });
    const b = l2026({ kosthold: 'vegetar,fisk', kostholdViktig: 'ma-stemme' });
    expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(false);
    const c = l2026({ kosthold: 'vegan', kostholdViktig: 'ma-stemme' });
    const d = l2026({ kosthold: 'spiser-koett', kostholdViktig: 'ma-stemme' });
    expect(sjekkAlleDealbreakers(c, d).hasDealbreaker).toBe(true);
  });

  /* ── Oppsummering ──────────────────────────────────────────────────── */

  test('O2P1-23: ingen fjernede O2-P1-felt i aktiv oppsummering (Step9)', () => {
    // Produkt: fjernede felt skal IKKE renderes i oppsummeringen — ikke engang
    // for legacy-profiler. Step9 har ingen aktiv rad for et fjernet felt.
    const s9 = read('app/onboarding/steps/Step9Oppsummering.tsx');
    for (const f of ALL_REMOVED_FIELDS) {
      expect(s9).not.toMatch(new RegExp(`(?:val|fmt|gatedVal)\\('${f}\\'`));
    }
    // Ny copy beholdes i de aktive label-mappene.
    expect(s9).toContain('Spiser det meste');
    expect(s9).toContain('Tar det rolig');
    expect(s9).toContain('Vil gjerne skru ned');
  });

  test('O2P1-36: tom oppsummerings-seksjon (Moden nysgjerrighet) ikke renderes', () => {
    // Alle 5 felter i «Moden nysgjerrighet» var fjernet i O2 P1 → seksjonen er
    // tom og må ikke renderes som tomt kort.
    const s9 = read('app/onboarding/steps/Step9Oppsummering.tsx');
    expect(s9).not.toContain('title="Moden nysgjerrighet"');
  });

  test('O2P1-37: legacy-verdier bevares i prefill (leses, ikke slettes)', () => {
    // Legacy data må fortsatt kunne LESAS/tolereres (toOnboardingData), men må
    // aldri bli til aktivt UI-felt. Her: verdiene beholdes i prefill-data.
    const r = toOnboardingData({
      identityName: 'Legacy', age: 40,
      lifeSituation: { gender: 'Kvinne', seekingGender: 'Mann', city: 'Oslo' },
      lifestyle: null,
      personality: { selfDesc: 'Jeg er en person.' },
      communication: null,
      intimacy: { smallThing: 'En liten ting' },
      futureVision: { dreamGoal: 'En drøm', buildTogether: 'Bygge noe' },
      boundaries: { limitations: 'Noe', partnerMustUnderstand: 'Noe' },
      emotionalNeeds: { importantBoundary: 'Noe' },
      securityLevel: null, psychometricAnswers: null, deepProfileData: null, preferences: null,
    }, true);
    expect(r.data['selfDesc']).toBe('Jeg er en person.');
    expect(r.data['smallThing']).toBe('En liten ting');
    expect(r.data['dreamGoal']).toBe('En drøm');
    expect(r.data['buildTogether']).toBe('Bygge noe');
    expect(r.data['limitations']).toBe('Noe');
    expect(r.data['partnerMustUnderstand']).toBe('Noe');
    expect(r.data['importantBoundary']).toBe('Noe');
  });

  /* ── Prefill / legacy ──────────────────────────────────────────────── */

  test('O2P1-24: prefill tåler legacy-profil (fjernede verdier krasjer ikke)', () => {
    const legacy = toOnboardingData({
      identityName: 'Legacy', age: 45,
      lifeSituation: {
        gender: 'Kvinne', seekingGender: 'Mann', city: 'Bergen',
        housingType: 'hus', householdSize: '3', workType: 'anstatt-fulltid',
        economicStability: 'stabil',
      },
      lifestyle: { kosthold: 'vegetar' },
      personality: { selfDesc: 'Jeg er en person.' },
      communication: null, intimacy: null, futureVision: null, boundaries: null,
      emotionalNeeds: null, securityLevel: null, psychometricAnswers: null,
      deepProfileData: null, preferences: { livsstil2026: { aktivitet: 'gym,lite' } },
    }, true);
    expect(legacy.data['identityName']).toBe('Legacy');
    expect(legacy.data['gender']).toBe('Kvinne');
    const open = toOnboardingData({
      identityName: 'X', age: 60,
      lifeSituation: { gender: 'Mann', seekingGender: 'Mann', city: 'Oslo' },
      lifestyle: null, personality: null, communication: null, intimacy: null,
      futureVision: null, boundaries: null, emotionalNeeds: null, securityLevel: null,
      psychometricAnswers: null, deepProfileData: null, preferences: { livsstil2026: {} },
    }, true);
    expect(typeof open.data).toBe('object');
  });

  /* ── Setup payload ─────────────────────────────────────────────────── */

  test('O2P1-26: setup payload krevde ikke lenger fjernede felt', () => {
    const setup = stripComments(read('lib/validation/onboarding-setup.ts'));
    expect(setup).not.toContain('selfDesc: z.string().min(10');
    expect(setup).not.toContain('goodEveryday: optStr(300, 10)');
    expect(setup).not.toContain('buildTogether: optStr(300, 10)');
  });

  /* ── 13 steg, ingen tom steg ───────────────────────────────────────── */

  test('O2P1-27: 13 steg beholdes', () => {
    const flow = read('app/onboarding/OnboardingFlow.tsx');
    expect(flow).toContain('const totalSteps = 13');
    expect(flow).toMatch(/case 0:/);
    expect(flow).toMatch(/case 11:/);
    expect(flow).toMatch(/case 12:/);
  });

  test('O2P1-28: ingen steg er tom etter fjerninger', () => {
    const s8 = read('app/onboarding/steps/Step8ModenNysgjerrighet.tsx');
    expect(s8).toContain('ERQ6.map');
    const s2l = read('app/onboarding/steps/Step2Livssituasjon.tsx');
    expect(s2l).toContain('ob-l2026-arbeidsrytme');
    expect(s2l).toContain('ob-l2026-skjerm');
    const s5 = read('app/onboarding/steps/Step5LivsstilVerdier.tsx');
    expect(s5).toContain('highPriority');
    expect(s5).toContain('ob-l2026-kosthold');
    const s6 = read('app/onboarding/steps/Step6FramtidVisjon.tsx');
    expect(s6).toContain('ob-future-vision');
    expect(s6).toContain('ob-experience-alone');
  });

  /* ── Låste områder (A18 / AGE99 / CPT / BQ / OT / consent) ─────────── */

  test('O2P1-29: barn-matching uendret (bonus-family = Pakke 2, fraværende)', () => {
    const db = read('lib/matching/dealbreaker.ts');
    expect(db).not.toContain('openToPartnerWithChildren');
    expect(db).not.toContain('partnerWithChildrenViktig');
    const cf = read('lib/matching/cheapFeatures.ts');
    expect(cf).not.toContain('openToPartnerWithChildren');
    expect(cf).not.toContain('partnerWithChildrenViktig');
  });

  test('O2P1-30: A18 låst (MIN_AGE = 18)', () => {
    expect(MIN_AGE).toBe(18);
  });

  test('O2P1-31: AGE99 låst (null maks-alder -> ingen maks-alder-sjekk)', () => {
    const db = read('lib/matching/dealbreaker.ts');
    expect(db).toContain('if (max != null && age > max) {');
    expect(db).toContain('if (min != null && age < min) {');
  });

  test('O2P1-32: CPT låst (14 dager, foto dag 8)', () => {
    expect(JOURNEY_TOTAL_DAYS).toBe(14);
    expect(PHOTO_REVEAL_DAY).toBe(8);
  });

  test('O2P1-33: BLI KJENT V2 låst (questions.ts uendret)', () => {
    expect(sha256('app/questions/data/questions.ts')).toBe(
      '8a107e0a4715fd5fe934211a18495e935e75b4f9245a9622d1e1509ffd75d25e'
    );
  });

  test('O2P1-34: OPPGAVER V2 låst (tasks.ts uendret)', () => {
    expect(sha256('app/chat/data/tasks.ts')).toBe(
      '04558d9a6fa4ecd064df2254dbf0815d267624f17e4cf2e2fefbb4615bf872ff'
    );
  });

  test('O2P1-35: consent-mekanikk uendret', () => {
    expect(sha256('app/api/consent/route.ts')).toBe(
      '423f20665ff17d613a8e6f862963875e749d27049a93176236c246d6feb54bdf'
    );
    expect(sha256('app/samtykke/page.tsx')).toBe(
      '4a202635920f91e060247014d1220619fdfd7a3e3ccf065dac04dba8ecf85fee'
    );
  });
});
