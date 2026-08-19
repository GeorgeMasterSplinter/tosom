/**
 * Tosom — Vipps OAuth Authorization Endpoint
 * Startar Vipps-login-flyten for brukere.
 */

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { features } from '@/config/features';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // S-2: Vipps er død kode (callback kaller fjernet CredentialsProvider). Skjult
    // bak VIPPS_ENABLED til fullverdig OAuth er implementert.
    if (!features.enableVipps) {
      return NextResponse.json(
        { error: 'Vipps-innlogging er ikke tilgjengelig enda' },
        { status: 503 }
      );
    }

    const vippsClientId = process.env.VIPPS_CLIENT_ID;
    
    if (!vippsClientId) {
      return NextResponse.json(
        { error: 'Vipps er ikke konfigurert' },
        { status: 503 }
      );
    }

    // Generer kryptografisk tilfeldig state for CSRF-beskyttelse
    const state = crypto.randomBytes(32).toString('base64url');
    
    // Lagre state i signert cookie for validering på callback
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/api/auth/vipps/callback`;
    
    const authUrl = new URL('https://auth.vipps.no/authorization/oauth/authorize');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', vippsClientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'openid profile email');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('response_mode', 'query');

    // Hash state + secret for signert lagring i cookie
    const secret = process.env.NEXTAUTH_SECRET || '';
    const stateHash = crypto.createHmac('sha256', secret).update(state).digest('hex');

    // Returner URL med signert cookie for state-validering
    const response = NextResponse.json({ authorizeUrl: authUrl.toString() });
    response.cookies.set('vipps_state', `${state}.${stateHash}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 300, // 5 minutter
    });

    return response;
  } catch (error) {
    console.error('Vipps authorize feil:', error);
    return NextResponse.json(
      { error: 'Kunne ikke starte Vipps-autorisasjon' },
      { status: 500 }
    );
  }
}