/**
 * ToSom — Vipps OAuth Callback Endpoint
 * Handsamer tilbakekalling frå Vipps og opprettar/oppdaterar brukar-session.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    // Sjekk om Vipps returnerte ein feil
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
      const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/login?error=${encodeURIComponent('Vipps er ikkje konfigurert')}`;
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
      const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/login?error=${encodeURIComponent('Kunne ikkje autentisere med Vipps')}`;
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
        `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/login?error=${encodeURIComponent('Kunne ikkje hente brukerinformasjon')}`
      );
    }

    const userInfo = await userInfoResponse.json();
    
    // Finn eller opprett brukar (identisk med Google OAuth)
    const email = userInfo.email || userInfo.sub;
    if (!email) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/login?error=${encodeURIComponent('Ingen e-post mottatt frå Vipps')}`
      );
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Opprett ny brukar
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
      // Oppdater eksisterande brukar med profil
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

    // Session lagd via cookie — sjå under
    
    // Lagre sesjon i cookies (bruk eksisterande auth-module sin logikk)
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/dashboard`;
    const response = NextResponse.redirect(dashboardUrl);
    response.cookies.set('tosom_session', String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 dagar
     });

    return response;
  } catch (error) {
    console.error('Vipps callback feil:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://app.tosom.no'}/login?error=${encodeURIComponent('Intern feil under Vipps-autentisering')}`
    );
  }
}