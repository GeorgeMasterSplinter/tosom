/**
 * ToSom — Chat Conversation API
 * 
 * GET /api/chat/conversations/[id] — hent samtale-info
 * POST /api/chat/conversations/[id] — oppdater samtale
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: any
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Uautorisert' }, { status: 401 });
    }

    const id = context?.params?.id;
    const conversationId = id;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        userA: {
          select: {
            id: true,
            email: true,
            profile: { select: { identityName: true, photoUrl: true } },
          },
        },
        userB: {
          select: {
            id: true,
            email: true,
            profile: { select: { identityName: true, photoUrl: true } },
          },
        },
        messages: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
          take: 200,
          select: {
            id: true,
            content: true,
            type: true,
            createdAt: true,
            readAt: true,
            senderId: true,
            sender: {
              select: {
                profile: { select: { identityName: true } },
              },
            },
          },
        },
        resonanceSessions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Samtalen finnes ikke' }, { status: 404 });
    }

    // Sjekk at brukeren er en av partene i samtalen
    const userId = session.user.id;
    if (userId !== conversation.userAId && userId !== conversation.userBId) {
      return NextResponse.json({ error: 'Du har ikke tilgang til denne samtalen' }, { status: 403 });
    }

    const myId = userId;
    const partnerId = userId === conversation.userAId ? conversation.userBId : conversation.userAId;
    const partner = userId === conversation.userAId ? conversation.userB : conversation.userA;

    // Beregn resonans
    const latestResonance = conversation.resonanceSessions[0];
    const resonanceScore = latestResonance
      ? Math.round((latestResonance.depthLevel / 10) * 100)
      : 0;

    // Beregn dager i reisen
    const journeyStart = conversation.createdAt;
    const daysElapsed = Math.floor(
      (Date.now() - journeyStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const currentDay = Math.min(daysElapsed + 1, 30);
    const daysRemaining = Math.max(30 - currentDay, 0);

    // Bestem fase basert på dager
    let phaseLabel = 'Fase 1 — Introduksjon';
    let phaseOrder = 1;
    if (currentDay > 21) {
      phaseLabel = 'Fase 4 — Fremtid';
      phaseOrder = 4;
    } else if (currentDay > 14) {
      phaseLabel = 'Fase 3 — Dypere samtaler';
      phaseOrder = 3;
    } else if (currentDay > 7) {
      phaseLabel = 'Fase 2 — Trygghet';
      phaseOrder = 2;
    }

    return NextResponse.json({
      id: conversation.id,
      userAId: conversation.userAId,
      userBId: conversation.userBId,
      partnerId,
      partner: {
        id: partner.id,
        email: partner.email,
        name: partner.profile?.identityName || 'Ukjent',
        photoUrl: partner.profile?.photoUrl,
      },
      phaseLabel,
      phaseOrder,
      currentDay,
      daysRemaining,
      resonanceScore,
      isSafe: true,
      imageShareAllowed: conversation.imageShared || false,
      messages: conversation.messages,
    });
  } catch (error) {
    console.error('GET /api/chat/conversations/[id] feil:', error);
    return NextResponse.json(
      { error: 'Kunne ikke hente samtale' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, context: any) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Uautorisert' }, { status: 401 });
    }

    const id = context?.params?.id;
    const conversationId = id;
    const body = await request.json();
    const { action, data } = body as { action?: string; data?: unknown };

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { userAId: true, userBId: true },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Samtalen finnes ikke' }, { status: 404 });
    }

    const userId = session.user.id;
    if (userId !== conversation.userAId && userId !== conversation.userBId) {
      return NextResponse.json({ error: 'Du har ikke tilgang' }, { status: 403 });
    }

    if (action === 'markRead') {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          ...(userId === conversation.userAId
            ? { unreadCountA: 0 }
            : { unreadCountB: 0 }),
        },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'freeze') {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          frozenAt: new Date(),
          frozenBy: userId,
        },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Ukjent handling' }, { status: 400 });
  } catch (error) {
    console.error('POST /api/chat/conversations/[id] feil:', error);
    return NextResponse.json(
      { error: 'Kunne ikke oppdatere samtale' },
      { status: 500 }
    );
  }
}