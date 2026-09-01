/**
 * GET /api/journey/progress
 * 
 * @deprecated (V2) Resonance-sessions er fjerna — beholdes for bakover-kompatibilitet.
 * V2-prinsipp: Oppgaver er valfrie. Ingen måling av resonans under reisen.
 * Se docs/tosom-concept-v2-skisse.md for detaljer.
 * 
 * Hent progresjon for reisa — alle dager, milestones.
 * Core-definition: Viser reise uten gamification.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireNotBanned } from "@/lib/auth/session";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Auth
    const result = await requireAuth(req);
    if (result instanceof NextResponse) {
      return result;
    }
    const user = result.user;

    // 1b. Sjekk om brukeren er utestengt (STEG 3.2 — sesjons-revokering)
    const bannedCheck = await requireNotBanned(user.id);
    if (bannedCheck) return bannedCheck;

    // 2. Finn journey
    const journey = await prisma.journeyProgress.findFirst({
      where: { userId: user.id },
      select: {
        id: true,
        day: true,
        phase: true,
        completedDays: true,
        startedAt: true,
        endedAt: true,
        pausedAt: true,
      },
    });

    if (!journey) {
      return NextResponse.json(
        { error: "Ingen aktiv reise funnet", noJourney: true },
        { status: 404 }
      );
    }

    // 3. Finn milestones for reisa
    const milestones = await prisma.journeyMilestone.findMany({
      where: { progressId: journey.id },
      orderBy: { day: "asc" },
    });

    /** @deprecated (V2) ResonanceSession er fjerna — beholdes for bakover-kompatibilitet */
    //
    const conversation = await prisma.conversation.findFirst({
      where: {
        userAId: user.id,
        userBId: { not: user.id },
      },
      select: { id: true },
    });

    const resonanceSessions = conversation
      ? await prisma.resonanceSession.findMany({
          where: { conversationId: conversation.id },
          orderBy: { day: "asc" },
        })
      : [];

    // 5. Berekn progresjon
    const totalDays = 30;
    const progressPercent = Math.min(100, Math.round((journey.completedDays / totalDays) * 100));

    // 6. Hent alle dag-content for ref
    const allContent = await prisma.journeyDayContent.findMany({
      orderBy: { day: "asc" },
    });

    return NextResponse.json({
      journey: {
        day: journey.day,
        phase: journey.phase,
        completedDays: journey.completedDays,
        startedAt: journey.startedAt?.toISOString() ?? null,
        endedAt: journey.endedAt?.toISOString() ?? null,
        pausedAt: journey.pausedAt?.toISOString() ?? null,
      },
      progress: {
        completedDays: journey.completedDays,
        totalDays,
        percent: progressPercent,
        isComplete: journey.completedDays >= totalDays,
      },
      milestones,
      resonanceSessions,
      contentOverview: allContent.map((c) => ({
        day: c.day,
        theme: c.theme,
        completed: milestones.some((m) => m.day === c.day),
      })),
    });
  } catch (error) {
    console.error("GET /api/journey/progress error:", error);
    return NextResponse.json(
      { error: "Internt feil ved henting av progresjon", internal: true },
      { status: 500 }
    );
  }
}