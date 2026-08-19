/**
 * ToSom — M-3: Robust parscoring
 *
 * Én korrupt profil må aldri velte hele lørdagsrunden. Testen matar inn en
 * profil som får scoring (unifiedScore) til å kaste, og bekrefter at
 * (a) runden fullfører (200) og de øvrige par fortsatt kan matche, og
 * (b) feilen logges til SystemLog med begge bruker-ID-er.
 */

import { NextRequest } from 'next/server';

const VALID_SECRET = 'test-cron-secret';
const CORRUPT_MARKER = 'NOT_JSON{{';

jest.mock('@/lib/prisma', () => {
  const p = {
    $queryRaw: jest.fn(),
    user: { findMany: jest.fn() },
    matchHistory: { findMany: jest.fn() },
    userBlock: { findMany: jest.fn() },
    systemLog: { create: jest.fn() },
    $transaction: jest.fn(),
  };
  return { __esModule: true, default: p, prisma: p };
});

jest.mock('@/config/features', () => ({
  isMatchingEnabled: () => true,
}));

// Simuler éin korrupt profil: unifiedScore kaster når profilen har CORRUPT_MARKER.
// Alle andre par får eit gyldig resultat, slik at runden kan fullføre for dei.
jest.mock('@/lib/matching/unifiedScorer', () => ({
  unifiedScore: (a: any, b: any) => {
    if (a?.preferences === CORRUPT_MARKER || b?.preferences === CORRUPT_MARKER) {
      throw new Error('Simulert korrupt profil');
    }
    const all = 85;
    return {
      score: 85,
      breakdown: {
        values: all,
        personality: all,
        relationshipStyle: all,
        communication: all,
        futureVision: all,
        boundaries: all,
        emotionalNeeds: all,
        lifeRhythm: all,
        maturity: all,
      },
      level: 'DEEP',
    };
  },
}));

import prisma from '@/lib/prisma';
import { GET } from '@/app/api/cron/matching/route';

const db = prisma as unknown as {
  $queryRaw: jest.Mock;
  user: { findMany: jest.Mock };
  matchHistory: { findMany: jest.Mock };
  userBlock: { findMany: jest.Mock };
  systemLog: { create: jest.Mock };
  $transaction: jest.Mock;
};

function makeReq(): NextRequest {
  return new NextRequest('http://localhost/api/cron/matching', {
    headers: { authorization: `Bearer ${VALID_SECRET}` },
  });
}

const GOOD = {
  lifeSituation: { values: ['family'] },
  relationshipStyle: 'gradual',
  communication: { style: 'direct' },
  futureVision: { goals: ['family'] },
  boundaries: { preferredDistance: 'slow-pace' },
  emotionalNeeds: { needs: ['depth'] },
  personality: { traits: ['open'] },
  lifeRhythm: 'morning',
  maturityLevel: 5,
};

describe('M-3: robust parscoring i cron', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CRON_SECRET = VALID_SECRET;
    db.$queryRaw.mockResolvedValue({ locked: true });
    db.matchHistory.findMany.mockResolvedValue([]);
    db.userBlock.findMany.mockResolvedValue([]);
    db.systemLog.create.mockResolvedValue({});
    db.$transaction.mockImplementation(
      async (fn: (tx: any) => Promise<any>) =>
        fn({
          match: { create: jest.fn().mockResolvedValue({ id: 'm1' }) },
          conversation: { create: jest.fn().mockResolvedValue({}) },
          journeyProgress: { create: jest.fn().mockResolvedValue({}) },
          notification: { create: jest.fn().mockResolvedValue({}) },
          user: { update: jest.fn().mockResolvedValue({}) },
        })
    );
  });

  it('fullfører runden selv om ÉN par-scoring kaster — og logger feilen', async () => {
    // Tre godk profiler + én korrupt. De godk skal fortsatt matche.
    const queued = [
      { id: 'user-a', matchQueuedAt: new Date(), profile: { ...GOOD } },
      { id: 'user-b', matchQueuedAt: new Date(), profile: { ...GOOD } },
      { id: 'corrupt', matchQueuedAt: new Date(), profile: { preferences: CORRUPT_MARKER } },
      { id: 'user-d', matchQueuedAt: new Date(), profile: { ...GOOD } },
    ];
    db.user.findMany.mockResolvedValue(queued);

    // Runde skal IKKE kaste — den fanger feilen per par og fortset.
    const res = await GET(makeReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);

    // Runden fortset for de øvrige: minst ett par blir koblet.
    expect(body.paired).toBeGreaterThan(0);

    // Feilen må ha blitt logget til SystemLog med ERROR og begge bruker-ID-er.
    const logData = db.systemLog.create.mock.calls.map((c) => (c[0] as any).data);
    const scoringError = logData.find(
      (d: any) => d.level === 'ERROR' && /Scoring feila/.test(d.message)
    );
    expect(scoringError).toBeDefined();
    expect(scoringError.metadata).toMatchObject({
      userA: expect.any(String),
      userB: expect.any(String),
    });

    // Den korrupte profilen skal også ha tallfestet avvisningen i hjerteslagset.
    const heartbeat = logData.find(
      (d: any) => /Matching-runde/.test(d.message)
    );
    expect(heartbeat.metadata.rejectReasons.scoring_feil).toBeGreaterThan(0);
  });
});