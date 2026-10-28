/**
 * RT1 FINAL — PRODUKTBESLUTNING-GUARDS (RT-C01…RT-C18)
 *
 * Sannhetsgrunnlag: Georges RT1-finalbeslutning (27.10.2026):
 *   D8 — ACCOUNT != JOURNEY: journey-end sletter ALDRI User-kontoer.
 *   D9 — DECISION WINDOW: 72 timer fra dag 14 (produkregel, ikke
 *        forskningsbasert) — sentralisert i config/journey.ts.
 *
 * Guards:
 *  RT-C01: dag 14 eksponerer individfullføringsvalg (kun eget valg)
 *  RT-C02: FOUND + FOUND => mutual
 *  RT-C03: FOUND + PENDING => waiting
 *  RT-C04: FOUND + PENDING => ingen PDF
 *  RT-C05: FOUND + FOUND => PDF tillatt
 *  RT-C06: NEW + noe => not mutual / ingen PDF
 *  RT-C07: PENDING + PENDING før 72 t => waiting (ingen lukking)
 *  RT-C08: PENDING + PENDING etter 72 t => no_action (reise lukkes)
 *  RT-C09: FOUND + PENDING etter 72 t => not mutual (reise lukkes)
 *  RT-C10: no_action sletter ALDRI User-konto (integrasjon: s9-deletion)
 *  RT-C11: no_action beholder profile/account-state for fremtidige reiser
 *          (integrasjon: s9-deletion)
 *  RT-C12: eksplisitt GDPR/kontosletting sletter fortsatt kontoen
 *          (eksisterende integrasjon: delete-account-testene)
 *  RT-C13: free quota/order refunderes IKKE av no_action
 *          (integrasjon: s9-deletion)
 *  RT-C14: PDF inneholder ingen image-records/stier
 *  RT-C15: PDF krev mutual FOUND
 *  RT-C16: valget kan ikke overskrives etter innsending (409)
 *  RT-C17: race FOUND+FOUND er deterministisk (ord-uavhengig tabell +
 *          idempotent single-writer)
 *  RT-C18: blandede samtidige valg er deterministiske
 *
 * C10–C13 kjører mot test-DBen i __tests__/integration/s9-deletion.test.ts
 * (RT-C12: __tests__/integration/delete-account.test.ts). Statisk guard her:
 * ingen destruktiv konto-kode kan finnes igjen i journey-stien.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

jest.mock('@/lib/auth/requireAuth', () => ({
  requireAuth: jest.fn(),
}));
jest.mock('@/lib/auth/csrf', () => ({
  csrfCheck: jest.fn(),
}));
jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
}));
jest.mock('@/lib/journey/endJourney', () => ({
  endJourney: jest.fn(),
}));
jest.mock('@/lib/system/log', () => ({
  logInfo: jest.fn(),
  logWarn: jest.fn(),
  logError: jest.fn(),
}));
jest.mock('@/lib/system/errors', () => ({
  captureError: jest.fn(),
}));
jest.mock('@/lib/prisma', () => {
  const mockPrisma = {
    user: { findUnique: jest.fn(), update: jest.fn() },
    match: { findUnique: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
    journeyProgress: { findFirst: jest.fn(), findMany: jest.fn() },
    conversation: { findUnique: jest.fn(), findFirst: jest.fn() },
    message: { findMany: jest.fn(), count: jest.fn() },
    journeyMilestone: { findMany: jest.fn() },
    journeyDayContent: { findFirst: jest.fn() },
    report: { create: jest.fn() },
    userBlock: { upsert: jest.fn() },
    $transaction: jest.fn(),
  };
  // Både navngitt export (`import { prisma }`) og default-export
  // (`import prisma`) brukes i rutenes. __esModule: true hindrer at
  // babel-interopet pakker default-importet i et ekstra lag.
  return { __esModule: true, prisma: mockPrisma, default: mockPrisma };
});

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/requireAuth';
import { csrfCheck } from '@/lib/auth/csrf';
import { getServerSession } from '@/lib/auth/session';
import { endJourney } from '@/lib/journey/endJourney';
import { POST as exitPost } from '@/app/api/journey/exit/route';
import { GET as checkGet } from '@/app/api/journey/check/route';
import { GET as exportPdfGet } from '@/app/api/journey/export-pdf/route';
import {
  resolveCompletionState,
  decisionWindowState,
} from '@/lib/journey/completion';
import {
  COMPLETION_DECISION_WINDOW_HOURS,
  COMPLETION_DECISION_WINDOW_MS,
} from '@/config/journey';

const HOUR = 60 * 60 * 1000;

const mockedPrisma = prisma as any;
const mockedRequireAuth = requireAuth as jest.Mock;
const mockedCsrf = csrfCheck as jest.Mock;
const mockedSession = getServerSession as jest.Mock;
const mockedEndJourney = endJourney as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockedCsrf.mockResolvedValue(undefined); // CSRF ok (ikke NextResponse)
});

/* ────────────────────────────────────────────────────────────────
   Sentralisering av 72-timers-vinduet (D9)
   ──────────────────────────────────────────────────────────────── */
describe('D9: 72-timers-vinduet er sentralisert i config/journey', () => {
  test('vinduet er 72 timer (produkregel)', () => {
    expect(COMPLETION_DECISION_WINDOW_HOURS).toBe(72);
    expect(COMPLETION_DECISION_WINDOW_MS).toBe(72 * HOUR);
  });

  test('cron bruker den delte tilstandsmaskinen (ikke hardkodet 72)', () => {
    const src = read('app/api/cron/journey/route.ts');
    expect(src).toContain("from '@/lib/journey/completion'");
    expect(src).toContain('decisionWindowState');
    expect(src).not.toMatch(/72\s*\*\s*60\s*\*\s*60/);
  });

  test('exit-ruten håndhever vinduet fra config-konstanten', () => {
    const src = read('app/api/journey/exit/route.ts');
    expect(src).toContain('COMPLETION_DECISION_WINDOW_MS');
    expect(src).toContain('410');
  });
});

/* ────────────────────────────────────────────────────────────────
   RT-C02/C03/C06/C17/C18 — deterministisk avgjørelsestabell
   ──────────────────────────────────────────────────────────────── */
describe('RT-C02/C03/C06/C17/C18: deterministisk avgjørelsestabell', () => {
  test('RT-C02: FOUND + FOUND => MUTUAL', () => {
    expect(resolveCompletionState('FOUND_EACH_OTHER', 'FOUND_EACH_OTHER')).toBe('MUTUAL');
  });

  test('RT-C03: FOUND + PENDING => WAITING (begge retninger)', () => {
    expect(resolveCompletionState('FOUND_EACH_OTHER', 'PENDING')).toBe('WAITING');
    expect(resolveCompletionState('PENDING', 'FOUND_EACH_OTHER')).toBe('WAITING');
  });

  test('RT-C06: NEW + noe bestemt => NOT_MUTUAL', () => {
    expect(resolveCompletionState('NEW_JOURNEY', 'FOUND_EACH_OTHER')).toBe('NOT_MUTUAL');
    expect(resolveCompletionState('FOUND_EACH_OTHER', 'NEW_JOURNEY')).toBe('NOT_MUTUAL');
    expect(resolveCompletionState('NEW_JOURNEY', 'NEW_JOURNEY')).toBe('NOT_MUTUAL');
  });

  test('RT-C17: tabellen er ord-uavhengig (race FOUND+FOUND deterministisk)', () => {
    const all = ['PENDING', 'FOUND_EACH_OTHER', 'NEW_JOURNEY'] as const;
    for (const a of all) {
      for (const b of all) {
        expect(resolveCompletionState(a, b)).toBe(resolveCompletionState(b, a));
      }
    }
  });

  test('RT-C17: exit-ruten skriver+leser i én transaksjon og er idempotent', () => {
    const src = read('app/api/journey/exit/route.ts');
    expect(src).toContain('prisma.$transaction');
    expect(src).toContain("!== 'PENDING'"); // 409-guard: valget kan ikke overskrives
  });

  test('RT-C18: blandede samtidige valg => samme resultat uansett rekkefølge', () => {
    // NEW kom først eller FOUND kom først — samme avgjørelse.
    expect(resolveCompletionState('NEW_JOURNEY', 'FOUND_EACH_OTHER')).toBe('NOT_MUTUAL');
    expect(resolveCompletionState('FOUND_EACH_OTHER', 'NEW_JOURNEY')).toBe('NOT_MUTUAL');
    expect(resolveCompletionState('PENDING', 'PENDING')).toBe('WAITING');
  });
});

/* ────────────────────────────────────────────────────────────────
   RT-C07/C08/C09 — 72-timers-vinduet (timeout-states)
   ──────────────────────────────────────────────────────────────── */
describe('RT-C07/C08/C09: 72-timers-vinduet (timeout-states)', () => {
  const now = new Date('2026-10-27T12:00:00.000Z');

  test('RT-C07: PENDING + PENDING før 72 t => venter, ingen lukking', () => {
    for (const h of [1, 24, 48, 71.98]) {
      const win = decisionWindowState(new Date(now.getTime() - h * HOUR), now, 'PENDING', 'PENDING');
      expect(win.expired).toBe(false);
      expect(win.cronOutcome).toBeNull();
      expect(win.state).toBe('WAITING');
    }
  });

  test('RT-C08: PENDING + PENDING ved/etter 72 t => no_action (reise lukkes)', () => {
    const atBoundary = decisionWindowState(new Date(now.getTime() - 72 * HOUR), now, 'PENDING', 'PENDING');
    expect(atBoundary.expired).toBe(true);
    expect(atBoundary.cronOutcome).toBe('no_action');

    const after = decisionWindowState(new Date(now.getTime() - 73 * HOUR), now, 'PENDING', 'PENDING');
    expect(after.expired).toBe(true);
    expect(after.cronOutcome).toBe('no_action');
    expect(after.state).toBe('WAITING');
  });

  test('RT-C09: FOUND + PENDING etter 72 t => not mutual / no_action-ekvivalent', () => {
    for (const [a, b] of [
      ['FOUND_EACH_OTHER', 'PENDING'],
      ['PENDING', 'FOUND_EACH_OTHER'],
    ] as const) {
      const win = decisionWindowState(new Date(now.getTime() - 73 * HOUR), now, a, b);
      expect(win.expired).toBe(true);
      expect(win.cronOutcome).toBe('no_action');
    }
  });

  test('exit-ruten nekter valg etter at vinduet er utløpt (410)', async () => {
    mockedRequireAuth.mockResolvedValue({ user: { id: 'user-a' } });
    mockedPrisma.journeyProgress.findFirst.mockResolvedValueOnce({
      id: 'jp1',
      userId: 'user-a',
      matchId: 'm1',
      day: 14,
      endedAt: new Date(now.getTime() - 73 * HOUR), // vinduet utløpt
    });
    mockedPrisma.match.findUnique.mockResolvedValue({
      id: 'm1',
      status: 'active',
      userAId: 'user-a',
      userBId: 'user-b',
      completionA: 'PENDING',
      completionB: 'PENDING',
    });
    const res = await exitPost(
      new NextRequest('http://localhost/api/journey/exit', {
        method: 'POST',
        body: JSON.stringify({ reason: 'found_each_other' }),
        headers: { 'content-type': 'application/json' },
      }),
    );
    expect(res.status).toBe(410);
    expect(mockedEndJourney).not.toHaveBeenCalled();
    expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
  });
});

/* ────────────────────────────────────────────────────────────────
   RT-C10 — ingen destruktiv konto-kode i journey-stien (D8)
   ──────────────────────────────────────────────────────────────── */
describe('RT-C10: no_action sletter aldri User-konto (D8)', () => {
  test('endJourney inneholder ingen user-/account-/profile-/order-sletting', () => {
    const src = read('lib/journey/endJourney.ts');
    expect(src).not.toContain('user.delete');
    expect(src).not.toContain('account.deleteMany');
    expect(src).not.toContain('profile.deleteMany');
    expect(src).not.toContain('order.deleteMany');
  });

  test('cron-journey lukker reiser men sletter ingen kontoer', () => {
    const src = read('app/api/cron/journey/route.ts');
    expect(src).not.toContain('user.delete');
    expect(src).not.toContain('profile.deleteMany');
    expect(src).not.toContain('account.deleteMany');
  });

  test('RT-C12: eksplisitt GDPR-sletting beholder sin destruktive vei', () => {
    // /api/settings/delete-account må fortsatt slette User-radet.
    const src = read('app/api/settings/delete-account/route.ts');
    expect(src).toContain('user.delete');
  });

  test('RT-C10/C11/C13: integrasjonstesten (s9) påtvinger beholdte kontoer', () => {
    const src = read('__tests__/integration/s9-deletion.test.ts');
    expect(src).toContain('not.toBeNull'); // kontoer/profiler beholdes
    expect(src).toContain('IDLE'); // journeyState for fremtidige reiser
    expect(src).toContain('freeQuota'); // gratisorden beholdes
  });
});

/* ────────────────────────────────────────────────────────────────
   RT-C01 — dag 14 eksponerer individfullføringsvalg (kun eget valg)
   ──────────────────────────────────────────────────────────────── */
describe('RT-C01: /api/journey/check eksponerer kun brukerens eget valg', () => {
  test('dag 14: eget valg (FOUND) eksponeres; partnerens valg (NEW) lekket ikke', async () => {
    mockedSession.mockResolvedValue({ user: { id: 'user-a' } });
    mockedPrisma.journeyProgress.findFirst.mockResolvedValue({
      id: 'jp1',
      matchId: 'm1',
      phase: 'CHECKIN',
      day: 14,
      completedDays: 14,
      startedAt: new Date(Date.now() - 13 * 24 * HOUR),
      endedAt: null,
      pausedAt: null,
      updatedAt: new Date(),
    });
    mockedPrisma.journeyMilestone.findMany.mockResolvedValue([]);
    mockedPrisma.journeyDayContent.findFirst.mockResolvedValue(null);
    mockedPrisma.match.findUnique.mockResolvedValue({
      userAId: 'user-a',
      completionA: 'FOUND_EACH_OTHER',
      completionADecidedAt: new Date('2026-10-27T10:00:00.000Z'),
      completionB: 'NEW_JOURNEY',
      completionBDecidedAt: new Date('2026-10-27T11:00:00.000Z'),
    });

    const res = await checkGet(new Request('http://localhost/api/journey/check'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.completion).toEqual({
      decision: 'FOUND_EACH_OTHER',
      decidedAt: '2026-10-27T10:00:00.000Z',
      mutualFound: false,
    });
    // Partnerens konkrete valg må aldri eksponeres:
    const raw = JSON.stringify(body);
    expect(raw).not.toContain('NEW_JOURNEY');
    expect(raw).not.toContain('completionB');
  });
});

/* ────────────────────────────────────────────────────────────────
   RT-C02/C03/C06/C16 — exit-ruten (bilateral oppførsel)
   ──────────────────────────────────────────────────────────────── */
describe('exit-ruten: bilateral fullføring på dag 14', () => {
  const day14Journey = {
    id: 'jp1',
    userId: 'user-a',
    matchId: 'm1',
    day: 14,
    endedAt: new Date(Date.now() - 24 * HOUR), // inne i 72-timers-vinduet
  };

  function mockExitRoute(
    partnerDecision: 'PENDING' | 'FOUND_EACH_OTHER' | 'NEW_JOURNEY',
    myDecision: 'PENDING' | 'FOUND_EACH_OTHER' | 'NEW_JOURNEY',
    myNewDecision: 'FOUND_EACH_OTHER' | 'NEW_JOURNEY' = 'FOUND_EACH_OTHER',
  ) {
    mockedRequireAuth.mockResolvedValue({ user: { id: 'user-a' } });
    mockedPrisma.journeyProgress.findFirst.mockResolvedValue(day14Journey);
    const activeMatch = {
      id: 'm1',
      status: 'active',
      userAId: 'user-a',
      userBId: 'user-b',
      completionA: myDecision,
      completionADecidedAt: myDecision === 'PENDING' ? null : new Date(),
      completionB: partnerDecision,
      completionBDecidedAt: partnerDecision === 'PENDING' ? null : new Date(),
    };
    mockedPrisma.match.findUnique.mockResolvedValue(activeMatch);
    const freshMatch = { ...activeMatch, completionA: myNewDecision };
    mockedPrisma.$transaction.mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) =>
      fn({
        match: {
          update: jest.fn().mockResolvedValue({}),
          findUnique: jest.fn().mockResolvedValue(freshMatch),
        },
      }),
    );
    mockedPrisma.user.update.mockResolvedValue({});
  }

  async function postExit(reason: string): Promise<{ status: number; body: any }> {
    const res = await exitPost(
      new NextRequest('http://localhost/api/journey/exit', {
        method: 'POST',
        body: JSON.stringify({ reason }),
        headers: { 'content-type': 'application/json' },
      }),
    );
    return { status: res.status, body: await res.json() };
  }

  test('RT-C02: FOUND + FOUND => mutual (endJourney found_each_other)', async () => {
    mockExitRoute('FOUND_EACH_OTHER', 'PENDING');
    mockedEndJourney.mockResolvedValue({ deleted: {} });
    const { status, body } = await postExit('found_each_other');
    expect(status).toBe(200);
    expect(body.outcome).toBe('found_each_other');
    expect(mockedEndJourney).toHaveBeenCalledTimes(1);
    expect(mockedEndJourney).toHaveBeenCalledWith('m1', 'found_each_other', 'user-a');
    // D8: selv mutual forteller at kontoen beholdes
    expect(body.nextStep).toContain('kontoen deres beholdes');
  });

  test('RT-C03: FOUND + PENDING => waiting (ingen endJourney, ingen sletting)', async () => {
    mockExitRoute('PENDING', 'PENDING');
    const { status, body } = await postExit('found_each_other');
    expect(status).toBe(200);
    expect(body.outcome).toBe('waiting');
    expect(body.decision).toBe('FOUND_EACH_OTHER');
    expect(mockedEndJourney).not.toHaveBeenCalled();
    // 72-timers-vinduet nevnes i ventemeldingen
    expect(body.message).toContain('72 timer');
  });

  test('RT-C06: NEW + FOUND => not mutual (endJourney new_journey)', async () => {
    mockExitRoute('FOUND_EACH_OTHER', 'PENDING', 'NEW_JOURNEY');
    mockedEndJourney.mockResolvedValue({ deleted: {} });
    const { status, body } = await postExit('ny_reise');
    expect(status).toBe(200);
    expect(body.outcome).toBe('new_journey');
    expect(mockedEndJourney).toHaveBeenCalledTimes(1);
    expect(mockedEndJourney).toHaveBeenCalledWith('m1', 'new_journey', 'user-a');
    // Onboarding låses opp for NY-valgeren (meg) — ikke partneren (FOUND)
    expect(mockedPrisma.user.update).toHaveBeenCalledTimes(1);
    expect(mockedPrisma.user.update.mock.calls[0][0]).toMatchObject({
      where: { id: 'user-a' },
    });
    // Nøytral melding — partnerens valg eksponeres ikke
    expect(body.message).not.toContain('hverandre');
  });

  test('RT-C06: NEW + NEW => not mutual, begge låses opp for onboarding', async () => {
    mockExitRoute('NEW_JOURNEY', 'PENDING', 'NEW_JOURNEY');
    mockedEndJourney.mockResolvedValue({ deleted: {} });
    const { status, body } = await postExit('ny_reise');
    expect(status).toBe(200);
    expect(body.outcome).toBe('new_journey');
    expect(mockedEndJourney).toHaveBeenCalledWith('m1', 'new_journey', 'user-a');
    // Begge (meg + partneren) har valgt NY → begge låses opp
    expect(mockedPrisma.user.update).toHaveBeenCalledTimes(2);
  });

  test('RT-C16: valget kan ikke overskrives etter innsending (409, idempotent)', async () => {
    mockExitRoute('PENDING', 'FOUND_EACH_OTHER'); // jeg har allerede valgt FOUND
    const { status, body } = await postExit('ny_reise');
    expect(status).toBe(409);
    expect(body.error).toContain('allerede tatt stilling');
    expect(mockedEndJourney).not.toHaveBeenCalled();
    expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
  });
});

/* ────────────────────────────────────────────────────────────────
   RT-C04/C05/C14/C15 — PDF (mutual-only, text-only)
   ──────────────────────────────────────────────────────────────── */
describe('PDF: mutual-only (RT-C15) og text-only (RT-C14)', () => {
  const userAProfile = { id: 'user-a', name: 'Asta', email: 'a@x.no', profile: { firstName: 'Asta', identityName: null } };
  const userBProfile = { id: 'user-b', name: 'Bjorn', email: 'b@x.no', profile: { firstName: 'Bjorn', identityName: null } };

  function mockPdfRoute(match: Record<string, unknown>) {
    mockedRequireAuth.mockResolvedValue({ user: { id: 'user-a' } });
    mockedPrisma.user.findUnique.mockResolvedValue({ bannedAt: null, deletedAt: null });
    mockedPrisma.match.findFirst.mockResolvedValue(match);
    mockedPrisma.conversation.findUnique.mockResolvedValue({ id: 'c1' });
    mockedPrisma.message.findMany.mockResolvedValue([
      { id: 'msg1', senderId: 'user-a', content: 'Hei deg! Tekstmelding som ma med i PDF-en.', type: 'text', createdAt: new Date('2026-10-20T10:00:00.000Z'), deletedAt: null },
      { id: 'msg2', senderId: 'system', content: 'Samtaleimpuls fra Tosom', type: 'system', createdAt: new Date('2026-10-20T10:05:00.000Z'), deletedAt: null },
    ]);
  }

  async function getPdf(): Promise<Response> {
    return exportPdfGet(new NextRequest('http://localhost/api/journey/export-pdf'));
  }

  test('RT-C04: FOUND + PENDING => ingen PDF (409)', async () => {
    mockPdfRoute({
      id: 'm1',
      status: 'active',
      expiresAt: null,
      userAId: 'user-a',
      userBId: 'user-b',
      completionA: 'FOUND_EACH_OTHER',
      completionB: 'PENDING',
      userA: userAProfile,
      userB: userBProfile,
    });
    const res = await getPdf();
    expect(res.status).toBe(409);
    expect(mockedPrisma.message.findMany).not.toHaveBeenCalled();
  });

  test('RT-C04: PENDING + PENDING => ingen PDF (409)', async () => {
    mockPdfRoute({
      id: 'm1',
      status: 'active',
      expiresAt: null,
      userAId: 'user-a',
      userBId: 'user-b',
      completionA: 'PENDING',
      completionB: 'PENDING',
      userA: userAProfile,
      userB: userBProfile,
    });
    const res = await getPdf();
    expect(res.status).toBe(409);
  });

  test('RT-C15: NEW + FOUND => ingen PDF (409)', async () => {
    mockPdfRoute({
      id: 'm1',
      status: 'active',
      expiresAt: null,
      userAId: 'user-a',
      userBId: 'user-b',
      completionA: 'NEW_JOURNEY',
      completionB: 'FOUND_EACH_OTHER',
      userA: userAProfile,
      userB: userBProfile,
    });
    const res = await getPdf();
    expect(res.status).toBe(409);
  });

  test('RT-C05: FOUND + FOUND => PDF tillatt (200, HTML med samtaletekst)', async () => {
    mockPdfRoute({
      id: 'm1',
      status: 'ended',
      expiresAt: new Date(Date.now() + 12 * HOUR), // grace-vinduet aapent
      userAId: 'user-a',
      userBId: 'user-b',
      completionA: 'FOUND_EACH_OTHER',
      completionB: 'FOUND_EACH_OTHER',
      userA: userAProfile,
      userB: userBProfile,
    });
    const res = await getPdf();
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Hei deg! Tekstmelding som ma med i PDF-en.');
  });

  test('RT-C14: meldingsquery utelater image-meldinger (type: { not: image })', async () => {
    mockPdfRoute({
      id: 'm1',
      status: 'ended',
      expiresAt: new Date(Date.now() + 12 * HOUR),
      userAId: 'user-a',
      userBId: 'user-b',
      completionA: 'FOUND_EACH_OTHER',
      completionB: 'FOUND_EACH_OTHER',
      userA: userAProfile,
      userB: userBProfile,
    });
    const res = await getPdf();
    expect(res.status).toBe(200);
    expect(mockedPrisma.message.findMany).toHaveBeenCalledTimes(1);
    const arg = mockedPrisma.message.findMany.mock.calls[0][0];
    expect(arg.where).toMatchObject({ conversationId: 'c1', deletedAt: null, type: { not: 'image' } });
    // Ingen image-stier i den renderede PDF-en
    const html = await res.text();
    expect(html).not.toContain('/api/chat/image/');
    expect(html).not.toContain('imageKey');
  });
});
