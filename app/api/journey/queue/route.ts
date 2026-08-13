/**
 * POST /api/journey/queue
 *
 * STEG B5 — «Start reisen» setter kø, ikke umiddelbar matching.
 *
 * Invariant I-3: «Start reisen» er det eneste menneskestyrte valget,
 * og det er et valg om å delta — ikke om hvem.
 *
 * Forutsetninger:
 *   - onboardingComplete === true
 *   - journeyState === 'IDLE'
 *   - ikke bannedAt / deletedAt
 *
 * Idempotent: allerede QUEUED → 200 uten å endre matchQueuedAt.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/requireAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth (AuthUser gir oss id + email + role)
    const result = await requireAuth(req);
    if (result instanceof NextResponse) {
      return result;
    }
    const authUser = result.user;

    // 2. Hent full User fra DB for å sjekke onboarding/journeyState/bannedAt
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        onboardingComplete: true,
        journeyState: true,
        matchQueuedAt: true,
        bannedAt: true,
        deletedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Bruker ikke funnet' },
        { status: 404 }
      );
    }

    // 3. Forutsetninger
    if (!user.onboardingComplete) {
      return NextResponse.json(
        { error: 'Onboarding er ikke fullført' },
        { status: 409 }
      );
    }

    if (user.bannedAt) {
      return NextResponse.json(
        { error: 'Kontoen er sperret. Kontakt support for informasjon.' },
        { status: 403 }
      );
    }

    if (user.deletedAt) {
      return NextResponse.json(
        { error: 'Kontoen er slettet' },
        { status: 410 }
      );
    }

    // 4. Idempotent kø-settning i en transaksjon
    const updated = await prisma.$transaction(async (tx) => {
      if (user.journeyState === 'QUEUED') {
        // Allerede i kø — returner eksisterende tilstand, endre ikke matchQueuedAt
        return { journeyState: user.journeyState, matchQueuedAt: user.matchQueuedAt };
      }

      if (user.journeyState !== 'IDLE') {
        // Pågående reise eller annen tilstand — blokker
        throw new Error(`Kan ikke settes i kø med journeyState=${user.journeyState}`);
      }

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          journeyState: 'QUEUED',
          matchQueuedAt: new Date(),
        },
        select: {
          journeyState: true,
          matchQueuedAt: true,
        },
      });

      return updatedUser;
    });

    return NextResponse.json({
      success: true,
      journeyState: updated.journeyState,
      matchQueuedAt: updated.matchQueuedAt?.toISOString() ?? null,
      message: 'Du er nå i kø. Du blir varslet her når noen passerer.',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Kan ikke settes i kø')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    console.error('POST /api/journey/queue error:', error);
    return NextResponse.json(
      { error: 'Kunne ikke sette deg i kø. Prøv igjen senere.' },
      { status: 500 }
    );
  }
}