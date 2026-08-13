/**
 * ToSom — GDPR Data Export Endpoint (STEG 8.3)
 * 
 * POST /api/settings/export
 * Henter all brukerens data og returnerer som nedlastbar JSON.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });
    }

    const userId = session.user.id;

    // Hent bruker + profil
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        onboardingComplete: true,
        deepProfileComplete: true,
        createdAt: true,
        updatedAt: true,
        lastMatchAt: true,
        profile: true,
      },
    });

    // Hent matcher
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId },
        ],
      },
      select: {
        id: true,
        status: true,
        score: true,
        resonanceLevel: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Hent konversasjoner
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId },
        ],
      },
      select: {
        id: true,
        createdAt: true,
        endedAt: true,
      },
    });

    // Hent meldinger (begrenset til siste 100)
    const messages = await prisma.message.findMany({
      where: { senderId: userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        content: true,
        type: true,
        createdAt: true,
        conversationId: true,
      },
    });

    // Hent varsler
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        type: true,
        message: true,
        readAt: true,
        createdAt: true,
      },
    });

    // Hent reise-progres
    const journey = await prisma.journeyProgress.findFirst({
      where: { userId },
      select: {
        id: true,
        phase: true,
        day: true,
        completedDays: true,
        startedAt: true,
        endedAt: true,
      },
    });

    // Samle alt i ett objekt
    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        phone: user?.phone,
        role: user?.role,
        onboardingComplete: user?.onboardingComplete,
        deepProfileComplete: user?.deepProfileComplete,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
        lastMatchAt: user?.lastMatchAt,
      },
      profile: user?.profile || null,
      matches: {
        count: matches.length,
        data: matches,
      },
      conversations: {
        count: conversations.length,
        data: conversations,
      },
      messages: {
        count: messages.length,
        data: messages,
      },
      notifications: {
        count: notifications.length,
        data: notifications,
      },
      journey,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="tosom-data-uttrekk.json"',
      },
    });
  } catch (error) {
    console.error('[export] Feil:', error);
    return NextResponse.json({ error: 'Kunne ikke hente data' }, { status: 500 });
  }
}

// GET metoden er ogsa tilgjengelig for direkte nedlasting fra browser
export async function GET(req: NextRequest) {
  return POST(req as unknown as NextRequest);
}