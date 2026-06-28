/**
 * ToSom — Chat Messages API (upgradert)
 * 
 * GET  /api/chat/messages?conversationId=xxx — hent alle meldingar i samtale
 * POST /api/chat/messages — send ny melding med Pusher-trigger
 */

import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { sendMessage, getMessages } from '@/lib/chat/messageService';

/* ------ GET: Hent meldingar ------ */

export async function GET(req: NextRequest) {
  try {
    const conversationId = req.nextUrl.searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: 'Manglar conversationId' }, { status: 400 });
    }

    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });
    }

    const messages = await getMessages(conversationId, session.user.id);
    return NextResponse.json(messages);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Du har ikkje tilgang til denne samtalen' }, { status: 403 });
    }
    console.error('GET /api/chat/messages feil:', error);
    return NextResponse.json({ error: 'Kunne ikke hente meldingar' }, { status: 500 });
  }
}

/* ------ POST: Send melding ------ */

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });
    }

    const body = await req.json();
    const { conversationId, content } = body;

    if (!conversationId || !content) {
      return NextResponse.json({ error: 'Manglar conversationId eller content' }, { status: 400 });
    }

    const message = await sendMessage({
      conversationId,
      senderId: session.user.id,
      content: content.trim(),
    });

    return NextResponse.json(message);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Du har ikkje tilgang til denne samtalen' }, { status: 403 });
    }
    console.error('POST /api/chat/messages feil:', error);
    return NextResponse.json({ error: 'Kunne ikke sende melding' }, { status: 500 });
  }
}