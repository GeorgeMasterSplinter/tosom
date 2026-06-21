/**
 * GET /api/chat/image-permission
 * 
 * Sjekk om ein brukar kan dele bilder i ein conversation.
 * 
 * Core-definition:
 * - Ingen bilder dei første 14 dagane
 * - imageShareAllowedAt blir sett til now + 14d ved match
 * - Berre viselig etter dag 14
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/requireAuth";

export async function GET(req: NextRequest) {
  try {
    // 1. Auth
    const result = await requireAuth(req);
    if (result instanceof NextResponse) {
      return result;
    }
    const user = result.user;

    // 2. Hent conversationId frå query params
    const url = new URL(req.url);
    const conversationId = url.searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId er påkrevd" },
        { status: 400 }
      );
    }

    // 3. Finn conversation og sjekk om brukaren er involvert
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { userAId: user.id },
          { userBId: user.id },
        ],
      },
      select: {
        userAId: true,
        userBId: true,
        matchId: true,
        imageShareAllowedAt: true,
        imageShared: true,
        userA: { select: { createdAt: true } },
        createdAt: true,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation ikkje funnen" },
        { status: 404 }
      );
    }

    // 4. Sjekk om bilder er allereie delt
    if (conversation.imageShared) {
      return NextResponse.json({
        allowed: true,
        alreadyShared: true,
        phase: "PHASE2",
        message: "Bilder er allereie delt med din match.",
      });
    }

    // 5. Berekn om bilder er tillatne
    const imageAllowedAt = conversation.imageShareAllowedAt;
    const now = new Date();

    if (!imageAllowedAt) {
      const calculatedAllowedAt = new Date(
        conversation.createdAt.getTime() + 14 * 24 * 60 * 60 * 1000
      );

      const canShare = now >= calculatedAllowedAt;
      const hoursUntil = canShare
        ? 0
        : Math.ceil((calculatedAllowedAt.getTime() - now.getTime()) / (1000 * 60 * 60));

      return NextResponse.json({
        allowed: canShare,
        imageShareAllowedAt: calculatedAllowedAt.toISOString(),
        phase: canShare ? "PHASE2" : "PHASE1",
        hoursUntilImageShare: canShare ? 0 : hoursUntil,
        message: canShare
          ? "No kan du dele bilder med din match (valfritt)."
          : `Du kan dele bilder om ${hoursUntil} time(r).`,
      });
    }

    const canShare = now >= imageAllowedAt;
    const hoursUntil = canShare
      ? 0
      : Math.ceil((imageAllowedAt.getTime() - now.getTime()) / (1000 * 60 * 60));

    return NextResponse.json({
      allowed: canShare,
      imageShareAllowedAt: imageAllowedAt.toISOString(),
      phase: canShare ? "PHASE2" : "PHASE1",
      hoursUntilImageShare: canShare ? 0 : hoursUntil,
      message: canShare
        ? "No kan du dele bilder med din match (valfritt)."
        : `Du kan dele bilder om ${hoursUntil} time(r).`,
    });
  } catch (error) {
    console.error("GET /api/chat/image-permission error:", error);
    return NextResponse.json(
      { error: "Internt feil ved henting av bilde-rettar", internal: true },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/image-permission
 * 
 * Markere at ein brukar har delt bilder (etter dag 14).
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const result = await requireAuth(req);
    if (result instanceof NextResponse) {
      return result;
    }
    const user = result.user;

    // 2. Hent body
    const body = await req.json();
    const { conversationId } = body as { conversationId: string };

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId er påkrevd" },
        { status: 400 }
      );
    }

    // 3. Finn conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { userAId: user.id },
          { userBId: user.id },
        ],
      },
      select: {
        imageShareAllowedAt: true,
        imageShared: true,
        userAId: true,
        userBId: true,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation ikkje funnen" },
        { status: 404 }
      );
    }

    // 4. Sjekk om bilder er tillatne
    const now = new Date();
    if (conversation.imageShareAllowedAt && now < conversation.imageShareAllowedAt) {
      return NextResponse.json(
        { error: "Du må vente til dag 15 før du kan dele bilder." },
        { status: 403 }
      );
    }

    // 5. Sjekk om begge har delt
    const alreadyShared = conversation.imageShared;

    // 6. Oppdater imageShared
    const updated = await prisma.conversation.update({
      where: { id: conversationId },
      data: { imageShared: true },
      select: { imageShared: true },
    });

    return NextResponse.json({
      success: true,
      imageShared: updated.imageShared,
      bothShared: alreadyShared || false,
      message: alreadyShared
        ? "Både du og din match har delt bilder."
        : "Du har delt ditt første bilete. Din match kan gjere det same når dei er klare.",
    });
  } catch (error) {
    console.error("POST /api/chat/image-permission error:", error);
    return NextResponse.json(
      { error: "Internt feil ved marking av bilde-deleing", internal: true },
      { status: 500 }
    );
  }
}