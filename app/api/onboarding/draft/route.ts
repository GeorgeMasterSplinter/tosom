/**
 * Tosom — API: Onboarding Draft Autosave (STEG 5.3)
 *
 * POST /api/onboarding/draft
 * Lagrer delvis onboarding-data til serveren slik at brukeren ikke mister
 * framdrift ved enhetsbytte eller nettleser-tømning.
 * Serveren er sannhet; localStorage blir kun hurtigbuffer.
 *
 * GET /api/onboarding/draft
 * Henter siste lagrede draft fra serveren.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

const STEP_ENUMS = ['IDENTITY', 'PERSONALITY', 'LIFE_SITUATION', 'RELATIONSHIP_STYLE',
  'COMMUNICATION', 'INTIMACY', 'FUTURE_VISION', 'BOUNDARIES'] as const;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { step, data } = body;

    // Bruk $executeRaw for å unngå Prisma type-problemer med enum-casting
    const enumStep = step !== undefined ? (STEP_ENUMS[Math.min(step, STEP_ENUMS.length - 1)] || 'IDENTITY') : null;

    await prisma.$executeRaw`
      INSERT INTO "Profile" ("userId", "deepProfileData", "deepProfileStep")
      VALUES (${session.user.id}, ${JSON.stringify(data || {})}::jsonb, ${enumStep}::text)
      ON CONFLICT ("userId")
      DO UPDATE SET
        "deepProfileData" = ${JSON.stringify(data || {})}::jsonb,
        "deepProfileStep" = CASE WHEN ${step as number} IS NOT NULL THEN ${enumStep}::text ELSE "Profile"."deepProfileStep" END
    `;

    return NextResponse.json({ ok: true, step });
  } catch (err) {
    console.error('[onboarding/draft] save failed:', err);
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { deepProfileData: true, deepProfileStep: true },
    });

    if (!profile?.deepProfileData) {
      return NextResponse.json({ data: null, step: null });
    }

    return NextResponse.json({
      data: profile.deepProfileData,
      step: mapEnumToStep(profile.deepProfileStep),
    });
  } catch (err) {
    console.error('[onboarding/draft] load failed:', err);
    return NextResponse.json(
      { error: 'Failed to load draft' },
      { status: 500 }
    );
  }
}

function mapEnumToStep(enumVal: string): number {
  const map: Record<string, number> = {
    IDENTITY: 0, PERSONALITY: 1, LIFE_SITUATION: 2,
    RELATIONSHIP_STYLE: 3, COMMUNICATION: 4, INTIMACY: 5,
    FUTURE_VISION: 7, BOUNDARIES: 9, SUMMARY: 11,
  };
  return map[enumVal] ?? 0;
}