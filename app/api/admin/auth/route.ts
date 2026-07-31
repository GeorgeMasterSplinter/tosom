import { NextRequest, NextResponse } from 'next/server';

/**
 * ToSom — Admin Auth API
 * 
 * POST /api/admin/auth
 * Credentials-basert autentisering med admin_token-cookie.
 * 
 * Brukar: George
 * Passord: Imposeneversnatch26
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Hent creds frå miljøvariablar (eller bruk standard)
    const adminEmail = process.env.ADMIN_EMAIL || 'George';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Imposeneversnatch26';

    // Valider credentials
    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Ugyldige innloggingopplysningar' },
        { status: 401 }
      );
    }

    // Set session-cookie (httpOnly, secure-ish, sameSite=strict, 24h)
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', 'valid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 timer
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Ugyldig forespursel' },
      { status: 400 }
    );
  }
}