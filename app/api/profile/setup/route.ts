/**
 * ToSom – API: Profile Setup
 * Mottar og lagrar all onboarding-data og mappar til Prisma Profile-modellen.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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
    } = body;

    if (!basic?.identityName) {
      return NextResponse.json(
        { error: 'identityName er påkrevd' },
        { status: 400 }
      );
    }

    // Valider session via NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Ikke autentisert. Logg inn først.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Mapper til Profile-modellen
    await prisma.profile.upsert({
      where: { userId },
      update: {
        identityName: basic.identityName,
        age: basic.age ? parseInt(basic.age) : undefined,
        lifeSituation: {
          gender: basic.gender,
          seekingGender: basic.seekingGender,
          city: basic.city,
        },
        lifestyle: {
          height: basic.height ? parseInt(basic.height) : undefined,
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
        communication: {
          commStyle: kommunikasjon?.commStyle,
          conflictStyle: kommunikasjon?.conflictStyle,
          calmingHelp: kommunikasjon?.calmingHelp,
          trigger: kommunikasjon?.trigger,
          trustBuilder: kommunikasjon?.trustBuilder,
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
        age: basic.age ? parseInt(basic.age) : undefined,
        lifeSituation: {
          gender: basic.gender,
          seekingGender: basic.seekingGender,
          city: basic.city,
        },
        lifestyle: {
          height: basic.height ? parseInt(basic.height) : undefined,
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
        communication: {
          commStyle: kommunikasjon?.commStyle,
          conflictStyle: kommunikasjon?.conflictStyle,
          calmingHelp: kommunikasjon?.calmingHelp,
          trigger: kommunikasjon?.trigger,
          trustBuilder: kommunikasjon?.trustBuilder,
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