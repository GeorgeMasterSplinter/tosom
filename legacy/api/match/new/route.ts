import prisma from "@/lib/prisma";
import { findBestMatchFor } from "@/lib/matching/findBestMatchFor";
import { generateExplanation } from "@/lib/matching/explainer";
import { JourneyPhase } from "@prisma/client";
import { generateFirstMessage } from "@/lib/journey/generateFirstMessage";

export async function POST(
  request: Request
): Promise<Response> {
  const { userId } = await request.json();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const matchResult = await findBestMatchFor(userId);

  if (!matchResult) {
    return new Response(JSON.stringify({ error: "No match found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }

  const { match: engineMatch, candidateId: matchUserId } = matchResult;

  // Hent profil for begge brukarar
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  const matchUser = await prisma.user.findUnique({
    where: { id: matchUserId },
    include: { profile: true },
  });

  if (!user?.profile || !matchUser?.profile) {
    return new Response(JSON.stringify({ error: "Profile missing for one or both users" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  const explanation = generateExplanation(engineMatch);

  // Opprett ny Match
  const match = await prisma.match.create({
    data: {
      userAId: userId,
      userBId: matchUserId,
      score: engineMatch.score * 100,
      normalizedScore: engineMatch.score,
      resonanceLevel: engineMatch.tier === "deepResonance" ? "DEEP" : engineMatch.tier === "strongResonance" ? "STRONG" : engineMatch.tier === "moderateResonance" ? "MODERATE" : engineMatch.tier === "gentleResonance" ? "GENTLE" : "GENTLE",
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

  // Opprett JourneyProgress for matchet
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
    score: engineMatch.score * 100,
    explanation,
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
      score: engineMatch.score * 100,
      explanation,
    },
  }), { status: 200, headers: { "Content-Type": "application/json" } });
}