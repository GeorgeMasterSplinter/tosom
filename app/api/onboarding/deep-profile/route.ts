/**
 * ToSom — Deep Profile API
 * 
 * POST /api/onboarding/deep-profile
 * - Mottar alle 10 dimensjonar
 * - Lagrer i Profile-table
 * - Oppdaterer User.deepProfileComplete
 * - Returnerer { ok: true }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const body = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Manglande userId' }, { status: 400 });
    }

    const {
      identityName,
      lifeSituation,
      lifestyle,
      personality,
      relationshipStyle,
      communication,
      intimacy,
      futureVision,
      boundaries,
      emotionalNeeds,
      lifeRhythm,
      maturityLevel,
      securityLevel,
      photoUrl,
      bio,
      interests,
    } = body;

    // Finn eller opprett profile
    let profile = await prisma.profile.findFirst({
      where: { userId },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId,
          identityName,
          lifeSituation: lifeSituation ? (JSON.stringify(lifeSituation) as Prisma.InputJsonValue) : Prisma.JsonNull,
          lifestyle: lifestyle ? (JSON.stringify(lifestyle) as Prisma.InputJsonValue) : Prisma.JsonNull,
          personality: personality ? (JSON.stringify(personality) as Prisma.InputJsonValue) : Prisma.JsonNull,
          relationshipStyle,
          communication: communication ? (JSON.stringify(communication) as Prisma.InputJsonValue) : Prisma.JsonNull,
          intimacy: intimacy ? (JSON.stringify(intimacy) as Prisma.InputJsonValue) : Prisma.JsonNull,
          futureVision: futureVision ? (JSON.stringify(futureVision) as Prisma.InputJsonValue) : Prisma.JsonNull,
          boundaries: boundaries ? (JSON.stringify(boundaries) as Prisma.InputJsonValue) : Prisma.JsonNull,
          emotionalNeeds: emotionalNeeds ? (JSON.stringify(emotionalNeeds) as Prisma.InputJsonValue) : Prisma.JsonNull,
          lifeRhythm,
          maturityLevel: maturityLevel ? parseInt(maturityLevel) : null,
          securityLevel,
          photoUrl,
          bio,
          interests: interests || [],
          deepProfileStep: 'SUMMARY',
        },
      });
    } else {
      // Oppdater eksisterande
      await prisma.profile.update({
        where: { id: profile.id },
        data: {
          identityName,
          lifeSituation: lifeSituation ? (JSON.stringify(lifeSituation) as Prisma.InputJsonValue) : Prisma.JsonNull,
          lifestyle: lifestyle ? (JSON.stringify(lifestyle) as Prisma.InputJsonValue) : Prisma.JsonNull,
          personality: personality ? (JSON.stringify(personality) as Prisma.InputJsonValue) : Prisma.JsonNull,
          relationshipStyle,
          communication: communication ? (JSON.stringify(communication) as Prisma.InputJsonValue) : Prisma.JsonNull,
          intimacy: intimacy ? (JSON.stringify(intimacy) as Prisma.InputJsonValue) : Prisma.JsonNull,
          futureVision: futureVision ? (JSON.stringify(futureVision) as Prisma.InputJsonValue) : Prisma.JsonNull,
          boundaries: boundaries ? (JSON.stringify(boundaries) as Prisma.InputJsonValue) : Prisma.JsonNull,
          emotionalNeeds: emotionalNeeds ? (JSON.stringify(emotionalNeeds) as Prisma.InputJsonValue) : Prisma.JsonNull,
          lifeRhythm,
          maturityLevel: maturityLevel ? parseInt(maturityLevel) : null,
          securityLevel,
          photoUrl,
          bio,
          interests: interests || [],
          deepProfileStep: 'SUMMARY',
        },
      });
    }

    // Oppdater User
    await prisma.user.update({
      where: { id: userId },
      data: {
        deepProfileComplete: true,
        onboardingStep: 11, // etter deep profile
      },
    });

    return NextResponse.json({ ok: true, message: 'Djup profil lagda' });
  } catch (err) {
    console.error('Deep profile API feil:', err);
    return NextResponse.json(
      { error: 'Kunne ikkje lagre djup profil' },
      { status: 500 }
    );
  }
}