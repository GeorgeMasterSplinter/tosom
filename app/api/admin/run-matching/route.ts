/**
 * POST /api/admin/run-matching
 *
 * B-3: Manuell matching for beta.
 * Trigger matcherunden on-demand i stedet for å vente til lørdag natt.
 *
 * Krever admin-autentisering. Kaller /api/cron/matching internt med
 * CRON_SECRET — samme kodevei, samme sikkerhet, samme logging.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { castToAdminUser } from '@/lib/auth/admin-auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // Admin-autentisering
    const result = await requireAuth(req);
    if (result instanceof NextResponse) return result;
    const adminUser = castToAdminUser(result.user);
    if (adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Bare admin kan kjøre matching' }, { status: 403 });
    }

    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      return NextResponse.json({ error: 'CRON_SECRET ikke konfigurert' }, { status: 500 });
    }

    // Kall matcherunden internt (samme kodevei som Vercel Cron)
    const baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/cron/matching`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cronSecret}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Matcherunden feilet', details: data },
        { status: res.status }
      );
    }

    return NextResponse.json({
      ok: true,
      message: data.deferred
        ? `Runden ble deferert: ${data.queueSize} i kø (trenger minst 2)`
        : `Matcherunde fullført: ${data.paired} par koblet, ${data.remaining} igjen i kø`,
      result: data,
    });
  } catch (error) {
    console.error('[POST /api/admin/run-matching] Error:', error);
    return NextResponse.json(
      { error: 'Kunne ikke kjøre matching', details: (error as Error).message },
      { status: 500 }
    );
  }
}