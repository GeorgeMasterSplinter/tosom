/**
 * GET /api/chat/messages?conversationId=X
 * Hent alle meldinger for en conversation.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { withMetrics } from "@/lib/observability/withMetrics";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getHandler(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json({ error: "Mangler conversationId" }, { status: 400 });
  }

  try {
    // IDOR-vern: verifiser at brukeren er del av samtalen før meldinger returneres
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { userAId: true, userBId: true, mood: true, imageShareAllowedAt: true },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Samtalen finnes ikke" },
        { status: 404 }
      );
    }

    const isMember = conversation.userAId === session.user.id || conversation.userBId === session.user.id;
    if (!isMember) {
      return NextResponse.json(
        { error: "Ingen tilgang" },
        { status: 403 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profile: {
              // identityName: navnet valgt i onboarding — vises rolig
              // over chat-boblene, slik at det er tydelig hvem som
              // har skrevet eller sendt hva. (source medfølger som
              // skalart felt — «💎 Bli kjent» / «📋 Oppgave»-merket.)
              select: { photoUrl: true, age: true, identityName: true },
            },
          },
        },
      },
    });

    const me = session.user.id;

    // K-8: Partnerens profilbilde vises kun når imageShareAllowedAt
    // (dag 15) er satt og passert. Egne meldinger kan vise eget bilde.
    const imageAllowed = conversation.imageShareAllowedAt
      ? new Date() >= conversation.imageShareAllowedAt
      : false;

    const visibleMessages = messages.map((m) => {
      if (m.sender.id !== me && !imageAllowed) {
        // Responset sendes som JSON (any) — bare bildelen skal maskeres.
        m.sender.profile = {
          ...(m.sender.profile as unknown as Record<string, unknown>),
          photoUrl: null,
        } as typeof m.sender.profile;
      }
      return m;
    });

    return NextResponse.json({ messages: visibleMessages, mood: conversation.mood });
  } catch (error) {
    console.error("GET /api/chat/messages error:", error);
    return NextResponse.json(
      { error: "Kunne ikke laste meldinger" },
      { status: 500 }
    );
  }
}

export const GET = withMetrics("/api/chat/messages", getHandler);
