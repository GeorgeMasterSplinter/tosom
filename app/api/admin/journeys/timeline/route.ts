import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/requireAuth';
import { getPhaseForDay } from '@/lib/journey/engine';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/journeys/timeline
 * Body: { userId: string, targetDay: number (1-30) }
 * Setter en brukers reise til en spesifikk dag (Time Machine).
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { userId, targetDay } = await req.json();

    if (!userId || !targetDay) {
      return NextResponse.json({ error: 'userId og targetDay kreves' }, { status: 400 });
    }

    const day = Math.max(1, Math.min(30, parseInt(targetDay, 10)));

    const journey = await prisma.journeyProgress.findFirst({
      where: { userId, endedAt: null },
    });

    if (!journey) {
      return NextResponse.json({ error: 'Ingen aktiv reise funnet for denne brukeren' }, { status: 404 });
    }

    const { phase } = getPhaseForDay(day);
    const now = new Date();
    const nextDayAt = day < 30 ? new Date(now.getTime() + 24 * 60 * 60 * 1000) : null;

    const updated = await prisma.journeyProgress.update({
      where: { id: journey.id },
      data: {
        day,
        phase,
        completedDays: day - 1,
        nextDayAt,
        startedAt: journey.startedAt ?? now,
        // Ensure journey is "started" (both seen) so it shows in dashboards
        ...(day >= 1 && !journey.bothSeenAt ? {
          bothSeenAt: now,
          userASeenAt: journey.userASeenAt ?? now,
          userBSeenAt: journey.userBSeenAt ?? now,
        } : {}),
      },
    });

    // Remove future milestones
    await prisma.journeyMilestone.deleteMany({
      where: { progressId: journey.id, day: { gte: day } },
    });

    // Ensure past milestones exist (title/summary are required)
    for (let d = 1; d < day; d++) {
      const existing = await prisma.journeyMilestone.findFirst({
        where: { progressId: journey.id, day: d },
      });
      if (!existing) {
        await prisma.journeyMilestone.create({
          data: {
            progressId: journey.id,
            day: d,
            title: `Dag ${d}`,
            summary: `Automatisk opprettet (time machine)`,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      journey: {
        day: updated.day,
        phase: updated.phase,
        completedDays: updated.completedDays,
        nextDayAt: updated.nextDayAt?.toISOString() ?? null,
      },
    });
  } catch (error) {
    console.error('POST /api/admin/journeys/timeline error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
