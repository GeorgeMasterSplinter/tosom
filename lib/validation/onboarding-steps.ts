/**
 * ToSom — Onboarding steg-validering (frontend)
 *
 * Én kilde for HVA som er obligatorisk for å fullføre onboarding. Reglene
 * speiler backend-skjemaet i lib/validation/onboarding-setup.ts
 * (onboardingSetupSchema) slik at frontend og backend aldri drar fra hverandre.
 *
 * Brukes av OnboardingFlow på to steder:
 *  1. Sentral gate i handleNext — man kan ikke avansere før stegets
 *     obligatoriske felt er fylt ut. Dette dekker også hopp via goToStep/prefill.
 *  2. Pre-flight i handleStartReisen — før /api/profile/setup kalles, hopper vi
 *     til det steget som mangler felt i stedet for å la serveren avvise med 400
 *     på siste steg («noe mangler i profilen din»).
 *
 * Kun steg 0 (grunnprofil), steg 1 (selfDesc) og de fem skalastegene
 * (1, 3, 5, 8, 10 — PL-08a, D-1) har obligatoriske felt; de øvrige stegene
 * har valfrie felt og returnerer derfor ingen feil.
 */

import { getDistancePrefRange } from '@/config/distance-prefs';
import { MIN_AGE } from '@/config/legal';
import {
  BFI10,
  ATTACHMENT,
  PVQ10,
  COMMUNICATION,
  ERQ6,
  Item,
} from '@/lib/psychometrics/instruments';

/**
 * PL-08a: Skalastegene med påkrevde svar (D-1). Stegeindeksene kommer fra
 * renderStep() i OnboardingFlow.tsx:
 *   1 → Step2Personlighet (BFI10) · 3 → Step3Tilknytning (ATTACHMENT) ·
 *   5 → Step5LivsstilVerdier (PVQ10) · 8 → Step7HumorPersonlighet (COMMUNICATION) ·
 *   10 → Step8ModenNysgjerrighet (ERQ6)
 */
const SCALE_STEPS: Record<number, Item[]> = {
  1: BFI10,
  3: ATTACHMENT,
  5: PVQ10,
  8: COMMUNICATION,
  10: ERQ6,
};

/**
 * PL-08a: Returnerer ID-ene til skalaprofiler uten et gyldig svar (tall 1–5).
 * Brukes både av stegets egen validate (PL-08b) og den sentrale
 * validateOnboardingStep-gaten (PL-08a) — serveren er fasit (PL-08g).
 */
export function missingScaleItems(
  data: Record<string, unknown>,
  items: Item[]
): string[] {
  return items.filter((item) => {
    const v = data[item.id];
    if (typeof v !== 'number' || Number.isNaN(v)) return true;
    return v < 1 || v > 5;
  }).map((item) => item.id);
}

export interface StepFieldError {
  field: string;
  message: string;
}

export interface StepValidation {
  step: number;
  errors: StepFieldError[];
}

/** Trimmet streng for et felt (undefined/null/'' → ''). */
function str(data: Record<string, unknown>, field: string): string {
  const v = data[field];
  return v === undefined || v === null ? '' : String(v).trim();
}

/** Er verdien manglende eller ikke et gyldig tall? */
function isMissingNumber(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  const s = String(v).trim();
  if (s === '') return true;
  return Number.isNaN(Number(v));
}

/** Steg 0 — Grunnprofil (speiler basicProfileSchema). */
function validateBasicStep(data: Record<string, unknown>): StepFieldError[] {
  const errors: StepFieldError[] = [];

  const name = str(data, 'identityName');
  if (!name) errors.push({ field: 'identityName', message: 'Fyll inn navnet ditt.' });
  else if (name.length < 2) errors.push({ field: 'identityName', message: 'Navnet må være minst 2 tegn.' });
  else if (name.length > 50) errors.push({ field: 'identityName', message: 'Navnet kan være maks 50 tegn.' });

  if (isMissingNumber(data['age'])) {
    errors.push({ field: 'age', message: 'Alder er påkrevd.' });
  } else {
    const age = Number(data['age']);
    if (age < MIN_AGE) errors.push({ field: 'age', message: `Du må være minst ${MIN_AGE} år.` });
    else if (age > 99) errors.push({ field: 'age', message: 'Alder kan ikke være over 99.' });
  }

  if (!str(data, 'gender')) errors.push({ field: 'gender', message: 'Velg et kjønn.' });
  if (!str(data, 'seekingGender')) errors.push({ field: 'seekingGender', message: 'Velg hvem du søker.' });

  const city = str(data, 'city');
  if (!city) errors.push({ field: 'city', message: 'Hvor bor du?' });
  else if (city.length > 100) errors.push({ field: 'city', message: 'Stedet kan være maks 100 tegn.' });

  const postalCode = str(data, 'postalCode');
  if (!postalCode) errors.push({ field: 'postalCode', message: 'Postnummer er påkrevd.' });
  else if (!/^\d{4}$/.test(postalCode)) errors.push({ field: 'postalCode', message: 'Postnummer må ha fire siffer.' });

  // Avstand må ligge i det tetthetsbaserte området for postnummeret.
  // getDistancePrefRange returnerer land-default for ukjent postnummer —
  // helt som backend-skjemaets superRefine.
  if (isMissingNumber(data['distancePref'])) {
    errors.push({ field: 'distancePref', message: 'Velg en maks avstand.' });
  } else {
    const dist = Number(data['distancePref']);
    const range = getDistancePrefRange(postalCode);
    if (dist < range.min || dist > range.max) {
      errors.push({ field: 'distancePref', message: `Maks avstand må være mellom ${range.min} og ${range.max} km.` });
    }
  }

  if (isMissingNumber(data['agePrefMin'])) {
    errors.push({ field: 'agePrefMin', message: 'Velg minste alder du søker.' });
  } else {
    const minAge = Number(data['agePrefMin']);
    if (minAge < MIN_AGE || minAge > 99) errors.push({ field: 'agePrefMin', message: `Minste alder må være mellom ${MIN_AGE} og 99.` });
  }

  if (isMissingNumber(data['agePrefMax'])) {
    errors.push({ field: 'agePrefMax', message: 'Velg høyeste alder du søker.' });
  } else {
    const maxAge = Number(data['agePrefMax']);
    if (maxAge < MIN_AGE || maxAge > 99) errors.push({ field: 'agePrefMax', message: `Høyeste alder må være mellom ${MIN_AGE} og 99.` });
  }

  return errors;
}

/** Steg 1 — Personlighet (speiler personlighetSchema: kun selfDesc er obligatorisk). */
function validatePersonlighetStep(data: Record<string, unknown>): StepFieldError[] {
  const errors: StepFieldError[] = [];
  const selfDesc = str(data, 'selfDesc');
  if (!selfDesc) errors.push({ field: 'selfDesc', message: 'Skriv litt om hvem du er.' });
  else if (selfDesc.length < 10) errors.push({ field: 'selfDesc', message: 'Skriv minst 10 tegn om hvem du er.' });
  return errors;
}

/**
 * Validerer ett onboarding-steg mot det som er påkrevd for å fullføre.
 * PL-08a: skalastegene (1, 3, 5, 8, 10) krever svar på alle påstandene.
 */
export function validateOnboardingStep(step: number, data: Record<string, unknown>): StepValidation {
  let errors: StepFieldError[] = [];
  if (step === 0) errors = validateBasicStep(data);
  else if (step === 1) errors = validatePersonlighetStep(data);

  // PL-08a: påkrevde skalasvar på de fem skalastegene.
  const scaleItems = SCALE_STEPS[step];
  if (scaleItems) {
    const missing = missingScaleItems(data, scaleItems);
    if (missing.length > 0) {
      errors.push({
        field: missing[0],
        message: 'Svar på alle påstandene — det finnes ingen fasit.',
      });
    }
  }

  return { step, errors };
}

/** Alle ufullstendige steg (i rekkefølge). Tomt array = profilen er komplett. */
export function validateAllOnboardingSteps(data: Record<string, unknown>): StepValidation[] {
  const incomplete: StepValidation[] = [];
  // PL-08a: kjører over ALLE steg (0–12), ikke bare [0, 1].
  for (let step = 0; step <= 12; step++) {
    const validation = validateOnboardingStep(step, data);
    if (validation.errors.length > 0) incomplete.push(validation);
  }
  return incomplete;
}

/** Det første ufullstendige steget (for å hoppe dit), eller null hvis komplett. */
export function firstIncompleteOnboardingStep(data: Record<string, unknown>): StepValidation | null {
  return validateAllOnboardingSteps(data)[0] ?? null;
}