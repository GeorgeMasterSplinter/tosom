import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/requireAuth';
import { getPhaseForDay } from '@/lib/journey/engine';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/journeys/timeline
 * Body: { matchId?: string, userId?: string, targetDay: number (1-30) }
 * 
 * Setter reise(r) til en spesifikk dag (Time Machine).
 * - matchId: setter BEGGE brukere i matchen til samme dag
 * - userId: setter kun én bruker
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { matchId, userId, targetDay } = await req.json();

    if (!targetDay) {
      return NextResponse.json({ error: 'targetDay kreves' }, { status: 400 });
    }
    if (!matchId && !userId) {
      return NextResponse.json({ error: 'matchId eller userId kreves' }, { status: 400 });
    }

    const day = Math.max(1, Math.min(30, parseInt(targetDay, 10)));
    const now = new Date();
    const nextDayAt = day < 30 ? new Date(now.getTime() + 24 * 60 * 60 * 1000) : null;
    const { phase } = getPhaseForDay(day);

    // Collect journeys to update
    let journeys: any[] = [];
    let names: string[] = [];

    if (matchId) {
      // Find both users in the match
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          userA: { select: { id: true, email: true, name: true, profile: { select: { identityName: true, firstName: true } } } },
          userB: { select: { id: true, email: true, name: true, profile: { select: { identityName: true, firstName: true } } } },
        },
      });
      if (!match) {
        return NextResponse.json({ error: 'Match ikke funnet' }, { status: 404 });
      }

      for (const user of [match.userA, match.userB]) {
        const journey = await prisma.journeyProgress.findFirst({
          where: { userId: user.id, endedAt: null },
        });
        if (journey) {
          journeys.push(journey);
          names.push(user.profile?.identityName || user.profile?.firstName || user.name || user.email);
        }
      }
    } else if (userId) {
      const journey = await prisma.journeyProgress.findFirst({
        where: { userId, endedAt: null },
      });
      if (!journey) {
        return NextResponse.json({ error: 'Ingen aktiv reise funnet for denne brukeren' }, { status: 404 });
      }
      journeys.push(journey);
      names.push(userId);
    }

    if (journeys.length === 0) {
      return NextResponse.json({ error: 'Ingen aktive reiser funnet' }, { status: 404 });
    }

    // Update each journey
    const results: any[] = [];
    for (const journey of journeys) {
      const updated = await prisma.journeyProgress.update({
        where: { id: journey.id },
        data: {
          day,
          phase,
          completedDays: day - 1,
          nextDayAt,
          startedAt: journey.startedAt ?? now,
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

      // Ensure past milestones exist
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

      results.push({
        userId: journey.userId,
        day: updated.day,
        phase: updated.phase,
      });
    }

    return NextResponse.json({
      success: true,
      names,
      journeys: results,
    });
  } catch (error) {
    console.error('POST /api/admin/journeys/timeline error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
