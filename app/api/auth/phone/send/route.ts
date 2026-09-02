/**
 * Tosom — Send telefonverifiseringskode
 * 
 * POST /api/auth/phone/send
 * - Valider telefonnummer
 * - Generer 6-sifret kode
 * - Lagre i PhoneVerification med 10 min utløp
 * - (Placeholder: console.log for SMS)
 * - Returner { ok: true }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAuthRateLimit } from '@/lib/rate-limit';
import { tryParseJsonBody } from '@/lib/api/validation';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Hent IP-adresse for rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip') 
      || undefined;

    const body = await tryParseJsonBody(req);
    if (!body) {
      return NextResponse.json({ error: 'Ugyldig body' }, { status: 400 });
    }
    const phone = (body.phone as string)?.trim();
    const termsAccepted = body.termsAccepted === true; // B4.1: Vilkår må aksepteres

    // Valider telefonnummer (enkel regex for internasjonale format)
    if (!phone || !/^\+?[0-9]{7,15}$/.test(phone.replace(/[\s-]/g, ''))) {
      return NextResponse.json(
        { error: 'Ugyldig telefonnummer' },
        { status: 400 }
      );
    }

    // B4.1: Vilkårssamtykke kreves ved registrering
    if (!termsAccepted) {
      return NextResponse.json(
        { error: 'Du må akseptere vilkårene for bruk for å registrere deg.' },
        { status: 400 }
      );
    }

    // STEG 2.5: Distribuert rate limiting med Upstash Redis (fallback in-memory)
    const rl = await checkAuthRateLimit('phone/send', phone);
    if (!rl.success) {
      return NextResponse.json(
        { error: `For mange forsøk. Prøv igjen om ${rl.retryAfter ?? 60} sekunder.` },
        { status: 429 }
      );
    }

    // Finn eller opprett bruker basert på telefon
    let user = await prisma.user.findFirst({
      where: { phone },
    });

    if (!user) {
      // Finn bruker basert på e-post (allerede oppretta via magic-link)
      // eller opprett ny — B4.1: lagre vilkårssamtykke
      user = await prisma.user.create({
        data: {
          email: `temp_${Date.now()}@placeholder.local`,
          phone,
          verified: true,
          termsAcceptedAt: new Date(),
          termsVersion: '2026-08-15', // B4.1: versjon som dato-streng
        },
      });
    } else if (!user.termsAcceptedAt) {
      // Eksisterende bruker uten vilkårssamtykke — oppdater
      await prisma.user.update({
        where: { id: user.id },
        data: {
          termsAcceptedAt: new Date(),
          termsVersion: '2026-08-15',
        },
      });
    }

    // Generer 6-sifret kode
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 min gyldig

    // Slett gamle kodar
    await prisma.phoneVerification.deleteMany({
      where: { phone },
    });

    // Lagre ny kode
    await prisma.phoneVerification.create({
      data: {
        userId: user.id,
        phone,
        code,
        expiresAt,
      },
    });

    // Placeholder: Send SMS (erstatt med Twilio/Infobip/sendgrid når klar)
    console.log(`[SMS-KODE til ${phone}]: ${code}`);

    return NextResponse.json({
      ok: true,
      message: 'Kode sendt',
    });
  } catch (err) {
    console.error('Phone send feil:', err);
    return NextResponse.json(
      { error: 'Kunne ikke sende kode' },
      { status: 500 }
    );
  }
}