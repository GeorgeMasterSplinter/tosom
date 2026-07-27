/**
 * GET /api/match/status
 * 
 * Hent match-status for ein brukar.
 * Viser:
 * - Aktiv match (dersom begge har akseptert)
 * - Pentende match (dersom ein har akseptert)
 * - Neste tilgjengelege match-tidspunkt
 * - Resonansnivå
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/requireAuth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Auth
    const result = await requireAuth(req);
    if (result instanceof NextResponse) {
      return result;
    }
    const user = result.user;

    // 2. Finn aktiv eller pending match for brukaren
    const match = await prisma.match.findFirst({
      where: {
        OR: [
          { userAId: user.id },
          { userBId: user.id },
        ],
        status: { in: ["pending", "matched"] },
      },
      include: {
        userA: {
          select: {
            id: true,
            profile: {
              select: { identityName: true, age: true, photoUrl: true },
            },
          },
        },
        userB: {
          select: {
            id: true,
            profile: {
              select: { identityName: true, age: true, photoUrl: true },
            },
          },
        },
      },
    });

    // 3. Hent brukar sin lås/info
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        lastMatchAt: true,
        lockedUntil: true,
        onboardingComplete: true,
        deepProfileComplete: true,
      },
    });

    // 4. Bygg response
    let nextAvailableAt: string | null = null;
    
    if (!match) {
      const canFindMatch = currentUser?.onboardingComplete && currentUser?.deepProfileComplete;
      
      if (currentUser?.lockedUntil) {
        nextAvailableAt = currentUser.lockedUntil.toISOString();
      } else if (currentUser?.lastMatchAt) {
        const hoursSince = (Date.now() - currentUser.lastMatchAt.getTime()) / (1000 * 60 * 60);
        if (hoursSince < 24) {
          nextAvailableAt = new Date(
            currentUser.lastMatchAt.getTime() + 24 * 60 * 60 * 1000
          ).toISOString();
        }
      }

      return NextResponse.json({
        hasActiveMatch: false,
        canFindMatch: !!canFindMatch,
        nextAvailableAt,
        requiresOnboarding: !canFindMatch,
      });
    }

    // Finn den andre brukaren (ikkje sjølv)
    const otherUser = match.userAId === user.id ? match.userB : match.userA;
    const isUserA = match.userAId === user.id;
    const myAccept = isUserA ? match.acceptedByA : match.acceptedByB;
    const otherAccept = isUserA ? match.acceptedByB : match.acceptedByA;

    // Sjekk om vi er i 14-dagers bildefase
    const conversation = await prisma.conversation.findFirst({
      where: { matchId: match.id },
      select: { imageShareAllowedAt: true, imageShared: true },
    });

    const inImagePhase = conversation?.imageShareAllowedAt
      ? new Date() >= conversation.imageShareAllowedAt
      : false;

    const hoursUntilImageShare = conversation?.imageShareAllowedAt
      ? Math.max(0, Math.ceil((conversation.imageShareAllowedAt.getTime() - Date.now()) / (1000 * 60 * 60)))
      : null;

    // Sjekk om reisen er aktiv
    const journeyActive = match.status === "matched" && !!match.lockedAt;

    return NextResponse.json({
      hasActiveMatch: true,
      match: {
        id: match.id,
        status: match.status,
        resonanceLevel: match.resonanceLevel,
        expiresAt: match.expiresAt?.toISOString(),
        lockedAt: match.lockedAt?.toISOString(),
        lockedUntil: currentUser?.lockedUntil?.toISOString(),
      },
      candidate: {
        id: otherUser.id,
        identityName: otherUser.profile?.identityName || null,
        age: otherUser.profile?.age || null,
        photoUrl: otherUser.profile?.photoUrl || null,
      },
      acceptance: {
        myAcceptance: myAccept?.toISOString() || null,
        otherAcceptance: otherAccept?.toISOString() || null,
        bothAccepted: !!myAccept && !!otherAccept,
      },
      journey: journeyActive
        ? {
            phase: "EARLY",
            daysRemaining: match.lockedAt
              ? Math.max(0, Math.ceil((30 * 24 * 60 * 60 * 1000 - (Date.now() - match.lockedAt.getTime())) / (1000 * 60 * 60 * 24)))
              : 30,
          }
        : null,
      imagePhase: {
        inPhase1: !inImagePhase,
        imageShareAllowedAt: conversation?.imageShareAllowedAt?.toISOString() || null,
        hoursUntilImageShare,
        alreadyShared: conversation?.imageShared || false,
      },
      nextAvailableAt: nextAvailableAt,
    });
  } catch (error) {
    console.error("GET /api/match/status error:", error);
    return NextResponse.json(
      { error: "Internt feil ved henting av match-status", internal: true },
      { status: 500 }
    );
  }
}