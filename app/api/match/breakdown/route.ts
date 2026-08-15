/**
 * GET /api/match/breakdown?targetUserId=<id>
 *
 * STEG 2.2 — Resonansforklaring.
 *
 * Returnerer numeriske verdier som transportdata (beslutning B, 2026-08-15).
 * Klientkomponenten (MatchBreakdown.tsx) konverterer til ORD via
 * toResonanceLevel + resonanceLabel / toDimensionLabel. Brukeren ser aldri tall.
 *
 * Kontrakt (låst, B1.5):
 *   { totalScore: number, breakdown: { base, resonance, semantic, intimacy, future } }
 *   Alle verdier 0-100.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { prisma } from "@/lib/prisma";
import { unifiedScore, UnifiedResult } from "@/lib/matching/unifiedScorer";
import { ProfileData } from "@/lib/matching/types";

export const dynamic = "force-dynamic";

/**
 * Mapp 9-dimensjonsresultat fra unifiedScore til de 5 dimensjonene
 * klienten forventer. Samme logikk som calculateTotalScore (deprecated)
 * men i 0-100 skala i stedet for [0,1].
 */
function mapToFiveDimensions(result: UnifiedResult): {
  totalScore: number;
  breakdown: {
    base: number;
    resonance: number;
    semantic: number;
    intimacy: number;
    future: number;
  };
} {
  return {
    totalScore: Math.round(result.score),
    breakdown: {
      base: Math.round(result.score),
      resonance: Math.round(result.breakdown.communication),
      semantic: Math.round(result.breakdown.values),
      intimacy: Math.round(result.breakdown.emotionalNeeds),
      future: Math.round(result.breakdown.futureVision),
    },
  };
}

/**
 * Mapp Prisma Profile → ProfileData for unifiedScore.
 */
function toProfileData(profile: {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  age: number;
  bio: string | null;
  interests: string[];
  lifeSituation: unknown;
  lifestyle: unknown;
  personality: unknown;
  relationshipStyle: string | null;
  communication: unknown;
  intimacy: unknown;
  futureVision: unknown;
  boundaries: unknown;
  emotionalNeeds: unknown;
  lifeRhythm: string | null;
  maturityLevel: number | null;
  securityLevel: string | null;
  preferences: unknown;
  matchTags: string[];
  latitude: number | null;
  longitude: number | null;
}): ProfileData {
  return {
    userId: profile.userId,
    firstName: profile.firstName,
    lastName: profile.lastName,
    age: profile.age,
    bio: profile.bio,
    interests: profile.interests,
    lifeSituation: (profile.lifeSituation as Record<string, unknown> | null) ?? null,
    lifestyle: (profile.lifestyle as Record<string, unknown> | null) ?? null,
    personality: (profile.personality as Record<string, unknown> | null) ?? null,
    relationshipStyle: profile.relationshipStyle,
    communication: (profile.communication as Record<string, unknown> | null) ?? null,
    intimacy: (profile.intimacy as Record<string, unknown> | null) ?? null,
    futureVision: (profile.futureVision as Record<string, unknown> | null) ?? null,
    boundaries: (profile.boundaries as Record<string, unknown> | null) ?? null,
    emotionalNeeds: (profile.emotionalNeeds as Record<string, unknown> | null) ?? null,
    lifeRhythm: profile.lifeRhythm,
    maturityLevel: profile.maturityLevel,
    securityLevel: profile.securityLevel,
    preferences: (profile.preferences as Record<string, unknown> | null) ?? null,
    matchTags: profile.matchTags,
    latitude: profile.latitude,
    longitude: profile.longitude,
  };
}

export async function GET(req: NextRequest) {
  const result = await requireAuth(req);
  if (result instanceof NextResponse) return result;
  const userId = result.user.id;

  const targetUserId = req.nextUrl.searchParams.get("targetUserId");
  if (!targetUserId) {
    return NextResponse.json({ error: "targetUserId mangler" }, { status: 400 });
  }

  // Verifiser at brukeren faktisk er koblet til targetUserId
  const match = await prisma.match.findUnique({
    where: {
      userAId_userBId:
        userId <= targetUserId
          ? { userAId: userId, userBId: targetUserId }
          : { userAId: targetUserId, userBId: userId },
    },
    select: { id: true },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Du er ikke koblet til denne personen" },
      { status: 403 }
    );
  }

  // Hent begge profilmene
  const [myProfile, targetProfile] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.profile.findUnique({ where: { userId: targetUserId } }),
  ]);

  if (!myProfile || !targetProfile) {
    return NextResponse.json(
      { error: "Profil mangler" },
      { status: 404 }
    );
  }

  // Kjør unified scoring
  const myData = toProfileData(myProfile);
  const targetData = toProfileData(targetProfile);
  const scoreResult = unifiedScore(myData, targetData);

  // Mapp 9→5 dimensjoner i 0-100 skala
  const response = mapToFiveDimensions(scoreResult);

  return NextResponse.json(response);
}