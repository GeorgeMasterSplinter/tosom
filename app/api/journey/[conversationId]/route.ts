import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { journeyAPI, JOURNEY_TOTAL_DAYS, UserProgress } from "@/lib/journey/engine";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const session = await getServerSession();
  const { conversationId } = await params;

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Finn Conversation → userAId → JourneyProgress
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId },
      select: { userAId: true },
    });

    if (!conversation) {
      return new Response(
        JSON.stringify({ error: "Conversation not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const progress = await prisma.journeyProgress.findUnique({
      where: { userId: conversation.userAId },
    });

    if (!progress) {
      return new Response(
        JSON.stringify({ error: "Journey not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const journeyState = journeyAPI.buildJourneyState(
      progress.day ?? 1,
      { matchState: "in_journey", conversationId }
    );

    return new Response(
      JSON.stringify({
        day: progress.day,
        phase: journeyState.phase,
        phaseLabel: journeyState.phaseLabel,
        photosAllowed: journeyState.photosAllowed,
        progress: journeyState.progress,
        daysRemaining: journeyState.daysRemaining,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const session = await getServerSession();
  const { conversationId } = await params;

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Finn Conversation → userAId → JourneyProgress
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId },
      select: { userAId: true },
    });

    if (!conversation) {
      return new Response(JSON.stringify({ error: "Conversation not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const journey = await prisma.journeyProgress.findUnique({
      where: { userId: conversation.userAId },
    });

    if (!journey) {
      return new Response(JSON.stringify({ error: "Journey not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Sjekk om reisen er ferdig
    const currentDay = journey.day ?? 1;
    if (currentDay >= JOURNEY_TOTAL_DAYS) {
      return new Response(JSON.stringify({ error: "Journey completed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Oppdater dag via Prisma
    const updatedProgress = await prisma.journeyProgress.update({
      where: { id: journey.id },
      data: { day: currentDay + 1, updatedAt: new Date() },
    });

    return new Response(
      JSON.stringify({
        day: updatedProgress.day,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}