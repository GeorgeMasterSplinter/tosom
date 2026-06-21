/**
 * GET /api/chat/messages
 * 
 * Hent meldingar for ein aktiv conversation med guiding-innhald.
 * Core-definition: Guided chat — systemmeldingar frå reisa.
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

    // 2. Hent query params
    const url = new URL(req.url);
    const conversationId = url.searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId er påkrevd" },
        { status: 400 }
      );
    }

    // 3. Sjekk at brukaren er i conversationen
    const conv = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { userAId: user.id },
          { userBId: user.id },
        ],
      },
      select: {
        id: true,
        userAId: true,
        userBId: true,
        endedAt: true,
        imageShareAllowedAt: true,
      },
    });

    if (!conv) {
      return NextResponse.json(
        { error: "Ingen conversation funnen" },
        { status: 404 }
      );
    }

    // 4. Finn journey for guiding
    const journey = await prisma.journeyProgress.findUnique({
      where: { userId: user.id },
      select: { day: true, phase: true, completedDays: true },
    });

    // 5. Hekter meldingar
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        deletedAt: null,
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { id: true, profile: { select: { identityName: true } } } },
      },
    });

    // 6. Dagens system-innhald
    const todayContent = journey
      ? await prisma.journeyDayContent.findFirst({
          where: { day: journey.day },
          select: {
            systemMessage: true,
            task: true,
            reflectionQuestion: true,
            theme: true,
          },
        })
      : null;

    // 7. Bildesjutt-status
    let imageShareInfo = { allowed: false, daysRemaining: 14 };
    if (journey) {
      if (journey.completedDays >= 14) {
        imageShareInfo = { allowed: true, daysRemaining: 0 };
      } else {
        imageShareInfo = { allowed: false, daysRemaining: 14 - journey.completedDays };
      }
    } else if (conv.imageShareAllowedAt) {
      imageShareInfo = {
        allowed: conv.imageShareAllowedAt <= new Date(),
        daysRemaining: 0,
      };
    }

    // 8. Hekter dagens system-melding om ikkje allereie send
    const hasTodaySystemMessage = todayContent?.systemMessage
      ? messages.some(
          (m) => m.type === "system" && m.content === todayContent.systemMessage
        )
      : false;

    const systemMessage = hasTodaySystemMessage
      ? null
      : todayContent?.systemMessage
        ? {
            id: `system-${journey?.day}`,
            senderId: "system",
            content: todayContent.systemMessage,
            type: "system" as const,
            createdAt: new Date(),
            sender: null,
          }
        : null;

    const allMessages = systemMessage
      ? [...messages, systemMessage]
      : messages;

    return NextResponse.json({
      conversationId,
      userAId: conv.userAId,
      userBId: conv.userBId,
      ended: conv.endedAt !== null,
      imageShare: imageShareInfo,
      todayTheme: todayContent?.theme || null,
      todayTask: todayContent?.task || null,
      messages: allMessages.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        content: m.content,
        type: m.type,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET /api/chat/messages error:", error);
    return NextResponse.json(
      { error: "Internt feil ved henting av meldingar", internal: true },
      { status: 500 }
    );
  }
}