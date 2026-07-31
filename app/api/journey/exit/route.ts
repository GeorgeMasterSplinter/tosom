// app/api/journey/exit/route.ts — POST /api/journey/exit
// Avslutt aktiv reise (tidleg avslutning)
// Sletter JourneyProgress, Conversation, og oppdaterer Match-status

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/requireAuth';

export const dynamic = 'force-dynamic';

/**
 * POST /api/journey/exit
 * 
 * Avslutt ein aktiv 30-dagers reise.
 * - Sletter JourneyProgress
 * - Oppdaterer Conversation (endedAt)
 * - Oppdaterer Match-status
 * - Låser opp brukar (fjern lockedUntil)
 * 
 * Response: { success: true, message: string }
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 1. Auth
    const result = await requireAuth(req);
    if (result instanceof NextResponse) {
      return result;
    }
    const user = result.user;

    // 2. Hent og valider data
    const body = await req.json();
    const { reason } = body as { reason?: string };

    // 3. Finn aktiv journey for brukaren
    const journey = await prisma.journeyProgress.findUnique({
      where: { userId: user.id },
      include: {
        milestones: true,
      },
    });

    if (!journey) {
      return NextResponse.json(
        { error: "Ingen aktiv reise funnen" },
        { status: 404 }
      );
    }

    // Sjekk om journey er allereie avslutta
    if (journey.endedAt || journey.completedAt) {
      return NextResponse.json(
        { error: "Reisen er allereie avslutta" },
        { status: 409 }
      );
    }

    // Hent den tilknytte matchen og conversationen
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { userAId: user.id, status: 'matched' },
          { userBId: user.id, status: 'matched' },
        ],
        lockedAt: { not: null }, // Berre aktive matcher
      },
      include: {
        conversations: true,
      },
    });

    const activeMatch = matches.find(m => m.lockedAt !== null);

    if (!activeMatch) {
      return NextResponse.json(
        { error: "Ingen aktiv match funnen" },
        { status: 404 }
      );
    }

    // 4. Avslutt journey (lagre oppsummering)
    const exitDate = new Date();
    
    await prisma.journeyProgress.update({
      where: { userId: user.id },
      data: {
        endedAt: exitDate,
        phase: 'ENDED',
        day: Math.min(journey.day, 30),
      },
    });

    // 5. Avslutt conversation (dersom ein finst)
    const conversation = activeMatch.conversations.find(c => 
      c.status === 'active'
    );

    if (conversation) {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          endedAt: exitDate,
          status: 'ended',
        },
      });
    }

    // 6. Lås opp brukar (fjern lockedUntil)
    await prisma.user.update({
      where: { id: user.id },
      data: { lockedUntil: null },
    });

    // 7. Logg avslutning
    console.log(`[journey/exit] Brukar ${user.id} avslutta reise dag ${journey.day}/30`, {
      day: journey.day,
      totalDays: journey.milestones.length,
      reason,
    });

    return NextResponse.json({
      success: true,
      message: `Reisen din vart avslutta. Du har nådd dag ${journey.day} av 30.`,
      nextStep: 'Du kan starte ein ny reise når du vil.',
    });

  } catch (error) {
    console.error('POST /api/journey/exit feil:', error);
    return NextResponse.json(
      { error: 'Kunne ikkje avslutte reisen', internal: true },
      { status: 500 }
    );
  }
}