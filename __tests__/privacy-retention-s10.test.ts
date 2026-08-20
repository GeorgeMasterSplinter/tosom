/**
 * ToSom — S-10: Oppbevaringskron (retention)
 *
 * Kaller den EKTEN runRetention() og bekrefter:
 *   1. RETENTION_ENABLED av → skipped, ingenting skjer
 *   2. Inaktiv ≥12 mnd → anonymiseres (deletedAt satt, profile borte)
 *   3. Inaktiv 11–12 mnd → ett [RETENTION]-varsel
 *   4. Nylig varslet → dedupliseres (ingen nytt varsel)
 *   5. Nylig aktiv → røres ikke
 *
 * isRetentionEnabled() leses LIVE fra env, så flagget slås av/på per test.
 * afterAll rydder opp i de modellene felles integration/setup.ts beforeEach
 * IKKE rydder (auth-materiell, profile, user) for å unngå kontaminering.
 */

import { testPrisma } from './integration/setup';
import { runRetention } from '@/lib/privacy/retention';

const db = testPrisma;

const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000);

describe('S-10: runRetention — oppbevaringskron', () => {
  let suffix: number;
  const ids: string[] = [];

  beforeAll(() => {
    suffix = Date.now();
  });

  afterAll(async () => {
    process.env.RETENTION_ENABLED = 'false';
    try {
      await db.session.deleteMany({ where: { userId: { in: ids } } });
      await db.account.deleteMany({ where: { userId: { in: ids } } });
      await db.passwordResetToken.deleteMany({ where: { userId: { in: ids } } });
      await db.phoneVerification.deleteMany({ where: { userId: { in: ids } } });
      await db.magicLinkToken.deleteMany({ where: { email: { contains: 's10r' } } });
      await db.twoFactorSecret.deleteMany({ where: { userId: { in: ids } } });
      await db.profile.deleteMany({ where: { userId: { in: ids } } });
      await db.notification.deleteMany({ where: { userId: { in: ids } } });
      await db.systemLog.deleteMany({ where: { module: 'cron:retention' } });
      await db.user.deleteMany({ where: { id: { in: ids } } });
    } catch {
      // Best-effort cleanup.
    }
  });

  it('RETENTION_ENABLED av → skipped, ingen endringer', async () => {
    const id = `s10r-off-${suffix}`;
    ids.push(id);
    await db.user.create({
      data: { id, email: `s10roff${suffix}@example.com`, name: 'Av', updatedAt: daysAgo(13 * 30) },
    });

    process.env.RETENTION_ENABLED = 'false';
    const stats = await runRetention();

    expect(stats.skipped).toBe(true);
    const u = await db.user.findUnique({ where: { id } });
    expect(u?.deletedAt).toBeNull();
  });

  it('kategoriserer: 12m anonymiseres, 11m varsles, nylig rørt ikke, dedup', async () => {
    process.env.RETENTION_ENABLED = 'true';

    // 1) ≥12 mnd → anonymiseres
    const anonId = `s10r-anon-${suffix}`;
    ids.push(anonId);
    await db.user.create({
      data: { id: anonId, email: `s10ranon${suffix}@example.com`, name: 'Anon', updatedAt: daysAgo(13 * 30) },
    });
    await db.profile.create({ data: { userId: anonId, age: 35 } });

    // 2) 11–12 mnd → varsel
    const warnId = `s10r-warn-${suffix}`;
    ids.push(warnId);
    await db.user.create({
      data: { id: warnId, email: `s10rwarn${suffix}@example.com`, name: 'Varsel', updatedAt: daysAgo(11 * 30 + 5) },
    });

    // 3) 11–12 mnd, ALLEREDE varslet → dedup
    const recentId = `s10r-recent-${suffix}`;
    ids.push(recentId);
    await db.user.create({
      data: { id: recentId, email: `s10rrecent${suffix}@example.com`, name: 'Nylig', updatedAt: daysAgo(11 * 30 + 5) },
    });
    await db.notification.create({
      data: { userId: recentId, type: 'SYSTEM', message: '[RETENTION] forrige varsel' },
    });

    // 4) Nylig aktiv → rørt ikke
    const freshId = `s10r-fresh-${suffix}`;
    ids.push(freshId);
    await db.user.create({
      data: { id: freshId, email: `s10rfresh${suffix}@example.com`, name: 'Frisk', updatedAt: daysAgo(2) },
    });

    const stats = await runRetention();
    expect(stats.skipped).toBe(false);

    // 1) Anonymisert
    const afterAnon = await db.user.findUnique({ where: { id: anonId } });
    expect(afterAnon?.deletedAt).not.toBeNull();
    expect(await db.profile.findUnique({ where: { userId: anonId } })).toBeNull();
    expect(stats.anonymized).toBeGreaterThanOrEqual(1);

    // 2) Akkurat ett varsel
    expect(await db.notification.count({ where: { userId: warnId, message: { startsWith: '[RETENTION]' } } })).toBe(1);
    expect((await db.user.findUnique({ where: { id: warnId } }))?.deletedAt).toBeNull();

    // 3) Dedup: fortsatt ett varsel (det opprinnelige), ikke to
    expect(await db.notification.count({ where: { userId: recentId, message: { startsWith: '[RETENTION]' } } })).toBe(1);

    // 4) Nylig aktiv rørt ikke
    expect((await db.user.findUnique({ where: { id: freshId } }))?.deletedAt).toBeNull();
    expect(await db.notification.count({ where: { userId: freshId } })).toBe(0);

    // Stats: kun warnId varslet
    expect(stats.warned).toBe(1);
  }, 30000);
});
