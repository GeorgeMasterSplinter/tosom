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
import { csrfCheck } from '@/lib/auth/csrf';
import { withMetrics } from '@/lib/observability/withMetrics';
import { recordEvent } from '@/lib/observability/metric';
import { isPaymentsEnabled } from '@/config/features';
import { claimFreeQuota, releaseFreeQuota } from '@/lib/payment/freeQuota';
import { pgCheck } from '@/lib/rate-limit-pg';

export const dynamic = 'force-dynamic';

// B-4: Rate-limit-tak per bruker (mønster fra A5).
const JOURNEY_QUEUE_RATE_MAX = 10;
const JOURNEY_QUEUE_RATE_WINDOW_SEC = 60;

async function postHandler(req: NextRequest) {
  // A4: Holder gratisplassen som ble claimet i denne forespørselen, slik at
  // den kan gis tilbake dersom noe feiler før brukeren faktisk står i kø.
  let claimedOrderId: string | null = null;

  try {
    // CSRF (systemaudit 03.09, funn 5) — skrive-rute (setter i kø)
    const csrf = await csrfCheck(req);
    if (csrf instanceof NextResponse) return csrf;

    // 1. Auth (AuthUser gir oss id + email + role)
    const result = await requireAuth(req);
    if (result instanceof NextResponse) {
      return result;
    }
    const authUser = result.user;

    // B-4: Rate limiting per bruker (mønster fra A5, fail-open).
    const queueLimit = await pgCheck(
      `journey:queue:${authUser.id}`,
      JOURNEY_QUEUE_RATE_MAX,
      JOURNEY_QUEUE_RATE_WINDOW_SEC
    );
    if (!queueLimit.ok) {
      return NextResponse.json(
        { error: 'Du prøver for ofte. Vent et øyeblikk og prøv igjen.' },
        { status: 429 }
      );
    }

    // B4.2: Les valgfrie samtykker fra body (withdrawalWaiver lagres på User)
    let withdrawalWaiver = false;
    try {
      const body = await req.json();
      withdrawalWaiver = body.withdrawalWaiver === true;
    } catch { /* ingen body — OK */ }

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

    // B0.6 + B4.3 — Kill switch / betalingsgate:
    // PAYMENTS_ENABLED=true → krev fullført betaling før kø (sendes til /betaling).
    // PAYMENTS_ENABLED=false → gratismodus: opprett gratisordre hvis kvote tilgjengelig.
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
    } else {
      // B4.3: Gratismodus — opprett gratisordre hvis brukeren ikke har en fra før
      const existingOrder = await prisma.order.findFirst({
        where: { userId: user.id, status: 'PAID' },
        select: { id: true },
      });
      if (!existingOrder) {
        // F2-2: atomisk claim — kun én kan vinne grenseplassen ved
        // taket (tidligere var det check-then-create med race-vindu).
        const claimed = await claimFreeQuota(user.id);
        if (!claimed) {
          return NextResponse.json(
            {
              error: 'Gratiskvoten er oppbrukt. Betaling kreves for å starte reisen.',
              redirectTo: '/betaling',
            },
            { status: 402 }
          );
        }
        // A4: Plassen er nå claimet. Feiler kø-transaksjonen under, må den gis
        // tilbake — ellers er en gratisplass brent uten at noen fikk en reise.
        claimedOrderId = claimed.id;
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
          // B4.2: Angrerett-samtykke lagres hvis gitt
          ...(withdrawalWaiver && !user.deletedAt ? { withdrawalWaiverAt: new Date() } : {}),
        },
        select: {
          journeyState: true,
          matchQueuedAt: true,
        },
      });

      return updatedUser;
    });

    // OBSERVABILITY O-7: brukeren stiller seg i match-køen
    recordEvent('queue.entered');

    return NextResponse.json({
      success: true,
      journeyState: updated.journeyState,
      matchQueuedAt: updated.matchQueuedAt?.toISOString() ?? null,
      message: 'Du er nå i kø. Du blir varslet her når noen passerer.',
    });
  } catch (error) {
    // A4: Kø-settingen kom aldri i mål. Er en gratisplass claimet i denne
    // forespørselen, gis den tilbake — ellers krymper gratiskvoten permanent
    // for hver feil, og brukeren møter «Gratiskvoten er oppbrukt» ved neste
    // forsøk uten at hun noen gang fikk en reise.
    if (claimedOrderId) {
      await releaseFreeQuota(claimedOrderId);
    }

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
async function deleteHandler(req: NextRequest) {
  try {
    // CSRF (systemaudit 03.09, funn 5) — skrive-rute (forlater kø)
    const csrf = await csrfCheck(req);
    if (csrf instanceof NextResponse) return csrf;

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

export const POST = withMetrics('/api/journey/queue', postHandler);
export const DELETE = withMetrics('/api/journey/queue', deleteHandler);
