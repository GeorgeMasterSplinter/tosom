/**
 * Tosom — Admin Journey Stats API (B5.3)
 * 
 * GET /api/admin/journey-stats
 * 
 * Anonym reisestatistikk fra JourneyStat.
 * Den viktigste metrikken: fullføringsgrad per resonansnivå (validerer matchemotoren).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/requireAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Hent alle JourneyStat-rader
    const stats = await prisma.journeyStat.findMany({
      select: {
        outcome: true,
        resonanceLevel: true,
        daysCompleted: true,
        messageCount: true,
        bothActive: true,
        usedBliKjent: true,
      },
    });

    const total = stats.length;

    // Grupper etter outcome
    const byOutcome: Record<string, number> = {};
    for (const s of stats) {
      byOutcome[s.outcome] = (byOutcome[s.outcome] ?? 0) + 1;
    }

    // Grupper etter resonansnivå
    const byResonance: Record<string, number> = {};
    for (const s of stats) {
      byResonance[s.resonanceLevel] = (byResonance[s.resonanceLevel] ?? 0) + 1;
    }

    // Fullføringsgrad per resonansnivå
    // "Fullført" = found_each_other eller daysCompleted >= 30
    const completionRateByResonance: Record<string, { completed: number; total: number }> = {};
    for (const level of ['DEEP', 'STRONG', 'MODERATE', 'GENTLE']) {
      const levelStats = stats.filter((s) => s.resonanceLevel === level);
      const completed = levelStats.filter(
        (s) => s.outcome === 'found_each_other' || s.daysCompleted >= 30
      ).length;
      completionRateByResonance[level] = { completed, total: levelStats.length };
    }

    return NextResponse.json({
      total,
      byOutcome,
      byResonance,
      completionRateByResonance,
    });
  } catch (error) {
    console.error('[admin/journey-stats] Feil:', error);
    return NextResponse.json(
      { error: 'Kunne ikke hente reisestatistikk' },
      { status: 500 }
    );
  }
}