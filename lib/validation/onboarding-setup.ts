/**
 * ToSom — Onboarding Setup Validation (Zod Schemas)
 * 
 * Backend-validering for alle 70+ felt i /api/profile/setup
 */

import { z } from 'zod';

/* ============================================================
   BASIC PROFILE (Steg 1: Grunnprofil)
   ============================================================ */

export const basicProfileSchema = z.object({
  identityName: z.string().min(2, 'Navn må vere minst 2 tegn').max(50, 'Navn kan vere maks 50 tegn'),
  age: z.coerce.number().min(23, 'Du må vere minst 23 år').max(99, 'Alder kan ikke vere over 99'),
  gender: z.string().min(1, 'Velg eit kjønn'),
  seekingGender: z.string().min(1, 'Velg kven du søker'),
  height: z.coerce.number().min(100).max(250).optional(),
  bodyType: z.string().optional(),
  lifestyle: z.string().optional(),
  smoking: z.string().optional(),
  religion: z.string().optional(),
  children: z.string().optional(),
  wantChildren: z.string().optional(),
  city: z.string().min(1, 'Hvor bor du?').max(100),
  postalCode: z.string().regex(/^\d{4}$/, 'Postnummer må ha fire siffer'),
  distancePref: z.coerce.number().min(1).max(300),
  agePrefMin: z.coerce.number().min(23).max(99),
  agePrefMax: z.coerce.number().min(23).max(99),
});

export type BasicProfileInput = z.infer<typeof basicProfileSchema>;

/* ============================================================
   PERSONLIGHEIT (Steg 2a)
   ============================================================ */

export const personlighetSchema = z.object({
  selfDesc: z.string().min(10, 'Skriv minst 10 teikn om kven du er').max(500),
  energyGiver: z.string().min(10, 'Kva gir deg energi?').max(300).optional(),
  energyDrainer: z.string().min(10, 'Kva tapper deg for energi?').max(300).optional(),
  pressureReact: z.string().min(10, 'Hvordan reagerer du under press?').max(300).optional(),
  quirk: z.string().min(5, 'Skildre ein quirky eigenskap').max(200).optional(),
});

export type PersonlighetInput = z.infer<typeof personlighetSchema>;

/* ============================================================
   LIVSSITUASJON (Steg 2b)
   ============================================================ */

export const livssituasjonSchema = z.object({
  workType: z.string().optional(),
  housingType: z.string().optional(),
  householdSize: z.string().optional(),
  economicStability: z.string().optional(),
  responsibilities: z.string().min(10).max(500).optional(),
  dailyRoutine: z.string().min(10).max(500).optional(),
});

export type LivssituasjonInput = z.infer<typeof livssituasjonSchema>;

/* ============================================================
   TILKNYTNING (Steg 3)
   ============================================================ */

export const tilknytningSchema = z.object({
  safetyNeed: z.string().min(10).max(300).optional(),
  insecurityTrigger: z.string().min(10).max(300).optional(),
  sadnessNeed: z.string().min(10).max(300).optional(),
  stressNeed: z.string().min(10).max(300).optional(),
  importantBoundary: z.string().min(10).max(300).optional(),
});

export type TilknytningInput = z.infer<typeof tilknytningSchema>;

/* ============================================================
   KJÆRLIGHETSSPRÅK (Steg 4)
   ============================================================ */

export const kjærlighetsspråkSchema = z.object({
  loveGive: z.string().optional(),
  loveReceive: z.string().optional(),
  closenessBuilder: z.string().min(10).max(300).optional(),
  distanceCreator: z.string().min(10).max(300).optional(),
  smallThing: z.string().min(10).max(300).optional(),
});

export type KjærlighetsspråkInput = z.infer<typeof kjærlighetsspråkSchema>;

/* ============================================================
   LIVSSTIL & VERDIAR (Steg 5a)
   ============================================================ */

export const livsstilSchema = z.object({
  highPriority: z.string().optional(),
  lowPriority: z.string().optional(),
  goodEveryday: z.string().min(10).max(300).optional(),
  desiredLifestyle: z.string().optional(),
  undesiredLifestyle: z.string().optional(),
});

export type LivsstilInput = z.infer<typeof livsstilSchema>;

/* ============================================================
   RELASJONSSTIL (Steg 5b)
   ============================================================ */

export const relasjonsStilSchema = z.object({
  relationshipSeeking: z.string().optional(),
  closenessNeed: z.string().optional(),
  independenceBalance: z.string().optional(),
});

export type RelasjonsStilInput = z.infer<typeof relasjonsStilSchema>;

/* ============================================================
   FRAMTID & VISJON (Steg 6)
   ============================================================ */

export const fremtidSchema = z.object({
  futureVision: z.string().min(10).max(500).optional(),
  dreamGoal: z.string().min(10).max(300).optional(),
  buildTogether: z.string().min(10).max(300).optional(),
  experienceAlone: z.string().min(10).max(300).optional(),
  experienceTogether: z.string().min(10).max(300).optional(),
});

export type FremtidInput = z.infer<typeof fremtidSchema>;

/* ============================================================
   HUMOR & PERSONLIGHEIT (Steg 7)
   ============================================================ */

export const humorSchema = z.object({
  laughterTrigger: z.string().max(200).optional(),
  quirkyHabit: z.string().min(5).max(200).optional(),
  guiltyPleasure: z.string().min(10).max(300).optional(),
  totallyYou: z.string().min(10).max(300).optional(),
  partnerWouldLaugh: z.string().max(200).optional(),
});

export type HumorInput = z.infer<typeof humorSchema>;

/* ============================================================
   GRENSE (Steg 8a)
   ============================================================ */

export const grenserSchema = z.object({
  neverCrossBoundary: z.string().min(10).max(300).optional(),
  understandPartnersBoundaries: z.string().min(10).max(300).optional(),
  limitations: z.string().max(300).optional(),
  partnerMustUnderstand: z.string().min(10).max(300).optional(),
});

export type GrenserInput = z.infer<typeof grenserSchema>;

/* ============================================================
   MODEN NYSGJERRIGHET (Steg 8b)
   ============================================================ */

export const modenSchema = z.object({
  intimacySafety: z.string().max(300).optional(),
  comfortableWith: z.string().max(300).optional(),
  boundary: z.string().max(200).optional(),
  nearerType: z.string().max(200).optional(),
  needsTime: z.string().max(200).optional(),
});

export type ModenInput = z.infer<typeof modenSchema>;

/* ============================================================
   PREFERSAR (valgfritt)
   ============================================================ */

export const preferanserSchema = z.object({
  politicsImportance: z.number().min(1).max(10).optional(),
  religionImportance: z.number().min(1).max(10).optional(),
  dietPreference: z.string().optional(),
  sleepSchedule: z.string().optional(),
  pets: z.string().optional(),
  travelFreq: z.string().optional(),
  alcoholFreq: z.string().optional(),
  ambitionLevel: z.string().optional(),
  structureSpontaneity: z.string().optional(),
  introExtrovert: z.string().optional(),
  attachmentStyle: z.string().optional(),
});

export type PreferanserInput = z.infer<typeof preferanserSchema>;

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