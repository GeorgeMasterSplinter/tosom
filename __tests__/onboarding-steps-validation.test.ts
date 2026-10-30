/**
 * ToSom — Onboarding steg-validering (frontend).
 *
 * Verifiserer at den sentrale validereren i lib/validation/onboarding-steps.ts
 * speiler backend-skjemaet (lib/validation/onboarding-setup.ts), slik at
 * handleNext blokkerer ufullstendige steg og pre-flighten aldri sender en
 * ufullstendig profil til /api/profile/setup (400 «noe mangler»).
 */

import {
  validateOnboardingStep,
  validateAllOnboardingSteps,
  firstIncompleteOnboardingStep,
  missingScaleItems,
  validateLivsstil2026Step,
} from '@/lib/validation/onboarding-steps';
import { ERQ6, ALL_ITEMS } from '@/lib/psychometrics/instruments';

// LANGUAGE & CLARITY ACT O1: meldingen er forkortet (repetisjonen
// «det finnes ingen fasit» beholdes kun i steg 2 skalaintro).
const SCALE_ERROR = 'Svar på alle påstandene.';

/** Alle aktive skalasvar (1–5) — fullt datagrunnlag for skalastegene. */
function allScaleAnswers(): Record<string, number> {
  const answers: Record<string, number> = {};
  for (const item of ALL_ITEMS) answers[item.id] = 3;
  return answers;
}

/** Fullstendig grunnprofil som passerer backend-skjemaet. */
const completeBasic = {
  identityName: 'Test',
  age: 30,
  gender: 'male',
  seekingGender: 'female',
  city: 'Oslo',
  postalCode: '0150',
  distancePref: 100,
  agePrefMin: 23,
  agePrefMax: 40,
};

describe('validateOnboardingStep — steg 0 (grunnprofil)', () => {
  it('returnerer ingen feil for fullstendig profil', () => {
    expect(validateOnboardingStep(0, completeBasic).errors).toEqual([]);
  });

  it('flagger alle obligatoriske felt ved tom profil', () => {
    const { errors } = validateOnboardingStep(0, {});
    const fields = errors.map((e) => e.field);
    for (const f of [
      'identityName', 'age', 'gender', 'seekingGender',
      'city', 'postalCode', 'distancePref', 'agePrefMin', 'agePrefMax',
    ]) {
      expect(fields).toContain(f);
    }
  });

  it('flagger alder under 18 (A18)', () => {
    const { errors } = validateOnboardingStep(0, { ...completeBasic, age: 17 });
    expect(errors.some((e) => e.field === 'age')).toBe(true);
  });

  it('A18-02: alder 18 godtas (minimumsalder)', () => {
    const { errors } = validateOnboardingStep(0, { ...completeBasic, age: 18 });
    expect(errors.some((e) => e.field === 'age')).toBe(false);
  });

  it('flagger alder over 99', () => {
    const { errors } = validateOnboardingStep(0, { ...completeBasic, age: 120 });
    expect(errors.some((e) => e.field === 'age')).toBe(true);
  });

  it('flagger ugyldig postnummer', () => {
    const { errors } = validateOnboardingStep(0, { ...completeBasic, postalCode: '12' });
    expect(errors.some((e) => e.field === 'postalCode')).toBe(true);
  });

  it('flagger avstand utenfor postnummerets område (Oslo 30–500)', () => {
    const { errors } = validateOnboardingStep(0, { ...completeBasic, distancePref: 5 });
    expect(errors.some((e) => e.field === 'distancePref')).toBe(true);
  });

  it('flagger alderspreferanse under 18 (A18)', () => {
    const { errors } = validateOnboardingStep(0, { ...completeBasic, agePrefMin: 17 });
    expect(errors.some((e) => e.field === 'agePrefMin')).toBe(true);
  });

  it('A18-04: alderspreferanse min 18 godtas (A18)', () => {
    const { errors } = validateOnboardingStep(0, { ...completeBasic, agePrefMin: 18 });
    expect(errors.some((e) => e.field === 'agePrefMin')).toBe(false);
  });
});

describe('validateOnboardingStep — steg 1 (personlighet)', () => {
  it('returnerer ingen feil for god selfDesc + alle V2-personlighetssvar (PL-08a)', () => {
    expect(validateOnboardingStep(1, { selfDesc: 'Jeg er veldig kreativ', ...allScaleAnswers() }).errors).toEqual([]);
  });

  it('flagger tom selfDesc', () => {
    const { errors } = validateOnboardingStep(1, { selfDesc: '' });
    expect(errors.some((e) => e.field === 'selfDesc')).toBe(true);
  });

  it('flagger selfDesc under 10 tegn', () => {
    const { errors } = validateOnboardingStep(1, { selfDesc: 'For kort' });
    expect(errors.some((e) => e.field === 'selfDesc')).toBe(true);
  });

  it('PL-08a: flagger manglende V2-personlighetssvar selv med god selfDesc', () => {
    const { errors } = validateOnboardingStep(1, { selfDesc: 'Jeg er veldig kreativ' });
    expect(errors.some((e) => e.message === SCALE_ERROR)).toBe(true);
  });
});

describe('validateOnboardingStep — skalasteg (PL-08a: påkrevde svar per steg)', () => {
  it('skalasteg (1, 3, 5, 8, 10) avvises uten skalasvar', () => {
    for (const step of [1, 3, 5, 8, 10]) {
      const { errors } = validateOnboardingStep(step, {});
      expect(errors.some((e) => e.message === SCALE_ERROR)).toBe(true);
    }
  });

  it('skala med bare delvis svar avvises (3 av 12 ATTACHMENT-items)', () => {
    const partial: Record<string, unknown> = { att_a1: 2, att_a2: 4, att_a3: 3 };
    const { errors } = validateOnboardingStep(3, partial);
    expect(errors.some((e) => e.message === SCALE_ERROR)).toBe(true);
  });

  it('skalasteg med alle items svart (1–5) godkjennes', () => {
    const answers = allScaleAnswers();
    for (const step of [3, 5, 8, 10]) {
      expect(validateOnboardingStep(step, answers).errors).toEqual([]);
    }
  });

  it('valfrie steg (2, 4, 6, 7, 9, 11, 12) returnerer ingen feil uten data', () => {
    for (const step of [2, 4, 6, 7, 9, 11, 12]) {
      expect(validateOnboardingStep(step, {}).errors).toEqual([]);
    }
  });

  it('missingScaleItems identifiserer ugyldige verdier (streng/NaN/utenfor 1–5)', () => {
    const data: Record<string, unknown> = { erq_r1: 3, erq_r2: 'x', erq_r3: 7 };
    const missing = missingScaleItems(data, ERQ6);
    expect(missing).toContain('erq_r2');
    expect(missing).toContain('erq_r3');
    expect(missing).not.toContain('erq_r1');
  });
});

describe('firstIncompleteOnboardingStep / validateAllOnboardingSteps', () => {
  it('returnerer null / [] når profilen er komplett (inkl. alle aktive skalasvar)', () => {
    const full = { ...completeBasic, selfDesc: 'Jeg er veldig kreativ', ...allScaleAnswers() };
    expect(firstIncompleteOnboardingStep(full)).toBeNull();
    expect(validateAllOnboardingSteps(full)).toEqual([]);
  });

  it('returnerer steg 0 først når grunnprofil mangler felt', () => {
    const missing = firstIncompleteOnboardingStep({ ...completeBasic, identityName: '' });
    expect(missing?.step).toBe(0);
    expect(missing?.errors.map((e) => e.field)).toContain('identityName');
  });

  it('returnerer steg 1 når grunnprofil er fullstendig men selfDesc mangler', () => {
    const missing = firstIncompleteOnboardingStep({ ...completeBasic, selfDesc: '' });
    expect(missing?.step).toBe(1);
    expect(missing?.errors.map((e) => e.field)).toContain('selfDesc');
  });

  it('PL-08a: tom profil returnerer alle ufullstendige steg (0, 1 + skalasteg)', () => {
    const all = validateAllOnboardingSteps({});
    expect(all.map((v) => v.step)).toEqual([0, 1, 3, 5, 8, 10]);
  });

  it('PL-08a: full profil uten skalasvar blokkeres av skalasteg (steget med første skaler)', () => {
    const noScales = { ...completeBasic, selfDesc: 'Jeg er veldig kreativ' };
    expect(firstIncompleteOnboardingStep(noScales)?.step).toBe(1);
  });
});

describe('livsstil2026 i steg-gaten (18.10: «livsstil2026.bil: Invalid input»)', () => {
  it('steg 2 og 5 uten l2026-data gir ingen feil (alt er valgfritt)', () => {
    expect(validateLivsstil2026Step(2, {})).toEqual([]);
    expect(validateLivsstil2026Step(5, {})).toEqual([]);
  });

  it('steg 2: gyldige hverdagsvalg godkjennes', () => {
    expect(
      validateLivsstil2026Step(2, {
        arbeidsrytme: 'hybrid',
        arbeidsrytmeViktig: 'bor-stemme',
        bosted: 'sentrum',
        reiser: 'utlandet',
        dyr: 'ingen',
        dyrViktig: 'ma-stemme',
        skjerm: 'moderat',
      })
    ).toEqual([]);
  });

  it('steg 2: ugyldig viktighetsnivå avvises', () => {
    const errors = validateLivsstil2026Step(2, { dyr: 'hund', dyrViktig: 'veldig-viktig' });
    expect(errors.map((e) => e.field)).toContain('dyrViktig');
  });

  it('steg 2: kommaseparert flervalg i engangsfelt avvises', () => {
    const errors = validateLivsstil2026Step(2, { bosted: 'sentrum,land' });
    expect(errors.map((e) => e.field)).toContain('bosted');
  });

  it('steg 5: gyldig bilverdi + vekt godkjennes', () => {
    expect(validateLivsstil2026Step(5, { bil: 'full-el', bilViktig: 'ma-stemme' })).toEqual([]);
  });

  it('steg 5: kommaseparert flervalg i bil avvises (den opprinnelige feilen)', () => {
    const errors = validateLivsstil2026Step(5, { bil: 'full-el,bensin' });
    expect(errors.map((e) => e.field)).toContain('bil');
  });

  it('steg 5: ukjent/legacy-verdi avvises', () => {
    const errors = validateLivsstil2026Step(5, { bil: 'Elbil' });
    expect(errors.map((e) => e.field)).toContain('bil');
  });

  it('aktivitet: opptil tre gyldige verdier godkjennes, fire avvises', () => {
    expect(validateLivsstil2026Step(5, { aktivitet: 'gym,lop-turer,lagidrett' })).toEqual([]);
    const errors = validateLivsstil2026Step(5, { aktivitet: 'gym,lop-turer,lagidrett,natur-fritid' });
    expect(errors.map((e) => e.field)).toContain('aktivitet');
  });

  it('aktivitet: ukjent verdi avvises', () => {
    const errors = validateLivsstil2026Step(5, { aktivitet: 'gym,spilling' });
    expect(errors.map((e) => e.field)).toContain('aktivitet');
  });

  it('sentral gate: validateOnboardingStep(5) fanger ugyldig bil — stopp PÅ steget', () => {
    const { errors } = validateOnboardingStep(5, { ...allScaleAnswers(), bil: 'full-el,bensin' });
    expect(errors.map((e) => e.field)).toContain('bil');
  });

  it('pre-flight: firstIncompleteOnboardingStep hopper til steg 5 ved ugyldig bil', () => {
    const full = {
      ...completeBasic,
      selfDesc: 'Jeg er veldig kreativ',
      ...allScaleAnswers(),
      bil: 'full-el,bensin',
    };
    const missing = firstIncompleteOnboardingStep(full);
    expect(missing?.step).toBe(5);
    expect(missing?.errors.map((e) => e.field)).toContain('bil');
  });
});