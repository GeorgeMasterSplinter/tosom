/**
 * PL-15 (V-5) — Bevis ved rapport og blokkering
 *
 * Verifiserer at:
 * 1. Rapport med aktiv samtale lagrer bevis (siste 50 tekstmeldinger,
 *    ingen bilder)
 * 2. Blokkering lager rapport med bevis FØR endJourney sletter meldingene
 * 3. Rapport etter avsluttet match godtas (bevis = null, samtalen er borte)
 * 4. Fjerde rapport innen ett minutt → 429 (pgCheck, ikke in-memory)
 */

// Mocks
const mockPgCheck = jest.fn();
jest.mock('@/lib/rate-limit-pg', () => ({
  pgCheck: (...args: unknown[]) => mockPgCheck(...args),
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    match: { findFirst: jest.fn(), findUnique: jest.fn() },
    matchHistory: { findFirst: jest.fn() },
    report: { create: jest.fn(), update: jest.fn() },
    conversation: { findFirst: jest.fn() },
    message: { findMany: jest.fn() },
    userBlock: { upsert: jest.fn() },
    journeyProgress: { findFirst: jest.fn() },
    user: { update: jest.fn() },
  },
}));

jest.mock('@/lib/auth/requireAuth', () => ({
  requireAuth: jest.fn(),
}));

jest.mock('@/lib/observability/alert', () => ({
  sendAlert: jest.fn(),
}));

const mockEndJourney = jest.fn();
jest.mock('@/lib/journey/endJourney', () => ({
  endJourney: (...args: unknown[]) => mockEndJourney(...args),
}));

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/requireAuth';
import { POST as postReport } from '@/app/api/report/route';
import { POST as postExit } from '@/app/api/journey/exit/route';

// Prisma-mocken er en flat objekttre (deleger → metoder) — kaster til
// løst typet struktur så .mockResolvedValue/.mock er tilgjengelig overalt.
const mockPrisma = prisma as unknown as Record<string, Record<string, jest.Mock>>;
const mockRequireAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;

const USER = { id: 'user-1', role: 'USER', email: 'test@test.no' } as const;
const PARTNER_ID = 'user-2';
const MATCH = { id: 'match-1', status: 'active', userAId: 'user-1', userBId: PARTNER_ID };
const CONVO = { id: 'conv-1' };
const MESSAGES = [
  { senderId: PARTNER_ID, content: 'Hei!', createdAt: new Date('2026-10-01T10:00:00Z'), type: 'user' },
  { senderId: 'user-1', content: 'Heisann', createdAt: new Date('2026-10-01T10:01:00Z'), type: 'user' },
  { senderId: PARTNER_ID, content: 'Ok', createdAt: new Date('2026-10-01T10:02:00Z'), type: 'user' },
];

function makeRequest(body: object): Request {
  return new Request('http://localhost/api/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockPgCheck.mockResolvedValue({ ok: true });
  mockRequireAuth.mockResolvedValue({ user: USER } as never);
  mockEndJourney.mockResolvedValue({ deleted: { messages: 3 } });
});

describe('PL-15 · Rapport lagrer bevis fra aktiv samtale', () => {
  it('kopierer siste 50 tekstmeldinger (uten bilder) til evidence', async () => {
    mockPrisma.match.findFirst.mockResolvedValue(MATCH as never);
    mockPrisma.matchHistory.findFirst.mockResolvedValue(null);
    mockPrisma.conversation.findFirst.mockResolvedValue(CONVO as never);
    mockPrisma.message.findMany.mockResolvedValue(MESSAGES as never);
    mockPrisma.report.create.mockResolvedValue({ id: 'rep-1' } as never);

    const res = await postReport(makeRequest({ reportedId: PARTNER_ID, category: 'HARASSMENT' }) as never);

    expect(res.status).toBe(201);
    // Bilder filtreres ut, max 50, kun tillatte felter
    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ conversationId: 'conv-1', type: { not: 'image' } }),
        take: 50,
        orderBy: { createdAt: 'desc' },
      })
    );
    const createArg = mockPrisma.report.create.mock.calls[0][0];
    expect(createArg.data.evidence).toEqual(MESSAGES);
  });

  it('godtar rapport etter avsluttet match (bevis er null — samtalen er borte)', async () => {
    mockPrisma.match.findFirst.mockResolvedValue(null);
    mockPrisma.matchHistory.findFirst.mockResolvedValue({ id: 'mh-1', userAId: 'user-1', userBId: PARTNER_ID });
    mockPrisma.conversation.findFirst.mockResolvedValue(null);
    mockPrisma.report.create.mockResolvedValue({ id: 'rep-2' } as never);

    const res = await postReport(makeRequest({ reportedId: PARTNER_ID, category: 'OTHER', description: 'Etter reisen' }) as never);

    expect(res.status).toBe(201);
    const createArg = mockPrisma.report.create.mock.calls[0][0];
    // Inga samtale → evidence-feltet utelates (blir null i DB)
    expect(createArg.data).not.toHaveProperty('evidence');
  });
});

describe('PL-15 · Blokkering lager rapport før sletting', () => {
  it('report.create kjøres før endJourney og får med beviset', async () => {
    mockPrisma.journeyProgress.findFirst.mockResolvedValue({
      id: 'jp-1',
      matchId: 'match-1',
      day: 5,
      endedAt: null,
    } as never);
    mockPrisma.match.findUnique.mockResolvedValue(MATCH as never);
    mockPrisma.userBlock.upsert.mockResolvedValue({} as never);
    mockPrisma.conversation.findFirst.mockResolvedValue(CONVO as never);
    mockPrisma.message.findMany.mockResolvedValue(MESSAGES as never);
    mockPrisma.report.create.mockResolvedValue({ id: 'rep-3' } as never);

    const req = new Request('http://localhost/api/journey/exit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'blocked' }),
    });
    const res = await postExit(req as never);

    expect(res.status).toBe(200);
    const createArg = mockPrisma.report.create.mock.calls[0][0];
    expect(createArg.data).toMatchObject({
      reporterId: 'user-1',
      reportedId: PARTNER_ID,
      matchId: 'match-1',
      category: 'OTHER',
      description: 'Blokkert av brukeren',
      evidence: MESSAGES,
    });
    // Rapporten må eksistere FØR endJourney sletter meldingene
    const createCall = mockPrisma.report.create.mock.invocationCallOrder[0];
    const endCall = mockEndJourney.mock.invocationCallOrder[0];
    expect(createCall).toBeLessThan(endCall);
  });
});

describe('PL-15 · Rategrense via pgCheck', () => {
  it('fjerde rapport innen ett minutt → 429', async () => {
    mockPrisma.match.findFirst.mockResolvedValue(MATCH as never);
    mockPrisma.matchHistory.findFirst.mockResolvedValue(null);
    mockPrisma.conversation.findFirst.mockResolvedValue(CONVO as never);
    mockPrisma.message.findMany.mockResolvedValue(MESSAGES as never);
    mockPrisma.report.create.mockResolvedValue({ id: 'rep-4' } as never);

    let calls = 0;
    mockPgCheck.mockImplementation(() => {
      calls += 1;
      return { ok: calls <= 3 };
    });

    const body = { reportedId: PARTNER_ID, category: 'HARASSMENT' };
    for (let i = 0; i < 3; i++) {
      const ok = await postReport(makeRequest(body) as never);
      expect(ok.status).toBe(201);
    }
    const limited = await postReport(makeRequest(body) as never);
    expect(limited.status).toBe(429);

    // pgCheck med riktig nøkkel og grense (3 per 60 sekunder)
    expect(mockPgCheck).toHaveBeenCalledWith('report:user-1', 3, 60);
    expect(mockPrisma.report.create).toHaveBeenCalledTimes(3);
  });
});
