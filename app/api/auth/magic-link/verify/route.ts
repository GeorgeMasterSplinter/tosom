/**
 * ToSom — Magisk lenke verify API
 * 
 * GET /api/auth/magic-link/verify?token=XYZ
 * - Finn token i DB
 * - Sjekk utløp
 * - Opprett/logg inn bruker
 * - Slett token
 * - Redirect til /onboarding/phone
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/* ========================
   GET — Verifiser magisk lenke
   ======================== */

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.redirect(new URL('/login?error=no-token', req.url));
    }

    // Finn token
    const magicToken = await prisma.magicLinkToken.findUnique({
      where: { token },
    });

    if (!magicToken) {
      return NextResponse.redirect(new URL('/login?error=invalid-token', req.url));
    }

    // Sjekk utløp
    if (magicToken.expiresAt < new Date()) {
      await prisma.magicLinkToken.delete({
        where: { id: magicToken.id },
      });
      return NextResponse.redirect(new URL('/login?error=token-expired', req.url));
    }

    // Finn eller opprett bruker
    let user = await prisma.user.findUnique({
      where: { email: magicToken.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: magicToken.email,
          verified: true,
          onboardingStep: 1,
          onboardingComplete: false,
        },
      });
    }

    // Slett token (brukbar ein gong)
    await prisma.magicLinkToken.delete({
      where: { id: magicToken.id },
    });

    // Merk at brukaren kom via magisk lenke
    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true },
    });

    // Set cookie-session (next-auth style)
    const response = NextResponse.redirect(new URL('/onboarding/phone', req.url));
    response.cookies.set('next-auth.session.token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 timer
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Magic-link verify feil:', err);
    return NextResponse.redirect(new URL('/login?error=server-error', req.url));
  }
}