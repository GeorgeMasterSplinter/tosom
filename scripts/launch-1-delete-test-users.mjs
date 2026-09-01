#!/usr/bin/env node
/**
 * ToSom lansering — Steg 1: Slett testbrukarar frå PRODUKSJON.
 *
 * Bruk:
 *   DATABASE_URL="postgres://..." node scripts/launch-1-delete-test-users.mjs          # DRY RUN (standard)
 *   DATABASE_URL="postgres://..." node scripts/launch-1-delete-test-users.mjs --apply  # faktisk sletting
 *
 * Sikkerheit:
 * - Dry run er standard. --apply krevs for faktisk sletting.
 * - Søket treff berre brukarar med epost/namn som inneheld test1 eller test2.
 */

import { PrismaClient } from '@prisma/client';

const APPLY = process.argv.includes('--apply');
const url = process.env.DATABASE_URL;
if (!url) {
  console.error('FEIL: DATABASE_URL manglar. Eksempel:\n  DATABASE_URL="postgres://..." node scripts/launch-1-delete-test-users.mjs');
  process.exit(1);
}

const prisma = new PrismaClient({ datasourceUrl: url });
const PATTERNS = ['test1', 'test2'];

async function main() {
  const users = await prisma.user.findMany({
    where: {
      OR: PATTERNS.flatMap((p) => [
        { email: { contains: p, mode: 'insensitive' } },
        { name: { contains: p, mode: 'insensitive' } },
      ]),
    },
    orderBy: { createdAt: 'asc' },
  });

  if (users.length === 0) {
    console.log('Ingen testbrukarar funne — inga sletting nødvendig.');
    return;
  }

  console.log(`Funne ${users.length} testbrukar(ar):`);
  for (const u of users) {
    console.log(`  - ${u.id}  ${u.email}  ${u.name || ''}  (oppretta ${u.createdAt.toISOString().slice(0, 10)})`);
  }

  const details = [];
  for (const u of users) {
    const uid = u.id;
    const convs = await prisma.conversation.findMany({
      where: { OR: [{ userAId: uid }, { userBId: uid }] },
      select: { id: true },
    });
    const convIds = convs.map((c) => c.id);
    const or2 = { OR: [{ userAId: uid }, { userBId: uid }] };
    const counts = {};
    counts.messages = await prisma.message.count({ where: { OR: [{ senderId: uid }, ...(convIds.length ? [{ conversationId: { in: convIds } }] : [])] } });
    counts.conversations = await prisma.conversation.count({ where: or2 });
    counts.matches = await prisma.match.count({ where: or2 });
    counts.matchHistory = await prisma.matchHistory.count({ where: or2 });
    counts.reports = await prisma.report.count({ where: { OR: [{ reporterId: uid }, { reportedId: uid }] } });
    counts.blocks = await prisma.userBlock.count({ where: { OR: [{ blockerId: uid }, { blockedId: uid }] } });
    counts.journeyProgress = await prisma.journeyProgress.count({ where: { userId: uid } });
    counts.journeyStateLogs = await prisma.journeyStateLog.count({ where: { conversationId: { in: convIds } } });
    counts.resonanceSessions = await prisma.resonanceSession.count({ where: { conversationId: { in: convIds } } });
    counts.notifications = await prisma.notification.count({ where: { userId: uid } });
    counts.sessions = await prisma.session.count({ where: { userId: uid } });
    counts.accounts = await prisma.account.count({ where: { userId: uid } });
    counts.orders = await prisma.order.count({ where: { userId: uid } });
    counts.resetTokens = await prisma.passwordResetToken.count({ where: { userId: uid } });
    counts.phoneVerif = await prisma.phoneVerification.count({ where: { userId: uid } });
    counts.profiles = await prisma.profile.count({ where: { userId: uid } });
    counts.twoFactor = await prisma.twoFactorSecret.count({ where: { userId: uid } });
    details.push({ u, convIds, or2, counts });
    console.log(`\n  Relasjonar for ${u.email}:`);
    for (const [k, v] of Object.entries(counts)) console.log(`    ${k}: ${v}`);
  }

  if (!APPLY) {
    console.log('\nDRY RUN — ingenting sletta. Kjør med --apply for faktisk sletting.');
    return;
  }

  // ---------- AKTUELL SLETTING (FK-rekkefølge) ----------
  for (const d of details) {
    const uid = d.u.id;
    console.log(`\nSlettar data for ${d.u.email} ...`);
    const rm = (model, where) => prisma[model].deleteMany({ where });
    await rm('journeyStateLog', { conversationId: { in: d.convIds } });
    await rm('resonanceSession', { conversationId: { in: d.convIds } });
    await rm('message', { OR: [{ senderId: uid }, ...(d.convIds.length ? [{ conversationId: { in: d.convIds } }] : [])] });
    await rm('conversation', d.or2);
    await rm('matchHistory', d.or2);
    await rm('match', d.or2);
    await rm('report', { OR: [{ reporterId: uid }, { reportedId: uid }] });
    await rm('userBlock', { OR: [{ blockerId: uid }, { blockedId: uid }] });
    await rm('journeyProgress', { userId: uid });
    await rm('notification', { userId: uid });
    await rm('session', { userId: uid });
    await rm('account', { userId: uid });
    await rm('order', { userId: uid });
    await rm('passwordResetToken', { userId: uid });
    await rm('phoneVerification', { userId: uid });
    await rm('twoFactorSecret', { userId: uid });
    await rm('profile', { userId: uid });
    const del = await prisma.user.delete({ where: { id: uid } });
    console.log(`  Brukar ${del.email} sletta. ✅`);
  }

  // Verifisering
  const remaining = await prisma.user.findMany({ select: { email: true, name: true } });
  const remainingMatches = await prisma.match.count();
  const remainingJourney = await prisma.journeyProgress.count();
  console.log('\n=== VERIFISERING ===');
  console.log('Attverande brukarar:', remaining.map((u) => u.email).join(', ') || '(ingen)');
  console.log('Attverande matchar:', remainingMatches);
  console.log('Attverande journeyProgress:', remainingJourney);
  console.log('FERDIG.');
}

main()
  .catch((e) => {
    console.error('FEIL:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());