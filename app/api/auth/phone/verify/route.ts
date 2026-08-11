/**
 * ToSom — Verifiser telefonkode
 * 
 * POST /api/auth/phone/verify
 * - Finn kode i DB
 * - Sjekk utløp
 * - Marker usedAt
 * - Oppdater bruker: phoneVerified = true
 * - Set cookie-session
 * - Redirect til /onboarding/payment
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkVerifyRateLimit } from '@/lib/security/phoneRateLimit';
import { signIn } from '@/lib/auth/config';

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

    // Rate limiting med lockout
    const rateLimit = checkVerifyRateLimit(phone);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: rateLimit.lockedOut 
            ? 'For mange feilforsøk. Konto låst i 30 minutter.' 
            : `Prøv igjen om ${rateLimit.retryAfter} sekunder.`,
          lockedOut: rateLimit.lockedOut,
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
        { error: 'Brukar ikkje funnen' },
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

    // Opprett NextAuth-session via signIn i stedet for manuelt cookie
    try {
      await signIn('credentials', {
        email: user.email,
        password: 'phone-verified-' + user.id, // Intern mekanisme, ikke passord-basert
        redirect: false,
      });
    } catch {
      // Fallback: signer cookie med NextAuth-secret istedenfor plaintext user.id
      const crypto = await import('crypto');
      const secret = process.env.NEXTAUTH_SECRET || '';
      const sessionToken = crypto.createHash('sha256').update(user.id + secret).digest('hex');
      
      const response = NextResponse.redirect(new URL('/onboarding/payment', req.url));
      response.cookies.set('next-auth.session-token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 timer
        path: '/',
      });
      return response;
    }

    return NextResponse.redirect(new URL('/onboarding/payment', req.url));
  } catch (err) {
    console.error('Phone verify feil:', err);
    return NextResponse.json(
      { error: 'Kunne ikkje verifisere telefon' },
      { status: 500 }
    );
  }
}