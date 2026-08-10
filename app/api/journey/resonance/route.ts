/**
 * GET /api/journey/resonance
 * 
 * Hent ResonanceSession for den autentifiserte brukaren.
 * Pakke 6.3 — Resonance Graf (Steg 2)
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/requireAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Auth — brukaren må vere logga inn
    const result = await requireAuth(req);
    if (result instanceof NextResponse) return result;
    const userId = result.user.id;

    // Hent ResonanceSession for brukaren sin conversation
    const sessions = await prisma.resonanceSession.findMany({
      where: {
        conversation: {
          OR: [
            { userAId: userId },
            { userBId: userId },
          ],
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Grupper per dag (hvis fleire sessionar same dag, ta nyaste)
    const dayMap = new Map<number, typeof sessions[0]>();
    for (const s of sessions) {
      if (!dayMap.has(s.day) || s.createdAt > dayMap.get(s.day)!.createdAt) {
        dayMap.set(s.day, s);
      }
    }

    const uniqueDays = Array.from(dayMap.values()).sort((a, b) => a.day - b.day);

    return NextResponse.json({
      success: true,
      data: {
        userId,
        totalSessions: sessions.length,
        uniqueDays: uniqueDays.length,
        sessions: uniqueDays.map((s) => ({
          day: s.day,
          emotionalTone: s.emotionalTone,
          depthLevel: s.depthLevel,
          summary: s.summary?.substring(0, 200) || '',
          createdAt: s.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error('[GET /api/journey/resonance] Error:', error);
    return NextResponse.json(
      { error: 'Internt feil' },
      { status: 500 }
    );
  }
}