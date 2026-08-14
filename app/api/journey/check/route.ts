// app/api/journey/check/route.ts — GET /api/journey/check
// Returner journey-status for innlogga bruker.
// Brukast av dashboard og journey-side for å vise progresjon, dag, phase og milestones.

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth/session";
import { captureError } from "@/lib/system/errors";
import { logInfo } from "@/lib/system/log";

export const dynamic = 'force-dynamic';

interface Milestone { id: string; day: number; title: string; summary: string }
interface TodayContent { theme: string; reflectionQuestion: string; conversationPrompt: string; task: string | null }

/**
 * GET /api/journey/check
 * 
 * Response:
 * {
 *   success: true,
 *   data: {
 *     active: boolean,
 *     journeyProgress: { id, phase, day, completedDays, startedAt, endedAt, pausedAt } | null,
 *     milestones: Array<{ id, day, title, summary }>,
 *     todayContent: { theme, reflectionQuestion, conversationPrompt, task } | null,
 *     daysRemaining: number | null,
 *     canComplete: boolean,
 *     message: string
 *   }
 * }
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = session.user.id;

    // Hent journeyProgress for brukaren
    const journeyProgress = await prisma.journeyProgress.findFirst({
      where: { userId },
      select: {
        id: true,
        phase: true,
        day: true,
        completedDays: true,
        startedAt: true,
        endedAt: true,
        pausedAt: true,
        updatedAt: true,
      },
    });

    // Definer om journey er aktiv
    const isActive = !journeyProgress?.endedAt && !journeyProgress?.pausedAt && !!journeyProgress;

    // Hent milestones
    let milestones: Milestone[] = [];
    if (journeyProgress) {
      milestones = await prisma.journeyMilestone.findMany({
        where: { progressId: journeyProgress.id },
        orderBy: { day: "asc" },
        select: { id: true, day: true, title: true, summary: true },
      });
    }

    // Hent today sin dagleg innhald frå JourneyDayContent
    let todayContent: TodayContent | null = null;
    if (journeyProgress?.day && journeyProgress.day > 0) {
      const content = await prisma.journeyDayContent.findFirst({
        where: { day: journeyProgress.day },
        select: { theme: true, reflectionQuestion: true, conversationPrompt: true, task: true },
      });
      if (content) todayContent = content;
    }

    // Rekn ut dagar att (30 dagers reise)
    let daysRemaining: number | null = null;
    if (journeyProgress?.startedAt) {
      const totalDays = 30;
      const elapsed = Math.floor(
        (Date.now() - journeyProgress.startedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      daysRemaining = Math.max(0, totalDays - elapsed);
    }

    // Kan brukaren fullføre reisa?
    const canComplete = journeyProgress ? (journeyProgress.day >= 30 || daysRemaining === 0 || isActive) : false;

    // Melding basert på status
    let message: string;
    if (!journeyProgress || !isActive) {
      message = "Du har ingen pågående reise. Vent på ein match eller fullfør onboarding.";
    } else if (journeyProgress.pausedAt) {
      message = `Reisa di er pausa. Dag ${journeyProgress.day}/30 — du kan halde fram når du vil.`;
    } else if (journeyProgress.endedAt) {
      message = "Reisa di er fullført. Gratulerer! 🎉";
    } else if (daysRemaining && daysRemaining <= 7) {
      message = `Berre ${daysRemaining} dag att av reisa di — du er nær målet!`;
    } else if (daysRemaining) {
      message = `Dag ${journeyProgress.day}/30 — ${daysRemaining} dagar att av reisa di.`;
    } else {
      message = "Reisa di er i gang.";
    }

    await logInfo("journey/check fetched", "journey_check", { userId, active: isActive, day: journeyProgress?.day });

    return NextResponse.json(
      {
        success: true,
        data: {
          active: isActive,
          journeyProgress: isActive ? journeyProgress : null,
          milestones,
          todayContent,
          daysRemaining,
          canComplete,
          message,
        },
      },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    await captureError(error, {
      module: "journey",
      message: "GET /api/journey/check failed",
    });
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Merknad: For "hent dagleg innhald", bruk GET /api/journey/{day} i staden.
