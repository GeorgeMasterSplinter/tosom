/**
 * ToSom — S-9 (RT1-final): endJourney('no_action') — reise-lukking med
 * BEHOLDTE kontoer (D8: ACCOUNT != JOURNEY, 72-timers-vinduet utløpt)
 *
 * Kaller den EKTEN endJourney()-funksjonen (ikke en simulert transaksjon) og
 * bekrefter:
 *   RT-C08/C09: Reisen lukkes: JourneyProgress, Message, Conversation,
 *               Match og bilde-objekter i lagringen er GONE.
 *   RT-C10:  User-konto slettes ALDRI (begge brukere finnes fortsatt).
 *   RT-C11:  Profile + onboarding beholdes; journeyState resettes til IDLE
 *            (brukeren kan starte ny reise etter vanlige
 *            kvalifikasjonsregler).
 *   RT-C13:  Gratisorden (free quota) beholdes — kvoten er person-basert,
 *            ingen journey-basert recycling (Quota-telleren er uendret).
 *   (MatchHistory, Report, AuditLog BESTÅR — revisjon/trygghet overlever.)
 *
 * (found_each_other har 24-timers grace-period (D) og sletter IKKE
 * umiddelbart — se full-loop-beta STEP 7.)
 *
 * (Oppdatert: bildet knyttest no til meldingen via imageKey og slettast per
 * nøkkel via lib/storage — ikke lenger som mappe-rydding i public/.)
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

describe('S-9: endJourney(no_action) — reise lukkes, kontoer beholdes (RT1-final D8)', () => {
  let storageDir: string;
  let storage: LocalImageStorage;

  beforeAll(async () => {
    // Isoler storage til ein tempdir for denne testen.
    storageDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tosom-s9-'));
    // Sette env FØR endJourney kallar getImageStorage() (singleton).
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

  it('lukker reisen (innhold borte) men beholder konto, profil, onboarding og gratisorden', async () => {
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
    await db.journeyProgress.create({ data: { userId: userA.id, matchId: match.id, day: 14 } });
    await db.journeyProgress.create({ data: { userId: userB.id, matchId: match.id, day: 14 } });

    // Meldinger: to tekst + ein bilde-melding KNYTT TIL ETT OBJEKT I LAGRINGA
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

    // Report som MÅ overleve reise-lukking
    const report = await db.report.create({
      data: {
        reporterId: userA.id,
        reportedId: userB.id,
        matchId: match.id,
        category: 'SPAM',
        description: 's9 test report',
      },
    });

    // Gratisordren (free quota) — person-basert, må BEHOLDES ved
    // no_action (RT-C13: ingen journey-basert recycling).
    for (const u of [userA, userB]) {
      await db.order.create({
        data: {
          userId: u.id,
          amount: 0,
          currency: 'NOK',
          status: 'PAID',
          provider: 'free_quota',
          freeQuota: true,
          withdrawalWaiver: false,
          completedAt: new Date(),
        },
      });
    }
    const quotaBefore = await db.quota.findUnique({ where: { id: 'free_users' } });

    // --- Kall den EKTEN endJourney ---
    await endJourney(match.id, 'no_action');

    // RT-C08/C09: Reisen lukkes — innholdet er borte
    expect(await db.message.count({ where: { conversationId: conversation.id } })).toBe(0);
    expect(await db.conversation.findUnique({ where: { id: conversation.id } })).toBeNull();
    expect(await db.journeyProgress.findFirst({ where: { userId: userA.id } })).toBeNull();
    expect(await db.journeyProgress.findFirst({ where: { userId: userB.id } })).toBeNull();
    expect(await db.match.findUnique({ where: { id: match.id } })).toBeNull();

    // RT-C10: User-konto slettes ALDRI ved no_action (D8)
    expect(await db.user.findUnique({ where: { id: userA.id } })).not.toBeNull();
    expect(await db.user.findUnique({ where: { id: userB.id } })).not.toBeNull();

    // RT-C11: Profile + onboarding beholdes; journeyState resettes til IDLE
    expect(await db.profile.findUnique({ where: { userId: userA.id } })).not.toBeNull();
    expect(await db.profile.findUnique({ where: { userId: userB.id } })).not.toBeNull();
    const aAfter = await db.user.findUnique({ where: { id: userA.id } });
    const bAfter = await db.user.findUnique({ where: { id: userB.id } });
    expect(aAfter?.journeyState).toBe('IDLE');
    expect(bAfter?.journeyState).toBe('IDLE');

    // RT-C13: Gratisorden beholdes; Quota-telleren uendret
    const remainingOrders = await db.order.findMany({
      where: { userId: { in: [userA.id, userB.id] }, freeQuota: true },
    });
    expect(remainingOrders).toHaveLength(2);
    const quotaAfter = await db.quota.findUnique({ where: { id: 'free_users' } });
    expect(quotaAfter?.used).toBe(quotaBefore?.used ?? 0);

    // 2) MatchHistory, Report og AuditLog BESTÅR
    const [first, second] = userA.id < userB.id ? [userA.id, userB.id] : [userB.id, userA.id];
    const history = await db.matchHistory.findUnique({
      where: { uh_idx: { userAId: first, userBId: second } },
    });
    expect(history).not.toBeNull();
    expect(history?.outcomeA).toBe('no_action');

    expect(await db.report.findUnique({ where: { id: report.id } })).not.toBeNull();

    // AuditLog for KJØRINGA (matchId i metadata)
    const audits = await db.auditLog.findMany({ where: { action: 'JOURNEY_RESET' } });
    const survivingAudit = audits.find(
      (a) => a.metadata && JSON.parse(a.metadata).matchId === match.id,
    );
    expect(survivingAudit).toBeDefined();
    expect(JSON.parse(survivingAudit!.metadata!)).toMatchObject({ outcome: 'no_action' });

    // 3) Bilde-OBJEKTA i lagringa er slettet (GDPR art. 17 — reell lekkasjevei)
    expect(await storage.exists(IMAGE_KEY)).toBe(false);
    expect(await storage._getBuffer(IMAGE_KEY)).toBeNull();
  }, 30000);
});
