// app/api/match/route.ts — GET /api/match (B7: POST fjernet)
// GET → list eksisterande matcher for brukaren
// POST er FJERNET (STEG B7) — Tosom kobler, godtar ikke.

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth/session";
import { captureError } from "@/lib/system/errors";

export const dynamic = 'force-dynamic';

/**
 * GET /api/match
 * 
 * Returner match-status + liste over matcher for innlogga bruker.
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
    
    let status: "no_match" | "active" = "no_match";
    if (matches.length > 0) {
      const hasActive = matches.some((m) => m.status === "active");
      status = hasActive ? "active" : "no_match";
    }

    return new Response(JSON.stringify({
      success: true,
      status,
      matchId: latest?.id ?? null,
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

// B7: POST er fjernet — ingen manuell matching fra klienten
// Hvis noe prøver POST → Next.js returnerer 404 automatisk (ingen POST-handler eksporter)