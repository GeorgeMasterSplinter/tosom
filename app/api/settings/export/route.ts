/**
 * ToSom — Data Export (STEG C5)
 *
 * GET /api/settings/export
 * GDPR art. 20 (dataportabilitet).
 *
 * Returnerer JSON med profil, svar, aktiv reise og meldinger.
 * Kun brukerens egne data. Rate-limitet via enkel teller.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

// Enkel rate-limiter (in-memory)
const exportRateLimit = new Map<string, number[]>();

function checkExportLimit(userId: string): boolean {
  const now = Date.now();
  const timestamps = exportRateLimit.get(userId) || [];
  const recent = timestamps.filter((t) => now - t < 300_000); // 5 minutter
  if (recent.length >= 1) return false; // Maks 1 export per 5 min
  recent.push(now);
  exportRateLimit.set(userId, recent);
  return true;
}

export async function GET(req: NextRequest) {
  try {
    // 1. Auth
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Uautorisert' }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Rate limiting
    if (!checkExportLimit(userId)) {
      return NextResponse.json(
        { error: 'For hyppig export. Vent 5 minutter.' },
        { status: 429 }
      );
    }

    // 3. Hent all bruker-data
    const [user, profile, messages, journeys, notifications] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, phone: true, createdAt: true, role: true },
      }),
      prisma.profile.findUnique({ where: { userId } }),
      prisma.message.findMany({
        where: { senderId: userId },
        select: { id: true, content: true, type: true, createdAt: true, conversationId: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.journeyProgress.findMany({
        where: { userId },
        include: { milestones: true },
      }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ]);

    // 4. Bygg export-pakke
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        email: user?.email,
        name: user?.name,
        phone: user?.phone,
        createdAt: user?.createdAt,
        role: user?.role,
      },
      profile: profile ? {
        age: profile.age,
        bio: profile.bio,
        interests: profile.interests,
        lifeRhythm: profile.lifeRhythm,
        relationshipStyle: profile.relationshipStyle,
        maturityLevel: profile.maturityLevel,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      } : null,
      messages: messages.map((m) => ({
        id: m.id,
        content: m.content,
        type: m.type,
        sentAt: m.createdAt.toISOString(),
        conversationId: m.conversationId,
      })),
      journeys: journeys.map((j) => ({
        matchId: j.matchId,
        phase: j.phase,
        day: j.day,
        completedDays: j.completedDays,
        startedAt: j.startedAt.toISOString(),
        endedAt: j.endedAt?.toISOString() || null,
        milestones: j.milestones.map((ml) => ({
          day: ml.day,
          title: ml.title,
          summary: ml.summary,
        })),
      })),
      notifications: notifications.map((n) => ({
        type: n.type,
        message: n.message,
        readAt: n.readAt?.toISOString() || null,
        createdAt: n.createdAt.toISOString(),
      })),
    };

    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="tosom-export-${userId.slice(0, 8)}.json"`,
      },
    });
  } catch (error) {
    console.error('[export] Feil:', error);
    return NextResponse.json({ error: 'Kunne ikke eksportere data' }, { status: 500 });
  }
}