/**
 * ToSom — Send telefonverifiseringskode
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = (body.phone as string)?.trim();

    // Valider telefonnummer (enkel regex for internasjonale format)
    if (!phone || !/^\+?[0-9]{7,15}$/.test(phone.replace(/[\s-]/g, ''))) {
      return NextResponse.json(
        { error: 'Ugyldig telefonnummer' },
        { status: 400 }
      );
    }

    // Finn eller opprett bruker basert på telefon
    let user = await prisma.user.findFirst({
      where: { phone },
    });

    if (!user) {
      // Finn bruker basert på e-post (allereie oppretta via magic-link)
      // eller opprett ny
      user = await prisma.user.create({
        data: {
          email: `temp_${Date.now()}@placeholder.local`,
          phone,
          verified: true,
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
      { error: 'Kunne ikkje sende kode' },
      { status: 500 }
    );
  }
}