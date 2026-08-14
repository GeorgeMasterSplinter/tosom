/**
 * ToSom — Admin Journeys API 🕓
 * GET /api/admin/journeys
 *
 * Returnerer alle reiser (journeys) med ekte data fra database.
 * Støtter paginering, status-filter og søk.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function isAdmin(req: NextRequest): boolean {
  const adminToken = req.cookies.get("admin_token")?.value;
  const sessionToken = req.cookies.get("authjs.session-token")?.value ?? req.cookies.get("next-auth.session-token")?.value;
  return !!(adminToken || sessionToken);
}

export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ success: false, error: "Ikke autorisert" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status") || "alle";
    const phase = searchParams.get("phase") || "alle";

    const skip = (page - 1) * limit;

    // Bygg filter
    const where: any = {};

    if (status === "active") {
      where.completedAt = null;
    } else if (status === "completed") {
      where.completedAt = { not: null };
    }

    if (phase === "early") {
      where.day = { lte: 10 };
    } else if (phase === "mid") {
      where.day = { gte: 6, lte: 20 };
    } else if (phase === "late") {
      where.day = { gte: 16 };
    }

    // Hent journey + bruker-info (separate query for users since relation removed in B4)
    const journeys = await prisma.journeyProgress.findMany({
      where,
      skip,
      take: limit,
      orderBy: { startedAt: "desc" },
    });
    const total = await prisma.journeyProgress.count({ where });

    // Fetch user info for all journeys in batch
    const userIds = [...new Set(journeys.map(j => j.userId))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });
    const userMap = new Map(users.map(u => [u.id, u]));

    // For hver journey, hent match-info hvis tilgjengelig
    const enrichedJourneys = await Promise.all(
      journeys.map(async (j) => {
        const user = userMap.get(j.userId);
        const match = await prisma.match.findFirst({
          where: {
            OR: [
              { userAId: j.userId, status: "active" },
              { userBId: j.userId, status: "active" },
            ],
          },
          include: {
            userA: { select: { id: true, name: true } },
            userB: { select: { id: true, name: true } },
          },
        });

        if (!match) {
          return {
            id: j.id,
            userId: j.userId,
            userName: user?.name || user?.email || "Ukjent",
            day: j.day || 1,
            currentDay: j.day || 1,
            totalDays: 30,
            profileLocked: (j.day || 1) <= 29,
            imageLocked: (j.day || 1) < 15,
            status: j.completedAt ? "Ferdig" : (j.day || 1) >= 30 ? "Dag 30" : "På reise",
            startDate: j.startedAt.toISOString().split("T")[0],
            completedAt: j.completedAt?.toISOString() ?? null,
            partnerName: null,
            matchId: null,
          };
        }

        const partner = match.userAId === j.userId ? match.userB : match.userA;

        return {
          id: j.id,
          userId: j.userId,
          userName: user?.name || user?.email || "Ukjent",
          day: j.day || 1,
          currentDay: j.day || 1,
          totalDays: 30,
          profileLocked: (j.day || 1) <= 29,
          imageLocked: (j.day || 1) < 15,
          status: j.completedAt ? "Ferdig" : (j.day || 1) >= 30 ? "Dag 30" : "På reise",
          startDate: j.startedAt.toISOString().split("T")[0],
          completedAt: j.completedAt?.toISOString() ?? null,
          partnerName: partner?.name || "Ukjent",
          matchId: match.id,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enrichedJourneys,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Feil i /api/admin/journeys:", error);
    return NextResponse.json(
      { success: false, error: "Kunne ikke hente reiser" },
      { status: 500 }
    );
  }
}