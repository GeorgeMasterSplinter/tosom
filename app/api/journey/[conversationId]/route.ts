import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { journeyAPI } from "@/lib/journey/engine";

/**
 * GET /api/journey/[conversationId] — Hent journey state per conversation
 * 
 * Denne ruten er berre for GET. For å advance journeY, bruk:
 *   POST /api/journey/progress
 * 
 * @deprecated POST-metoden vart fjerna 2026-08-02 (overlap med /api/journey/progress/advance)
 */

export const dynamic = 'force-dynamic';

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
