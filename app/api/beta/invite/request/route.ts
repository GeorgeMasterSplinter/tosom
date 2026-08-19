/**
 * Tosom — Invitasjonsport: magic-link request (BETA-ACCESS §3)
 *
 * POST /api/beta/invite/request  { email }
 *
 * Primær-gate for lukket beta. Returnerer EN IDENTISK, rolig respons uansett
 * om adressen er invitert — ingen email-enumeration. Den virkelige sendingen
 * skjer i sendVerificationRequest (lib/auth/config.ts), som også gater på
 * BetaInvite. Her har vi i tillegg rate-limit (5 per 15 min per IP).
 */

import { NextRequest, NextResponse } from 'next/server';
import { isBetaInviteMode } from '@/config/features';
import { isInvitedEmail } from '@/lib/beta/invites';

export const dynamic = 'force-dynamic';

const CALM =
  'Tosom er i lukket beta. Vi åpner for flere etter hvert.';
const SENT =
  'Hvis adressen din er invitert, får du snart en lenke. Den er gyldig i 24 timer.';

const hits = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof (body as Record<string, unknown>)?.email === 'string'
      ? ((body as Record<string, unknown>).email as string)
      : '';

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ invited: false, message: CALM });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const now = Date.now();
    const rec = hits.get(ip);
    if (!rec || now - rec.windowStart > WINDOW_MS) {
      hits.set(ip, { count: 1, windowStart: now });
    } else if (rec.count >= MAX_HITS) {
      // Rate-limited: oppgi ikke invit-status (unngår enumeration)
      return NextResponse.json({ invited: false, message: CALM });
    } else {
      rec.count += 1;
    }

    const invited = isBetaInviteMode() ? await isInvitedEmail(email) : true;
    return NextResponse.json({ invited, message: invited ? SENT : CALM });
  } catch {
    return NextResponse.json({ invited: false, message: CALM });
  }
}
