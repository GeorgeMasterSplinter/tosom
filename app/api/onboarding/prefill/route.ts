/**
 * Tosom — API: Onboarding Prefill (WP2, 2026-08-24)
 *
 * GET /api/onboarding/prefill
 * Én kilde for onboarding sin INITIALL-tilstand: mapper fullførte profiler
 * tilbake til det flate onboarding-språket via lib/profile/toOnboardingData.
 *
 * Svar: { complete: boolean, step: number, data: Record<string, unknown> | null }
 *   - complete: User.onboardingComplete (profilen er fullført)
 *   - step:     anbefalt startsteg (0 — brukeren går igjen og kan hoppe fram)
 *   - data:     pre-fyllingsverdier (null hvis ingen structured data finnes)
 *
 * Prioritet i OnboardingFlow: server-draft (pågående utkast) > prefill >
 * localStorage. Prefill brukes altså når det IKKE er et aktivt utkast.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';
import { toOnboardingData } from '@/lib/profile/toOnboardingData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        onboardingComplete: true,
        profile: {
          select: {
            identityName: true,
            age: true,
            lifeSituation: true,
            lifestyle: true,
            personality: true,
            communication: true,
            intimacy: true,
            futureVision: true,
            boundaries: true,
            emotionalNeeds: true,
            securityLevel: true,
            psychometricAnswers: true,
            deepProfileData: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ complete: false, step: 0, data: null });
    }

    // Prisma tiler Json-kolonner som JsonValue — mapperen er defensiv og
    // type-definerer formen selv, så kasting er her bevisst.
    const { data, complete } = toOnboardingData(
      user.profile as unknown as Parameters<typeof toOnboardingData>[0],
      user.onboardingComplete
    );

    return NextResponse.json({
      complete,
      step: 0,
      data: Object.keys(data).length > 0 ? data : null,
    });
  } catch (err) {
    console.error('[onboarding/prefill] failed:', err);
    return NextResponse.json(
      { error: 'Kunne ikke hente prefill' },
      { status: 500 }
    );
  }
}