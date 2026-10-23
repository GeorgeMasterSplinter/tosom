/**
 * ToSom — Onboarding Setup Validation (Zod Schemas)
 * 
 * Backend-validering for alle 70+ felt i /api/profile/setup
 */

import { z } from 'zod';
import { getDistancePrefRange } from '@/config/distance-prefs';
import { lookupPostalCode } from '@/lib/geo/lookup';
import { ALL_ITEMS } from '@/lib/psychometrics/instruments';

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

/** Valgfritt valg-felt: verdien må være én av de gitte option-verdiene. */
function optEnum(values: string[]) {
  return z.preprocess(
    blankToUndefined,
    z.enum(values as [string, ...string[]], { error: 'Ugyldig valg' }).optional()
  );
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
    acceptedReligions: optStr(),
    // Phase 1.5: OPEN TO ALL som eksplisitt tilstand (teknisk distinkt fra tom/manglende)
    religionOpen: z.boolean().optional(),
    children: optStr(),
    wantChildren: optStr(),
    city: z.string().min(1, 'Hvor bor du?').max(100),
    postalCode: z.string().regex(/^\d{4}$/, 'Postnummer må ha fire siffer'),
    distancePref: z.coerce.number(),
    agePrefMin: z.coerce.number().min(21).max(99),
    agePrefMax: z.coerce.number().min(21).max(99),

  })
  .superRefine((val, ctx) => {
    // PL-27: religion / livssyn — opptil fire valg (kommaseparert, som i Step1)
    if (val.religion && val.religion.split(',').map((s) => s.trim()).filter(Boolean).length > 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['religion'],
        message: 'Du kan velge opptil fire under religion og livssyn.',
      });
    }
    // Lansering: aksepterte religioner/livssyn — opptil fire valg (hard kompatibilitet)
    if (val.acceptedReligions && val.acceptedReligions.split(',').map((s) => s.trim()).filter(Boolean).length > 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['acceptedReligions'],
        message: 'Du kan velge opptil fire religioner eller livssyn du er åpen for.',
      });
    }
    // «Åpen for alle» er eksklusivt — det er en egen tilstand, ikke et femte valg
    const acceptedParts = val.acceptedReligions
      ? val.acceptedReligions.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    if (acceptedParts.includes('OPEN_TO_ALL') && acceptedParts.length > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['acceptedReligions'],
        message: '«Åpen for alle» velges alene — ikke sammen med konkrete religioner.',
      });
    }
    // D-4 (PL-12): ukjent postnummer → avvis (klienten sjekker også, Step1)
    if (!lookupPostalCode(val.postalCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['postalCode'],
        message: 'Vi finner ikke dette postnummeret. Sjekk at det stemmer.',
      });
    }
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
  // LIVSSTIL-2026 (D-5): konvertert til valg-grid — korte option-verdier, ingen min-lengde.
  energyGiver: optStr(300),
  energyDrainer: optStr(300),
  pressureReact: optStr(300),
  quirk: optStr(200),
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
  // LIVSSTIL-2026 (D-5): konvertert til valg-grid — korte option-verdier.
  responsibilities: optStr(200),
  dailyRoutine: optStr(200),
});

export type LivssituasjonInput = z.infer<typeof livssituasjonSchema>;

/* ============================================================
   TILKNYTNING (Steg 3)
   ============================================================ */

export const tilknytningSchema = z.object({
  // LIVSSTIL-2026 (D-5): 4 felt konvertert til valg-grid; importantBoundary
  // beholdes som valgfri kort fritekst.
  safetyNeed: optStr(300),
  insecurityTrigger: optStr(300),
  sadnessNeed: optStr(300),
  stressNeed: optStr(300),
  importantBoundary: optStr(300),
});

export type TilknytningInput = z.infer<typeof tilknytningSchema>;

/* ============================================================
   KJÆRLIGHETSSPRÅK (Steg 4)
   ============================================================ */

export const kjærlighetsspråkSchema = z.object({
  loveGive: optStr(),
  loveReceive: optStr(),
  // LIVSSTIL-2026 (D-5): konvertert til valg-grid; smallThing er valgfri kort.
  closenessBuilder: optStr(300),
  distanceCreator: optStr(300),
  smallThing: optStr(300),
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
  // LIVSSTIL-2026 (D-5): futureVision/experienceAlone/experienceTogether konvertert
  // til valg-grid; dreamGoal er valgfri kort; buildTogether beholdes (varme, min 10).
  futureVision: optStr(200),
  dreamGoal: optStr(300),
  buildTogether: optStr(300, 10),
  experienceAlone: optStr(200),
  experienceTogether: optStr(200),
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
  neverCrossBoundary: optStr(300),
  understandPartnersBoundaries: optStr(300),
  // LIVSSTIL-2026 (D-3, besluttet 18.10): begge fritekstfeltene er VALGFRIE.
  // ERQ-6 + grense-gridene bærer sikkerhetsdataene — to store tomme bokser
  // var et av de tyngste fravikelstegene i onboarding.
  limitations: optStr(300),
  partnerMustUnderstand: optStr(300),
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
   LIVSSTIL 2026 (ny 18.10.2026 — D-2/D-4)
   Hverdagsvalg for 2026-Norge, plassert i steg 2b (arbeidsrytme, bosted,
   reiser, dyr, skjerm) og steg 5a (bil, kosthold, klima, alkohol,
   aktivitet). Lagres i Profile.preferences.livsstil2026 (ingen migrasjon).
   Vekt-modellen (D-4): bil/kosthold/alkohol/dyr får et viktighetsvalg —
   «ma-stemme» gjør feltet til en hard dealbreaker i motoren.
   Alle felt er valfrie; motoren behandler manglende data nøytralt.
   ============================================================ */

const VIKTIGHET = ['ikke-viktig', 'bor-stemme', 'ma-stemme'] as const;

export const livsstil2026Schema = z.object({
  // Steg 2b — hverdagen
  arbeidsrytme: optEnum(['kontorbundet', 'hybrid', 'hjemmearbeid', 'skift']),
  arbeidsrytmeViktig: optEnum([...VIKTIGHET]),
  bosted: optEnum(['sentrum', 'forstad', 'land', 'ubestemt']),
  bostedViktig: optEnum([...VIKTIGHET]),
  reiser: optEnum(['fjell-bobil', 'utlandet', 'naturen-naermest', 'lite-reising']),
  reiserViktig: optEnum([...VIKTIGHET]),
  dyr: optEnum(['hund', 'katt', 'annet-dyr', 'ingen']),
  dyrViktig: optEnum([...VIKTIGHET]),
  skjerm: optEnum(['mye', 'moderat', 'vil-skru-ned', 'ubestemt']),
  skjermViktig: optEnum([...VIKTIGHET]),
  // Steg 5a — livsstil & verdier
  bil: optEnum(['full-el', 'phev', 'bensin', 'diesel', 'esykkel-ingen']),
  bilViktig: optEnum([...VIKTIGHET]),
  kosthold: optEnum(['spiser-koett', 'fleksitar', 'vegetar', 'vegan', 'fisk']),
  kostholdViktig: optEnum([...VIKTIGHET]),
  klima: optEnum(['veldig-viktig', 'viktig', 'ikke-stor-sak']),
  alkohol: optEnum(['aldri', 'sjelden', 'helligdager', 'ofte']),
  alkoholViktig: optEnum([...VIKTIGHET]),
  aktivitet: optStr(100), // flervalg (maks 3), kommaseparert
  aktivitetViktig: optEnum([...VIKTIGHET]),
});

export type Livsstil2026Input = z.infer<typeof livsstil2026Schema>;

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
   PL-08g (D-1): Rå svar (1–5) er PÅKREVDE for alle 44 item-ID-er.
   Skjemaet bygges fra ALL_ITEMS slik at serveren er fasit —
   onboarding kan ikke fullføres uten komplett datagrunnlag
   for skårer og resonansnivå.
   ============================================================ */

export const psychometricsSchema = z
  .object(
    Object.fromEntries(
      ALL_ITEMS.map((item) => [
        item.id,
        z.coerce.number().min(1, 'Skalavertien må være mellom 1 og 5').max(5, 'Skalavertien må være mellom 1 og 5'),
      ])
    )
  );

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
  // LIVSSTIL-2026 (D-2): ny seksjon — VALGFRI (gammle payloads/tester uten
  // seksjonen må fortsatt gå gjennom; alle felt i selve seksjonen er optionale).
  livsstil2026: livsstil2026Schema.optional(),
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