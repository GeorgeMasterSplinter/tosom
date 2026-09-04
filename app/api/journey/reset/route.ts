/**
 * Tosom — Journey Reset API 🟡⭐
 * POST /api/journey/reset
 *
 * Kjøres når brukeren velger "Ja til tosommhet" eller "Start ny reise" på dag 30.
 * Sletter chat, markerer match som completed, og resetter journey.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { tryParseJsonBody } from "@/lib/api/validation";
import { csrfCheck } from "@/lib/auth/csrf";

export async function POST(req: NextRequest) {
  try {
    // CSRF (systemaudit 03.09, funn 5) — destruktiv rute (sletter chat + resetter reise)
    const csrf = await csrfCheck(req);
    if (csrf instanceof NextResponse) return csrf;

    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Ikke autentisert" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await tryParseJsonBody(req);
    if (!body) {
      return NextResponse.json({ error: "Ugyldig body" }, { status: 400 });
    }
    const choice: "complete" | "loop_back" = body.choice || "complete";

    // Finn aktiv match
    const activeMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { userAId: userId, status: 'active' },
          { userBId: userId, status: 'active' },
        ],
      },
    });

    if (activeMatch) {
      // Finn konversasjonen mellom partnerne
      const conversation = await prisma.conversation.findFirst({
        where: {
          matchId: activeMatch.id,
        },
      });

      // Slett alle meldinger i konversasjonen
      if (conversation) {
        await prisma.message.deleteMany({
          where: { conversationId: conversation.id },
        });

        // Slett konversasjonen selv
        await prisma.conversation.delete({
          where: { id: conversation.id },
        });
      }

      // Marker match som ended
      await prisma.match.update({
        where: { id: activeMatch.id },
        data: { status: 'ended' },
      });
    }

    // Reset journey — sett completedAt
    const journey = await prisma.journeyProgress.findFirst({
      where: { userId },
      orderBy: { startedAt: 'desc' },
    });

    if (journey) {
      await prisma.journeyProgress.update({
        where: { id: journey.id },
        data: {
          completedAt: new Date(),
          day: 30,
        },
      });
    }

    // Hvis "loop_back" — reset onboarding slik at brukeren kan starte på nytt
    if (choice === "loop_back") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          onboardingComplete: false,
          onboardingStep: 1,
        },
      });

      return NextResponse.json({
        success: true,
        redirect: "/onboarding/start",
      });
    }

    // "complete" — brukeren er ferdig med Tosom
    return NextResponse.json({
      success: true,
      redirect: "/dashboard?journey=complete",
    });

  } catch (error) {
    console.error("Feil i journey reset:", error);
    return NextResponse.json(
      { success: false, error: "Noe gikk galt" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Kun POST tillatt" },
    { status: 405 }
  );
}