/**
 * Tosom — Samtykke (K-2)
 *
 * POST /api/consent — { terms: true, sensitive: true }
 * Aktiv aksept av vilkår + uttrykkelig samtykke til behandling av
 * særlige kategorier (GDPR art. 9) for matching.
 *
 * GET /api/consent — { needsConsent: boolean }
 * True når vilkårsversjonen er utdatert eller samtykket til særlige
 * kategorier mangler.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';
import { csrfCheck } from '@/lib/auth/csrf';
import { TERMS_VERSION } from '@/config/legal';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const ConsentSchema = z.object({
  terms: z.literal(true),
  sensitive: z.literal(true),
});

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Uautorisert' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { termsVersion: true, sensitiveConsentAt: true },
  });

  const needsConsent =
    !user || user.termsVersion !== TERMS_VERSION || user.sensitiveConsentAt === null;

  return NextResponse.json({ needsConsent });
}

export async function POST(req: NextRequest) {
  try {
    // CSRF først — samtykke er en skrivehandling med personverneffekt
    const csrf = await csrfCheck(req);
    if (csrf instanceof NextResponse) return csrf;

    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Uautorisert' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Mangler body' }, { status: 400 });
    }

    const parsed = ConsentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Ugyldig samtykke. Send { "terms": true, "sensitive": true }.' },
        { status: 400 }
      );
    }

    const now = new Date();
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        termsAcceptedAt: now,
        termsVersion: TERMS_VERSION,
        sensitiveConsentAt: now,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[consent] Feil:', error);
    return NextResponse.json({ error: 'Kunne ikke lagre samtykke' }, { status: 500 });
  }
}
