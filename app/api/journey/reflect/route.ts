/** @deprecated (V2) Refleksjonar er valfrie — ikke pliktige lenger. */
/**
 * POST /api/journey/reflect
 * 
 * Lag refleksjon for dagen.
 * Core-definition: Dagleg refleksjon, mild guiding, ingen gamification.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/requireAuth";

export const dynamic = 'force-dynamic';

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
    const { reflection, conversationResponse } = body as {
      reflection?: string;
      conversationResponse?: string;
    };

    if (!reflection && !conversationResponse) {
      return NextResponse.json(
        { error: "Refleksjon eller samtalesvar er påkrevd" },
        { status: 400 }
      );
    }

    // 3. Finn journey
    const journey = await prisma.journeyProgress.findFirst({
      where: { userId: user.id },
      select: { id: true, day: true, phase: true, nextDayAt: true, completedDays: true },
    });

    if (!journey) {
      return NextResponse.json(
        { error: "Ingen aktiv reise funnen", noJourney: true },
        { status: 404 }
      );
    }

    // 4. Finn conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        userAId: user.id,
        userBId: { not: user.id },
      },
      select: { id: true },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Ingen conversation funnen" },
        { status: 404 }
      );
    }

    // 5. Sjekk om allereie har refleksjon for denne dagen
    const hasReflection = await prisma.journeyMilestone.findFirst({
      where: {
        progress: { userId: user.id },
        day: journey.day,
      },
    });

    // 6. Oppdater eller opprett refleksjon
    const milestone = hasReflection
      ? await prisma.journeyMilestone.update({
          where: { id: hasReflection.id },
          data: { summary: reflection || conversationResponse || "" },
        })
      : await prisma.journeyMilestone.create({
          data: {
            progressId: journey.id,
            day: journey.day,
            title: journey.day === 1
              ? "Første refleksjon"
              : `Refleksjon dag ${journey.day}`,
            summary: reflection || conversationResponse || "",
          },
        });

    // 7. Oppdater completedDays og nextDayAt — bare første gong
    if (!hasReflection) {
      await prisma.journeyProgress.update({
        where: { id: journey.id },
        data: {
          completedDays: { increment: 1 },
          nextDayAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
    }

    // 8. Hent oppdatert journey for response
    const updatedJourney = await prisma.journeyProgress.findFirst({
      where: { userId: user.id },
      select: { completedDays: true },
    });

    return NextResponse.json({
      success: true,
      milestone: {
        id: milestone.id,
        day: milestone.day,
        title: milestone.title,
        summary: milestone.summary,
      },
      completedDays: hasReflection ? undefined : (journey.completedDays + 1),
      message: hasReflection
        ? "Refleksjon oppdatert."
        : "Refleksjon lagra. Du kan gå vidare til neste dag etter 24 timer.",
    });
  } catch (error) {
    console.error("POST /api/journey/reflect error:", error);
    return NextResponse.json(
      { error: "Internt feil ved lagring av refleksjon", internal: true },
      { status: 500 }
    );
  }
}