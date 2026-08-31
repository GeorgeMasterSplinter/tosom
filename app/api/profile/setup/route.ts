/**
 * Tosom – API: Profile Setup
 * Mottar og lagrar all onboarding-data og mappar til Prisma Profile-modellen.
 *
 * O1 FIX: Input-validering med Zod-schema (onboardingSetupSchema).
 * Alle ~90 felt valideres før database-innsetting.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';
import { validateOnboarding } from '@/lib/validation/onboarding-setup';
import { lookupPostalCode } from '@/lib/geo/lookup';
import { withMetrics } from '@/lib/observability/withMetrics';
import { scoreAll } from '@/lib/psychometrics/scoring';
import { INSTRUMENT_SET_VERSION } from '@/lib/psychometrics/instruments';
import { pgCheck } from '@/lib/rate-limit-pg';

export const dynamic = 'force-dynamic';

// B-4: Rate-limit-tak per bruker (mønster fra A5).
const PROFILE_SETUP_RATE_MAX = 20;
const PROFILE_SETUP_RATE_WINDOW_SEC = 60;

async function postHandler(req: NextRequest) {
  try {
    const body = await req.json();

    // O1 FIX: Valider med Zod-skjemaet FØR du skriver til databasen
    const validation = validateOnboarding(body);
    if (!validation.success) {
      // STEG 13.3: logg Zod-avvisingar så framtidige 400-ar er synlege i Vercel-loggen
      console.error('[profile/setup] validation failed:', JSON.stringify(validation.errors));
      return NextResponse.json(
        { error: 'Ugyldig input', details: validation.errors },
        { status: 400 }
      );
    }

    const { data } = validation;
    const {
      basic,
      personlighet,
      livssituasjon,
      tilknytning,
      kommunikasjon,
      kjaerlighet,
      livsstil,
      relasjonsStil,
      fremtid,
      humor,
      grenser,
      moden,
      preferanser,
      psychometrics,
    } = data;

    // FORSKNINGSMOTOR F-6: Beregn psykometriske skårer fra rå svar (1–5 per item).
    // Manglende items behandles som nøytrale i scoring.ts — ingen crash ved partial profil.
    const psychScores = psychometrics ? scoreAll(psychometrics as Record<string, number>) : null;

    // Valider session via NextAuth
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Ikke autentisert. Logg inn først.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // B-4: Rate limiting per bruker (mønster fra A5, fail-open).
    const setupLimit = await pgCheck(
      `profile:setup:${userId}`,
      PROFILE_SETUP_RATE_MAX,
      PROFILE_SETUP_RATE_WINDOW_SEC
    );
    if (!setupLimit.ok) {
      return NextResponse.json(
        { error: 'Du sender for mange forespørsler. Vent et øyeblikk.' },
        { status: 429 }
      );
    }

    // B1.3: Utled latitude/longitude FRA postalCode ved lagring (ikke ved lesing).
    // Ukjent postnummer / postboks-kode uten geometri → null (håndteres i B1.4).
    const geo = lookupPostalCode(basic.postalCode);

    // BUG 1 ROBUSTHET: Dei tre skrivingane (profil-upsert, draft-rydding,
    // user-flagg) ligg i éin atomisk transaksjon — all-eller-ingenting.
    // Tidlegare kunne ein feil midt i sekvensen la att delvis tilstand
    // (f.eks. profil lagret, men onboardingComplete ikke satt).
    await prisma.$transaction(async (tx) => {
    // Mapper til Profile-modellen (validering allerede gjort — data er trygt)
    await tx.profile.upsert({
      where: { userId },
      update: {
        identityName: basic.identityName,
        age: basic.age ?? undefined, // Zod coerces to number already
        // B1.3: postnummer som kolonne (filterbar) + koordinater utledet ved lagring
        postalCode: basic.postalCode,
        latitude: geo?.lat ?? null,
        longitude: geo?.lon ?? null,
        lifeSituation: {
          gender: basic.gender,
          seekingGender: basic.seekingGender,
          city: basic.city,
          // Livssituasjon (steg 2b) — additive nøkler (var validert men aldri lagret)
          workType: livssituasjon?.workType,
          housingType: livssituasjon?.housingType,
          householdSize: livssituasjon?.householdSize,
          economicStability: livssituasjon?.economicStability,
          responsibilities: livssituasjon?.responsibilities,
          dailyRoutine: livssituasjon?.dailyRoutine,
        },
        lifestyle: {
          height: basic.height ?? undefined, // Zod coerces to number already
          bodyType: basic.bodyType,
          lifestyleType: basic.lifestyle,
          smoking: basic.smoking,
          children: basic.children,
          wantChildren: basic.wantChildren,
          // Livsstil & verdier (steg 5a) — additive nøkler i lifestyle-kolonnen
          highPriority: livsstil?.highPriority,
          lowPriority: livsstil?.lowPriority,
          goodEveryday: livsstil?.goodEveryday,
          desiredLifestyle: livsstil?.desiredLifestyle,
          undesiredLifestyle: livsstil?.undesiredLifestyle,
        },
        personality: {
          selfDesc: personlighet?.selfDesc,
          energyGiver: personlighet?.energyGiver,
          energyDrainer: personlighet?.energyDrainer,
          pressureReact: personlighet?.pressureReact,
          quirk: personlighet?.quirk,
        },
        // STEG 7.2 FIX: Fjernet commStyle/conflictStyle (var duplisert med structureSpontaneity/introExtrovert).
        // Kanoniske verdier lagres kun under deepProfileData.preferanser.
        communication: {
          calmingHelp: (kommunikasjon as any)?.calmingHelp,
          trigger: (kommunikasjon as any)?.trigger,
          trustBuilder: (kommunikasjon as any)?.trustBuilder,
        },
        intimacy: {
          loveGive: kjaerlighet?.loveGive,
          loveReceive: kjaerlighet?.loveReceive,
          closenessBuilder: kjaerlighet?.closenessBuilder,
          distanceCreator: kjaerlighet?.distanceCreator,
          smallThing: kjaerlighet?.smallThing,
        },
        futureVision: {
          futureVision: fremtid?.futureVision,
          dreamGoal: fremtid?.dreamGoal,
          buildTogether: fremtid?.buildTogether,
          experienceAlone: fremtid?.experienceAlone,
          experienceTogether: fremtid?.experienceTogether,
        },
        // boundaries-kolonnen bærer både humor (steg 7) og grenser (steg 8a) —
        // additive nøkler, eksisterende data beholdes ikke her (full oppskrivning ved setup).
        boundaries: {
          laughterTrigger: humor?.laughterTrigger,
          quirkyHabit: humor?.quirkyHabit,
          guiltyPleasure: humor?.guiltyPleasure,
          totallyYou: humor?.totallyYou,
          partnerWouldLaugh: humor?.partnerWouldLaugh,
          neverCrossBoundary: grenser?.neverCrossBoundary,
          understandPartnersBoundaries: grenser?.understandPartnersBoundaries,
          limitations: grenser?.limitations,
          partnerMustUnderstand: grenser?.partnerMustUnderstand,
        },
        emotionalNeeds: {
          safetyNeed: tilknytning?.safetyNeed,
          insecurityTrigger: tilknytning?.insecurityTrigger,
          sadnessNeed: tilknytning?.sadnessNeed,
          stressNeed: tilknytning?.stressNeed,
          importantBoundary: tilknytning?.importantBoundary,
        },
        maturityLevel: moden?.intimacySafety ? 7 : 5,
        securityLevel: preferanser?.attachmentStyle || 'secure',
        // FORSKNINGSMOTOR F-6: Psykometriske skårer (additive felt).
        // Prisma Json-kolonner krever InputJsonValue — kaster for å unngå index-signature-feil.
        psychometricAnswers: (psychometrics as any) ?? undefined,
        bigFive: psychScores ? (psychScores.bigFive as any) : undefined,
        attachment: psychScores ? (psychScores.attachment as any) : undefined,
        valueProfile: psychScores ? (psychScores.values as any) : undefined,
        emotionRegulation: psychScores ? (psychScores.emotionRegulation as any) : undefined,
        psychometricVersion: psychScores ? INSTRUMENT_SET_VERSION : undefined,
        deepProfileStep: 'SUMMARY',
        deepProfileData: {
          distancePref: basic.distancePref,
          agePrefMin: basic.agePrefMin,
          agePrefMax: basic.agePrefMax,
          religion: basic.religion,
          politicsImportance: preferanser?.politicsImportance,
          religionImportance: preferanser?.religionImportance,
          dietPreference: preferanser?.dietPreference,
          sleepSchedule: preferanser?.sleepSchedule,
          pets: preferanser?.pets,
          travelFreq: preferanser?.travelFreq,
          alcoholFreq: preferanser?.alcoholFreq,
          ambitionLevel: preferanser?.ambitionLevel,
          structureSpontaneity: preferanser?.structureSpontaneity,
          introExtrovert: preferanser?.introExtrovert,
          // Relasjonsstil (steg 5b) — kolonnen relationshipStyle er String,
          // så hele seksjonen lagres her som additiv nøkkel
          relasjonsStil: relasjonsStil ?? undefined,
          // Kommunikasjonsskår (FORSKNINGSMOTOR) — lagres i deepProfileData, ikke dedikert kolonne
          communicationScores: psychScores?.communication ?? undefined,
        },
      },
      create: {
        userId: userId,
        identityName: basic.identityName,
        age: basic.age ?? 25, // Zod coerces to number already
        // B1.3: postnummer som kolonne (filterbar) + koordinater utledet ved lagring
        postalCode: basic.postalCode,
        latitude: geo?.lat ?? null,
        longitude: geo?.lon ?? null,
        lifeSituation: {
          gender: basic.gender,
          seekingGender: basic.seekingGender,
          city: basic.city,
          // Livssituasjon (steg 2b) — additive nøkler (var validert men aldri lagret)
          workType: livssituasjon?.workType,
          housingType: livssituasjon?.housingType,
          householdSize: livssituasjon?.householdSize,
          economicStability: livssituasjon?.economicStability,
          responsibilities: livssituasjon?.responsibilities,
          dailyRoutine: livssituasjon?.dailyRoutine,
        },
        lifestyle: {
          height: basic.height ?? undefined, // Zod coerces to number already
          bodyType: basic.bodyType,
          lifestyleType: basic.lifestyle,
          smoking: basic.smoking,
          children: basic.children,
          wantChildren: basic.wantChildren,
          // Livsstil & verdier (steg 5a) — additive nøkler i lifestyle-kolonnen
          highPriority: livsstil?.highPriority,
          lowPriority: livsstil?.lowPriority,
          goodEveryday: livsstil?.goodEveryday,
          desiredLifestyle: livsstil?.desiredLifestyle,
          undesiredLifestyle: livsstil?.undesiredLifestyle,
        },
        personality: {
          selfDesc: personlighet?.selfDesc,
          energyGiver: personlighet?.energyGiver,
          energyDrainer: personlighet?.energyDrainer,
          pressureReact: personlighet?.pressureReact,
          quirk: personlighet?.quirk,
        },
        // STEG 7.2 FIX: Fjernet commStyle/conflictStyle (var duplisert med structureSpontaneity/introExtrovert).
        // Kanoniske verdier lagres kun under deepProfileData.preferanser.
        communication: {
          calmingHelp: (kommunikasjon as any)?.calmingHelp,
          trigger: (kommunikasjon as any)?.trigger,
          trustBuilder: (kommunikasjon as any)?.trustBuilder,
        },
        intimacy: {
          loveGive: kjaerlighet?.loveGive,
          loveReceive: kjaerlighet?.loveReceive,
          closenessBuilder: kjaerlighet?.closenessBuilder,
          distanceCreator: kjaerlighet?.distanceCreator,
          smallThing: kjaerlighet?.smallThing,
        },
        futureVision: {
          futureVision: fremtid?.futureVision,
          dreamGoal: fremtid?.dreamGoal,
          buildTogether: fremtid?.buildTogether,
          experienceAlone: fremtid?.experienceAlone,
          experienceTogether: fremtid?.experienceTogether,
        },
        boundaries: {
          laughterTrigger: humor?.laughterTrigger,
          quirkyHabit: humor?.quirkyHabit,
          guiltyPleasure: humor?.guiltyPleasure,
          totallyYou: humor?.totallyYou,
          partnerWouldLaugh: humor?.partnerWouldLaugh,
          neverCrossBoundary: grenser?.neverCrossBoundary,
          understandPartnersBoundaries: grenser?.understandPartnersBoundaries,
          limitations: grenser?.limitations,
          partnerMustUnderstand: grenser?.partnerMustUnderstand,
        },
        emotionalNeeds: {
          safetyNeed: tilknytning?.safetyNeed,
          insecurityTrigger: tilknytning?.insecurityTrigger,
          sadnessNeed: tilknytning?.sadnessNeed,
          stressNeed: tilknytning?.stressNeed,
          importantBoundary: tilknytning?.importantBoundary,
        },
        maturityLevel: moden?.intimacySafety ? 7 : 5,
        securityLevel: preferanser?.attachmentStyle || 'secure',
        // FORSKNINGSMOTOR F-6: Psykometriske skårer (additive felt).
        // Prisma Json-kolonner krever InputJsonValue — kaster for å unngå index-signature-feil.
        psychometricAnswers: (psychometrics as any) ?? undefined,
        bigFive: psychScores ? (psychScores.bigFive as any) : undefined,
        attachment: psychScores ? (psychScores.attachment as any) : undefined,
        valueProfile: psychScores ? (psychScores.values as any) : undefined,
        emotionRegulation: psychScores ? (psychScores.emotionRegulation as any) : undefined,
        psychometricVersion: psychScores ? INSTRUMENT_SET_VERSION : undefined,
        deepProfileStep: 'SUMMARY',
        deepProfileData: {
          distancePref: basic.distancePref,
          agePrefMin: basic.agePrefMin,
          agePrefMax: basic.agePrefMax,
          religion: basic.religion,
          politicsImportance: preferanser?.politicsImportance,
          religionImportance: preferanser?.religionImportance,
          dietPreference: preferanser?.dietPreference,
          sleepSchedule: preferanser?.sleepSchedule,
          pets: preferanser?.pets,
          travelFreq: preferanser?.travelFreq,
          alcoholFreq: preferanser?.alcoholFreq,
          ambitionLevel: preferanser?.ambitionLevel,
          structureSpontaneity: preferanser?.structureSpontaneity,
          introExtrovert: preferanser?.introExtrovert,
          // Relasjonsstil (steg 5b) — kolonnen relationshipStyle er String,
          // så hele seksjonen lagres her som additiv nøkkel
          relasjonsStil: relasjonsStil ?? undefined,
          // Kommunikasjonsskår (FORSKNINGSMOTOR) — lagres i deepProfileData, ikke dedikert kolonne
          communicationScores: psychScores?.communication ?? undefined,
        },
      },
    });

    // WP2: Rydd onboarding-utkastet — profilen er nå fullførte. Draften bor
    // i eget felt (onboardingDraft) og kan aldri overskrive matching-dataen
    // over; vi sletter den for at neste onboarding-omgang starter rent.
    await tx.profile.update({
      where: { userId },
      data: { onboardingDraft: Prisma.DbNull },
    });

    // Marker onboarding som fullført
    await tx.user.update({
      where: { id: userId },
      data: {
        onboardingComplete: true,
        deepProfileComplete: true,
        onboardingStep: 10,
      },
    });
    });

    return NextResponse.json({
      success: true,
      userId,
      message: 'Profil fullført!',
    });
  } catch (error) {
    // BUG 1 DIAGNOSTIKK: Logg Prisma-feilkode og -melding eksplisitt, slik at
    // ein produksjonssvikt er med eitt blikk identifiserbar i Vercel-loggen.
    // Mest sannsynlege årsak til 500 her: manglende kolonne i DB-en
    // (P2022) — typisk ved ikke-deployet migrasjon mot produksjonen.
    const prismaCode = (error as { code?: string })?.code;
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      `[profile/setup] 500${prismaCode ? ` (Prisma ${prismaCode})` : ''}: ${message.slice(0, 500)}`
    );
    if (prismaCode === 'P2022' || message.includes('does not exist')) {
      console.error(
        '[profile/setup] Kolonne manglar i databasen. Kjør `prisma migrate deploy` mot produksjons-DB-en og verifiser at alle migrasjonar (inkl. add_psychometrics og add_onboarding_draft) er applied.'
      );
    }
    return NextResponse.json(
      { error: 'Kunne ikke lagre profil' },
      { status: 500 }
    );
  }
}

export const POST = withMetrics('/api/profile/setup', postHandler);
