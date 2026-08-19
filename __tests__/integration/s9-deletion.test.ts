/**
 * ToSom — S-9: Verifiser at sletting er fullstendig (found_each_other)
 *
 * Kaller den EKTEN endJourney()-funksjonen (ikke en simulert transaksjon) og
 * bekrefter:
 *   1. User, Profile, Message, Conversation, JourneyProgress er BORTE for begge
 *   2. MatchHistory, Report, AuditLog BESTÅR (overlever kontosletting)
 *   3. Opplaaste bilde-FILER på disken er slettet (S-9 punkt 5 — reell lekkasjevei)
 */

import path from 'path';
import { writeFile, mkdir, rm, stat } from 'fs/promises';
import { testPrisma } from './setup';
import { endJourney } from '@/lib/journey/endJourney';

const db = testPrisma;

const CONV_ID = 's9-test-conversation';
// Stien endJourney() rydder: {cwd}/public/uploads/images/{conversationId}
const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'uploads', 'images', CONV_ID);

describe('S-9: endJourney(found_each_other) — fullstendig sletting', () => {
  afterAll(async () => {
    // Sikker rydding av test-mappen, også dersom endJourney feilet midt i
    await rm(UPLOAD_DIR, { recursive: true, force: true }).catch(() => {});
  });

  it('sletter konto+innhold+bildefiler, men behold MatchHistory/Report/AuditLog', async () => {
    const suffix = Date.now();
    const userA = await db.user.create({
      data: { id: `s9-a-${suffix}`, email: `s9a${suffix}@example.com`, journeyState: 'MATCHED' },
    });
    const userB = await db.user.create({
      data: { id: `s9-b-${suffix}`, email: `s9b${suffix}@example.com`, journeyState: 'MATCHED' },
    });
    await db.profile.create({ data: { userId: userA.id, age: 30 } });
    await db.profile.create({ data: { userId: userB.id, age: 28 } });

    const match = await db.match.create({
      data: {
        userAId: userA.id,
        userBId: userB.id,
        status: 'active',
        normalizedScore: 0.85,
      },
    });
    // Konversasjon med kjent ID, slik at vi treffer den eksakte opprydningsstien
    const conversation = await db.conversation.create({
      data: { id: CONV_ID, matchId: match.id, userAId: userA.id, userBId: userB.id },
    });
    await db.journeyProgress.create({ data: { userId: userA.id, matchId: match.id, day: 30 } });
    await db.journeyProgress.create({ data: { userId: userB.id, matchId: match.id, day: 30 } });

    // Meldinger, inkludert ett opplastet bilde (DB-rad type=image)
    await db.message.create({ data: { conversationId: conversation.id, senderId: userA.id, content: 'Hei!' } });
    await db.message.create({ data: { conversationId: conversation.id, senderId: userB.id, content: 'Heisann!' } });
    await db.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userA.id,
        content: '/uploads/images/s9-test-conversation/bilde.jpg',
        type: 'image',
      },
    });

    // Opplaaste BILDEFIL på den eksakte diskestien endJourney() rydder
    await mkdir(UPLOAD_DIR, { recursive: true });
    const imgPath = path.join(UPLOAD_DIR, 'bilde.jpg');
    await writeFile(imgPath, Buffer.from([0xff, 0xd8, 0xff, 0xe0]), 'binary');
    await stat(imgPath); // finnes før sletting

    // Report som MÅ overleve kontosletting
    const report = await db.report.create({
      data: {
        reporterId: userA.id,
        reportedId: userB.id,
        matchId: match.id,
        category: 'SPAM',
        description: 's9 test report',
      },
    });

    // --- Kall den EKTEN endJourney ---
    await endJourney(match.id, 'found_each_other');

    // 1) Konto + innhold er borte for begge
    expect(await db.user.findUnique({ where: { id: userA.id } })).toBeNull();
    expect(await db.user.findUnique({ where: { id: userB.id } })).toBeNull();
    expect(await db.profile.findUnique({ where: { userId: userA.id } })).toBeNull();
    expect(await db.profile.findUnique({ where: { userId: userB.id } })).toBeNull();
    expect(await db.message.count({ where: { conversationId: conversation.id } })).toBe(0);
    expect(await db.conversation.findUnique({ where: { id: conversation.id } })).toBeNull();
    expect(await db.journeyProgress.findFirst({ where: { userId: userA.id } })).toBeNull();
    expect(await db.journeyProgress.findFirst({ where: { userId: userB.id } })).toBeNull();
    expect(await db.match.findUnique({ where: { id: match.id } })).toBeNull();

    // 2) MatchHistory, Report og AuditLog BESTÅR
    const [first, second] = userA.id < userB.id ? [userA.id, userB.id] : [userB.id, userA.id];
    const history = await db.matchHistory.findUnique({
      where: { uh_idx: { userAId: first, userBId: second } },
    });
    expect(history).not.toBeNull();
    expect(history?.outcomeA).toBe('found_each_other');

    expect(await db.report.findUnique({ where: { id: report.id } })).not.toBeNull();

    // AuditLog overlever i ANONYMISERT form: aktøren (userA) er slettet, så
    // adminId er nulla ut (SetNull) — loggen består, men refererer ikke til slettet bruker.
    const survivingAudit = await db.auditLog.findFirst({
      where: { action: 'JOURNEY_RESET' },
    });
    expect(survivingAudit).not.toBeNull();
    expect(survivingAudit?.adminId).toBeNull();
    expect(JSON.parse(survivingAudit!.metadata!)).toMatchObject({ outcome: 'found_each_other' });

    // 3) Bildefiler på disken er slettet (S-9 punkt 5 — reell lekkasjevei)
    let fileGone = false;
    try {
      await stat(imgPath);
    } catch {
      fileGone = true;
    }
    expect(fileGone).toBe(true);
  }, 30000);
});