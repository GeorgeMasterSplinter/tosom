/**
 * POST /api/report — Brukerstyrt rapportering (STEG C1)
 *
 * Krever autentisering. Rate-limitet via pgCheck (3 per minutt, DB-basert).
 * Validerer at `reportedId` faktisk er brukerens nåværende eller tidligere match.
 *
 * Viktigt: Report slettes IKKE av endJourney() — rapporten må overleve
 * at samtalen slettes, ellers kan man rapportere og deretter avslutte
 * for å skjule sporet.
 *
 * Body: { reportedId: string, matchId?: string, category: ReportCategory, description?: string }
 * Response: { success: true, reportId: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/requireAuth';
import { csrfCheck } from '@/lib/auth/csrf';
import { sendAlert } from '@/lib/observability/alert';
import { tryParseJsonBody } from '@/lib/api/validation';
import { pgCheck } from '@/lib/rate-limit-pg';

export const dynamic = 'force-dynamic';

// PL-15 (V-5): rategrensen flyttet til pgCheck (DB-basert, overlever
// instance-recycling på Vercel — den in-memory Map-en gikk tapt mellom
// kald starts). Maks 3 rapporter per bruker per minutt.

type ReportCategory = 'HARASSMENT' | 'INAPPROPRIATE' | 'SPAM' | 'FAKE_PROFILE' | 'OTHER';

const validCategories: Set<string> = new Set([
  'HARASSMENT',
  'INAPPROPRIATE',
  'SPAM',
  'FAKE_PROFILE',
  'OTHER',
]);

/**
 * POST /api/report
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // L6: CSRF-vern
    const csrf = await csrfCheck(req);
    if (csrf instanceof NextResponse) return csrf;

    // 1. Auth
    const result = await requireAuth(req);
    if (result instanceof NextResponse) {
      return result;
    }
    const user = result.user;

    // 2. Rate limiting (PL-15: pgCheck i stedet for in-memory teller)
    const rl = await pgCheck(`report:${user.id}`, 3, 60);
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'For mange rapporter. Vent et øyeblikk.' },
        { status: 429 }
      );
    }

    // 3. Parse body
    const body = await tryParseJsonBody(req);
    if (!body) {
      return NextResponse.json({ error: 'Ugyldig body' }, { status: 400 });
    }
    const { reportedId, matchId, category, description } = body as {
      reportedId?: string;
      matchId?: string;
      category?: string;
      description?: string;
    };

    // 4. Validering
    if (!reportedId || !category) {
      return NextResponse.json(
        { error: 'reportedId og category er påkrevd.' },
        { status: 400 }
      );
    }

    if (!validCategories.has(category)) {
      return NextResponse.json(
        { error: 'Ugyldig kategori.' },
        { status: 400 }
      );
    }

    // Kan ikke rapportere seg selv
    if (reportedId === user.id) {
      return NextResponse.json(
        { error: 'Du kan ikke rapportere deg selv.' },
        { status: 400 }
      );
    }

    // 5. Valider at reportedId er en faktisk match (nåværende eller tidligere)
    const activeMatch = await prisma.match.findFirst({
      where: {
        status: 'active',
        OR: [
          { userAId: user.id, userBId: reportedId },
          { userBId: user.id, userAId: reportedId },
        ],
      },
    });

    const historyMatch = await prisma.matchHistory.findFirst({
      where: {
        OR: [
          { userAId: user.id, userBId: reportedId },
          { userBId: user.id, userAId: reportedId },
        ],
      },
    });

    if (!activeMatch && !historyMatch) {
      return NextResponse.json(
        { error: 'Du har ingen historikk med denne brukeren.' },
        { status: 403 }
      );
    }

    // 6. PL-15 (V-5): bevis — øyeblikksbilde av de siste meldingene i en
    // aktiv samtale. Kun tekst (ikke bilder): moderatoren skal se hva som
    // skjedde, ikke motta bildefiler. Evidens blir null når samtalen ikke
    // lenger finnes (f.eks. rapport etter avsluttet reise).
    let evidence: Array<{
      senderId: string;
      content: string;
      createdAt: Date;
      type: string;
    }> | undefined;
    const matchRef = matchId || activeMatch?.id;
    if (matchRef) {
      const convo = await prisma.conversation.findFirst({
        where: { matchId: matchRef },
      });
      if (convo) {
        const messages = await prisma.message.findMany({
          where: { conversationId: convo.id, type: { not: 'image' } },
          orderBy: { createdAt: 'desc' },
          take: 50,
          select: { senderId: true, content: true, createdAt: true, type: true },
        });
        if (messages.length > 0) evidence = messages;
      }
    }

    // 7. Opprett rapporten
    const report = await prisma.report.create({
      data: {
        reporterId: user.id,
        reportedId,
        matchId: matchRef || undefined,
        category: category as ReportCategory,
        description: description || null,
        // Prisma Json-felt: null legges ikke inn — feltet blir da null i DB
        // (default) når ingen meldinger finnes.
        ...(evidence ? { evidence } : {}),
      },
    });

    // 8. Logg
    console.log(`[report] Bruker ${user.id} rapporterte ${reportedId}`, {
      reportId: report.id,
      category,
      matchId: report.matchId,
    });

    // 9. Varsling — kategori + identifikatorer, IKKE fritekstbeskrivelsen
    try {
      await sendAlert(
        'warning',
        'Ny rapport mottatt',
        `Kategori: ${category}\nRapport-ID: ${report.id}\nRapportør: ${user.id}\nRapportert: ${reportedId}\nMatch: ${report.matchId || 'ukjent'}`
      );
    } catch (alertErr) {
      console.error('[report] Varsling feilet (rapport er lagret):', alertErr);
    }

    return NextResponse.json(
      { success: true, reportId: report.id, message: 'Takk. Rapporten din er mottatt.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/report feil:', error);
    return NextResponse.json(
      { error: 'Kunne ikke sende rapport' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/report — Admin: hent åpne rapporter (kun admin)
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const result = await requireAuth(req);
    if (result instanceof NextResponse) return result;

    // Admin-sjekk
    if (result.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Krever admin' }, { status: 403 });
    }

    const reports = await prisma.report.findMany({
      where: { status: 'OPEN' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Report-modellen har ingen relasjoner til User — hent navn/epost separat
    const userIds = Array.from(new Set(reports.flatMap((r) => [r.reporterId, r.reportedId])));
    const users = userIds.length
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, email: true },
        })
      : [];
    const userById = new Map(users.map((u) => [u.id, u]));

    const withUsers = reports.map((r) => ({
      ...r,
      reporter: userById.get(r.reporterId) ?? null,
      reportedUser: userById.get(r.reportedId) ?? null,
    }));

    return NextResponse.json({ reports: withUsers });
  } catch (error) {
    console.error('GET /api/report feil:', error);
    return NextResponse.json({ error: 'Kunne ikke hente rapporter' }, { status: 500 });
  }
}

/**
 * PATCH /api/report — Admin: oppdater status (kun admin)
 */
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const result = await requireAuth(req);
    if (result instanceof NextResponse) return result;

    if (result.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Krever admin' }, { status: 403 });
    }

    const body = await tryParseJsonBody(req);
    if (!body) {
      return NextResponse.json({ error: 'Ugyldig body' }, { status: 400 });
    }
    const { reportId, status } = body as { reportId?: string; status?: string };

    if (!reportId || !status) {
      return NextResponse.json({ error: 'reportId og status er påkrevd' }, { status: 400 });
    }

    const validStatuses = ['OPEN', 'REVIEWED', 'ACTIONED', 'DISMISSED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Ugyldig status' }, { status: 400 });
    }

    // PL-15 (V-5, D-8): når saken lukkes starter 90-dagers-fristen for
    // beviset. Cronen i cron/journey nullstiller evidence når fristen løper ut.
    const isClosing = status === 'REVIEWED' || status === 'ACTIONED' || status === 'DISMISSED';
    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: status as any,
        reviewedAt: new Date(),
        reviewedBy: result.user.id,
        ...(isClosing
          ? { evidenceExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }
          : {}),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/report feil:', error);
    return NextResponse.json({ error: 'Kunne ikke oppdatere rapport' }, { status: 500 });
  }
}