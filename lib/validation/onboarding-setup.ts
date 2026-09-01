/**
 * ToSom — Onboarding Setup Validation (Zod Schemas)
 * 
 * Backend-validering for alle 70+ felt i /api/profile/setup
 */

import { z } from 'zod';
import { getDistancePrefRange } from '@/config/distance-prefs';

/* ============================================================
   HJELPERE — tolerant input fra frontend (STEG 13.1 FIX)
   Frontend sender '' for ALLE felt brukeren ikke fylte ut
   (OnboardingFlow.tsx initialData), mens Zod .optional() kun
   tolererer undefined. '' på valfrie felt ga derfor 400 på
   /api/profile/setup hver gong et steg ble hoppa over.
   Blank streng → undefined før validering. Obligatoriske felt
   (fanget klient-side) blir ikke rørt.
   ============================================================ */

function blankToUndefined(v: unknown): unknown {
  if (typeof v === 'string' && v.trim() === '') return undefined;
  return v;
}

/** Valgfri streng-felt: '' behandles som "ikke svart". */
function optStr(max?: number, min = 0, msg?: string) {
  let s: z.ZodString = z.string();
  if (min > 0) s = msg ? s.min(min, msg) : s.min(min);
  if (max !== undefined) s = s.max(max);
  return z.preprocess(blankToUndefined, s.optional());
}

/* ============================================================
   BASIC PROFILE (Steg 1: Grunnprofil)
   ============================================================ */

export const basicProfileSchema = z
  .object({
    identityName: z.string().min(2, 'Navn må være minst 2 tegn').max(50, 'Navn kan være maks 50 tegn'),
    age: z.coerce.number().min(21, 'Du må være minst 21 år').max(99, 'Alder kan ikke være over 99'),
    gender: z.string().min(1, 'Velg et kjønn'),
    seekingGender: z.string().min(1, 'Velg hvem du søker'),
    height: z.preprocess(blankToUndefined, z.coerce.number().min(100).max(250).optional()),
    bodyType: optStr(),
    lifestyle: optStr(),
    smoking: optStr(),
    religion: optStr(),
    children: optStr(),
    wantChildren: optStr(),
    city: z.string().min(1, 'Hvor bor du?').max(100),
    postalCode: z.string().regex(/^\d{4}$/, 'Postnummer må ha fire siffer'),
    distancePref: z.coerce.number(),
    agePrefMin: z.coerce.number().min(21).max(99),
    agePrefMax: z.coerce.number().min(21).max(99),

  })
  .superRefine((val, ctx) => {
    // Dag 11: tetthetsbasert avstandsvalg — område basert på postnummer
    const range = getDistancePrefRange(val.postalCode);
    const v = Number(val.distancePref);
    if (Number.isNaN(v) || v < range.min || v > range.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['distancePref'],
        message: `Maks avstand må være mellom ${range.min} og ${range.max} km.`,
      });
    }
  });

export type BasicProfileInput = z.infer<typeof basicProfileSchema>;

/* ============================================================
   PERSONLIGHEIT (Steg 2a)
   ============================================================ */

export const personlighetSchema = z.object({
  selfDesc: z.string().min(10, 'Skriv minst 10 tegn om hvem du er').max(500),
  energyGiver: optStr(300, 10, 'Hva gir deg energi?'),
  energyDrainer: optStr(300, 10, 'Hva tapper deg for energi?'),
  pressureReact: optStr(300, 10, 'Hvordan reagerer du under press?'),
  quirk: optStr(200, 5, 'Skildre en quirky eigenskap'),
});

export type PersonlighetInput = z.infer<typeof personlighetSchema>;

/* ============================================================
   LIVSSITUASJON (Steg 2b)
   ============================================================ */

export const livssituasjonSchema = z.object({
  workType: optStr(),
  housingType: optStr(),
  householdSize: optStr(),
  economicStability: optStr(),
  responsibilities: optStr(500, 10),
  dailyRoutine: optStr(500, 10),
});

export type LivssituasjonInput = z.infer<typeof livssituasjonSchema>;

/* ============================================================
   TILKNYTNING (Steg 3)
   ============================================================ */

export const tilknytningSchema = z.object({
  safetyNeed: optStr(300, 10),
  insecurityTrigger: optStr(300, 10),
  sadnessNeed: optStr(300, 10),
  stressNeed: optStr(300, 10),
  importantBoundary: optStr(300, 10),
});

export type TilknytningInput = z.infer<typeof tilknytningSchema>;

/* ============================================================
   KJÆRLIGHETSSPRÅK (Steg 4)
   ============================================================ */

export const kjærlighetsspråkSchema = z.object({
  loveGive: optStr(),
  loveReceive: optStr(),
  closenessBuilder: optStr(300, 10),
  distanceCreator: optStr(300, 10),
  smallThing: optStr(300, 10),
});

export type KjærlighetsspråkInput = z.infer<typeof kjærlighetsspråkSchema>;

/* ============================================================
   LIVSSTIL & VERDIER (Steg 5a)
   ============================================================ */

export const livsstilSchema = z.object({
  highPriority: optStr(),
  lowPriority: optStr(),
  goodEveryday: optStr(300, 10),
  desiredLifestyle: optStr(),
  undesiredLifestyle: optStr(),
});

export type LivsstilInput = z.infer<typeof livsstilSchema>;

/* ============================================================
   RELASJONSSTIL (Steg 5b)
   ============================================================ */

export const relasjonsStilSchema = z.object({
  relationshipSeeking: optStr(),
  closenessNeed: optStr(),
  independenceBalance: optStr(),
});

export type RelasjonsStilInput = z.infer<typeof relasjonsStilSchema>;

/* ============================================================
   FRAMTID & VISJON (Steg 6)
   ============================================================ */

export const fremtidSchema = z.object({
  futureVision: optStr(500, 10),
  dreamGoal: optStr(300, 10),
  buildTogether: optStr(300, 10),
  experienceAlone: optStr(300, 10),
  experienceTogether: optStr(300, 10),
});

export type FremtidInput = z.infer<typeof fremtidSchema>;

/* ============================================================
   HUMOR & PERSONLIGHEIT (Steg 7)
   ============================================================ */

export const humorSchema = z.object({
  laughterTrigger: optStr(200),
  quirkyHabit: optStr(200, 5),
  guiltyPleasure: optStr(300, 10),
  totallyYou: optStr(300, 10),
  partnerWouldLaugh: optStr(200),
});

export type HumorInput = z.infer<typeof humorSchema>;

/* ============================================================
   GRENSE (Steg 8a)
   ============================================================ */

export const grenserSchema = z.object({
  // Select-grid-felt fra steg 8a: sender korte option-verdier
  // (f.eks. «respekt», «lar») — ingen min-lengde på disse.
  // Fritekst-feltene (limitations/partnerMustUnderstand) beholder min 10.
  neverCrossBoundary: optStr(300),
  understandPartnersBoundaries: optStr(300),
  limitations: optStr(300),
  partnerMustUnderstand: optStr(300, 10),
});

export type GrenserInput = z.infer<typeof grenserSchema>;

/* ============================================================
   MODEN NYSGJERRIGHET (Steg 8b)
   ============================================================ */

export const modenSchema = z.object({
  intimacySafety: optStr(300),
  comfortableWith: optStr(300),
  boundary: optStr(200),
  nearerType: optStr(200),
  needsTime: optStr(200),
});

export type ModenInput = z.infer<typeof modenSchema>;

/* ============================================================
   PREFERSAR (valgfritt)
   ============================================================ */

export const preferanserSchema = z.object({
  politicsImportance: z.number().min(1).max(10).optional(),
  religionImportance: z.number().min(1).max(10).optional(),
  dietPreference: optStr(),
  sleepSchedule: optStr(),
  pets: optStr(),
  travelFreq: optStr(),
  alcoholFreq: optStr(),
  ambitionLevel: optStr(),
  structureSpontaneity: optStr(),
  introExtrovert: optStr(),
  attachmentStyle: optStr(),
});

export type PreferanserInput = z.infer<typeof preferanserSchema>;

/* ============================================================
   PSYKOMETRIK (FORSKNINGSMOTOR F-6)
   Rå svar per item (1–5). Manglende items behandles som nøytrale
   i scoring.ts — derfor er seksjonen valgfri i skjemaet.
   ============================================================ */

export const psychometricsSchema = z
  .record(
    z.string(),
    z.coerce.number().min(1, 'Skalavertien må være mellom 1 og 5').max(5, 'Skalavertien må være mellom 1 og 5'),
  )
  .optional();

export type PsychometricsInput = z.infer<typeof psychometricsSchema>;

/* ============================================================
   HEIL ONBOARDING-SKJEMA
   ============================================================ */

// STEG 7.1 FIX: Frontend sender ALLE 12 seksjonene (bekreftet i OnboardingFlow.tsx:300-360).
// Fjernet .optional() fra alle dype seksjoner for server-side håndheving.
export const onboardingSetupSchema = z.object({
  basic: basicProfileSchema,
  personlighet: personlighetSchema,
  livssituasjon: livssituasjonSchema,
  tilknytning: tilknytningSchema,
  kommunikasjon: kjærlighetsspråkSchema,
  kjaerlighet: kjærlighetsspråkSchema,
  livsstil: livsstilSchema,
  relasjonsStil: relasjonsStilSchema,
  fremtid: fremtidSchema,
  humor: humorSchema,
  grenser: grenserSchema,
  moden: modenSchema,
  preferanser: preferanserSchema,
  psychometrics: psychometricsSchema,
});

export type OnboardingSetupInput = z.infer<typeof onboardingSetupSchema>;

/* ============================================================
   HELPER — validateWithZod
   ============================================================ */

export function validateOnboarding(data: unknown): 
  { success: true; data: OnboardingSetupInput } | 
  { success: false; errors: Array<{ field: string; message: string }> } {
  
  const result = onboardingSetupSchema.safeParse(data);
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map(err => ({
        field: (err as any).path?.join('.') || 'unknown',
        message: err.message || 'Ugyldig input',
      })),
    };
  }
  
  return { success: true, data: result.data };
}