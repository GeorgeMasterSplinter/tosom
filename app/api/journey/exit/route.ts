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

    // 3. Finn reisen — prioriter den aktive (endedAt = null), fall tilbake til
    // nyeste reise (reisen kan ha endedAt satt fra en tidligere, feil avslutning
    // og da fremdeles kunne være "fast" og behøve å avsluttes på nytt).
    const journey =
      (await prisma.journeyProgress.findFirst({
        where: { userId: user.id, endedAt: null },
        orderBy: { updatedAt: 'desc' },
      })) ??
      (await prisma.journeyProgress.findFirst({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
      }));

    if (!journey) {
      return NextResponse.json(
        { error: 'Ingen aktiv reise funnet' },
        { status: 404 }
      );
    }

    // Hent den tilknyttede matchen DIREKTE via reisen sin matchId.
    // (Før ble matchen funnet via en separat "active + lockedAt"-query — men
    //  lockedAt settes ALDRI i den reelle matching-flyen, så queryen fant
    //  aldri noe og ruten svarte alltid 409. Reisen kunne derfor aldri avsluttes
    //  og kontoen ble aldri slettet. Dette var rotårsaken til at "Vi fant
    //  hverandre" fastnet uten sletting.)
    // Fremdeles den reelle "allerede løst"-sjekken: når endJourney har kjørt er
    // matchen borte eller ikke lenger aktiv → 409 (idempotent).
    const activeMatch = await prisma.match.findUnique({
      where: { id: journey.matchId },
    });

    if (!activeMatch || activeMatch.status !== 'active') {
      return NextResponse.json(
        { error: 'Reisen er allerede avsluttet eller allerede håndtert' },
        { status: 409 }
      );
    }

    // STEG S1: Blokkering lager en permanent sperreliste-oppføring FØR sletting.
    // (Sperrelisten overlever endJourney-sletting — match history og blocks beholdes.)
    // Map reason → endJourney-outcome:
    //   found_each_other → full kontosletting (begge) — "Vi fant hverandre"
    //   ny_reise         → reset til IDLE, behold profil (ny onboarding) — "Start ny reise"
    //   blocked          → sperreliste + reset til IDLE
    //   (rest)           → tidlig avslutning (reset til IDLE)
    const isBlocked = reason === 'blocked';
    let outcome: 'blocked' | 'early_exit' | 'found_each_other' | 'new_journey';
    if (isBlocked) outcome = 'blocked';
    else if (reason === 'found_each_other') outcome = 'found_each_other';
    else if (reason === 'ny_reise' || reason === 'new_journey') outcome = 'new_journey';
    else outcome = 'early_exit';

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

      // PL-15 (V-5): rapport med bevis FØR endJourney sletter meldingene.
      // En blokkering fortjener alltid moderasjonsblikk, selv om brukeren
      // ikke sender en separat rapport.
      const blockedConvo = await prisma.conversation.findFirst({
        where: { matchId: activeMatch.id },
      });
      let blockedEvidence: Array<{
        senderId: string;
        content: string;
        createdAt: Date;
        type: string;
      }> | undefined;
      if (blockedConvo) {
        const blockedMessages = await prisma.message.findMany({
          where: { conversationId: blockedConvo.id, type: { not: 'image' } },
          orderBy: { createdAt: 'desc' },
          take: 50,
          select: { senderId: true, content: true, createdAt: true, type: true },
        });
        if (blockedMessages.length > 0) blockedEvidence = blockedMessages;
      }
      await prisma.report.create({
        data: {
          reporterId: user.id,
          reportedId: partnerId,
          matchId: activeMatch.id,
          category: 'OTHER',
          description: 'Blokkert av brukeren',
          // Prisma Json-felt: utelatt når tomt (blir null i DB).
          ...(blockedEvidence ? { evidence: blockedEvidence } : {}),
        },
      });
    }

    // 4. Kall endJourney() — verifisert sletting
    const { deleted } = await endJourney(activeMatch.id, outcome);

    // Ny reise: lås opp onboarding for den handlingen brukeren slik at profilen
    // kan brukes om via prefill (de justerer, skriver ikke på nytt). Kontoen
    // bevares — bare journey-dataet er nullstilt (endJourney).
    if (outcome === 'new_journey') {
      await prisma.user.update({
        where: { id: user.id },
        data: { onboardingComplete: false, onboardingStep: 1 },
      });
    }

    // 5. Logg avslutning
    console.log(`[journey/exit] Bruker ${user.id} ${outcome === 'blocked' ? 'blokkerte' : 'avsluttet'} reise dag ${journey.day}/30 (outcome=${outcome})`, {
      matchId: activeMatch.id,
      day: journey.day,
      reason,
      outcome,
      deleted,
    });

    return NextResponse.json({
      success: true,
      outcome,
      message:
        outcome === 'blocked'
          ? 'Reisen ble avsluttet og brukeren blokkeres permanent.'
          : outcome === 'found_each_other'
            ? 'Reisen er fullført. Begge kontoene er slettet.'
            : outcome === 'new_journey'
              ? 'Reisen er avsluttet. Du sendes tilbake til onboarding.'
              : `Reisen din ble avsluttet. Du nådde dag ${journey.day} av 30.`,
      nextStep: outcome === 'new_journey' ? 'onboarding' : 'Du kan starte en ny reise når du vil.',
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