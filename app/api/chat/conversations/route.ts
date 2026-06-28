/**
 * ToSom — Chat Conversations API (upgradert)
 * 
 * GET  /api/chat/conversations — hent alle samtalar for bruker (sanntid)
 * POST /api/chat/conversations — opprett eller hent eksisterande samtale
 */

import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getUserConversations, getOrCreateConversation } from '@/lib/chat/conversationService';
import { triggerConversationUpdated } from '@/lib/pusher/server';

/* ------ GET: Hent samtalar for bruker ------ */

export async function GET() {
  try {
     const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });
    }

    const conversations = await getUserConversations(session.user.id);
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('GET /api/chat/conversations feil:', error);
    return NextResponse.json({ error: 'Kunne ikke hente samtalar' }, { status: 500 });
  }
}

/* ------ POST: Opprett eller finn eksisterande samtale ------ */

export async function POST(req: NextRequest) {
  try {
     const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });
    }

    const body = await req.json();
    const { otherUserId } = body;
    const userId = session.user.id;

    if (!otherUserId) {
      return NextResponse.json({ error: 'Manglar otherUserId' }, { status: 400 });
    }

    if (userId === otherUserId) {
      return NextResponse.json({ error: 'Kan ikkje oppta samtale med deg sjølv' }, { status: 400 });
    }

    // Finn eller opprett samtale
    const convo = await getOrCreateConversation(userId, otherUserId);

    // Trigger at samtalen er oppdatert for begge brukarar
    await triggerConversationUpdated(userId, convo.id);
    await triggerConversationUpdated(otherUserId, convo.id);

    return NextResponse.json(convo);
  } catch (error) {
    if (error instanceof Error && error.message === 'CANNOT_CREATE_SAME_USER') {
      return NextResponse.json({ error: 'Kan ikkje oppta samtale med deg sjølv' }, { status: 400 });
    }
    console.error('POST /api/chat/conversations feil:', error);
    return NextResponse.json({ error: 'Kunne ikke opprette samtale' }, { status: 500 });
  }
}