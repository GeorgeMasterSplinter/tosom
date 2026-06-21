/**
 * POST /api/journey/resonance
 * 
 * Lag resonans-data for dagen.
 * Core-definition: Måle emosjonell resonans — ikkje numerisk score.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/requireAuth";

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
    const {
      emotionalTone,
      depthLevel,
      responseQuality,
      mutualSharing,
      vulnerability,
      summary,
    } = body as {
      emotionalTone?: string;
      depthLevel?: number;
      responseQuality?: string;
      mutualSharing?: boolean;
      vulnerability?: boolean;
      summary?: string;
    };

    // 3. Finn journey
    const journey = await prisma.journeyProgress.findUnique({
      where: { userId: user.id },
      select: { day: true, phase: true },
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

    // 5. Byg resonance data — kun definerte verdiar
    const resonanceData: Record<string, any> = {};
    if (emotionalTone) resonanceData.emotionalTone = emotionalTone;
    if (depthLevel !== undefined) resonanceData.depthLevel = depthLevel;
    if (responseQuality) resonanceData.responseQuality = responseQuality;
    if (mutualSharing !== undefined) resonanceData.mutualSharing = mutualSharing;
    if (vulnerability !== undefined) resonanceData.vulnerability = vulnerability;
    if (summary) resonanceData.summary = summary;

    // 6. Oppdater eller opprett ResonanceSession
    const existing = await prisma.resonanceSession.findFirst({
      where: {
        conversationId: conversation.id,
        day: journey.day,
      },
      select: { id: true },
    });

    const session = existing
      ? await prisma.resonanceSession.update({
          where: { id: existing.id },
          data: resonanceData,
        })
      : await prisma.resonanceSession.create({
          data: {
            conversationId: conversation.id,
            day: journey.day,
            emotionalTone: resonanceData.emotionalTone ?? null,
            depthLevel: resonanceData.depthLevel ?? null,
            responseQuality: resonanceData.responseQuality ?? null,
            mutualSharing: resonanceData.mutualSharing ?? false,
            vulnerability: resonanceData.vulnerability ?? false,
            summary: resonanceData.summary ?? null,
          },
        });

    return NextResponse.json({
      success: true,
      resonanceSession: {
        id: session.id,
        day: session.day,
        emotionalTone: session.emotionalTone,
        depthLevel: session.depthLevel,
        responseQuality: session.responseQuality,
        mutualSharing: session.mutualSharing,
        vulnerability: session.vulnerability,
        summary: session.summary,
      },
      message: "Resonans lagrad.",
    });
  } catch (error) {
    console.error("POST /api/journey/resonance error:", error);
    return NextResponse.json(
      { error: "Internt feil ved lagring av resonans", internal: true },
      { status: 500 }
    );
  }
}