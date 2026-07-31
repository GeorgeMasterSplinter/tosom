/**
 * GET /api/admin/session — Sjekk om admin er innlogga
 * 
 * Returnerer { authenticated: true/false }
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = req.cookies.get('admin_session');
    const isAuthenticated = !!session?.value;

    return NextResponse.json({
      authenticated: isAuthenticated,
    });
  } catch (error) {
    console.error('GET /api/admin/session feil:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Kunne ikkje sjekke sesjon.' },
      { status: 500 }
    );
  }
}