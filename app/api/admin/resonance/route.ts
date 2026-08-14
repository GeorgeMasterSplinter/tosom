/**
 * GET /api/admin/resonance
 * 
 * Hent ResonanceSession for ein bruker (admin).
 * Utvidet 2026-08-03 (Pakke 4.2): ResonanceSession Tracking
 * 
 * Query-params:
 *   - userId: obrigatory — bruker-id
 *   - limit: max antal resultat (valgfritt, default 50)
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/requireAuth";
import { castToAdminUser } from "@/lib/auth/admin-auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Auth + Admin-krav
    const result = await requireAuth(req);
    if (result instanceof NextResponse) return result;
    const user = result.user;
    const adminUser = castToAdminUser(user);

    if (adminUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Berre admin kan få tilgang til resonansdata" },
        { status: 403 }
      );
    }

    // Query-params
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const limitParam = url.searchParams.get('limit');

    if (!userId) {
      return NextResponse.json(
        { error: "Query-param 'userId' er påkrevd" },
        { status: 400 }
      );
    }

    const limit = parseInt(limitParam || '50');

    // Hent ResonanceSession for brukaren (via Conversation)
    const sessions = await prisma.resonanceSession.findMany({
      where: {
        conversation: {
          OR: [
            { userAId: userId },
            { userBId: userId },
          ],
        },
      },
      include: {
        conversation: {
          select: {
            userAId: true,
            userBId: true,
            matchId: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      take: Math.min(limit, 50),
    });

    // Grupper per dag (hvis fleire sessionar same dag)
    const dayMap = new Map<number, typeof sessions[0]>();
    for (const s of sessions) {
      if (!dayMap.has(s.day) || s.createdAt > dayMap.get(s.day)!.createdAt) {
        dayMap.set(s.day, s);
      }
    }

    const sorted = Array.from(dayMap.values()).sort((a, b) => a.day - b.day);

    // Kvantifiser resonans per fase
    const phaseStats = {
      EARLY: { count: 0, avgDepth: 0, depths: [] as number[] },
      BUILDING_TRUST: { count: 0, avgDepth: 0, depths: [] as number[] },
      DEEPER: { count: 0, avgDepth: 0, depths: [] as number[] },
    };

    for (const s of sorted) {
      // Enkel fase-tilordning basert på day
      let phase = 'EARLY' as const;

      // Enkel depth-estimat: høyare depthLevel + open emotionalTone → høgare depth
      let depthEstim = s.depthLevel || 1;
      if (s.emotionalTone === 'deep') depthEstim += 1;
      else if (s.emotionalTone === 'guarded') depthEstim -= 1;

      phaseStats[phase].count += 1;
      phaseStats[phase].depths.push(depthEstim);
    }

    for (const phase of Object.keys(phaseStats)) {
      const stat = phaseStats[phase as keyof typeof phaseStats];
      stat.avgDepth = stat.depths.length > 0
        ? Math.round(stat.depths.reduce((a, b) => a + b, 0) / stat.depths.length * 10) / 10
        : 0;
    }

    return NextResponse.json({
      success: true,
      data: {
        userId,
        totalSessions: sessions.length,
        uniqueDays: sorted.length,
        phases: phaseStats,
        sessions: sorted.map((s) => ({
          id: s.id,
          day: s.day,
          emotionalTone: s.emotionalTone,
          depthLevel: s.depthLevel,
          responseQuality: s.responseQuality,
          vulnerability: s.vulnerability,
          summary: s.summary?.substring(0, 200) || '', // Kutt lange summar
          createdAt: s.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error('[GET /api/admin/resonance] Error:', error);
    return NextResponse.json(
      { error: 'Internt feil' },
      { status: 500 }
    );
  }
}