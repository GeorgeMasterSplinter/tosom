
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { findBestMatchFor } from "@/lib/matching/findBestMatchFor";
import { calculateScore, generateExplanation } from "@/lib/matching/scorer";
import { User, Profile, JourneyPhase } from "@prisma/client";
import { generateFirstMessage } from "@/lib/journey/generateFirstMessage";
import { logInfo } from "@/lib/system/log";
import { captureError } from "@/lib/system/errors";
import { isProd } from "@/config/runtime";

export async function POST(
  request: Request
): Promise<Response> {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (session.user.id !== userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const matchUserId = await findBestMatchFor(userId);

    if (!matchUserId) {
      return new Response(JSON.stringify({ error: "No match found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const [user, matchUser] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      }),
      prisma.user.findUnique({
        where: { id: matchUserId },
        include: { profile: true },
      }),
    ]);

    if (!user?.profile || !matchUser?.profile) {
      return new Response(JSON.stringify({ error: "Profile missing for one or both users" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Beregn match-score med den nye scorer-motoren
    const scoreResult = calculateScore(
      user.profile as unknown as Record<string, unknown>,
      matchUser.profile as unknown as Record<string, unknown>
    );
    const explanation = generateExplanation(scoreResult);

    const match = await prisma.match.create({
      data: {
        userAId: userId,
        userBId: matchUserId,
        matchScore: scoreResult.totalScore,
        matchQuality: scoreResult.matchQuality,
        status: "active",
      },
    });

    const conversation = await prisma.conversation.create({
      data: {
        userAId: userId,
        userBId: matchUserId,
        matchId: match.id,
      },
    });

    // JourneyProgress uses userId (not conversationId), and has day (not currentStep/completedSteps/totalSteps)
    await prisma.journeyProgress.create({
      data: {
        userId: userId,
        phase: JourneyPhase.EARLY,
        day: 1,
      },
    });

    // Get name from profile, not User model
    const firstName = matchUser.profile?.firstName || "";
    const lastName = matchUser.profile?.lastName || "";
    const name = `${firstName} ${lastName}`.trim() || "Ukjent";

    const firstMessage = generateFirstMessage({
      name,
      score: scoreResult.totalScore,
      explanation: explanation.explanation,
    });

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userId,
        content: firstMessage,
      },
    });

    await logInfo("New match created", "match", {
      userId,
      matchId: match.id,
      score: scoreResult.totalScore,
    });

    return new Response(
      JSON.stringify({
        conversationId: conversation.id,
        matchInfo: {
          name,
          age: matchUser.profile?.age || 0,
          score: scoreResult.totalScore,
          explanation: explanation.explanation,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    await captureError(error, {
      module: "match",
      message: "Match API failed",
    });

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
