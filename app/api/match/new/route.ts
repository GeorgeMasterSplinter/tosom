
import prisma from "@/lib/prisma";
import { findBestMatchFor } from "@/lib/matching/findBestMatchFor";
import { calculateScore, generateExplanation } from "@/lib/matching/scorer";
import { User, Profile, JourneyPhase } from "@prisma/client";
import { generateFirstMessage } from "@/lib/journey/generateFirstMessage";

export async function POST(
  request: Request
): Promise<Response> {
  const { userId } = await request.json();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const matchUserId = await findBestMatchFor(userId);

  if (!matchUserId) {
    return new Response(JSON.stringify({ error: "No match found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }

  // Hent profil for begge brukarar for scoreberegning
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
    return new Response(JSON.stringify({ error: "Profile missing for one or both users" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  // Beregn match-score med den nye scorer-motoren
  const scoreResult = calculateScore(
    user.profile as unknown as Record<string, unknown>,
    matchUser.profile as unknown as Record<string, unknown>
  );
  const explanation = generateExplanation(scoreResult);

  // Opprett ny Match
  const match = await prisma.match.create({
    data: {
      userAId: userId,
      userBId: matchUserId,
      matchScore: scoreResult.totalScore,
      matchQuality: scoreResult.matchQuality,
      status: "active",
    },
  });

  // Opprett ny Conversation
  const conversation = await prisma.conversation.create({
    data: {
      userAId: userId,
      userBId: matchUserId,
      matchId: match.id,
    },
  });

  // Opprett JourneyProgress for matchet (using userId, not conversationId)
  const journeyPhase: JourneyPhase = "EARLY";
  await prisma.journeyProgress.create({
    data: {
      userId: userId,
      phase: journeyPhase,
      day: 1,
    },
  });

  // Send første systemmelding
  const firstName = matchUser.profile?.firstName || "";
  const lastName = matchUser.profile?.lastName || "";
  const name = `${firstName} ${lastName}`.trim() || "Ukjent";
  const firstMessage = generateFirstMessage({
    name,
    score: scoreResult.totalScore,
    explanation: explanation.explanation,
  });

  // System messages use a system user or null
  const systemUserId = "system";
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: systemUserId,
      content: firstMessage,
      type: "system",
    },
  });

  return new Response(JSON.stringify({
    conversationId: conversation.id,
    matchInfo: {
      name,
      age: matchUser.profile?.age || 0,
      score: scoreResult.totalScore,
      explanation: explanation.explanation,
    },
  }), { status: 200, headers: { "Content-Type": "application/json" } });
}
