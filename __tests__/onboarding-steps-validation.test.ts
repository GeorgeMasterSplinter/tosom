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
} from '@/lib/validation/onboarding-steps';

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

  it('flagger alder under 21', () => {
    const { errors } = validateOnboardingStep(0, { ...completeBasic, age: 18 });
    expect(errors.some((e) => e.field === 'age')).toBe(true);
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

  it('flagger alderspreferanse under 21', () => {
    const { errors } = validateOnboardingStep(0, { ...completeBasic, agePrefMin: 20 });
    expect(errors.some((e) => e.field === 'agePrefMin')).toBe(true);
  });
});

describe('validateOnboardingStep — steg 1 (personlighet)', () => {
  it('returnerer ingen feil for god selfDesc (>= 10 tegn)', () => {
    expect(validateOnboardingStep(1, { selfDesc: 'Jeg er veldig kreativ' }).errors).toEqual([]);
  });

  it('flagger tom selfDesc', () => {
    const { errors } = validateOnboardingStep(1, { selfDesc: '' });
    expect(errors.some((e) => e.field === 'selfDesc')).toBe(true);
  });

  it('flagger selfDesc under 10 tegn', () => {
    const { errors } = validateOnboardingStep(1, { selfDesc: 'For kort' });
    expect(errors.some((e) => e.field === 'selfDesc')).toBe(true);
  });
});

describe('validateOnboardingStep — valfrie steg', () => {
  it('returnerer ingen feil for steg 2–12 (ingen obligatoriske felt)', () => {
    for (const step of [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
      expect(validateOnboardingStep(step, {}).errors).toEqual([]);
    }
  });
});

describe('firstIncompleteOnboardingStep / validateAllOnboardingSteps', () => {
  it('returnerer null / [] når profilen er komplett', () => {
    const full = { ...completeBasic, selfDesc: 'Jeg er veldig kreativ' };
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

  it('returnerer begge ufullstendige steg i rekkefølge', () => {
    const all = validateAllOnboardingSteps({});
    expect(all.map((v) => v.step)).toEqual([0, 1]);
  });
});