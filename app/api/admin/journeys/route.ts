/**
 * Tosom — Admin Journeys API 🕓
 * GET /api/admin/journeys
 *
 * Returnerer alle reiser (journeys) med ekte data fra database.
 * Støtter paginering, status-filter og søk.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminAuthGuard } from "@/lib/auth/adminAuthGuard";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // B-4 FIX: Bruk kanonisk admin-guard (session + admin-role) — erstatter lokal
    // isAdmin() som sjekket kun at en cookie eksisterte (privilegie-eskalering).
    const denied = await adminAuthGuard();
    if (denied) return denied;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status") || "alle";
    const phase = searchParams.get("phase") || "alle";
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Bygg filter
    const where: any = {};

    if (search) {
      // Søk etter brukernavn/e-post og filtrer reiser på disse bruker-ID-ene.
      const matchedUsers = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
        select: { id: true },
      });
      where.userId = { in: matchedUsers.map((u) => u.id) };
    }

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

    // Hent journeys + sanne totals (status-tellingene skal ikke være bundet til siden)
    const [journeys, total, activeCount, completedCount] = await Promise.all([
      prisma.journeyProgress.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startedAt: "desc" },
      }),
      prisma.journeyProgress.count({ where }),
      prisma.journeyProgress.count({ where: { ...where, completedAt: null } }),
      prisma.journeyProgress.count({ where: { ...where, completedAt: { not: null } } }),
    ]);

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
      counts: { total, active: activeCount, completed: completedCount },
    });
  } catch (error) {
    console.error("Feil i /api/admin/journeys:", error);
    return NextResponse.json(
      { success: false, error: "Kunne ikke hente reiser" },
      { status: 500 }
    );
  }
}