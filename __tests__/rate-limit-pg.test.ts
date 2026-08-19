/**
 * ToSom — Dag 12: Enhetstest for Postgres-basert delt rate limiting
 */

jest.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: jest.fn(),
    $executeRaw: jest.fn(),
    $disconnect: jest.fn(),
  },
}));

import { prisma } from '@/lib/prisma';
import { pgCheck, cleanupStale } from '@/lib/rate-limit-pg';

const mockedPrisma = prisma as unknown as {
  $queryRaw: jest.Mock;
  $executeRaw: jest.Mock;
};

describe('pgCheck (Dag 12)', () => {
  beforeEach(() => {
    mockedPrisma.$queryRaw.mockReset();
    mockedPrisma.$executeRaw.mockReset();
  });

  it('returnerer ok=true når count < max', async () => {
    mockedPrisma.$queryRaw.mockResolvedValue([{ count: 2 }]);
    const r = await pgCheck('tosom:login:user1', 5, 900);
    expect(r).toEqual({ ok: true, remaining: 3 });
  });

  it('returnerer ok=true når count === max (grensen)', async () => {
    mockedPrisma.$queryRaw.mockResolvedValue([{ count: 5 }]);
    const r = await pgCheck('tosom:login:user1', 5, 900);
    expect(r).toEqual({ ok: true, remaining: 0 });
  });

  it('returnerer ok=false når count > max', async () => {
    mockedPrisma.$queryRaw.mockResolvedValue([{ count: 6 }]);
    const r = await pgCheck('tosom:login:user1', 5, 900);
    expect(r.ok).toBe(false);
    expect(r.remaining).toBe(0);
  });

  it('håndterer tomt resultsett (fallback count=1)', async () => {
    mockedPrisma.$queryRaw.mockResolvedValue([]);
    const r = await pgCheck('tosom:login:user1', 5, 900);
    expect(r).toEqual({ ok: true, remaining: 4 });
  });

  it('fail-open: Postgres-feil → ok=true (aldri velter request)', async () => {
    mockedPrisma.$queryRaw.mockRejectedValue(new Error('DB down'));
    const r = await pgCheck('tosom:login:user1', 5, 900);
    expect(r).toEqual({ ok: true, remaining: 5 });
  });

  it('kaller $queryRaw med korrekt nøkkel og vindu', async () => {
    mockedPrisma.$queryRaw.mockResolvedValue([{ count: 1 }]);
    await pgCheck('tosom:sms_send:471', 3, 3600);
    // Tagged-template: første argument er strings-array, etterfølges av interpolasjoner
    const strings = mockedPrisma.$queryRaw.mock.calls[0][0];
    expect(Array.isArray(strings)).toBe(true);
    const joined = (strings as TemplateStringsArray).join('?');
    expect(joined).toContain('RateLimitCounter');
    expect(joined).toContain('ON CONFLICT');
    const args = mockedPrisma.$queryRaw.mock.calls[0].slice(1);
    expect(args).toContain('tosom:sms_send:471');
    expect(args).toContain(3600);
  });
});

describe('cleanupStale (Dag 12)', () => {
  it('returnerer antall slettede rader', async () => {
    mockedPrisma.$executeRaw.mockResolvedValue(12);
    const n = await cleanupStale();
    expect(n).toBe(12);
  });

  it('returnerer 0 ved Postgres-feil', async () => {
    mockedPrisma.$executeRaw.mockRejectedValue(new Error('DB down'));
    const n = await cleanupStale();
    expect(n).toBe(0);
  });
});
