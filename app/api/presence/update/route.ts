/**
 * Tosom — Presence Update API (Partner Presence v2026) 🟡⭐
 * 
 * PATCH /api/presence/update
 * Body: { isOnline?: boolean; isTyping?: boolean }
 * 
 * Oppdaterer presence state for pålogga bruker.
 * Krev auth via session.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { setOnline, setOffline, setTyping, clearTyping, getPresence } from '@/lib/presence/presenceState';
import { presenceUpdateSchema, errorResponse } from '@/lib/api-validator';

export async function PATCH(request: NextRequest) {
  try {
    // Krever authentisering
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Ikke autentisert' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // STEG 3: Zod-validering av body
    const validation = presenceUpdateSchema.safeParse({
      userId,
      ...(await request.json()),
    });
    if (!validation.success) {
      return errorResponse(
        `Valideringsfeil: ${validation.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')}`,
        400
      );
    }

    const body = validation.data;

    // Oppdater basert på body
    if (body.isOnline !== undefined) {
      if (body.isOnline) {
        setOnline(userId);
      } else {
        setOffline(userId);
      }
    }

    if (body.isTyping !== undefined) {
      if (body.isTyping) {
        setTyping(userId);
      } else {
        clearTyping(userId);
      }
    }

    // Returner oppdatert state
    const presence = getPresence(userId);

    return NextResponse.json({ 
      success: true,
      presence: presence || null
    });

  } catch (error) {
    console.error('Feil ved oppdatering av presence:', error);
    return NextResponse.json(
      { error: 'Intern feil' },
      { status: 500 }
    );
  }
}