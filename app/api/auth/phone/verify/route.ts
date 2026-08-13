/**
 * ToSom — Verifiser telefonkode
 * 
 * POST /api/auth/phone/verify
 * - Finn kode i DB
 * - Sjekk utløp
 * - Marker usedAt
 * - Oppdater bruker: phoneVerified = true
 * - Set cookie-session (HMAC-signert, identisk med Vipps-callback)
 * - Redirect til /onboarding/payment
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { checkAuthRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = (body.phone as string)?.trim();
    const code = (body.code as string)?.trim();

    // Valider input
    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Manglende telefon eller kode' },
        { status: 400 }
      );
    }

    // STEG 2.5: Distribuert rate limiting med Upstash Redis (fallback in-memory)
    const rl = await checkAuthRateLimit('phone/verify', phone);
    if (!rl.success) {
      return NextResponse.json(
        { 
          error: 'For mange forsøk. Prøv igjen senere.',
        },
        { status: 429 }
      );
    }

    // Finn aktive kode
    const verification = await prisma.phoneVerification.findFirst({
      where: {
        phone,
        code,
        usedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!verification) {
      return NextResponse.json(
        { error: 'Ugyldig eller manglande kode' },
        { status: 400 }
      );
    }

    // Sjekk utløp
    if (verification.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Koden har utløpt. Send ny kode.' },
        { status: 400 }
      );
    }

    // Finn bruker
    const user = await prisma.user.findUnique({
      where: { id: verification.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Brukar ikke funnen' },
        { status: 404 }
      );
    }

    // Marker som brukt og oppdater bruker i transaksjon
    await prisma.$transaction([
      prisma.phoneVerification.update({
        where: { id: verification.id },
        data: { usedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          phoneVerified: true,
          phone,
        },
      }),
    ]);

    // Opprett HMAC-signert session-token (samme mønster som Vipps-callback)
    const secret = process.env.NEXTAUTH_SECRET || '';
    const sessionToken = crypto.createHmac('sha256', secret).update(user.id + '-phone-verify').digest('hex');

    const response = NextResponse.redirect(new URL('/onboarding/payment', req.url));
    
    // Sett cookie (bruk samme navn som Vipps: tosom_session)
    response.cookies.set('tosom_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 timer
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Phone verify feil:', err);
    return NextResponse.json(
      { error: 'Kunne ikke verifisere telefon' },
      { status: 500 }
    );
  }
}