/**
 * POST /api/match/accept
 * 
 * Aksepter ein match. Når begge har akseptert:
 * - Match-status blir "matched"
 * - 30-dagers lås blir sett (lockedUntil)
 * - Reisen startar
 * 
 * Core-definition:
 * - Begge brukarar må akseptere
 * - Låst i 30 dagar
 * - Ingen nye matcher før lås opphøyrer
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireNotBanned } from "@/lib/auth/session";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const result = await requireAuth(req);
    if (result instanceof NextResponse) {
      return result;
    }
    const user = result.user;

    // 1b. Sjekk om brukaren er utestengt (STEG 3.2 — sesjons-revokering)
    const bannedCheck = await requireNotBanned(user.id);
    if (bannedCheck) return bannedCheck;

    // 2. Hent request body
    const body = await req.json();
    const { matchId } = body as { matchId: string };

    if (!matchId) {
      return NextResponse.json(
        { error: "matchId er påkrevd" },
        { status: 400 }
      );
    }

    // 3. Finn matchen
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        userA: { select: { id: true, email: true, onboardingComplete: true, deepProfileComplete: true } },
        userB: { select: { id: true, email: true, onboardingComplete: true, deepProfileComplete: true } },
      },
    });

    if (!match) {
      return NextResponse.json(
        { error: "Match ikke funnen" },
        { status: 404 }
      );
    }

    // 4. Sjekk om brukaren er involvert i matchen
    if (match.userAId !== user.id && match.userBId !== user.id) {
      return NextResponse.json(
        { error: "Du er ikke involvert i denne matchen" },
        { status: 403 }
      );
    }

    // 5. Sjekk om matchen er utgått
    if (match.expiresAt && new Date() > match.expiresAt) {
      return NextResponse.json(
        { error: "Matchen har utgått" },
        { status: 410 }
      );
    }

    // 6. Sjekk om brukaren allereie har akseptert
    const isUserA = match.userAId === user.id;
    const acceptField = isUserA ? "acceptedByA" : "acceptedByB";
    
    if (match[acceptField as keyof typeof match]) {
      return NextResponse.json(
        { error: "Du har allereie akseptert denne matchen" },
        { status: 400 }
      );
    }

    // 7. STEG 5.1: Transaksjonssikker oppdatering med betinget updateMany
    const acceptDate = new Date();
    
    // Betinget update: kun hvis matchen fortsatt er pending (hinder race conditions)
    const updateResult = await prisma.match.updateMany({
      where: { 
        id: matchId, 
        status: 'pending'  // lowercase — enum-verdi i Prisma
      },
      data: {
        [acceptField as string]: acceptDate,
      },
    });

    // Hvis ingen rader ble oppdatert, betyr det at status endret seg (race condition)
    if (updateResult.count === 0) {
      return NextResponse.json(
        { error: "Matchen har endret status — prøv igjen" },
        { status: 409 }
      );
    }

    // Hent oppdatert match
    const updatedMatch = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        userA: { select: { id: true, email: true, profile: { select: { identityName: true, age: true } } } },
        userB: { select: { id: true, email: true, profile: { select: { identityName: true, age: true } } } },
      },
    });

    if (!updatedMatch) {
      return NextResponse.json(
        { error: "Match forsvant underveis — prøv igjen" },
        { status: 500 }
      );
    }

    // 8. Sjekk om begge har akseptert
    const bothAccepted = updatedMatch.acceptedByA && updatedMatch.acceptedByB;

    if (bothAccepted) {
      // Begge har akseptert — lås i 30 dagar og start reise
      const lockedUntil = new Date(acceptDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      // STEG 5.1: Pakk alt i én transaksjon for å unngå race conditions
      await prisma.$transaction(async (tx) => {
        // Oppdater match-status
        await tx.match.update({
          where: { id: matchId },
          data: {
            status: "matched",
            lockedAt: acceptDate,
            expiresAt: lockedUntil,
          },
        });

        // Lås begge brukarar
        await tx.user.update({
          where: { id: updatedMatch.userAId },
          data: { lockedUntil },
        });
        await tx.user.update({
          where: { id: updatedMatch.userBId },
          data: { lockedUntil },
        });

        // Opprett/restart JourneyProgress for begge
        for (const uid of [updatedMatch.userAId, updatedMatch.userBId]) {
          await tx.journeyProgress.upsert({
            where: { userId: uid },
            update: { phase: "EARLY", day: 1 },
            create: { userId: uid, phase: "EARLY", day: 1 },
          });
        }

        // Bildedelings-lås opp etter 14 dagar
        const imageShareAllowedAt = new Date(acceptDate.getTime() + 14 * 24 * 60 * 60 * 1000);

        // OPPRETT CONVERSATION — så chat kan opnast!
        await tx.conversation.create({
          data: {
            userAId: updatedMatch.userAId,
            userBId: updatedMatch.userBId,
            imageShareAllowedAt,
          },
        });

        return { acceptDate, imageShareAllowedAt };
      });

      // Hent conversationen for svar
      const conversation = await prisma.conversation.findFirst({
        where: {
          userAId: updatedMatch.userAId,
          userBId: updatedMatch.userBId,
        },
      });

      const imageShareDate = new Date(acceptDate.getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('no-NO');

      return NextResponse.json({
        success: true,
        match: {
          id: matchId,
          status: "matched",
          lockedUntil,
          resonanceLevel: updatedMatch.resonanceLevel,
        },
        conversation: {
          id: conversation?.id,
          message: `Din reise med din match har begynt. Bildedeling er låst opp ${imageShareDate}.`,
        },
        journey: {
          phase: "EARLY",
          day: 1,
        },
      });
    }

    // Berre éin har akseptert enno
    return NextResponse.json({
      success: true,
      status: "pending_acceptance",
      acceptor: isUserA ? "userA" : "userB",
      waitingFor: isUserA ? updatedMatch.userB.email : updatedMatch.userA.email,
      message: "Vent på at din match aksepterer.",
    });
  } catch (error) {
    console.error("POST /api/match/accept error:", error);
    return NextResponse.json(
      { error: "Internt feil ved aksept", internal: true },
      { status: 500 }
    );
  }
}