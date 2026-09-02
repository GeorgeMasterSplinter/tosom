/**
 * POST /api/report — Brukerstyrt rapportering (STEG C1)
 *
 * Krever autentisering. Rate-limitet via enkel in-memory teller.
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

export const dynamic = 'force-dynamic';

// Enkel rate-limiter (in-memory, bør erstattes med Upstash i prod)
const reportRateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minutt
const RATE_LIMIT_MAX = 3; // maks 3 rapporter per minutt

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const timestamps = reportRateLimit.get(userId) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) return false;
  recent.push(now);
  reportRateLimit.set(userId, recent);
  return true;
}

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

    // 2. Rate limiting
    if (!checkRateLimit(user.id)) {
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

    // 6. Opprett rapporten
    const report = await prisma.report.create({
      data: {
        reporterId: user.id,
        reportedId,
        matchId: matchId || activeMatch?.id || undefined,
        category: category as ReportCategory,
        description: description || null,
      },
    });

    // 7. Logg
    console.log(`[report] Bruker ${user.id} rapporterte ${reportedId}`, {
      reportId: report.id,
      category,
      matchId: report.matchId,
    });

    // 8. Varsling — kategori + identifikatorer, IKKE fritekstbeskrivelsen
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

    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: status as any,
        reviewedAt: new Date(),
        reviewedBy: result.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/report feil:', error);
    return NextResponse.json({ error: 'Kunne ikke oppdatere rapport' }, { status: 500 });
  }
}