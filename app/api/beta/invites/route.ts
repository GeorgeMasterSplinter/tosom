/**
 * Tosom — Admin: Invitasjonsport (BETA-ACCESS §3.3)
 *
 * GET  /api/beta/invites   → liste alle invitasjoner
 * POST /api/beta/invites   → { emails: string[], note? } → legg til (idempotent)
 *
 * Bak adminAuthGuard().
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminAuthGuard } from '@/lib/auth/adminAuthGuard';

export const dynamic = 'force-dynamic';

export async function GET() {
  const denied = await adminAuthGuard();
  if (denied) return denied;

  try {
    const invites = await prisma.betaInvite.findMany({
      orderBy: { invitedAt: 'desc' },
      take: 500,
    });
    return NextResponse.json({ invites });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = await adminAuthGuard();
  if (denied) return denied;

  try {
    const body = await req.json().catch(() => ({}));
    const emails = Array.isArray((body as Record<string, unknown>)?.emails)
      ? ((body as Record<string, unknown>).emails as unknown[]).filter(
          (e): e is string => typeof e === 'string' && e.trim().length > 0
        )
      : [];
    const note = typeof (body as Record<string, unknown>)?.note === 'string'
      ? ((body as Record<string, unknown>).note as string).slice(0, 500)
      : null;

    if (emails.length === 0) {
      return NextResponse.json({ error: 'Ingen e-poster gitt' }, { status: 400 });
    }

    // Idempotent: upsert per e-post (lowercase/trim)
    let created = 0;
    let existing = 0;
    for (const raw of emails) {
      const email = raw.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) continue;
      const before = await prisma.betaInvite.findUnique({ where: { email }, select: { id: true } });
      await prisma.betaInvite.upsert({
        where: { email },
        update: before ? {} : { note },
        create: { email, note },
      });
      if (before) existing++;
      else created++;
    }

    return NextResponse.json({ ok: true, created, existing, total: emails.length });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
