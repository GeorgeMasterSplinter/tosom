/**
 * POST /api/conversation/create
 * 
 * Opprett ein ny conversation for ein match.
 * Brukes når brukaren trykker "Start samtale" på matching/[id].
 * 
 * Input: { matchId: string }
 * Output: { conversationId: string, success: boolean }
 * 
 * - Verifiser at match eksisterer og begge har akseptert
 * - Opprett conversation med status 'active'
 * - Returnerer conversationId for chat-routing
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
import { requireAuth } from "@/lib/auth/requireAuth";

export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const result = await requireAuth(req);
    if (result instanceof NextResponse) {
      return result;
    }
    const user = result.user;

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
        userA: { select: { id: true, profile: { select: { identityName: true } } } },
        userB: { select: { id: true, profile: { select: { identityName: true } } } },
      },
    });

    if (!match) {
      return NextResponse.json(
        { error: "Match ikke funnen" },
        { status: 404 }
      );
    }

    // 4. Sjekk at brukaren er involvert i matchen
    if (match.userAId !== user.id && match.userBId !== user.id) {
      return NextResponse.json(
        { error: "Du er ikke involvert i denne matchen" },
        { status: 403 }
      );
    }

    // 5. Sjekk at begge har akseptert (match-status "matched")
    if (match.status !== "matched") {
      return NextResponse.json(
        { error: "Matchen må vere akseptert av begge parti før chat kan opnast" },
        { status: 400 }
      );
    }

    // 6. Sjekk at conversation ikke allereie eksisterer
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { userAId: match.userAId, userBId: match.userBId },
          { userAId: match.userBId, userBId: match.userAId },
        ],
        endedAt: null,
      },
    });

    if (existingConversation) {
      // Returner eksisterande conversation
      return NextResponse.json({
        success: true,
        conversationId: existingConversation.id,
        message: "Chat allereie oppretta.",
      });
    }

    // 7. Opprett ny conversation
    const conversation = await prisma.conversation.create({
      data: {
        userAId: match.userAId,
        userBId: match.userBId,
      },
    });

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      message: "Chat oppretta. Velkommen til samtalen!",
    });
  } catch (error) {
    console.error("POST /api/conversation/create error:", error);
    return NextResponse.json(
      { error: "Internt feil ved oppretting av chat", internal: true },
      { status: 500 }
    );
  }
}