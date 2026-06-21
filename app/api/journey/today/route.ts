/**
 * GET /api/journey/today
 * 
 * Hent dagens journey-innhald for ein aktiv reise.
 * 
 * Core-definition: Dagleg refleksjon, tema, oppgåve og resonans
 * Ingen gamification. 24t-dagssyklus.
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

    // 2. Finn aktiv journey for brukaren
    const journey = await prisma.journeyProgress.findUnique({
      where: { userId: user.id },
      select: {
        day: true,
        phase: true,
        completedDays: true,
        nextDayAt: true,
        startedAt: true,
        endedAt: true,
        pausedAt: true,
      },
    });

    if (!journey) {
      return NextResponse.json(
        { error: "Ingen aktiv reise funnen. Start ein match for å starte reise.", noJourney: true },
        { status: 404 }
      );
    }

    // 3. Sjekk om reise er fullført
    if (journey.endedAt) {
      return NextResponse.json({
        ended: true,
        message: "Reisa di er fullført. Vel sjølv veien vidare.",
      });
    }

    // 4. Hent dagens innhald frå JourneyDayContent
    const dayContent = await prisma.journeyDayContent.findFirst({
      where: { day: journey.day },
    });

    if (!dayContent) {
      return NextResponse.json(
        { error: "Ingen innhald funnen for dag " + journey.day, noContent: true },
        { status: 404 }
      );
    }

    // 5. Sjekk om neste dag er låst (24t-syklus)
    const nextDayAt = journey.nextDayAt as Date | null;
    const isDayLocked = nextDayAt && new Date() < nextDayAt;

    // 6. Hent refleksjonar og resonans for dagen
    const conversation = await prisma.conversation.findFirst({
      where: {
        userAId: user.id,
        userBId: { not: user.id },
      },
      include: {
        match: {
          include: {
            userA: { select: { id: true, profile: { select: { identityName: true } } } },
            userB: { select: { id: true, profile: { select: { identityName: true } } } },
          },
        },
        resonanceSessions: {
          where: { day: journey.day },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const lastResonance = conversation?.resonanceSessions[0] || null;

    return NextResponse.json({
      day: journey.day,
      phase: journey.phase,
      completedDays: journey.completedDays,
      dayContent: {
        theme: dayContent.theme,
        reflectionQuestion: dayContent.reflectionQuestion,
        conversationPrompt: dayContent.conversationPrompt,
        task: dayContent.task,
        resonanceGoal: dayContent.resonanceGoal,
        systemMessage: dayContent.systemMessage,
      },
      locks: {
        isDayLocked,
        nextDayAt: nextDayAt?.toISOString() || null,
        canAdvance: !isDayLocked,
      },
      lastResonance,
      conversationId: conversation?.id || null,
    });
  } catch (error) {
    console.error("GET /api/journey/today error:", error);
    return NextResponse.json(
      { error: "Internt feil ved henting av dagens innhald", internal: true },
      { status: 500 }
    );
  }
}