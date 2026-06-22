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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = (body.phone as string)?.trim();
    const code = (body.code as string)?.trim();

    // Valider input
    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Manglande telefon eller kode' },
        { status: 400 }
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

    // Marker som brukt
    await prisma.phoneVerification.update({
      where: { id: verification.id },
      data: { usedAt: new Date() },
    });

    // Oppdater bruker
    await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneVerified: true,
        phone,
      },
    });

    // Set cookie-session (next-auth style)
    const response = NextResponse.redirect(new URL('/onboarding/payment', req.url));
    response.cookies.set('next-auth.session.token', user.id, {
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
      { error: 'Kunne ikkje verifisere telefon' },
      { status: 500 }
    );
  }
}