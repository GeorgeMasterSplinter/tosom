/**
 * ToSom — S-10: Anonymiserings-kjerne (inaktive kontoer)
 *
 * Kaller den EKTEN anonymizeUser()-funksjonen og bekrefter:
 *   1. Auth-materiell (session, account, tokens) er slettet
 *   2. Den private Profile er slettet
 *   3. PII på User er nullset (email anonymisert-unikt, name/phone/password null)
 *      og deletedAt er satt — men User-raden BEHOLDES (FK-integritet)
 *   4. MatchHistory og Report BESTÅR (anonymisert referanse)
 *   5. Partnerens data (profile) røres IKKE — anonymisering er partner-sikker
 *   6. Idempotens: andre kall → 'already_deleted'; ukjent → 'not_found'
 *
 * Delikate Conversation/Message/Match-avgrensninger (delte med motpart)
 * dekkes av en senere retention-cron-test — kjernen her er bevisst avgrensa.
 */

import { testPrisma } from './integration/setup';
import { anonymizeUser } from '@/lib/privacy/anonymize';

const db = testPrisma;

describe('S-10: anonymizeUser — anonymiserer inaktiv konto (kjernen)', () => {
  it('sletter auth+profile, nuller PII, beholder User/MatchHistory/Report, rører ikke partneren', async () => {
    const suffix = Date.now();

    // Én anonymiserbar bruker + sin motpart
    const userA = await db.user.create({
      data: {
        id: `s10-a-${suffix}`,
        email: `s10a${suffix}@example.com`,
        name: 'Anonymisert Navn',
        phone: '41234567',
        password: 'hemmelig-passord',
        verified: true,
        phoneVerified: true,
        journeyState: 'QUEUED',
        matchQueuedAt: new Date(),
      },
    });
    const userB = await db.user.create({
      data: { id: `s10-b-${suffix}`, email: `s10b${suffix}@example.com`, name: 'Partneren' },
    });

    // Auth-materiell som MÅ dø
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.session.create({
      data: { userId: userA.id, sessionToken: `tok-a-${suffix}`, expires: future },
    });
    await db.account.create({
      data: { userId: userA.id, provider: 'email', type: 'email', providerAccountId: `acc-${suffix}` },
    });
    await db.passwordResetToken.create({
      data: { userId: userA.id, tokenHash: `reset-${suffix}`, expiresAt: future },
    });
    await db.phoneVerification.create({
      data: { userId: userA.id, phone: '41234567', code: '123456', expiresAt: future },
    });
    await db.magicLinkToken.create({
      data: { email: userA.email, token: `magic-${suffix}`, expiresAt: future },
    });
    await db.notification.create({
      data: { userId: userA.id, type: 'MATCH', message: 'test' },
    });

    // Privat profile for begge
    await db.profile.create({ data: { userId: userA.id, age: 31 } });
    await db.profile.create({ data: { userId: userB.id, age: 29 } });

    // Match + rapport som MÅ overleve (anonymisert referanse)
    const match = await db.match.create({
      data: { userAId: userA.id, userBId: userB.id, status: 'active', normalizedScore: 0.8 },
    });
    const report = await db.report.create({
      data: { reporterId: userA.id, reportedId: userB.id, matchId: match.id, category: 'SPAM' },
    });
    await db.matchHistory.create({
      data: {
        userAId: userA.id < userB.id ? userA.id : userB.id,
        userBId: userA.id < userB.id ? userB.id : userA.id,
        matchId: match.id,
        outcomeA: 'completed',
        outcomeB: 'completed',
      },
    });

    // --- Kall den EKTEN anonymizeUser ---
    const result = await anonymizeUser(userA.id, 'inactivity');

    // 0) Rapportert som anonymisert
    expect(result.anonymized).toBe(true);

    // 1) Auth-materiell er borte
    expect(await db.session.count({ where: { userId: userA.id } })).toBe(0);
    expect(await db.account.count({ where: { userId: userA.id } })).toBe(0);
    expect(await db.passwordResetToken.count({ where: { userId: userA.id } })).toBe(0);
    expect(await db.phoneVerification.count({ where: { userId: userA.id } })).toBe(0);
    expect(await db.magicLinkToken.count({ where: { email: `s10a${suffix}@example.com` } })).toBe(0);
    expect(await db.notification.count({ where: { userId: userA.id } })).toBe(0);

    // 2) Privat profile er borte
    expect(await db.profile.findUnique({ where: { userId: userA.id } })).toBeNull();

    // 3) PII nullset + deletedAt satt + User-raden BEHOLDES
    const updatedA = await db.user.findUnique({ where: { id: userA.id } });
    expect(updatedA).not.toBeNull();
    expect(updatedA!.deletedAt).not.toBeNull();
    expect(updatedA!.name).toBeNull();
    expect(updatedA!.phone).toBeNull();
    expect(updatedA!.password).toBeNull();
    expect(updatedA!.verified).toBe(false);
    expect(updatedA!.phoneVerified).toBe(false);
    expect(updatedA!.journeyState).toBe('IDLE');
    expect(updatedA!.matchQueuedAt).toBeNull();
    // E-post er anonymisert UNIKT (holder @@unique([email]) intakt) og ikke originalen
    expect(updatedA!.email).not.toBe(`s10a${suffix}@example.com`);
    expect(updatedA!.email).toMatch(/^anonymized-.+@anonymized\.tosom$/);
    // Unikt — ingen annen bruker deler e-posten
    expect(await db.user.count({ where: { email: updatedA!.email } })).toBe(1);

    // 4) MatchHistory + Report BESTÅR (FK-integritet ved å beholde User-raden)
    const hist = await db.matchHistory.findFirst({ where: { matchId: match.id } });
    expect(hist).not.toBeNull();
    expect(await db.report.findUnique({ where: { id: report.id } })).not.toBeNull();

    // 5) Partnerens data røres IKKE
    const partnerProfile = await db.profile.findUnique({ where: { userId: userB.id } });
    expect(partnerProfile).not.toBeNull();
    const partner = await db.user.findUnique({ where: { id: userB.id } });
    expect(partner!.deletedAt).toBeNull();
    expect(partner!.name).toBe('Partneren');
  }, 30000);

  it('er idempotent: andre kall → already_deleted', async () => {
    const suffix = Date.now();
    const u = await db.user.create({
      data: { id: `s10-idem-${suffix}`, email: `s10idem${suffix}@example.com` },
    });
    await db.profile.create({ data: { userId: u.id, age: 40 } });

    const first = await anonymizeUser(u.id);
    expect(first.anonymized).toBe(true);

    const second = await anonymizeUser(u.id);
    expect(second.anonymized).toBe(false);
    expect(second.skipped).toBe('already_deleted');
    // Profile fortsatt borte (ikke kastet)
    expect(await db.profile.findUnique({ where: { userId: u.id } })).toBeNull();
  }, 30000);

  it('ukjent bruker → not_found (feiler ikke)', async () => {
    const result = await anonymizeUser('ikke-en-riktig-bruker-id');
    expect(result.anonymized).toBe(false);
    expect(result.skipped).toBe('not_found');
  });
});
