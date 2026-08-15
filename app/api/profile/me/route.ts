/**
 * GET /api/profile/me
 *
 * Returnerer den innloggede brukerens egen profil.
 * Bruk av: app/profile/page.tsx:42
 *
 * Krav fra ACT v6 steg 2.1 Del B:
 * - Ingen koordinater i klientresponsen (posisjon hører hjemme server-side)
 * - postalCode er greit
 * - Kontrakten utledes fra kallstedet
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { prisma } from "@/lib/prisma";
import { JOURNEY_TOTAL_DAYS } from "@/lib/journey/engine";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const result = await requireAuth(req);
    if (result instanceof NextResponse) return result;
    const userId = result.user.id;

    // Hent profil
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: {
        identityName: true,
        bio: true,
        interests: true,
        matchTags: true,
        photoUrl: true,
        postalCode: true,
      },
    });

    // Hent journey for currentDay/daysRemaining
    const journey = await prisma.journeyProgress.findFirst({
      where: { userId },
      select: { day: true },
    });

    const currentDay = journey?.day ?? 0;
    const daysRemaining = Math.max(0, JOURNEY_TOTAL_DAYS - currentDay);

    // Hent matchScore hvis aktiv match finnes
    const activeMatch = await prisma.match.findFirst({
      where: {
        status: "active",
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      select: { score: true },
    });

    // Returner flat JSON — klienten leser direkte fra responsen (ingen success-wrapper)
    return NextResponse.json(
      {
        identityName: profile?.identityName ?? null,
        bio: profile?.bio ?? null,
        tags: profile?.interests ?? [],
        matchTags: profile?.matchTags ?? [],
        postalCode: profile?.postalCode ?? null,
        photoUrl: profile?.photoUrl ?? null,
        currentDay,
        daysRemaining,
        matchScore: activeMatch?.score ?? 0,
      },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("GET /api/profile/me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}