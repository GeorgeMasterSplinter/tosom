/**
 * ToSom — Full-loop test (BETA-ACCESS §7.8)
 *
 * Den viktigste testen i hele betaen. Kjører den sammenhengende reisen som ÉN
 * kontinuerlig sekvens (setup.ts' beforeEach sletter all data mellom tests,
 * derfor kan ikke loopen deles opp i flere `it`-blokker):
 *
 *   onboarding (profil) → kø → matcherunde (scoring) → match
 *   → reise (faser + bildesperre) → chat → dag 30 → found_each_other
 *   → full sletting → MatchHistory beholdt
 *
 * Bruker reelle funksjoner: unifiedScore, toResonanceLevel, dayToPhase,
 * isPhotosAllowed, endJourney. Ingen mocks — ekte Postgres (tosom_test).
 */

import { testPrisma } from './setup';
import { unifiedScore } from '@/lib/matching/unifiedScorer';
import { toResonanceLevel } from '@/lib/matching/resonanceLevel';
import { dayToPhase, isPhotosAllowed, JOURNEY_TOTAL_DAYS } from '@/lib/journey/engine';
import { endJourney } from '@/lib/journey/endJourney';

const db = testPrisma;

describe('BETA-ACCESS §7.8 — Full loop: onboarding → match → reise → sletting', () => {
  // Inngangs-verdier som er data-uavhengige (kjører uavhengig av DB-state)
  it('faser, tema og bildesperre (I-5, I-6)', () => {
    // Fase 1 (dag 1-14): EARLY
    expect(dayToPhase(1)).toBe('EARLY');
    expect(dayToPhase(14)).toBe('EARLY');
    // Fase 2 (dag 15-21): BUILDING_TRUST
    expect(dayToPhase(15)).toBe('BUILDING_TRUST');
    expect(dayToPhase(21)).toBe('BUILDING_TRUST');
    // Fase 3 (dag 22-25): DEEPER
    expect(dayToPhase(22)).toBe('DEEPER');
    expect(dayToPhase(25)).toBe('DEEPER');
    // Fase 4 (dag 26-30): CHECKIN
    expect(dayToPhase(26)).toBe('CHECKIN');
    expect(dayToPhase(30)).toBe('CHECKIN');
    // I-6: Ingen bilder før dag 15
    expect(isPhotosAllowed(1)).toBe(false);
    expect(isPhotosAllowed(14)).toBe(false);
    expect(isPhotosAllowed(15)).toBe(true);
    expect(isPhotosAllowed(30)).toBe(true);
    // 30 dager totalt (I-5)
    expect(JOURNEY_TOTAL_DAYS).toBe(30);
  });

  // Den store sammenhengende loopen — ÉN test
  it('full loop: onboarding → match → reise → found_each_other → sletting', async () => {
    const suffix = Date.now();

    // ── STEP 1: Onboarding fullført — to brukere med compatible profiler ──
    const userA = await db.user.create({
      data: {
        id: `loop-a-${suffix}`,
        email: `loopa${suffix}@example.com`,
        name: 'Anna',
        journeyState: 'QUEUED',
        matchQueuedAt: new Date(),
      },
    });
    const userB = await db.user.create({
      data: {
        id: `loop-b-${suffix}`,
        email: `loopb${suffix}@example.com`,
        name: 'Bjørn',
        journeyState: 'QUEUED',
        matchQueuedAt: new Date(),
      },
    });

    // Begge har like verdier på alle dimensjoner → høy resonans
    const profileData = {
      lifeSituation: { family: 'partner', work: 'fulltid', children: 'ingen' },
      lifestyle: { smoking: 'never', alcohol: 'social', exercise: 'regular' },
      personality: { introversion: 3, sensitivity: 4, humor: 5 },
      relationshipStyle: 'kommunikativ',
      communication: { style: 'åpen', frequency: 'daily' },
      intimacy: { pace: 'gradvis', boundaries: 'respekt' },
      futureVision: { children: 'maybe', career: 'important', location: 'fleksibel' },
      boundaries: { physical: 'gradvis', emotional: 'åpen', pace: 'rolig' },
      emotionalNeeds: { security: 4, freedom: 3, validation: 4 },
      lifeRhythm: 'balanced',
      maturityLevel: 4,
      securityLevel: 'high',
    };
    await db.profile.create({
      data: { userId: userA.id, age: 32, postalCode: '0150', latitude: 59.9139, longitude: 10.7522, ...profileData },
    });
    await db.profile.create({
      data: { userId: userB.id, age: 35, postalCode: '0170', latitude: 59.9139, longitude: 10.7522, ...profileData },
    });

    // ── STEP 2: Matcherunde — scoring ≥ MIN_SCORE (40) ──
    const profileA = await db.profile.findUnique({ where: { userId: userA.id } });
    const profileB = await db.profile.findUnique({ where: { userId: userB.id } });
    if (!profileA || !profileB) throw new Error('Profile mangler etter onboarding');

    const result = unifiedScore(profileA, profileB);
    expect(result.score).toBeGreaterThanOrEqual(40);
    const level = toResonanceLevel(result.score);
    expect(['DEEP', 'STRONG', 'MODERATE', 'GENTLE']).toContain(level);

    // ── STEP 3: Match opprettes — Match + Conversation + JourneyProgress ──
    const matchId = `loop-match-${suffix}`;
    const match = await db.match.create({
      data: {
        id: matchId,
        userAId: userA.id,
        userBId: userB.id,
        status: 'active',
        normalizedScore: result.score / 100,
        resonanceLevel: level,
      },
    });
    expect(match.status).toBe('active');

    const conversation = await db.conversation.create({
      data: { matchId: match.id, userAId: userA.id, userBId: userB.id },
    });

    // JourneyProgress for begge (dag 1)
    await db.journeyProgress.create({ data: { userId: userA.id, matchId: match.id, day: 1 } });
    await db.journeyProgress.create({ data: { userId: userB.id, matchId: match.id, day: 1 } });

    // I-4: Ingen e-post/SMS/push — kun in-app notification
    await db.notification.create({ data: { userId: userA.id, type: 'MATCH', message: 'Du har fått en match!' } });
    await db.notification.create({ data: { userId: userB.id, type: 'MATCH', message: 'Du har fått en match!' } });

    // Brukere på reisen
    await db.user.update({ where: { id: userA.id }, data: { journeyState: 'ON_JOURNEY' } });
    await db.user.update({ where: { id: userB.id }, data: { journeyState: 'ON_JOURNEY' } });

    // ── STEP 4: Chat — meldinger sendes og mottas ──
    await db.message.create({ data: { conversationId: conversation.id, senderId: userA.id, content: 'Hei! Hvordan var din uke?' } });
    await db.message.create({ data: { conversationId: conversation.id, senderId: userB.id, content: 'Bra takk!' } });
    const msgs = await db.message.findMany({ where: { conversationId: conversation.id }, orderBy: { createdAt: 'asc' } });
    expect(msgs).toHaveLength(2);

    // ── STEP 5: Bildeopplasting avvises før dag 15 (I-6) ──
    const journeyDay1 = await db.journeyProgress.findFirst({ where: { userId: userA.id, matchId } });
    expect(journeyDay1).not.toBeNull();
    expect(journeyDay1!.day).toBe(1);
    expect(isPhotosAllowed(journeyDay1!.day)).toBe(false);

    // ── STEP 6: Dag 30 — CHECKIN-fase ──
    await db.journeyProgress.update({ where: { jp_user_match: { userId: userA.id, matchId } }, data: { day: 30, completedAt: new Date() } });
    await db.journeyProgress.update({ where: { jp_user_match: { userId: userB.id, matchId } }, data: { day: 30, completedAt: new Date() } });
    expect(dayToPhase(30)).toBe('CHECKIN');

    // ── STEP 7: found_each_other → full sletting (I-13) ──
    const delResult = await endJourney(matchId, 'found_each_other');

    // ALT reise-innhold slettet
    expect(await db.match.findUnique({ where: { id: matchId } })).toBeNull();
    expect(await db.conversation.findUnique({ where: { matchId } })).toBeNull();
    expect(await db.message.count({ where: { conversationId: conversation.id } })).toBe(0);
    expect(await db.journeyProgress.findFirst({ where: { userId: userA.id, matchId } })).toBeNull();
    expect(await db.journeyProgress.findFirst({ where: { userId: userB.id, matchId } })).toBeNull();

    // Begge kontoer slettet permanent
    expect(await db.user.findUnique({ where: { id: userA.id } })).toBeNull();
    expect(await db.user.findUnique({ where: { id: userB.id } })).toBeNull();
    expect(await db.profile.findUnique({ where: { userId: userA.id } })).toBeNull();
    expect(await db.profile.findUnique({ where: { userId: userB.id } })).toBeNull();

    // MatchHistory BEHOLDT (sperreliste overlever) — I-13 beholder to ID-er
    const [first, second] = userA.id < userB.id ? [userA.id, userB.id] : [userB.id, userA.id];
    const history = await db.matchHistory.findUnique({ where: { uh_idx: { userAId: first, userBId: second } } });
    expect(history).not.toBeNull();
    expect(history!.outcomeA).toBe('found_each_other');
    expect(history!.outcomeB).toBe('found_each_other');

    // Notifications slettet
    expect(await db.notification.count({ where: { userId: userA.id, type: 'MATCH' } })).toBe(0);

    // Slettingstatistikk fra endJourney
    expect(delResult.deleted.Match).toBe(1);
    expect(delResult.deleted.Conversation).toBe(1);
    expect(delResult.deleted.User).toBe(2);

    // ── STEP 8: Ingen hengende data ──
    expect(await db.user.count({ where: { email: { in: [userA.email, userB.email] } } })).toBe(0);
    expect(await db.profile.count({ where: { userId: { in: [userA.id, userB.id] } } })).toBe(0);

    // Cleanup (MatchHistory beholdes bevisst — det er hel-poengs)
    try {
      await db.matchHistory.deleteMany({ where: { matchId } });
      await db.systemLog.deleteMany({ where: { module: 'journey:end' } });
      await db.auditLog.deleteMany({});
    } catch {
      // Best-effort
    }
  }, 60000);
});