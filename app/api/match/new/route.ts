import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { findBestMatchFor } from "@/lib/matching/findBestMatchFor";
import { calculateMatchScore, MatchBlocks } from "@/lib/matching/calculateMatchScore";
import { explainMatch } from "@/lib/matching/explainMatch";
import { User, Profile } from "@prisma/client";
import { generateFirstMessage } from "@/lib/journey/generateFirstMessage";

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const matchUserId = await findBestMatchFor(userId);

  if (!matchUserId) {
    return NextResponse.json({ error: "No match found" }, { status: 404 });
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
    return NextResponse.json(
      { error: "Profile missing for one or both users" },
      { status: 500 }
    );
  }

  // Beregn matchblokkar og forklaring
  const result = calculateMatchScore(
    user as User & { profile: Profile | null },
    matchUser as User & { profile: Profile | null },
    { returnBlocks: true }
  );
  const blocks: MatchBlocks = result as MatchBlocks;
  const explanation = explainMatch(blocks);
  const score = Math.min(
    blocks.basic +
      blocks.lifestyle +
      blocks.interests +
      blocks.location +
      blocks.needs +
      blocks.boundaries +
      blocks.intentions,
    100
  );

  // Opprett ny Match
  const match = await prisma.match.create({
    data: {
      userAId: userId,
      userBId: matchUserId,
      matchScore: 0,
      matchQuality: "moderate",
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
  await prisma.journeyProgress.create({
    data: {
      conversationId: conversation.id,
      phase: "EARLY",
      currentStep: 0,
      completedSteps: 0,
      totalSteps: 36,
    },
  });

  // Send første systemmelding
  const firstMessage = generateFirstMessage({
    name: matchUser.name || "Ukjent",
    score,
    explanation,
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: null as any,
      content: firstMessage,
    },
  });

  return NextResponse.json({
    conversationId: conversation.id,
    matchInfo: {
      name: matchUser.name || "Ukjent",
      age: matchUser.profile?.age || 0,
      score,
      explanation,
    },
  });
}
