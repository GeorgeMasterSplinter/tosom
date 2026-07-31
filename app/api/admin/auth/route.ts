/**
 * POST /api/admin/auth — Admin autentisering
 * 
 * Credentials: George / Imposeneversnatch26
 * Returnerer session-token som lagres i cookie.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'George';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Imposeneversnatch26';
const SESSION_SECRET = process.env.SESSION_SECRET || 'tosom-admin-secret-2026';

// Simple session generator (production: use JWT or proper session library)
function generateSessionId(): string {
  const random = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now().toString(36);
  return `admin_${random}_${timestamp}`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { username, password } = body as { username?: string; password?: string };

    // Valider credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { ok: false, error: 'Ugyldig brukernamn eller passord.' },
        { status: 401 }
      );
    }

    // Generer session
    const sessionId = generateSessionId();
    
    // Set cookie (24 timar utgåing)
    const response = NextResponse.json({ ok: true, message: 'Innlogga' });
    response.cookies.set('admin_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 timar
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('POST /api/admin/auth feil:', error);
    return NextResponse.json(
      { ok: false, error: 'Kunne ikkje logge inn. Prøv igjen.' },
      { status: 500 }
    );
  }
}

export async function DELETE(): Promise<NextResponse> {
  try {
    const response = NextResponse.json({ ok: true, message: 'Utlogga' });
    response.cookies.delete('admin_session');
    return response;
  } catch (error) {
    console.error('DELETE /api/admin/logout feil:', error);
    return NextResponse.json(
      { ok: false, error: 'Kunne ikkje logge ut.' },
      { status: 500 }
    );
  }
}