/**
 * POST /api/admin/broadcast
 *
 * Admin verktøy: send én felles epost til alle aktive brukere
 * (endringer, tilbud, informasjon). Beta: tak på 500 mottakere per send.
 *
 * Body: { subject: string, message: string }
 * Response: { ok, total, sent, failed }
 *
 * Admin-autorisasjon som alle andre admin-ruter (requireAdmin(request)).
 * Sendes sekvensielt (Resend rate-limit) og awaits fullstendig før
 * svaret — ellers drepes ufullendte sends av Vercel (serverless).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/requireAuth';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const BROADCAST_LIMIT = 500;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(req: NextRequest): Promise<Response> {
  // Admin-autentisering (kryptografisk verifisert admin_token)
  const authResult = await requireAdmin(req);
  if (authResult instanceof NextResponse) return authResult;

  let body: { subject?: unknown; message?: unknown };
  try {
    body = (await req.json()) as { subject?: unknown; message?: unknown };
  } catch {
    return NextResponse.json({ error: 'Ugyldig body' }, { status: 400 });
  }

  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!subject || subject.length > 100) {
    return NextResponse.json({ error: 'Emne må være 1–100 tegn' }, { status: 400 });
  }
  if (!message || message.length > 5000) {
    return NextResponse.json({ error: 'Melding må være 1–5000 tegn' }, { status: 400 });
  }

  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    select: { id: true, email: true, name: true },
    take: BROADCAST_LIMIT,
    orderBy: { createdAt: 'asc' },
  });

  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
  const html = `
    <div style="font-family: Inter, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0A1A2A; color: #ffffff; border-radius: 16px;">
      <h1 style="font-size: 24px; font-weight: 600; color: #D4AF37; margin-bottom: 16px;">${safeSubject}</h1>
      <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); margin-bottom: 24px;">${safeMessage}</p>
      <p style="font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.5); margin-top: 32px;">
        Ro, varme og én reise av gangen.<br />— Tosom
      </p>
    </div>
  `;
  const text = `${subject}\n\n${message}\n\n— Tosom`;

  let sent = 0;
  let failed = 0;
  for (const u of users) {
    if (!u.email) continue;
    const r = await sendEmail({ to: u.email, subject, text, html });
    if (r.success) sent++;
    else {
      failed++;
      console.warn(`[admin broadcast] Feilet for ${u.email}: ${r.error}`);
    }
  }

  // Systemlogg som audit-spor (AuditAction-enumet har ingen broadcast-verdi)
  await prisma.systemLog
    .create({
      data: {
        level: 'INFO',
        message: `Broadcast epost: «${subject}» — ${sent} sendt, ${failed} feilet av ${users.length}`,
        module: 'admin:broadcast',
        metadata: { adminId: authResult.user.id, subject, sent, failed, total: users.length },
      },
    })
    .catch(() => {});

  return NextResponse.json({ ok: true, total: users.length, sent, failed });
}
