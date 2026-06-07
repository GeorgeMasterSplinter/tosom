import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { calculateScore, generateExplanation } from "@/lib/matching/scorer";
import { checkRateLimit } from "@/lib/rateLimit";
import { matchCreateSchema } from "@/lib/validation/match";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting: maks 20 match-førespurslar/minutt per user
  if (checkRateLimit(`match:${session.user.id}`, 20, 60_000)) {
    return NextResponse.json(
      { error: "For mange match-førespurslar. Vent eit par sekund." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const parse = matchCreateSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { error: parse.error.errors[0]?.message || "Ugyldig data" },
      { status: 400 }
    );
  }
  const { targetUserId } = parse.data;

  // Hent profiler for scoring
  const [profileA, profileB] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.profile.findUnique({ where: { userId: targetUserId } }),
  ]);

  if (!profileA || !profileB) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Kalkuler match-score med ny 5-vektet motor
  const scoreResult = calculateScore(profileA, profileB);

  // Generer forklaring
  const explanation = generateExplanation(scoreResult);

  // Opprett match i transaksjon
  const match = await prisma.match.create({
    data: {
      userAId: session.user.id,
      userBId: targetUserId,
      status: "active",
      score: scoreResult.totalScore,
    },
  });

  // Start journey for begge brukarar (DB-basert no)
  const journeyA = await prisma.journeyProgress.findUnique({
    where: { userId: session.user.id },
    select: { day: true, phase: true },
  });

  const journeyB = await prisma.journeyProgress.findUnique({
    where: { userId: targetUserId },
    select: { day: true, phase: true },
  });

  // Sjekk om den andre brukaren allereie har likt deg
  const reverseMatch = await prisma.match.findFirst({
    where: {
      userAId: targetUserId,
      userBId: session.user.id,
    },
  });

  // Hvis gjensidig match → opprett conversation + systemmelding i transaksjon
  if (reverseMatch) {
    const result = await prisma.$transaction(async (tx) => {
      const conversation = await tx.conversation.create({
        data: {
          userAId: session.user.id,
          userBId: targetUserId,
          matchId: match.id,
        },
      });

      await tx.message.create({
        data: {
          conversationId: conversation.id,
          senderId: session.user.id,
          content: "Dere har ein match! Ta et roleg første steg og si hei 👋",
          type: "system",
        },
      });

      return conversation;
    });

    return NextResponse.json({
      success: true,
      mutual: true,
      conversationId: result.id,
      matchId: match.id,
      score: scoreResult.totalScore,
      quality: scoreResult.matchQuality,
      breakdown: scoreResult.breakdown,
      explanation,
      journeyA: { day: journeyA?.day ?? 1, phase: journeyA?.phase ?? "EARLY" },
      journeyB: { day: journeyB?.day ?? 1, phase: journeyB?.phase ?? "EARLY" },
    });
  }

  return NextResponse.json({
    success: true,
    mutual: false,
    matchId: match.id,
    score: scoreResult.totalScore,
    quality: scoreResult.matchQuality,
    breakdown: scoreResult.breakdown,
    explanation,
    journeyA: { day: journeyA?.day ?? 1, phase: journeyA?.phase ?? "EARLY" },
  });
}
