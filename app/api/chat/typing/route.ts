/**
 * ToSom — Typing Indicator API
 * 
 * POST /api/chat/typing
 * Marker at ein brukar skriv ein melding.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, isTyping } = body;

    if (!conversationId || isTyping === undefined) {
      return NextResponse.json(
        { error: 'Manglar conversationId eller isTyping' },
        { status: 400 }
      );
    }

    // TODO: I framtida publisere typing-event via Pusher
    // For no: berre returnere suksess
    return NextResponse.json({ success: true, isTyping });
  } catch {
    return NextResponse.json(
      { error: 'Internt feil' },
      { status: 500 }
    );
  }
}