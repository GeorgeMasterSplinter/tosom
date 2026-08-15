/**
 * STEG B3 — endJourney() med verifisert sletting
 *
 * Invariant I-6: ToSom lover at ingen ser samtalene.
 * Ved reiseslutt skal alt innhold forsvinne — etterprøvbart.
 *
 * Rekkefølgen følger fremmednøkkelavhengighetene:
 *   1. Message deleteMany     { conversationId }
 *   2. JourneyStateLog deleteMany { conversationId }
 *   3. ResonanceSession deleteMany  { conversationId }
 *   4. JourneyMilestone deleteMany  { progressId }
 *   5. JourneyProgress delete
 *   6. Conversation delete
 *   7. MatchInsight delete (hvis finnes)
 *   8. Match delete
 *   9. MatchHistory create    { normalizePair(a,b), outcome }
 *  10. Notification deleteMany match-relaterte for begge brukere
 *  11. User × 2 update        { journeyState: IDLE, ...null }
 *  12. AuditLog create        { action: JOURNEY_ENDED, metadata }
 */

import { prisma } from '@/lib/prisma';

/** Normalize pair — consistent ordering for MatchHistory unique constraint */
function normalizePair(aId: string, bId: string): { userAId: string; userBId: string } {
  return aId < bId ? { userAId: aId, userBId: bId } : { userAId: bId, userBId: aId };
}

export async function endJourney(
  matchId: string,
  outcome: 'completed' | 'early_exit' | 'blocked' | 'expired' | 'found_each_other' | 'new_journey',
): Promise<{ deleted: Record<string, number> }> {
  // Fetch match with full relations
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      userA: true,
      userB: true,
    },
  });

  if (!match) {
    throw new Error('Match ikke funnet');
  }

  const { userA, userB } = match;
  // B8: insights er fjerna frå Match-modellen

  // Find conversation for this match
  const conversation = await prisma.conversation.findUnique({
    where: { matchId },
  });

  if (!conversation) {
    throw new Error('Samtale ikke funnet for match');
  }

  const conversationId = conversation.id;

  // Find JourneyProgress for both users (match-scoped via conversation)
  const journeyA = await prisma.journeyProgress.findFirst({
    where: { userId: userA.id },
  });
  const journeyB = await prisma.journeyProgress.findFirst({
    where: { userId: userB.id },
  });

  // B4.6 — JourneyStat: Skriv anonym statistikk FØR sletting (dataene trengs for å fylle den)
  // Ingen ID-er, ingen navn, ingen innhold, ingen posisjon (I-14).
  try {
    const messageCount = conversation
      ? await prisma.message.count({ where: { conversationId: conversation.id } })
      : 0;

    // Aldersbånd i femårsintervaller
    const ageToBand = (age: number | null | undefined): string => {
      if (!age) return 'ukjent';
      const lower = Math.floor(age / 5) * 5;
      return `${lower}-${lower + 4}`;
    };

    // Avstandsbånd i 25 km-intervaller
    const distanceToBand = (km: number | null): string => {
      if (km === null) return 'ukjent';
      const lower = Math.floor(km / 25) * 25;
      return `${lower}-${lower + 24}km`;
    };

    // Beregn avstand hvis begge har koordinater
    let distanceKm: number | null = null;
    const profileA = await prisma.profile.findUnique({ where: { userId: userA.id } });
    const profileB = await prisma.profile.findUnique({ where: { userId: userB.id } });
    if (profileA?.latitude && profileA?.longitude && profileB?.latitude && profileB?.longitude) {
      // Enkel haversine-approksimasjon
      const { haversineKm } = await import('@/lib/matching/distance');
      distanceKm = haversineKm(profileA.latitude, profileA.longitude, profileB.latitude, profileB.longitude);
    }

    // Sjekk om de brukte BliKjent (system-meldinger med spørsmål)
    const bliKjentCount = conversation
      ? await prisma.message.count({
          where: { conversationId: conversation.id, type: 'system' },
        })
      : 0;

    // Gjennomsnittlig dag fra JourneyProgress
    const daysCompleted = Math.max(journeyA?.day ?? 0, journeyB?.day ?? 0);

    await prisma.journeyStat.create({
      data: {
        outcome,
        daysCompleted,
        messageCount,
        bothActive: (journeyA?.day ?? 0) > 0 && (journeyB?.day ?? 0) > 0,
        resonanceLevel: match.resonanceLevel ?? 'GENTLE',
        ageBandA: ageToBand((userA as any).profile?.age ?? null),
        ageBandB: ageToBand((userB as any).profile?.age ?? null),
        distanceBand: distanceToBand(distanceKm),
        usedBliKjent: bliKjentCount > 0,
      },
    });
  } catch (statErr) {
    // Ikke-blokkerende: statistikk skal ikke hindre sletting
    console.warn('[endJourney] Kunne ikke skrive JourneyStat:', statErr);
  }

  // Perform the deletion transaction
  const result = await prisma.$transaction(async (tx) => {
    const deleted: Record<string, number> = {};

    // 1. Delete messages
    const msgResult = await tx.message.deleteMany({ where: { conversationId } });
    deleted.Message = (msgResult as any).count ?? 0;

    // 2. Delete journey state logs
    const logResult = await tx.journeyStateLog.deleteMany({ where: { conversationId } });
    deleted.JourneyStateLog = (logResult as any).count ?? 0;

    // 3. Delete resonance sessions
    const resResult = await tx.resonanceSession.deleteMany({ where: { conversationId } });
    deleted.ResonanceSession = (resResult as any).count ?? 0;

    // 4. Delete journey milestones (for both users if they have separate journeys)
    let milestonesA = 0;
    let milestonesB = 0;
    if (journeyA) {
      const r = await tx.journeyMilestone.deleteMany({ where: { progressId: journeyA.id } });
      milestonesA = (r as any).count ?? 0;
    }
    if (journeyB) {
      const r = await tx.journeyMilestone.deleteMany({ where: { progressId: journeyB.id } });
      milestonesB = (r as any).count ?? 0;
    }
    deleted.JourneyMilestone = milestonesA + milestonesB;

    // 5. Delete journey progress (for both users) — B4 composite where [userId, matchId]
    if (journeyA) {
      await tx.journeyProgress.delete({ where: { jp_user_match: { userId: userA.id, matchId } } });
      deleted.JourneyProgress = (deleted.JourneyProgress ?? 0) + 1;
    }
    if (journeyB) {
      await tx.journeyProgress.delete({ where: { jp_user_match: { userId: userB.id, matchId } } });
      deleted.JourneyProgress = (deleted.JourneyProgress ?? 0) + 1;
    }

    // 6. Delete conversation
    await tx.conversation.delete({ where: { id: conversationId } });
    deleted.Conversation = 1;

    //

    // 8. Delete match
    await tx.match.delete({ where: { id: matchId } });
    deleted.Match = 1;

    // 9. Create MatchHistory record (normalize pair for unique constraint)
    const { userAId, userBId } = normalizePair(userA.id, userB.id);
    await tx.matchHistory.upsert({
      where: { uh_idx: { userAId, userBId } },
      create: { userAId, userBId, matchId, outcomeA: outcome, outcomeB: outcome },
      update: { endedAt: new Date(), outcomeA: outcome, outcomeB: outcome },
    });
    deleted.MatchHistory = 0; // Created, not deleted

    // 10. Delete match-related notifications for both users
    const notifResultA = await tx.notification.deleteMany({
      where: { userId: userA.id, type: 'MATCH' },
    });
    const notifResultB = await tx.notification.deleteMany({
      where: { userId: userB.id, type: 'MATCH' },
    });
    deleted.Notification =
      ((notifResultA as any).count ?? 0) + ((notifResultB as any).count ?? 0);

    // 12. Create audit log FØR eventuell kontosletting (B4.5)
    const totalDeleted = Object.values(deleted).reduce((sum: number, v: number) => sum + v, 0);
    await tx.auditLog.create({
      data: {
        adminId: userA.id, // Using userA as actor (in production this should be the acting user)
        action: 'JOURNEY_RESET', // Closest existing AuditAction enum value
        metadata: JSON.stringify({
          matchId,
          outcome,
          totalDeleted,
          ...deleted,
        }),
      },
    });

    // 11. B4.5: Utfallet bestemmer hva som skjer med kontoene
    // - found_each_other: SLETT begge kontoer permanent (behold MatchHistory + Report + AuditLog)
    // - new_journey / andre: Reset til IDLE (kontoen lever videre)
    if (outcome === 'found_each_other') {
      // Full kontosletting — brukeren har funnet hverandre utenfor ToSom
      // Behold: MatchHistory (to ID-er), Report (må overleve), AuditLog (admin-handlinger)
      for (const user of [userA, userB]) {
        // Slett brukerdata i riktig rekkefølge (FK-avhengigheter)
        await tx.notification.deleteMany({ where: { userId: user.id } });
        await tx.phoneVerification.deleteMany({ where: { userId: user.id } });
        await tx.passwordResetToken.deleteMany({ where: { userId: user.id } });
        await tx.magicLinkToken.deleteMany({ where: { email: user.email } });
        await tx.session.deleteMany({ where: { userId: user.id } });
        await tx.account.deleteMany({ where: { userId: user.id } });
        await tx.order.deleteMany({ where: { userId: user.id } });
        await tx.twoFactorSecret.deleteMany({ where: { userId: user.id } });
        // Profile slettes via cascade fra User
        // User slettes til slutt
        await tx.user.delete({ where: { id: user.id } });
        deleted.User = (deleted.User ?? 0) + 1;
      }
    } else {
      // Reset both users to IDLE — kontoen lever videre
      await tx.user.update({
        where: { id: userA.id },
        data: { journeyState: 'IDLE', matchQueuedAt: null, lastMatchAt: null, lockedUntil: null },
      });
      await tx.user.update({
        where: { id: userB.id },
        data: { journeyState: 'IDLE', matchQueuedAt: null, lastMatchAt: null, lockedUntil: null },
      });
    }

    return deleted;
  }, {
    maxWait: 10_000,
    timeout: 30_000,
  });

  // Create SystemLog entry for the event
  await prisma.systemLog.create({
    data: {
      level: 'INFO',
      message: `Journey ended: matchId=${matchId}, outcome=${outcome}`,
      module: 'journey:end',
      metadata: { matchId, outcome, deleted: result },
    },
  });

  return { deleted: result };
}