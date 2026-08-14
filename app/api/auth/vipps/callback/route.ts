/**
 * ToSom — Vipps OAuth Callback Endpoint
 * Handsamer tilbakekalling frå Vipps og opprettar/oppdaterar bruker-session.
 * 
 * STEG 2.1: Fjernet manuell base64-sesjonscookie. Bruker nå NextAuth signIn() 
 * for å utstede signert JWT-token via authjs sin egen mekanisme.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { signIn } from '@/lib/auth/config';
import { isRegistrationEnabled } from '@/config/features';

export const dynamic = 'force-dynamic';

/**
 * Verifier Vipps state mot cookie for å beskytte mot CSRF.
 * State lagres som "rawValue.hash" i cookie, og vi sjekker at:
 * 1. State fra URL matcher raw-value i cookie
 * 2. HMAC-hash er gyldig (ikke manipulert)
 */
function verifyVippsState(stateFromUrl: string | null, cookies: Map<string, string>): boolean {
  if (!stateFromUrl) return false;
  
  const cookieValue = cookies.get('vipps_state');
  if (!cookieValue) return false;

  const [rawState, storedHash] = cookieValue.split('.');
  if (!rawState || !storedHash) return false;

  // Verifiser at state ikke er manipulert
  const secret = process.env.NEXTAUTH_SECRET || '';
  const expectedHash = crypto.createHmac('sha256', secret).update(rawState).digest('hex');
  
  // Konstant-tid sammenligning for å unngå timing attacks
  if (storedHash.length !== expectedHash.length) return false;
  
  let match = true;
  for (let i = 0; i < storedHash.length; i++) {
    if (storedHash[i] !== expectedHash[i]) match = false;
  }
  if (!match) return false;

  // Verifiser at state fra URL matcher den lagrede state-verdien
  return rawState === stateFromUrl;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    // Hent cookies fra request som Map for enkel oppslag
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = new Map<string, string>(
      cookieHeader.split(';')
        .map(c => c.trim())
        .filter(c => c.length > 0)
        .map(c => c.split('=').map(s => s.trim()))
        .filter((p): p is [string, string] => p.length === 2)
    );

    // CSRF-beskyttelse: Verifiser state mot cookie før videre processing
    if (!verifyVippsState(state, cookies)) {
      console.warn('[vipps/callback] State-verifikasjon feilet - mulig CSRF-angrep');
      const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/login?error=${encodeURIComponent('Ugyldig sikkerhetstoken. Prøv på nytt.')}`;
      const response = NextResponse.redirect(loginUrl);
      // Slett eventuell ugyldig state-cookie
      response.cookies.set('vipps_state', '', { maxAge: 0 });
      return response;
    }

    // Sjekk om Vipps returnerte en feil
    if (error) {
      const errorDesc = url.searchParams.get('error_description') || 'Ukjent feil';
      const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/login?error=${encodeURIComponent(errorDesc)}`;
      return NextResponse.redirect(loginUrl);
    }

    if (!code) {
      const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/login?error=${encodeURIComponent('Ingen autorisasjonskode mottatt')}`;
      return NextResponse.redirect(loginUrl);
    }

    const vippsClientId = process.env.VIPPS_CLIENT_ID;
    const vippsClientSecret = process.env.VIPPS_CLIENT_SECRET;

    if (!vippsClientId || !vippsClientSecret) {
      const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/login?error=${encodeURIComponent('Vipps er ikke konfigurert')}`;
      return NextResponse.redirect(loginUrl);
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/api/auth/vipps/callback`;

    // Tukken exchange kode for access_token
    const tokenResponse = await fetch('https://auth.vipps.no/access_token/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${vippsClientId}:${vippsClientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        scope: 'openid profile email',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Vipps token exchange failed:', errorText);
      const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/login?error=${encodeURIComponent('Kunne ikke autentisere med Vipps')}`;
      return NextResponse.redirect(loginUrl);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Hent bruker-info med access_token
    const userinfoHost = process.env.VIPPS_HOST || 'api.vipps.no';
    const userInfoResponse = await fetch(`https://${userinfoHost}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error('Vipps userinfo feil:', await userInfoResponse.text());
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/login?error=${encodeURIComponent('Kunne ikke hente brukerinformasjon')}`
      );
    }

    const userInfo = await userInfoResponse.json();
    
    // Finn eller opprett bruker (identisk med Google OAuth)
    const email = userInfo.email || userInfo.sub;
    if (!email) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/login?error=${encodeURIComponent('Ingen e-post mottatt frå Vipps')}`
      );
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // B0.6 — Kill switch: REGISTRATION_ENABLED=false stenger nye registreringar
      if (!isRegistrationEnabled()) {
        await prisma.systemLog.create({
          data: {
            level: 'INFO',
            message: 'Registrering stanset av kill switch (REGISTRATION_ENABLED=false)',
            module: 'auth:vipps',
            metadata: { skipped: true, reason: 'registration_disabled' },
          },
        });
        return NextResponse.json(
          { error: 'Registreringen er midlertidig stengt. Velkommen tilbake litt senere.' },
          { status: 503 }
        );
      }

      // Opprett ny bruker
      const name = userInfo.name || userInfo.given_name || 'Ny Brukar';
      user = await prisma.user.create({
        data: {
          email,
          name,
          verified: true, // Vipps-verifisert automatisk
          profile: {
            create: {
              identityName: name.split(' ')[0] || '',
              age: 30,
              deepProfileStep: 'IDENTITY',
            },
          },
        },
      });

      await prisma.auditLog.create({
        data: {
          adminId: user.id,
          action: 'ADMIN_LOGIN', // eller eigen audit-action for OAuth-registrering
          metadata: JSON.stringify({ method: 'vipps_oauth', registered: true }),
        },
      });
    } else {
      // Oppdater eksisterande bruker med profil
      const profileUpdateData: any = {};
      if (userInfo.name) {
        profileUpdateData.identityName = userInfo.name.split(' ')[0];
      }
      if (userInfo.email) {
        profileUpdateData.bio = `Inngangen via Vipps ${new Date().toISOString().split('T')[0]}`;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          profile: {
            update: {
              data: profileUpdateData,
            },
          },
        },
      });

      await prisma.auditLog.create({
        data: {
          adminId: user.id,
          action: 'ADMIN_LOGIN',
          metadata: JSON.stringify({ method: 'vipps_oauth' }),
        },
      });
    }

    // STEG 2.1: Bruk NextAuth signIn() for å utstede signert JWT-token i stedet for manuell base64-cookie
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/dashboard`;
    const response = NextResponse.redirect(dashboardUrl);

    // Bruk NextAuth signIn med credentials for å utstede signert token
    await signIn('credentials', {
      email: user.email,
      redirect: false,
      redirectTo: dashboardUrl,
    });

    // Slett state-cookie etter bruk
    response.cookies.set('vipps_state', '', { maxAge: 0 });

    return response;
  } catch (error) {
    console.error('Vipps callback feil:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/login?error=${encodeURIComponent('Intern feil under Vipps-autentisering')}`
    );
  }
}