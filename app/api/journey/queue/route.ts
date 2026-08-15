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
 *
 * DELETE /api/journey/queue (B2.3)
 *
 * «Ut av køen» — brukeren kan forlate køen så lenge journeyState = QUEUED.
 * Er hun MATCHED, er det for sent (409).
 * Å forlate køen er ikke det samme som å avvise et menneske.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/requireAuth';
import { isPaymentsEnabled } from '@/config/features';

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

    // B0.6 — Kill switch / betalingsgate:
    // PAYMENTS_ENABLED=true → krev fullført betaling før kø (sendes til /betaling).
    // PAYMENTS_ENABLED=false → gratismodus, alle slipper rett i kø.
    if (isPaymentsEnabled()) {
      const paidOrder = await prisma.order.findFirst({
        where: { userId: user.id, status: 'PAID' },
        select: { id: true },
      });
      if (!paidOrder) {
        return NextResponse.json(
          {
            error: 'Betaling kreves før du kan starte reisen.',
            redirectTo: '/betaling',
          },
          { status: 402 }
        );
      }
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

/**
 * B2.3 — DELETE /api/journey/queue
 * Forlater køen. Kun tillatt når journeyState = QUEUED.
 */
export async function DELETE(req: NextRequest) {
  try {
    const result = await requireAuth(req);
    if (result instanceof NextResponse) {
      return result;
    }
    const authUser = result.user;

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        journeyState: true,
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

    if (user.bannedAt || user.deletedAt) {
      return NextResponse.json(
        { error: 'Kontoen er ikke aktiv' },
        { status: 403 }
      );
    }

    // Kun tillatt å forlate køen når QUEUED — er hun MATCHED, er det for sent
    if (user.journeyState !== 'QUEUED') {
      return NextResponse.json(
        { error: 'Du kan bare forlate køen når du venter på match. Er du allerede matchet, kan du ikke gå ut av køen.' },
        { status: 409 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        journeyState: 'IDLE',
        matchQueuedAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      journeyState: 'IDLE',
      message: 'Du har forlatt køen. Trykk «Start reisen» når du er klar igjen.',
    });
  } catch (error) {
    console.error('DELETE /api/journey/queue error:', error);
    return NextResponse.json(
      { error: 'Kunne ikke forlate køen. Prøv igjen senere.' },
      { status: 500 }
    );
  }
}
