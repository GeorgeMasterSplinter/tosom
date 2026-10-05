/**
 * PL-01d (K-1) — Integrasjonstest: kontosletting med aktiv reise
 *
 * Kaller den EKTEN POST /api/settings/delete-account-ruten mot test-DBen
 * (ikke en simulert transaksjon) og bekrefter:
 *   1. User, Profile, Message, Conversation og JourneyProgress for A er BORTE
 *   2. B lever og er satt til IDLE (endJourney 'early_exit')
 *   3. MatchHistory overlever (to ID-er, ingen innhold)
 *
 * Kun auth, CSRF og e-post mockes — Prisma, endJourney og transaksjonen er ekte.
 */

jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
}));
jest.mock('@/lib/auth/csrf', () => ({
  csrfCheck: jest.fn(),
}));
jest.mock('@/lib/email', () => ({
  sendDeletionConfirmationEmail: jest.fn().mockResolvedValue(undefined),
}));

import { NextRequest } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { csrfCheck } from '@/lib/auth/csrf';
// Viktig: setup importeres FØR ruten — den setter global.prisma (test-DBen),
// som @/lib/prisma genbrukes. I motsatt rekkefølge kobler ruten til dev-DBen.
import { testPrisma } from './setup';
import { POST } from '@/app/api/settings/delete-account/route';

const db = testPrisma;
const mockedSession = getServerSession as jest.Mock;
const mockedCsrf = csrfCheck as jest.Mock;

describe('PL-01d: kontosletting med aktiv reise (K-1)', () => {
  it('sletter A ende-til-ende; B blir IDLE; MatchHistory overlever', async () => {
    mockedCsrf.mockResolvedValue({ token: 'csrf-token' });

    const suffix = Date.now();
    const userA = await db.user.create({
      data: {
        id: `pl01-a-${suffix}`,
        email: `pl01a${suffix}@example.com`,
        name: 'Anna Test',
        journeyState: 'ON_JOURNEY',
      },
    });
    const userB = await db.user.create({
      data: {
        id: `pl01-b-${suffix}`,
        email: `pl01b${suffix}@example.com`,
        name: 'Bjørn Test',
        journeyState: 'ON_JOURNEY',
      },
    });
    await db.profile.create({ data: { userId: userA.id, age: 30 } });
    await db.profile.create({ data: { userId: userB.id, age: 31 } });

    const match = await db.match.create({
      data: { userAId: userA.id, userBId: userB.id, status: 'active', normalizedScore: 0.8 },
    });
    const conversation = await db.conversation.create({
      data: { matchId: match.id, userAId: userA.id, userBId: userB.id },
    });
    await db.journeyProgress.create({ data: { userId: userA.id, matchId: match.id, day: 5 } });
    await db.journeyProgress.create({ data: { userId: userB.id, matchId: match.id, day: 5 } });

    // Meldinger fra begge parter — forsvinner når samtalen slettes
    await db.message.create({ data: { conversationId: conversation.id, senderId: userA.id, content: 'Hei!' } });
    await db.message.create({ data: { conversationId: conversation.id, senderId: userB.id, content: 'Heisann!' } });

    // A sletter kontoen sin
    mockedSession.mockResolvedValue({ user: { id: userA.id, email: userA.email } });
    const req = new NextRequest('http://localhost/api/settings/delete-account', {
      method: 'POST',
      body: JSON.stringify({ confirmation: 'DELETE' }),
      headers: { 'content-type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);

    // 1) A er borte — full sletting
    expect(await db.user.findUnique({ where: { id: userA.id } })).toBeNull();
    expect(await db.profile.findUnique({ where: { userId: userA.id } })).toBeNull();
    expect(await db.conversation.findUnique({ where: { id: conversation.id } })).toBeNull();
    expect(await db.message.findMany({ where: { conversationId: conversation.id } })).toEqual([]);
    expect(await db.journeyProgress.findMany({ where: { userId: userA.id } })).toEqual([]);
    expect(await db.match.findUnique({ where: { id: match.id } })).toBeNull();

    // 2) B lever og er IDLE (kan matche på nytt)
    const b = await db.user.findUnique({ where: { id: userB.id } });
    expect(b).not.toBeNull();
    expect(b!.journeyState).toBe('IDLE');
    expect(await db.profile.findUnique({ where: { userId: userB.id } })).not.toBeNull();

    // 3) MatchHistory overlever (anonymisert historikk, ingen innhold)
    const history = await db.matchHistory.findFirst({
      where: {
        OR: [
          { userAId: userA.id, userBId: userB.id },
          { userAId: userB.id, userBId: userA.id },
        ],
      },
    });
    expect(history).not.toBeNull();
  });
});
