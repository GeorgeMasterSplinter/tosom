/**
 * ToSom — Integrasjonstest-setup (E3)
 */

import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const testDbUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL ||
  'postgres://tosom:tosom@localhost:5433/tosom_test';

const prisma = new PrismaClient({ datasources: { db: { url: testDbUrl } } });

if (!global.prisma) {
  global.prisma = prisma;
}

beforeAll(async () => {
  try {
    await global.prisma!.$connect();
  } catch (err) {
    console.warn('⚠️  Kan ikke koble til test-DB — hopp over integrasjonstester:', (err as Error).message);
    throw err;
  }
});

beforeEach(async () => {
  try {
    await global.prisma!.message.deleteMany({});
    await global.prisma!.journeyMilestone.deleteMany({});
    await global.prisma!.journeyStateLog.deleteMany({});
    await global.prisma!.resonanceSession.deleteMany({});
    await global.prisma!.journeyProgress.deleteMany({});
    await global.prisma!.conversation.deleteMany({});
    await global.prisma!.notification.deleteMany({});
    await global.prisma!.matchHistory.deleteMany({});
    await global.prisma!.auditLog.deleteMany({});
    await global.prisma!.systemLog.deleteMany({});
    await global.prisma!.match.deleteMany({});
    await global.prisma!.profile.deleteMany({});
    await global.prisma!.user.deleteMany({});
  } catch {
    // Tabellene finnes ikke ennå — ignorer
  }
});

afterAll(async () => {
  try {
    await global.prisma!.$disconnect();
  } catch { /* ignore */ }
});

export { prisma as testPrisma };