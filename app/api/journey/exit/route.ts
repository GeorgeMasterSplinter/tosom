// app/api/journey/exit/route.ts — POST /api/journey/exit
// Avslutt aktiv reise (tidlig avslutning) / registrer dag-14-valg
// Kaller endJourney() for verifisert sletting og sperreliste
//
// RT1 (D4) — BILATERAL fullførelse på dag 14:
//   Hver deltaker velger for seg selv («Vi fant hverandre» / «Start ny reise»).
//   Valget lagres per deltaker på matchen (completionA/completionB) og er
//   endelig (idempotent). Resultatet avgjøres når BEGGE har valgt:
//     FOUND + FOUND            → mutual: endJourney('found_each_other')
//                                (grace 24 t, PDF tilgjengelig for begge)
//     FOUND + NEW_JOURNEY      → NOT MUTUAL: endJourney('new_journey')
//                                (ingen PDF, reisen avsluttes for begge)
//     NEW_JOURNEY + NEW_JOURNEY → NOT MUTUAL: endJourney('new_journey')
//     én valgt, partner PENDING → WAITING: reisen fortsetter inntil
//                                partneren velger ELLER 72-timers-vinduet
//                                utløper (cron lukker da reisen som
//                                no_action — kontoen beholdes, D8)
//   Beslutningsvinduet er 72 timer fra dag 14 (produkregel — se
//   COMPLETION_DECISION_WINDOW_MS i config/journey). Etter at vinduet er
//   utløpt godtas ikke lenger valg (410).
//   RT1-final (D8): JOURNEY END != ACCOUNT DELETION — ingen utfall her
//   sletter bruker-kontoer.
//   Tidlig avslutning (før dag 14) og blokkering er uendret: ensidig,
//   endJourney umiddelbart.

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/requireAuth';
import { csrfCheck } from '@/lib/auth/csrf';
import { endJourney } from '@/lib/journey/endJourney';
import { resolveCompletionState } from '@/lib/journey/completion';
import { tryParseJsonBody } from '@/lib/api/validation';
import { JOURNEY_TOTAL_DAYS, COMPLETION_DECISION_WINDOW_MS } from '@/config/journey';

export const dynamic = 'force-dynamic';

/**
 * POST /api/journey/exit
 *
 * Avslutt en aktiv 14-dagers reise.
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

    // RT1 (D4): BILATERAL fullførelse — kun på dag 14. Hver deltaker registrerer
    // sitt eget valg; resultatet avgjøres når begge har valgt. Tidlig avslutning
    // (found/ny reise/blokkering FØR dag 14) beholder den gamle ensidige atferden.
    const isDay14Choice =
      (reason === 'found_each_other' || reason === 'ny_reise' || reason === 'new_journey') &&
      journey.day >= JOURNEY_TOTAL_DAYS;

    if (isDay14Choice) {
      // D9: 72-timers beslutningsvindu (produkregel). Anker: tidspunktet
      // reisen fullførte dag 14 (journeyProgress.endedAt). Når vinduet er
      // utløpt godtas ikke lenger valg — cronen lukker reisen som
      // no_action (reise-lukking, IKKE kontosletting — D8).
      if (journey.endedAt) {
        const windowEndsAt = new Date(
          journey.endedAt.getTime() + COMPLETION_DECISION_WINDOW_MS,
        );
        if (new Date() > windowEndsAt) {
          return NextResponse.json(
            {
              error:
                'Vinduet for fullføringsvalget har gått ut. Reisen er avsluttet.',
            },
            { status: 410 },
          );
        }
      }

      const isUserA = activeMatch.userAId === user.id;
      const partnerId = isUserA ? activeMatch.userBId : activeMatch.userAId;
      const myField: 'completionA' | 'completionB' = isUserA ? 'completionA' : 'completionB';
      const partnerField: 'completionA' | 'completionB' = isUserA ? 'completionB' : 'completionA';

      // Idempotent: valget er endelig.
      if (activeMatch[myField] !== 'PENDING') {
        return NextResponse.json(
          { error: 'Du har allerede tatt stilling til reisen.' },
          { status: 409 }
        );
      }

      const newDecision: 'FOUND_EACH_OTHER' | 'NEW_JOURNEY' =
        reason === 'found_each_other' ? 'FOUND_EACH_OTHER' : 'NEW_JOURNEY';

      // Skriv valget og LES PARTNERENS valg i samme transaksjon: hvis partneren
      // skriver samtidig, serles raden etter at deres transaksjon er commitaet —
      // nøyaktig én av de to POST-kallene ser det komplette bildet og avgjør.
      const freshMatch = await prisma.$transaction(async (tx) => {
        await tx.match.update({
          where: { id: activeMatch.id },
          data: isUserA
            ? { completionA: newDecision, completionADecidedAt: new Date() }
            : { completionB: newDecision, completionBDecidedAt: new Date() },
        });
        return tx.match.findUnique({ where: { id: activeMatch.id } });
      });
      const partnerDecision = freshMatch ? freshMatch[partnerField] : 'PENDING';

      // Deterministisk avgjørelsestabell (D4) — ord-uavhengig, deles med
      // cronen via lib/journey/completion.
      const state = resolveCompletionState(newDecision, partnerDecision);

      if (state === 'MUTUAL') {
        // MUTUAL FOUND → grace 24 t, PDF tilgjengelig for begge.
        const { deleted } = await endJourney(activeMatch.id, 'found_each_other', user.id);
        console.log(`[journey/exit] MUTUAL FOUND: match ${activeMatch.id} (begge valgt found_each_other)`, {
          matchId: activeMatch.id, day: journey.day,
        });
        return NextResponse.json({
          success: true,
          outcome: 'found_each_other',
          message:
            'Dere har valgt «Vi fant hverandre». Begge kan laste ned teksten fra samtalen som PDF i 24 timer — bilder blir ikke med.',
          nextStep:
            'PDF-vinduet er åpent i 24 timer. Deretter slettes samtalen, bildene og reisen permanent — kontoen deres beholdes.',
          deleted,
        });
      }

      if (state === 'NOT_MUTUAL') {
        // NOT MUTUAL (partneren har tatt stilling) → reisen avsluttes for
        // begge, ingen PDF. 'new_journey' = innhold slettes, profilen
        // beholdes, begge resettes til IDLE (eksisterende endJourney-semantikk).
        const { deleted } = await endJourney(activeMatch.id, 'new_journey', user.id);
        // Onboarding låses opp for alle som valgte «Start ny reise» (meg +
        // partneren dersom partneren også valgte ny reise).
        if (newDecision === 'NEW_JOURNEY') {
          await prisma.user.update({
            where: { id: user.id },
            data: { onboardingComplete: false, onboardingStep: 1 },
          });
        }
        if (partnerDecision === 'NEW_JOURNEY') {
          await prisma.user.update({
            where: { id: partnerId },
            data: { onboardingComplete: false, onboardingStep: 1 },
          });
        }
        console.log(`[journey/exit] NOT MUTUAL: match ${activeMatch.id} (${newDecision} + ${partnerDecision})`, {
          matchId: activeMatch.id, day: journey.day,
        });
        return NextResponse.json({
          success: true,
          outcome: 'new_journey',
          message: 'Reisen er avsluttet.',
          nextStep: newDecision === 'NEW_JOURNEY' ? 'onboarding' : undefined,
          deleted,
        });
      }

      // WAITING: partneren har ennå ikke tatt stilling (PENDING). Ingen
      // sletting, ingen avslutning — reisen fortsetter inntil partneren
      // velger eller 72-timers-vinduet utløper (cron → no_action; kontoen
      // beholdes — D8).
      console.log(`[journey/exit] WAITING: match ${activeMatch.id} — ${user.id} valgte ${newDecision}, partner PENDING`, {
        matchId: activeMatch.id, day: journey.day,
      });
      return NextResponse.json({
        success: true,
        outcome: 'waiting',
        decision: newDecision,
        message:
          'Valget ditt er registrert. Reisen avgjøres når begge har tatt stilling — senest 72 timer etter dag 14. Dere hører mer i e-post.',
      });
    }

    // STEG S1: Blokkering lager en permanent sperreliste-oppføring FØR sletting.
    // (Sperrelisten overlever endJourney-sletting — match history og blocks beholdes.)
    // Map reason → endJourney-outcome:
    //   found_each_other → grace 24 t (PDF-vindu), deretter slettes alt — "Vi fant hverandre"
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
    // initiatorId sendes med slik at PARTNEREN får «reisen er avsluttet»-epost.
    const { deleted } = await endJourney(activeMatch.id, outcome, user.id);

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
    console.log(`[journey/exit] Bruker ${user.id} ${outcome === 'blocked' ? 'blokkerte' : 'avsluttet'} reise dag ${journey.day}/${JOURNEY_TOTAL_DAYS} (outcome=${outcome})`, {
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
            ? 'Reisen er fullført. Begge kan laste ned teksten fra samtalen som PDF i 24 timer — bilder blir ikke med.'
            : outcome === 'new_journey'
              ? 'Reisen er avsluttet. Du sendes tilbake til onboarding.'
              : `Reisen din ble avsluttet. Du nådde dag ${journey.day} av ${JOURNEY_TOTAL_DAYS}.`,
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