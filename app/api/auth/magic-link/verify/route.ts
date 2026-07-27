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

export const dynamic = 'force-dynamic';

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
    if (new Date() > magicToken.expiresAt) {
      await prisma.magicLinkToken.delete({
        where: { id: magicToken.id },
      });
      return NextResponse.redirect(new URL('/login?error=token-expired', req.url));
    }

    // Finn eller lag bruker
    let user: any = await prisma.user.findUnique({
      where: { email: magicToken.email },
      include: { profile: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: magicToken.email,
          verified: true,
          onboardingStep: 0,
          onboardingComplete: false,
          deepProfileComplete: false,
          profile: {
            create: {
              identityName: magicToken.email.split('@')[0] ?? 'User',
              age: 30,
              deepProfileStep: 'IDENTITY',
            },
          },
        },
      });
    }

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=server-error', req.url));
    }

    // Slett brukt token
    await prisma.magicLinkToken.delete({
      where: { id: magicToken.id },
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