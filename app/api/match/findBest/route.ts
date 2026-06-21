/**
 * POST /api/match/findBest
 * 
 * Finn og opprett éin match basert på resonans.
 * 
 * Core-definition:
 * - Éin match per 24 time
 * - Berre fullførte djup profiler
 * - Ingen foto-basert matching
 * - Ingen offentlege profiler
 */

import { NextRequest, NextResponse } from "next/server";
import { findBestResonance } from "@/lib/matching/findBestResonance";
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

    // 2. Finn beste match
    const bestMatch = await findBestResonance({
      userId: user.id,
      minResonance: 20,
    });

    if (!bestMatch) {
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          onboardingComplete: true,
          deepProfileComplete: true,
          lastMatchAt: true,
          lockedUntil: true,
        },
      });

      if (!currentUser) {
        return NextResponse.json(
          { error: "Brukar ikkje funnen" },
          { status: 404 }
        );
      }

      if (!currentUser.onboardingComplete || !currentUser.deepProfileComplete) {
        return NextResponse.json(
          { error: "Fullfør onboarding for å få ein match", requiresOnboarding: true },
          { status: 400 }
        );
      }

      if (currentUser.lockedUntil && new Date() < currentUser.lockedUntil) {
        return NextResponse.json(
          { error: "Du er i ein aktiv reise. Ny match tilgjengeleg etter lås opphøyr.", lockedUntil: currentUser.lockedUntil },
          { status: 409 }
        );
      }

      if (currentUser.lastMatchAt) {
        const hoursSince = (Date.now() - currentUser.lastMatchAt.getTime()) / (1000 * 60 * 60);
        if (hoursSince < 24) {
          const nextAvailable = new Date(
            currentUser.lastMatchAt.getTime() + 24 * 60 * 60 * 1000
          );
          return NextResponse.json(
            { error: "Vent 24 time mellom matcher", nextAvailableAt: nextAvailable, hoursRemaining: Math.ceil((24 - hoursSince) * 10) / 10 },
            { status: 409 }
          );
        }
      }

      return NextResponse.json(
        { error: "Fann ingen match — prøv igjen seinare", noCandidates: true },
        { status: 200 }
      );
    }

    // 3. Opprett Match med resonansnivå
    const newMatch = await prisma.match.create({
      data: {
        userAId: user.id,
        userBId: bestMatch.candidateId,
        status: "pending",
        resonanceLevel: bestMatch.match.resonanceLevel,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      include: {
        userA: { include: { profile: true } },
        userB: { include: { profile: true } },
      },
    });

    // 4. Opprett Conversation for paret
    const conversation = await prisma.conversation.create({
      data: {
        userAId: user.id,
        userBId: bestMatch.candidateId,
        matchId: newMatch.id,
        imageShareAllowedAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        imageShared: false,
      },
    });

    // 5. Oppdater User.lastMatchAt (24t-syklus)
    await prisma.user.update({
      where: { id: user.id },
      data: { lastMatchAt: new Date() },
    });

    // 6. Opprett JourneyProgress
    await prisma.journeyProgress.upsert({
      where: { userId: user.id },
      update: { phase: "EARLY", day: 1 },
      create: { userId: user.id, phase: "EARLY", day: 1 },
    });

    // 7. Returner match-resultat
    return NextResponse.json({
      match: {
        id: newMatch.id,
        status: newMatch.status,
        resonanceLevel: newMatch.resonanceLevel,
        resonanceScore: bestMatch.match.resonanceScore,
        nextAvailableAt: bestMatch.nextAvailableAt,
        expiresAt: newMatch.expiresAt,
        conversationId: conversation.id,
      },
      candidate: {
        id: bestMatch.candidateId,
        identityName: bestMatch.candidate.profile?.identityName || null,
        age: bestMatch.candidate.profile?.age || null,
      },
      resonanceBreakdown: bestMatch.match.breakdown,
      guidance: {
        phase1: "Dei første 14 dagane er utan bilder — bygger trygghet først.",
        nextStep: "Både du og din match må akseptere for å starte reisen.",
      },
    });
  } catch (error) {
    console.error("POST /api/match/findBest error:", error);
    return NextResponse.json(
      { error: "Internt feil ved match", internal: true },
      { status: 500 }
    );
  }
}