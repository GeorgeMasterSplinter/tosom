// app/api/journey/export-pdf/route.ts — GET /api/journey/export-pdf
//
// B-3: PDF-eksport av samtalen FØR «Vi fant hverandre» sletter alt.
// UI lover en eksport (app/reisen/avslutning/page.tsx), men ingen generator
// eksisterte — window.print() på en side uten samtaleinnhold er tom.
//
// Her renderes den faktiske samtalen som et print-vennlig HTML-dokument som
// brukeren åpner i nytt vindu og lagrer som PDF (browser-innbygd — ingen
// ny avhengighet, i tråd med den eksisterende JSON-eksporten under /settings).
//
// Sikkerhet: kun eier kan hente. Bruker må ha en AKTIV match/samtale
// (før sletting). Ingen data for andres samtaler.

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/requireAuth';

export const dynamic = 'force-dynamic';

function escapeHtml(s: string): string {
  // Entiteter bygges frå kodepunkter slik at kilde ikke avhengig av literal '&'
  // (unngår at et tekst-/format-lag decoder entitetene bort).
  const AMP = String.fromCharCode(38); // &
  return s
    .replace(/&/g, AMP + 'amp;')
    .replace(/</g, AMP + 'lt;')
    .replace(/>/g, AMP + 'gt;')
    .replace(/"/g, AMP + 'quot;')
    .replace(/'/g, AMP + '#39;');
}

function fmtDate(iso: string | Date): string {
  const d = new Date(iso);
  return d.toLocaleString('nb-NO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // 1. Auth — kun den innloggede brukeren
    const result = await requireAuth(req);
    if (result instanceof NextResponse) {
      return result;
    }
    const userId = result.user.id;

    // 2. Finn brukerens AKTIVE match + samtale (må eksistere før sletting)
    const activeMatch = await prisma.match.findFirst({
      where: {
        status: 'active',
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      include: {
        userA: { select: { id: true, name: true, email: true, profile: { select: { firstName: true, identityName: true } } } },
        userB: { select: { id: true, name: true, email: true, profile: { select: { firstName: true, identityName: true } } } },
      },
    });

    if (!activeMatch) {
      return NextResponse.json(
        { error: 'Ingen aktiv reise å eksportere' },
        { status: 404 }
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: { matchId: activeMatch.id },
    });
    if (!conversation) {
      return NextResponse.json(
        { error: 'Ingen samtale funnet for denne reisen' },
        { status: 404 }
      );
    }

    // 3. Hent meldingene (tidligst først)
    const messages = await prisma.message.findMany({
      where: { conversationId: conversation.id, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });

    // 4. Bygg print-vennlig HTML
    const nameFor = (u: typeof activeMatch.userA): string => {
      const first = u.profile?.firstName || u.profile?.identityName || u.name;
      return first && first.trim() ? first.trim() : 'Partner';
    };
    const isA = activeMatch.userA.id === userId;
    const meName = isA ? nameFor(activeMatch.userA) : nameFor(activeMatch.userB);
    const partnerName = isA ? nameFor(activeMatch.userB) : nameFor(activeMatch.userA);

    const messageRows = messages
      .map((m) => {
        const mine = m.senderId === userId;
        const sender = mine ? meName : partnerName;
        // System-meldinger (BliKjent-spørsmål) senteres
        if (m.type === 'system') {
          return `
        <div class="system">
          <div class="system-text">${escapeHtml(m.content)}</div>
          <div class="system-date">${fmtDate(m.createdAt)}</div>
        </div>`;
        }
        return `
        <div class="msg ${mine ? 'mine' : 'theirs'}">
          <div class="bubble">${escapeHtml(m.content)}</div>
          <div class="meta">${escapeHtml(sender)} · ${fmtDate(m.createdAt)}</div>
        </div>`;
      })
      .join('\n');

    const html = `<!DOCTYPE html>
<html lang="nb">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Reisen min — minnet</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 40px 24px 60px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1a2330; background: #ffffff; line-height: 1.6;
  }
  .wrap { max-width: 720px; margin: 0 auto; }
  header { text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 24px; margin-bottom: 32px; }
  h1 { font-size: 28px; font-weight: 300; color: #b8860b; margin: 0 0 8px; }
  .sub { color: #6b7280; font-size: 15px; }
  .note {
    background: #fbf7ec; border: 1px solid #ecd9a0; border-radius: 12px;
    padding: 14px 18px; font-size: 14px; color: #6b5b1e; margin: 0 0 32px;
  }
  .msg { margin: 0 0 18px; page-break-inside: avoid; }
  .msg .bubble {
    padding: 12px 16px; border-radius: 16px; font-size: 16px; white-space: pre-wrap; word-break: break-word;
  }
  .msg.mine { margin-left: 48px; }
  .msg.mine .bubble { background: #f3ecd6; color: #2b2410; }
  .msg.theirs { margin-right: 48px; }
  .msg.theirs .bubble { background: #eef1f5; color: #1a2330; }
  .msg .meta { font-size: 12px; color: #9ca3af; margin-top: 6px; }
  .msg.mine .meta { text-align: right; }
  .system { text-align: center; margin: 24px 0; page-break-inside: avoid; }
  .system-text { font-style: italic; color: #6b7280; font-size: 15px; }
  .system-date { font-size: 12px; color: #9ca3af; margin-top: 4px; }
  .empty { text-align: center; color: #6b7280; font-size: 16px; padding: 40px 0; }
  footer { margin-top: 40px; text-align: center; font-size: 13px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
  @media print {
    body { padding: 0; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
  <div class="wrap">
    <div class="no-print" style="text-align:right; margin-bottom: 16px;">
      <button onclick="window.print()" style="padding:10px 20px; background:#d4af37; color:#0b1520; border:none; border-radius:10px; font-weight:600; cursor:pointer;">
        Lagre som PDF
      </button>
    </div>
    <header>
      <h1>Reisen min 💛</h1>
      <div class="sub">Samtalen mellom ${escapeHtml(meName)} og ${escapeHtml(partnerName)}</div>
    </header>
    <div class="note">
      Dette er minnet fra reisen deres på ToSom. Lagre det som PDF, så kan dere ha det for alltid —
      plattformen sletter alt utover dette.
    </div>
    ${
      messages.length === 0
        ? `<div class="empty">Ingen meldinger var lagret for denne reisen.</div>`
        : messageRows
    }
    <footer>
      Eksportert fra ToSom · ${fmtDate(new Date())}
    </footer>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Kunne ikke eksportere samtalen', details: (err as Error).message },
      { status: 500 }
    );
  }
}