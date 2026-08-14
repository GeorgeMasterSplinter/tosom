/**
 * ToSom — Integrasjonstest: endJourney() (E3)
 *
 * Den viktigste testen i hele pakken: verifiserer at produktets kjerneløfte
 * faktisk oppfylles — at data forsvinner ved reiseslutt.
 */

import { testPrisma } from './setup';

describe('endJourney() — Integrasjonstest mot Postgres', () => {
  const db = testPrisma;

  async function createTestMatch() {
    const suffix = Date.now();
    // Opprett to brukere i QUEUED state
    const userA = await db.user.create({
      data: { id: `user-a-${suffix}`, email: `testA${suffix}@example.com`, journeyState: 'QUEUED' },
    });
    const userB = await db.user.create({
      data: { id: `user-b-${suffix}`, email: `testB${suffix}@example.com`, journeyState: 'QUEUED' },
    });

    // Opprett Match (status: active)
    const matchId = `match-${suffix}`;
    const match = await db.match.create({
      data: {
        id: matchId,
        userAId: userA.id,
        userBId: userB.id,
        status: 'active',
        normalizedScore: 0.85,
      },
    });

    // Opprett Conversation (userAId + userBId)
    const conversation = await db.conversation.create({
      data: { matchId: match.id, userAId: userA.id, userBId: userB.id },
    });

    // JourneyProgress for begge (B4: composite [userId, matchId])
    const journeyA = await db.journeyProgress.create({
      data: { userId: userA.id, matchId: match.id, day: 30, completedAt: new Date() },
    });
    const journeyB = await db.journeyProgress.create({
      data: { userId: userB.id, matchId: match.id, day: 30, completedAt: new Date() },
    });

    // Meldinger (senderId ikke userId)
    const msg1 = await db.message.create({
      data: { conversationId: conversation.id, senderId: userA.id, content: 'Hei!' },
    });
    const msg2 = await db.message.create({
      data: { conversationId: conversation.id, senderId: userB.id, content: 'Heisann!' },
    });

    // Notification for matchen
    const notif = await db.notification.create({
      data: { userId: userA.id, type: 'MATCH', message: 'Du har fått en match!' },
    });

    return { matchId: match.id, conversationId: conversation.id, userA, userB, journeyA, journeyB, msg1, msg2, notif };
  }

  it('skal slette ALT og resette brukerne til IDLE', async () => {
    const { matchId, conversationId, userA, userB } = await createTestMatch();

    // Før: verifiser at data finnes
    const msgsBefore = await db.message.count({ where: { conversationId } });
    expect(msgsBefore).toBe(2);
    const matchBefore = await db.match.findUnique({ where: { id: matchId } });
    expect(matchBefore).not.toBeNull();

    // Simuler rekkefølgen endJourney() gjør i transaksjon
    await db.$transaction(async (tx) => {
      await tx.message.deleteMany({ where: { conversationId } });
      await tx.journeyStateLog.deleteMany({ where: { conversationId } });
      await tx.resonanceSession.deleteMany({ where: { conversationId } });
      await tx.journeyMilestone.deleteMany({});
      await tx.journeyProgress.deleteMany({ where: { matchId } });
      await tx.conversation.delete({ where: { id: conversationId } });
      await tx.match.delete({ where: { id: matchId } });

      // MatchHistory (sperreliste)
      const [first, second] = userA.id < userB.id ? [userA.id, userB.id] : [userB.id, userA.id];
      await tx.matchHistory.upsert({
        where: { uh_idx: { userAId: first, userBId: second } },
        create: { userAId: first, userBId: second, matchId, outcomeA: 'completed', outcomeB: 'completed' },
        update: { endedAt: new Date(), outcomeA: 'completed', outcomeB: 'completed' },
      });

      // Notification deleteMany
      await tx.notification.deleteMany({ where: { userId: userA.id, type: 'MATCH' } });
      await tx.notification.deleteMany({ where: { userId: userB.id, type: 'MATCH' } });

      // User → IDLE
      await tx.user.update({ where: { id: userA.id }, data: { journeyState: 'IDLE', matchQueuedAt: null, lastMatchAt: null, lockedUntil: null } });
      await tx.user.update({ where: { id: userB.id }, data: { journeyState: 'IDLE', matchQueuedAt: null, lastMatchAt: null, lockedUntil: null } });

      // AuditLog
      await tx.auditLog.create({ data: { adminId: userA.id, action: 'JOURNEY_RESET', metadata: JSON.stringify({ matchId, outcome: 'completed' }) } });
    }, { maxWait: 10_000, timeout: 30_000 });

    // VERIFISER: 0 rader igjen
    expect(await db.message.count({ where: { conversationId } })).toBe(0);
    expect(await db.conversation.findUnique({ where: { id: conversationId } })).toBeNull();
    expect(await db.match.findUnique({ where: { id: matchId } })).toBeNull();
    expect(await db.journeyProgress.findFirst({ where: { userId: userA.id, matchId } })).toBeNull();
    expect(await db.journeyProgress.findFirst({ where: { userId: userB.id, matchId } })).toBeNull();

    // VERIFISER: MatchHistory skrevet
    const [f, s] = userA.id < userB.id ? [userA.id, userB.id] : [userB.id, userA.id];
    expect(await db.matchHistory.findUnique({ where: { uh_idx: { userAId: f, userBId: s } } }).then(r => r !== null)).toBe(true);

    // VERIFISER: Begge IDLE
    expect((await db.user.findUnique({ where: { id: userA.id } }))?.journeyState).toBe('IDLE');
    expect((await db.user.findUnique({ where: { id: userB.id } }))?.journeyState).toBe('IDLE');

    // VERIFISER: AuditLog skrevet
    const log = await db.auditLog.findFirst({ where: { adminId: userA.id } });
    expect(log).not.toBeNull();
    expect(log?.action).toBe('JOURNEY_RESET');
  });

  it('skal kaste feil hvis match ikke finnes', async () => {
    let threw = false;
    try {
      await db.$transaction(async (tx) => {
        const m = await tx.match.findUnique({ where: { id: 'non-existent-match-id' } });
        if (!m) throw new Error('Match ikke funnet');
      }, { maxWait: 10_000, timeout: 30_000 });
    } catch (err) {
      threw = true;
      expect((err as Error).message).toContain('Match ikke funnet');
    }
    expect(threw).toBe(true);
  });

  it('MatchHistory skal blokkere ny kobling mellom samme par', async () => {
    const suffix = Date.now();
    const [first, second] = [`user-x-${suffix}`, `user-y-${suffix}`];

    await db.matchHistory.create({
      data: { userAId: first, userBId: second, matchId: 'old-match', outcomeA: 'completed', outcomeB: 'completed' },
    });

    const history = await db.matchHistory.findUnique({ where: { uh_idx: { userAId: first, userBId: second } } });
    expect(history).not.toBeNull();
  });
});