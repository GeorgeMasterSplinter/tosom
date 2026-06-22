/**
 * ToSom — Magisk lenke API
 * 
 * POST /api/auth/magic-link
 * - Validerer e-post
 * - Genererer token
 * - Lagrer i DB
 * - Send e-post (placeholder)
 * - Returner { ok: true }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/* ========================
   POST — Send magisk lenke
   ======================== */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email as string)?.trim().toLowerCase();

    // Valider e-post
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Ugyldig e-postadresse' },
        { status: 400 }
      );
    }

    // Lagre e-post i database
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { email, verified: true },
      });
    }

    // Generer token
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 time gyldig

    // Slett gamle tokens
    await prisma.magicLinkToken.deleteMany({
      where: { email },
    });

    // Lagre nytt token
    await prisma.magicLinkToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    // Send e-post (placeholder — erstatt med sendgrid/resend når klar)
    // const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/magic-link/verify?token=${token}`;
    // await sendMagicLinkEmail(email, verifyUrl);

    // Returner ok — vi returnerer ikkje lenka her, brukaren får ein separat melding
    return NextResponse.json({
      ok: true,
      message: 'Sjekk e-posten din',
    });
  } catch (err) {
    console.error('Magic-link POST feil:', err);
    return NextResponse.json(
      { error: 'Kunne ikkje sende magisk lenke' },
      { status: 500 }
    );
  }
}