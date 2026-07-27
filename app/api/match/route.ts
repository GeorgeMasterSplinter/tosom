// app/api/match/route.ts — GET /api/match + POST /api/match
// GET  → list eksisterande matcher for brukaren
// POST → finn og opprett ny match

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth/session";
import { findBestMatchFor } from "@/lib/matching/findBestMatchFor";
import { logInfo } from "@/lib/system/log";
import { captureError } from "@/lib/system/errors";
import { isProd } from "@/config/runtime";

export const dynamic = 'force-dynamic';

/**
 * GET /api/match
 * 
 * Returner match-status + liste over matcher for innlogga brukar.
 * Ingen params treng — auth kjem frå session.
 */
export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    
    // Bruk query userId om tilgjengeleg, elles henta frå session
    let userId = url.searchParams.get("userId");
    if (!userId) {
      const session = await getServerSession();
      if (!session?.user?.id) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      userId = session.user.id;
    }

    const matches = await prisma.match.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      select: {
        id: true,
        score: true,
        status: true,
        createdAt: true,
        userA: { select: { id: true, profile: { select: { identityName: true, age: true, photoUrl: true } } } },
        userB: { select: { id: true, profile: { select: { identityName: true, age: true, photoUrl: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    const latest = matches[0] ?? null;
    
    let status: "no_match" | "pending" | "matched" = "no_match";
    if (matches.length > 0) {
      const hasLocked = matches.some((m) => m.status === "matched");
      status = hasLocked ? "matched" : "pending";
    }

    // Hent conversationId om det finst for den locked matchen
    let conversationId: string | null = null;
    if (status === "matched") {
      const convo = await prisma.match.findFirst({
        where: {
          OR: [{ userAId: userId }, { userBId: userId }],
          status: "matched",
        },
        select: { id: true },
        orderBy: { createdAt: "desc" },
      });
      // conversationId er knytt til match via MatchConversation (om den finst)
    }

    return new Response(JSON.stringify({
      success: true,
      status,
      matchId: latest?.id ?? null,
      conversationId,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    await captureError(error, { module: "match", message: "GET /api/match failed" });
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * POST /api/match
 * 
 * Request body:
 * { userId: string }
 * 
 * Response:
 * {
 *   match: {
 *     id: string,
 *     userId: string,
 *     name: string,
 *     score: number,        // 0–1
 *     tier: string,
 *     breakdown: { base, resonance, semantic, intimacy, future },
 *     explanation: string,
 *     rejected: boolean,
 *     rejectionReason: string | null
 *   },
 *   nextEligibleAt: string | null
 * }
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Auth-sjekk
    const session = await getServerSession();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (session.user.id !== userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 24t-regel: Sjekk om bruker er låst
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { lockedUntil: true },
    });

    if (currentUser?.lockedUntil) {
      const now = new Date();
      if (now < currentUser.lockedUntil) {
        return new Response(
          JSON.stringify({
            error: "Du er låst til en pågående reise. Låsen faller @{" + currentUser.lockedUntil.toLocaleDateString('no-NO') + "}.",
            nextEligibleAt: currentUser.lockedUntil.toISOString(),
          }),
          {
            status: 409,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // 30d-regel: Sjekk om bruker har pågående reise
    const activeJourney = await prisma.journeyProgress.findUnique({
      where: { userId },
      select: { endedAt: true, pausedAt: true },
    });

    if (activeJourney?.endedAt === null && activeJourney?.pausedAt === null) {
      return new Response(
        JSON.stringify({
          error: "Du har allerede en pågående reise. Fullfør eller avslutt den først.",
          nextEligibleAt: null,
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Finn beste match med den nye engine
    const result = await findBestMatchFor(userId);

    if (!result) {
      return new Response(
        JSON.stringify({
          error: "Ingen gyldig match funnet",
          match: null,
          nextEligibleAt: null,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { match, candidateId, candidateProfile, nextEligibleAt } = result;

    // Konverter score til 0-100 for lagring i DB
    const scoreForDB = Math.round(match.score * 100);
    const normalizedScoreForDB = match.score;

    // Opprett match-post
    const newMatch = await prisma.match.create({
      data: {
        userAId: userId,
        userBId: candidateId,
        score: scoreForDB,
        normalizedScore: normalizedScoreForDB,
        scoringBreakdown: match.breakdown as any,
        status: "active",
        resonanceLevel: match.tier === "deepResonance" ? "DEEP" : match.tier === "strongResonance" ? "STRONG" : match.tier === "moderateResonance" ? "MODERATE" : match.tier === "gentleResonance" ? "GENTLE" : "GENTLE",
      },
    });

    // Opprett conversation
    const conversation = await prisma.conversation.create({
      data: {
        userAId: userId,
        userBId: candidateId,
        matchId: newMatch.id,
      },
    });

    // Opprett journeyProgress for brukeren
    await prisma.journeyProgress.create({
      data: {
        userId: userId,
        phase: "EARLY",
        day: 1,
      },
    });

    // Hent navn fra kandidat sin profil
    const name = `${candidateProfile.firstName || ""} ${candidateProfile.lastName || ""}`.trim() || "Ukjent";

    // Lagrer match-event (valgfritt for observabilitet)
    await logInfo("New match created", "match", {
      userId,
      matchId: newMatch.id,
      candidateId,
      score: match.score,
      tier: match.tier,
    });

    return new Response(
      JSON.stringify({
        conversationId: conversation.id,
        match: {
          id: newMatch.id,
          userId: candidateId,
          name,
          score: match.score,
          tier: match.tier,
          breakdown: match.breakdown,
          explanation: match.explanation,
          rejected: match.rejected,
          rejectionReason: match.rejectionReason || null,
        },
        nextEligibleAt: nextEligibleAt?.toISOString() || null,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    await captureError(error, {
      module: "match",
      message: "Match API failed",
    });

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}