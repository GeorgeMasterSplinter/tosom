// app/api/journey/exit/route.ts — POST /api/journey/exit
// Avslutt aktiv reise (tidlig avslutning)
// Kaller endJourney() for verifisert sletting og sperrelisete

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/requireAuth';
import { csrfCheck } from '@/lib/auth/csrf';
import { endJourney } from '@/lib/journey/endJourney';
import { tryParseJsonBody } from '@/lib/api/validation';

export const dynamic = 'force-dynamic';

/**
 * POST /api/journey/exit
 *
 * Avslutt en aktiv 30-dagers reise.
 * Kaller endJourney() som sletter alt innhold verifiserbart (I-6).
 *
 * Body: { reason?: string }
 * Response: { success: true, deleted: Record<string, number> }
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // CSRF (systemaudit 03.09, funn 5) — destruktiv rute (endJourney sletter alt)
    const csrf = await csrfCheck(req);
    if (csrf instanceof NextResponse) return csrf;

    // 1. Auth
    const result = await requireAuth(req);
    if (result instanceof NextResponse) {
      return result;
    }
    const user = result.user;

    // 2. Hent og valider data
    const body = await tryParseJsonBody(req);
    if (!body) {
      return NextResponse.json({ error: 'Ugyldig body' }, { status: 400 });
    }
    const { reason } = body as { reason?: string };

    // 3. Finn aktiv journey for brukeren
    const journey = await prisma.journeyProgress.findFirst({
      where: { userId: user.id },
    });

    if (!journey) {
      return NextResponse.json(
        { error: 'Ingen aktiv reise funnet' },
        { status: 404 }
      );
    }

    // Sjekk om journey er allerede avsluttet
    if (journey.endedAt || journey.completedAt) {
      return NextResponse.json(
        { error: 'Reisen er allerede avsluttet' },
        { status: 409 }
      );
    }

    // Hent den tilknyttede matchen
    const activeMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { userAId: user.id, status: 'active' },
          { userBId: user.id, status: 'active' },
        ],
        lockedAt: { not: null }, // Bare aktive matcher
      },
    });

    if (!activeMatch) {
      return NextResponse.json(
        { error: 'Ingen aktiv match funnet' },
        { status: 404 }
      );
    }

    // STEG S1: Blokkering lager en permanent sperreliste-oppføring FØR sletting.
    // (Sperrelisten overlever endJourney-sletting — match history og blocks beholdes.)
    const isBlocked = reason === 'blocked';
    const outcome = isBlocked ? 'blocked' : 'early_exit';

    if (isBlocked) {
      const partnerId = activeMatch.userAId === user.id ? activeMatch.userBId : activeMatch.userAId;
      await prisma.userBlock.upsert({
        where: { blockerId_blockedId: { blockerId: user.id, blockedId: partnerId } },
        create: {
          blockerId: user.id,
          blockedId: partnerId,
          matchId: activeMatch.id,
          reason: 'blocked',
        },
        update: { matchId: activeMatch.id, reason: 'blocked' },
      });
    }

    // 4. Kall endJourney() — verifisert sletting
    const { deleted } = await endJourney(activeMatch.id, outcome);

    // 5. Logg avslutning
    console.log(`[journey/exit] Bruker ${user.id} ${isBlocked ? 'blokkerte' : 'avsluttet'} reise dag ${journey.day}/30`, {
      matchId: activeMatch.id,
      day: journey.day,
      reason,
      deleted,
    });

    return NextResponse.json({
      success: true,
      message: isBlocked
        ? 'Reisen ble avsluttet og brukeren blokkeres permanent.'
        : `Reisen din ble avsluttet. Du nådde dag ${journey.day} av 30.`,
      nextStep: 'Du kan starte en ny reise når du vil.',
      deleted,
    });

  } catch (error) {
    console.error('POST /api/journey/exit feil:', error);
    const msg = (error as Error).message;
    if (msg.includes('ikke funnet') || msg.includes('ikke funnet')) {
      return NextResponse.json(
        { error: msg },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Kunne ikke avslutte reisen' },
      { status: 500 }
    );
  }
}