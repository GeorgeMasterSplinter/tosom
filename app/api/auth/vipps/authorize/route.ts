/**
 * ToSom — Vipps OAuth Authorization Endpoint
 * Startar Vipps-login-flyten for brukarar.
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const vippsClientId = process.env.VIPPS_CLIENT_ID;
    
    if (!vippsClientId) {
      return NextResponse.json(
        { error: 'Vipps er ikkje konfigurert' },
        { status: 503 }
      );
    }

    // Generer state parameter for CSRF-beskyttelse
    const state = Buffer.from(Date.now().toString()).toString('base64url');
    
    // Lagre state i cookie for validering på callback
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/api/auth/vipps/callback`;
    
    const authUrl = new URL('https://auth.vipps.no/authorization/oauth/authorize');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', vippsClientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'openid profile email');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('response_mode', 'query');

    // Returnerer URL med cookie for state-validering
    const response = NextResponse.json({ authorizeUrl: authUrl.toString(), state });
    response.cookies.set('vipps_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 300, // 5 minutt
    });

    return response;
  } catch (error) {
    console.error('Vipps authorize feil:', error);
    return NextResponse.json(
      { error: 'Kunne ikkje starte Vipps-autorisasjon' },
      { status: 500 }
    );
  }
}