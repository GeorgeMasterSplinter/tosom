/**
 * ToSom — Presence Get API (Partner Presence v2026) 🟡⭐
 * 
 * GET /api/presence/get/[id]
 * Returnerer presence state for ein spesifikk bruker.
 * Krev auth via session.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { getPresence } from '@/lib/presence/presenceState';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Krever authentisering
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Ikke autentisert' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const presence = getPresence(id);

    if (!presence) {
      // Ingen state funnet — returner default "offline"
      return NextResponse.json({
        userId: id,
        isOnline: false,
        isTyping: false,
        lastSeen: null,
      });
    }

    return NextResponse.json({
      userId: presence.userId,
      isOnline: presence.isOnline,
      isTyping: presence.isTyping,
      lastSeen: presence.lastSeen,
    });

  } catch (error) {
    console.error('Feil ved henting av presence:', error);
    return NextResponse.json(
      { error: 'Intern feil' },
      { status: 500 }
    );
  }
}