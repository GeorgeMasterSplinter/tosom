/**
 * ToSom — Lansering: religion/livssyn som gjensidig HARD kompatibilitetsregel
 *
 * Religion er IKKE en scoringsdimensjon — den er en dealbreaker (hard filter)
 * som kjører FØR scoring. Regelen er brukerdefinert og gjensidig:
 *   A aksepterer B  ⇔  A.acceptedReligions ∩ B.religion ≠ ∅
 *   B aksepterer A  ⇔  B.acceptedReligions ∩ A.religion ≠ ∅
 *   RELIGION_COMPATIBLE = (A aksepterer B) OG (B aksepterer A)
 *
 * Dekker R-01..R-12 fra docs/LanseringsCheckList.md, to eksplisitte eksempler
 * fra produktavgjørelsen, ekvivalens (cheapSjekkAll === sjekkAlleDealbreakers)
 * og server-side validering (maks 4 aksepterte).
 */

import { sjekkAlleDealbreakers } from '@/lib/matching/dealbreaker';
import { buildCheapFeatures, cheapSjekkAll } from '@/lib/matching/cheapFeatures';
import { mapRejectReason } from '@/lib/matching/rejectReason';
import { scoreRound, emptyRejectReasons } from '@/lib/matching/scoreRound';
import type { ProfileData } from '@/lib/matching/types';
import { validateOnboarding } from '@/lib/validation/onboarding-setup';
import { ALL_ITEMS } from '@/lib/psychometrics/instruments';
import { getReligionSelfAcceptHint } from '@/lib/onboarding/religionSelfAccept';

/** Nøytral profil: passer ALLE andre dealbreakers (åpent kjønnssøk, ingen alderradius). */
function makeProfile(overrides: Partial<ProfileData> = {}): ProfileData {
  return {
    userId: 'test-id',
    firstName: 'Test',
    lastName: 'Person',
    age: 30,
    bio: null,
    interests: [],
    matchTags: [],
    personality: null,
    lifeSituation: null,
    relationshipStyle: null,
    communication: null,
    futureVision: null,
    boundaries: null,
    emotionalNeeds: null,
    lifeRhythm: null,
    maturityLevel: null,
    securityLevel: null,
    preferences: null,
    deepProfileData: null,
    lifestyle: null,
    intimacy: null,
    latitude: null,
    longitude: null,
    distancePref: null,
    ...overrides,
  } as ProfileData;
}

/**
 * Profil med EGEN religion + AKSEPTLISTE (begge i deepProfileData, kommaseparert).
 * `null` = nøkkelen er fraværende (legacy/ikke svart); `''` = tilstede men tom.
 */
function relProfile(id: string, own: string | null, accepted: string | null): ProfileData {
  const dp: Record<string, unknown> = {};
  if (own !== null) dp.religion = own;
  if (accepted !== null) dp.acceptedReligions = accepted;
  return makeProfile({
    userId: id,
    // Åpent søk → kjønnsdealbreakeren blokkerer aldri (kun religion skal avgjøre).
    lifeSituation: { gender: 'Mann', seekingGender: 'Alle kjønner' },
    deepProfileData: dp,
  });
}

/** Religion-avgjørelse ALLENE (alle andre dealbreakers er nøytrale i fixturen). */
function religionVerdict(a: ProfileData, b: ProfileData) {
  const r = sjekkAlleDealbreakers(a, b);
  const isReligion = typeof r.reason === 'string' && r.reason.startsWith('Religion/livssyn');
  return { hasDealbreaker: r.hasDealbreaker, isReligion, reason: r.reason ?? null };
}

describe('Religion/livssyn — gjensidig hard kompatibilitet (R-01..R-12)', () => {
  it('R-01: gjensidig aksept → religion PASS', () => {
    const a = relProfile('a', 'Kristen', 'Kristen,Muslim');
    const b = relProfile('b', 'Muslim', 'Kristen,Muslim');
    const v = religionVerdict(a, b);
    expect(v.hasDealbreaker).toBe(false);
  });

  it('R-02: ensidig aksept (A aksepterer B, B ikke A) → dealbreaker', () => {
    const a = relProfile('a', 'Kristen', 'Kristen,Muslim');
    const b = relProfile('b', 'Muslim', 'Muslim');
    const v = religionVerdict(a, b);
    expect(v.hasDealbreaker).toBe(true);
    expect(v.isReligion).toBe(true);
    // Retninga i årsaken: det er B som ikke aksepterer A si religion (Kristen).
    expect(v.reason).toContain('b er ikke åpen');
    expect(v.reason).toContain('til a');
  });

  it('R-03: ingen aksept (hverken aksepterer) → dealbreaker', () => {
    const a = relProfile('a', 'Kristen', 'Ateist');
    const b = relProfile('b', 'Muslim', 'Ateist');
    const v = religionVerdict(a, b);
    expect(v.hasDealbreaker).toBe(true);
    expect(v.isReligion).toBe(true);
  });

  it('R-04: éin valgt akseptert religion → fungerer', () => {
    const a = relProfile('a', 'Kristen', 'Muslim');
    const b = relProfile('b', 'Muslim', 'Kristen');
    expect(religionVerdict(a, b).hasDealbreaker).toBe(false);
  });

  it('R-05: fire valgte aksepterte religioner → fungerer', () => {
    const a = relProfile('a', 'Kristen', 'Katolsk,Agnostiker,Ateist,Spirituell');
    const b = relProfile('b', 'Agnostiker', 'Kristen,Judedom,Buddhist,Hindu');
    expect(religionVerdict(a, b).hasDealbreaker).toBe(false);
  });

  it('R-07: ingen dedikert "åpen for alle" (avgjørelse #7) — tom akseptliste blokkerer IKKE', () => {
    // Eksisterende modell har IKKE et "åpen for alle"-valg. Trygg håndtering:
    // en bruker uten eksplisitt akseptliste har ingen religion-begrensning.
    const a = relProfile('a', 'Kristen', ''); // tom akseptliste
    const b = relProfile('b', 'Muslim', 'Kristen');
    expect(religionVerdict(a, b).hasDealbreaker).toBe(false);
  });

  it('R-08: manglende legacy-data blokkerer aldri (verken akseptliste eller egen religion)', () => {
    // Legacy: A har egen religion men INGEN akseptliste (nøkkelen er borte).
    const a = relProfile('a', 'Kristen', null);
    const b = relProfile('b', 'Muslim', 'Kristen,Muslim');
    expect(religionVerdict(a, b).hasDealbreaker).toBe(false);
    // Legacy: A mangler BÅDE egen religion og akseptliste.
    const legacy = relProfile('a', null, null);
    expect(religionVerdict(legacy, b).hasDealbreaker).toBe(false);
  });

  it('R-09: høy score kan IKKE overstyre inkompatibilitet (dealbreaker før scoring)', () => {
    // Like profiler (høy liknendeheit) som ville skåret høyt — men religion er
    // inkompatibel. Med minScore=0 ville paret vært matcha uten dealbreakeren.
    const a = { ...relProfile('ra', 'Kristen', 'Ateist'), bio: 'liker musikk, natur, film', interests: ['musikk', 'natur', 'film'] };
    const b = { ...relProfile('rb', 'Muslim', 'Ateist'), bio: 'liker musikk, natur, film', interests: ['musikk', 'natur', 'film'] };
    const candidates = [
      { id: 'ra', profile: a },
      { id: 'rb', profile: b },
    ];
    const features = candidates.map((c) => buildCheapFeatures(c.profile!));
    const r = scoreRound(candidates, features, new Set(), { deadline: Date.now() + 60_000, minScore: 0 });
    expect(r.pairs).toHaveLength(0);
    expect(r.rejectReasons['religion']).toBe(1);
  });

  it('R-10: endrede preferanser brukes korrekt (samme egen religion, ulik akseptliste)', () => {
    const b = relProfile('b', 'Muslim', 'Kristen');
    // Før: A aksepterer bare Ateist → inkompatibel med B (Muslim).
    const aBefore = relProfile('a', 'Kristen', 'Ateist');
    expect(religionVerdict(aBefore, b).hasDealbreaker).toBe(true);
    // Etter: A endrer akseptlista til Muslim → kompatibel.
    const aAfter = relProfile('a', 'Kristen', 'Muslim');
    expect(religionVerdict(aAfter, b).hasDealbreaker).toBe(false);
  });

  it('R-11: samme religion UTEN eksplisitt aksept → dealbreaker (akseptlista er autoritativ)', () => {
    // A er Muslim, men A har IKKE valgt Muslim i akseptlista si (bare Kristen).
    const a = relProfile('a', 'Muslim', 'Kristen');
    const b = relProfile('b', 'Muslim', 'Muslim');
    const v = religionVerdict(a, b);
    expect(v.hasDealbreaker).toBe(true);
    expect(v.isReligion).toBe(true);
  });

  it('R-12: flere egen religioner, minst én er akseptert → religion PASS', () => {
    // A har to egen religioner. B aksepterer bare Kristen (én av de to).
    const a = relProfile('a', 'Muslim,Kristen', 'Muslim');
    const b = relProfile('b', 'Muslim', 'Kristen');
    expect(religionVerdict(a, b).hasDealbreaker).toBe(false);
  });
});

describe('Religion/livssyn — eksplisitte produkt-eksempler', () => {
  it('EKSEMPEL 1: A=[muslim]/aksept[muslim,kristen], B=[kristen]/aksept[kristen] => INGEN MATCH', () => {
    const a = relProfile('a', 'Muslim', 'Muslim,Kristen');
    const b = relProfile('b', 'Kristen', 'Kristen');
    const v = religionVerdict(a, b);
    expect(v.hasDealbreaker).toBe(true); // B aksepterer ikke A sin egen religion (Muslim)
    expect(v.isReligion).toBe(true);
  });

  it('EKSEMPEL 2: A=[muslim]/aksept[muslim,kristen], B=[kristen]/aksept[kristen,muslim] => RELIGION PASS', () => {
    const a = relProfile('a', 'Muslim', 'Muslim,Kristen');
    const b = relProfile('b', 'Kristen', 'Kristen,Muslim');
    const v = religionVerdict(a, b);
    expect(v.hasDealbreaker).toBe(false); // Religion passer — resten av motoren avgjer
  });
});

describe('Religion/livssyn — ekvivalens (cheapSjekkAll === sjekkAlleDealbreakers)', () => {
  const tilfeller: Array<[ProfileData, ProfileData]> = [
    [relProfile('a', 'Kristen', 'Kristen,Muslim'), relProfile('b', 'Muslim', 'Kristen,Muslim')],
    [relProfile('a', 'Kristen', 'Kristen,Muslim'), relProfile('b', 'Muslim', 'Muslim')],
    [relProfile('a', 'Kristen', 'Ateist'), relProfile('b', 'Muslim', 'Ateist')],
    [relProfile('a', 'Muslim', 'Muslim,Kristen'), relProfile('b', 'Kristen', 'Kristen')],
    [relProfile('a', 'Muslim', 'Muslim,Kristen'), relProfile('b', 'Kristen', 'Kristen,Muslim')],
    [relProfile('a', 'Muslim,Kristen', 'Muslim'), relProfile('b', 'Muslim', 'Kristen')],
    [relProfile('a', 'Kristen', null), relProfile('b', 'Muslim', 'Kristen,Muslim')], // legacy
    [relProfile('a', null, null), relProfile('b', 'Muslim', 'Muslim')], // legacy
    [relProfile('a', 'Kristen', ''), relProfile('b', 'Muslim', 'Kristen')], // tom liste
    // Phase 1.5: OPEN TO ALL
    [openProfile('a', 'Muslim'), relProfile('b', 'Kristen', 'Muslim')], // R-13: PASS
    [openProfile('a', 'Muslim'), relProfile('b', 'Kristen', 'Kristen')], // R-14: FAIL (B lukket)
    [openProfile('a', 'Muslim'), openProfile('b', 'Kristen')], // R-15: PASS
    [openProfile('a', 'Muslim'), relProfile('b', null, null)], // OPEN + legacy: PASS
  ];

  for (const [a, b] of tilfeller) {
    it(`par ${a.userId}/${b.userId} (${JSON.stringify(a.deepProfileData)})/(${JSON.stringify(b.deepProfileData)}): cheap === full`, () => {
      const full = sjekkAlleDealbreakers(a, b).reason ?? sjekkAlleDealbreakers(b, a).reason ?? null;
      const cheap = cheapSjekkAll(buildCheapFeatures(a), buildCheapFeatures(b));
      expect(cheap).toBe(full);
      // Begge retningar blir like avgjort
      const fullRev = sjekkAlleDealbreakers(b, a).reason ?? sjekkAlleDealbreakers(a, b).reason ?? null;
      expect(Boolean(fullRev)).toBe(Boolean(full));
    });
  }
});

describe('Religion/livssyn — avvisningsnøkkel', () => {
  it('reason kartleggjast til "religion"', () => {
    const a = relProfile('a', 'Kristen', 'Ateist');
    const b = relProfile('b', 'Muslim', 'Ateist');
    const reason = sjekkAlleDealbreakers(a, b).reason;
    expect(reason).toBeTruthy();
    expect(mapRejectReason(reason!)).toBe('religion');
  });

  it('"religion" er ein M-12-nøkkel (initialiserast til 0)', () => {
    const r0 = emptyRejectReasons();
    expect(r0['religion']).toBe(0);
  });
});

/** Fullt, gyldig onboarding-payload for valideringstester (modulnivå). */
function fullPayload(basic: Record<string, unknown> = {}): any {
  return {
    basic: {
      identityName: 'Testbruker',
      age: 30,
      gender: 'Kvinne',
      seekingGender: 'Mann',
      city: 'Bergen',
      postalCode: '5003',
      distancePref: 50,
      agePrefMin: 23,
      agePrefMax: 40,
      ...basic,
    },
    personlighet: { selfDesc: 'Jeg liker natur, musikk og gode samtaler om livet.' },
    livssituasjon: {},
    tilknytning: {},
    kommunikasjon: {},
    kjaerlighet: {},
    livsstil: {},
    relasjonsStil: {},
    fremtid: {},
    humor: {},
    grenser: {},
    moden: {},
    preferanser: {},
    psychometrics: Object.fromEntries(ALL_ITEMS.map((item, i) => [item.id, (i % 5) + 1])),
  };
}

describe('Religion/livssyn — server-side validering (acceptedReligions, maks 4)', () => {
  it('aksepterer éin akseptert religion', () => {
    expect(validateOnboarding(fullPayload({ acceptedReligions: 'Kristen' })).success).toBe(true);
  });

  it('aksepterer fire aksepterte religioner', () => {
    expect(validateOnboarding(fullPayload({ acceptedReligions: 'Kristen,Muslim,Spirituell,Annet' })).success).toBe(true);
  });

  it('avviser fem aksepterte religioner med rolig melding på feltet', () => {
    const result = validateOnboarding(fullPayload({ acceptedReligions: 'Kristen,Muslim,Spirituell,Annet,Buddhist' }));
    expect(result.success).toBe(false);
    if (!result.success) {
      const feil = result.errors.find((e) => e.field === 'basic.acceptedReligions');
      expect(feil?.message).toBe('Du kan velge opptil fire religioner eller livssyn du er åpen for.');
    }
  });

  it('tom akseptliste går gjennom (feltet er valgfritt)', () => {
    expect(validateOnboarding(fullPayload({ acceptedReligions: '' })).success).toBe(true);
  });
});

/* ═══════════════════════════════════════════════════════════════
   Phase 1.5 — OPEN TO ALL (R-13–R-20) + R-12 UX-hint
   ═══════════════════════════════════════════════════════════════ */

/** Profil med OPEN TO ALL (religionOpen: true) og valgfri egen religion. */
function openProfile(id: string, own: string | null, accepted?: string | null): ProfileData {
  const dp: Record<string, unknown> = { religionOpen: true };
  if (own !== null) dp.religion = own;
  if (accepted !== undefined && accepted !== null) dp.acceptedReligions = accepted;
  return makeProfile({
    userId: id,
    lifeSituation: { gender: 'Mann', seekingGender: 'Alle kjønner' },
    deepProfileData: dp,
  });
}

describe('Phase 1.5 — OPEN TO ALL (R-13–R-17)', () => {
  it('R-13: A = OPEN TO ALL aksepterer B, selv om B sin religion ikke er i As (tomme) akseptliste', () => {
    const a = openProfile('a', 'Muslim'); // OPEN, ingen konkret akseptliste
    const b = relProfile('b', 'Kristen', 'Muslim'); // B aksepterer A
    // A aksepterer B (OPEN) + B aksepterer A → religion PASS
    expect(religionVerdict(a, b).hasDealbreaker).toBe(false);
  });

  it('R-14: A = OPEN TO ALL, men B aksepterer ikke As religion → RELIGION FAIL på Bs side', () => {
    const a = openProfile('a', 'Muslim');
    const b = relProfile('b', 'Kristen', 'Kristen');
    const v = religionVerdict(a, b);
    expect(v.hasDealbreaker).toBe(true);
    expect(v.isReligion).toBe(true);
    // Det er B som ikke aksepterer A sin egen religion (Muslim)
    expect(v.reason).toContain('b er ikke åpen');
    expect(v.reason).toContain('til a');
    expect(v.reason).toContain('Muslim');
  });

  it('R-15: begge OPEN TO ALL → RELIGION PASS', () => {
    const a = openProfile('a', 'Muslim');
    const b = openProfile('b', 'Kristen');
    expect(religionVerdict(a, b).hasDealbreaker).toBe(false);
  });

  it('R-16: legacy-profil mangler acceptedReligions (og religionOpen) → trygge fallbacken videreføres', () => {
    const legacy = relProfile('a', 'Kristen', null); // ingen akseptliste, ingen religionOpen
    const b = openProfile('b', 'Muslim');
    expect(religionVerdict(legacy, b).hasDealbreaker).toBe(false);
    const ingenData = relProfile('a', null, null); // mangler begge felt
    expect(religionVerdict(ingenData, b).hasDealbreaker).toBe(false);
  });

  it('R-17: MISSING er ikke OPEN TO ALL — ingen tolkning av tom/manglende som «aksepterer alt»', () => {
    // En profil MED AKSEPTLISTE (ikke MISSING) må fortsatt respektere lista:
    const medListe = relProfile('a', 'Kristen', 'Kristen'); // ingen religionOpen
    const b = relProfile('b', 'Muslim', 'Kristen');
    expect(religionVerdict(medListe, b).hasDealbreaker).toBe(true); // Muslim er ikke i lista
    // …mens MISSING (legacy) blokkerer aldri:
    const missing = relProfile('a', 'Kristen', null);
    expect(religionVerdict(missing, b).hasDealbreaker).toBe(false);
    // …og OPEN TO ALL aksepterer alltid:
    const open = openProfile('a', 'Kristen');
    expect(religionVerdict(open, b).hasDealbreaker).toBe(false);
    // Teknisk distinksjon: religionOpen-feltet er tilstede (true) for OPEN,
    // fraværende for MISSING — ingen tolkning av tom streng.
    expect(open.deepProfileData?.religionOpen).toBe(true);
    expect(missing.deepProfileData?.religionOpen).toBeUndefined();
  });

  it('OPEN TO ALL + gammel (legacy) profil på begge sider → PASS', () => {
    const open = openProfile('a', 'Muslim');
    const legacy = relProfile('b', null, null);
    expect(religionVerdict(open, legacy).hasDealbreaker).toBe(false);
  });

  it('OPEN TO ALL vinner over konkret akseptliste dersom begge er lagret (forsvar i dybden)', () => {
    const a: ProfileData = makeProfile({
      userId: 'a',
      lifeSituation: { gender: 'Mann', seekingGender: 'Alle kjønner' },
      deepProfileData: { religion: 'Muslim', religionOpen: true, acceptedReligions: 'Kristen' },
    });
    const b = relProfile('b', 'Muslim', 'Muslim');
    expect(religionVerdict(a, b).hasDealbreaker).toBe(false);
  });

  it('versaler/mellomrom tolereres i OPEN TO ALL-kombinasjoner (edge case)', () => {
    const a = relProfile('a', 'Kristen', 'MUSLIM '); // versaler + mellomrom
    const b = relProfile('b', 'muslim', 'kristen');
    expect(religionVerdict(a, b).hasDealbreaker).toBe(false);
  });

  it('maksimal fire valgte + OPEN TO ALL eksklusivt (edge case i validering)', () => {
    const fire = fullPayload({ acceptedReligions: 'Kristen,Muslim,Spirituell,Annet' });
    expect(validateOnboarding(fire).success).toBe(true);
    const openAlene = fullPayload({ religionOpen: true, acceptedReligions: '' });
    expect(validateOnboarding(openAlene).success).toBe(true);
    const kombinaert = fullPayload({ acceptedReligions: 'OPEN_TO_ALL,Kristen' });
    expect(validateOnboarding(kombinaert).success).toBe(false);
  });
});

describe('Phase 1.5 — R-12 UX-hint (R-18–R-20)', () => {
  it('R-18: hint vises når egen religion/livssyn mangler i den eksplisitte akseptlisten', () => {
    const hint = getReligionSelfAcceptHint({ religion: 'Muslim', acceptedReligions: 'Kristen' });
    expect(hint).not.toBeNull();
    expect(hint).toContain('muslim');
  });

  it('R-18 (flere egne verdier): hint avdekker kun de som mangler, ikke alle', () => {
    const delvis = getReligionSelfAcceptHint({ religion: 'Muslim,Kristen', acceptedReligions: 'Kristen' });
    expect(delvis).not.toBeNull();
    expect(delvis).toContain('muslim');
    expect(delvis).not.toContain('kristen');
    const begge = getReligionSelfAcceptHint({ religion: 'Muslim,Kristen', acceptedReligions: 'Ateist' });
    expect(begge).not.toBeNull();
    expect(begge).toContain('muslim');
    expect(begge).toContain('kristen');
  });

  it('R-18 (edge cases): versaler/mellomrom gir ikke falsk hint; ingen egen religion eller tom akseptliste gir ingen hint', () => {
    expect(getReligionSelfAcceptHint({ religion: 'muslim ', acceptedReligions: 'Muslim' })).toBeNull();
    expect(getReligionSelfAcceptHint({ religion: 'MUSLIM', acceptedReligions: 'muslim' })).toBeNull();
    expect(getReligionSelfAcceptHint({ religion: '', acceptedReligions: 'Kristen' })).toBeNull();
    expect(getReligionSelfAcceptHint({ religion: 'Muslim', acceptedReligions: '' })).toBeNull();
    expect(getReligionSelfAcceptHint({ religion: 'Muslim', acceptedReligions: null })).toBeNull();
    expect(getReligionSelfAcceptHint({ religion: 'Muslim,Kristen', acceptedReligions: 'Kristen,Muslim' })).toBeNull();
  });

  it('R-19: hintet påvirker ikke matchinglogikken (ren funksjon — par avgjøres likt med og uten hint)', () => {
    const a = relProfile('a', 'Muslim', 'Kristen'); // utløser hint
    const b = relProfile('b', 'Muslim', 'Muslim');
    const før = religionVerdict(a, b);
    const hint = getReligionSelfAcceptHint({
      religion: 'Muslim',
      acceptedReligions: 'Kristen',
      religionOpen: false,
    });
    expect(hint).not.toBeNull(); // hintet utløses for dette paret
    const etter = religionVerdict(a, b);
    expect(etter).toEqual(før); // identisk avgjørelse — hintet er informasjon, ikke logikk
    expect(før.hasDealbreaker).toBe(true); // streng R-12-logikk er intakt
  });

  it('R-20: OPEN TO ALL viser ikke R-12-hint', () => {
    expect(
      getReligionSelfAcceptHint({ religion: 'Muslim', acceptedReligions: '', religionOpen: true })
    ).toBeNull();
    expect(
      getReligionSelfAcceptHint({ religion: 'Muslim,Kristen', religionOpen: true })
    ).toBeNull();
  });
});




