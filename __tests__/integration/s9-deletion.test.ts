/**
 * ToSom — S-9: Verifiser at sletting er fullstendig (found_each_other)
 *
 * Kaller den EKTEN endJourney()-funksjonen (ikke en simulert transaksjon) og
 * bekrefter:
 *   1. User, Profile, Message, Conversation, JourneyProgress er BORTE for begge
 *   2. MatchHistory, Report, AuditLog BESTÅR (overlever kontosletting)
 *   3. Opplaaste bilde-OBJEKTA i lagringen er slettet (GDPR art. 17 — reell
 *      lekkasjevei). Testen kjører mot local-driver mot ein isolert tempdir,
 *      slik at vi kan verifisere at fila faktisk er borte frå disken.
 *
 * (Oppdatert: bildet knyttest no til meldinga via imageKey og slettast per
 * nøkkel via lib/storage — ikkje lenger som mappe-rydding i public/.)
 */

import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { testPrisma } from './setup';
import { endJourney } from '@/lib/journey/endJourney';
import { LocalImageStorage, _resetImageStorageForTesting } from '@/lib/storage';

const db = testPrisma;

const CONV_ID = 's9-test-conversation';
// Nøkkelen bildet får i lagringen (format: {conversationId}/{uuid}.{ext})
const IMAGE_KEY = 's9-test-conversation/bilde.jpg';

describe('S-9: endJourney(found_each_other) — fullstendig sletting', () => {
  let storageDir: string;
  let storage: LocalImageStorage;

  beforeAll(async () => {
    // Isoler storage til ein tempdir for denne testen.
    storageDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tosom-s9-'));
    // Setje env FØR endJourney kallar getImageStorage() (singleton).
    process.env.STORAGE_DRIVER = 'local';
    process.env.STORAGE_LOCAL_DIR = storageDir;
    _resetImageStorageForTesting();
    storage = new LocalImageStorage({ rootDir: storageDir });
  });

  afterAll(async () => {
    _resetImageStorageForTesting();
    delete process.env.STORAGE_DRIVER;
    delete process.env.STORAGE_LOCAL_DIR;
    await fs.rm(storageDir, { recursive: true, force: true }).catch(() => {});
  });

  it('sletter konto+innhold+bilde-objekt, men behold MatchHistory/Report/AuditLog', async () => {
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
    // Konversasjon med kjent ID
    const conversation = await db.conversation.create({
      data: { id: CONV_ID, matchId: match.id, userAId: userA.id, userBId: userB.id },
    });
    await db.journeyProgress.create({ data: { userId: userA.id, matchId: match.id, day: 30 } });
    await db.journeyProgress.create({ data: { userId: userB.id, matchId: match.id, day: 30 } });

    // Meldingar: to tekst + ein bilde-melding KNYTT TIL ETT OBJEKT I LAGRINGA
    await db.message.create({ data: { conversationId: conversation.id, senderId: userA.id, content: 'Hei!' } });
    await db.message.create({ data: { conversationId: conversation.id, senderId: userB.id, content: 'Heisann!' } });
    await db.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userA.id,
        content: '',
        type: 'image',
        imageKey: IMAGE_KEY,
      },
    });

    // Last opp BILDE-OBJEKTA i lagringa (via local-driver mot tempdir)
    await storage.putImage(IMAGE_KEY, Buffer.from([0xff, 0xd8, 0xff, 0xe0]), { contentType: 'image/jpeg' });
    expect(await storage.exists(IMAGE_KEY)).toBe(true);

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

    const survivingAudit = await db.auditLog.findFirst({
      where: { action: 'JOURNEY_RESET' },
    });
    expect(survivingAudit).not.toBeNull();
    expect(survivingAudit?.adminId).toBeNull();
    expect(JSON.parse(survivingAudit!.metadata!)).toMatchObject({ outcome: 'found_each_other' });

    // 3) Bilde-OBJEKTA i lagringa er slettet (GDPR art. 17 — reell lekkasjevei)
    expect(await storage.exists(IMAGE_KEY)).toBe(false);
    expect(await storage._getBuffer(IMAGE_KEY)).toBeNull();
  }, 30000);
});
