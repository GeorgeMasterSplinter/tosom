/**
 * Tosom – API: Profile Setup
 * Mottar og lagrar all onboarding-data og mappar til Prisma Profile-modellen.
 *
 * O1 FIX: Input-validering med Zod-schema (onboardingSetupSchema).
 * Alle ~90 felt valideres før database-innsetting.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';
import { validateOnboarding } from '@/lib/validation/onboarding-setup';
import { lookupPostalCode } from '@/lib/geo/lookup';
import { withMetrics } from '@/lib/observability/withMetrics';

export const dynamic = 'force-dynamic';

async function postHandler(req: NextRequest) {
  try {
    const body = await req.json();

    // O1 FIX: Valider med Zod-skjemaet FØR du skriver til databasen
    const validation = validateOnboarding(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Ugyldig input', details: validation.errors },
        { status: 400 }
      );
    }

    const { data } = validation;
    const {
      basic,
      personlighet,
      tilknytning,
      kommunikasjon,
      kjaerlighet,
      livsstil,
      fremtid,
      humor,
      moden,
      preferanser,
    } = data;

    // Valider session via NextAuth
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Ikke autentisert. Logg inn først.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // B1.3: Utled latitude/longitude FRA postalCode ved lagring (ikke ved lesing).
    // Ukjent postnummer / postboks-kode uten geometri → null (håndteres i B1.4).
    const geo = lookupPostalCode(basic.postalCode);

    // Mapper til Profile-modellen (validering allerede gjort — data er trygt)
    await prisma.profile.upsert({
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
        },
        lifestyle: {
          height: basic.height ?? undefined, // Zod coerces to number already
          bodyType: basic.bodyType,
          lifestyleType: basic.lifestyle,
          smoking: basic.smoking,
          children: basic.children,
          wantChildren: basic.wantChildren,
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
        },
        lifestyle: {
          height: basic.height ?? undefined, // Zod coerces to number already
          bodyType: basic.bodyType,
          lifestyleType: basic.lifestyle,
          smoking: basic.smoking,
          children: basic.children,
          wantChildren: basic.wantChildren,
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
        },
      },
    });

    // Marker onboarding som fullført
    await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingComplete: true,
        deepProfileComplete: true,
        onboardingStep: 10,
      },
    });

    return NextResponse.json({
      success: true,
      userId,
      message: 'Profil fullført!',
    });
  } catch (error) {
    console.error('Profile setup error:', error);
    return NextResponse.json(
      { error: 'Kunne ikke lagre profil' },
      { status: 500 }
    );
  }
}

export const POST = withMetrics('/api/profile/setup', postHandler);
