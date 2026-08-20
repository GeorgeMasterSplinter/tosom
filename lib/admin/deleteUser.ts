// lib/admin/deleteUser.ts — Permanent (hard) sletting av én bruker.
//
// Brukes av admin-kommandopanels for å rense testdata: sletter brukeren OG alt
// relasjonert innhold — profil, matcher, reiser, samtaler, meldinger, notifikasjoner,
// auth-materiell, ordere, rapporter og blokkeringer.
//
// Rekkefølgen følger fremmednøkkelavhengighetene (mønstret i lib/journey/endJourney.ts):
//   1. Samle imageKeys + conversation/journey-id-er FØR transaksjonen (radene slettes inne i den).
//   2. Slett barn-tabeller nedover i FK-treet:
//        JourneyMilestone → JourneyProgress
//        JourneyStateLog / ResonanceSession / Message → Conversation
//        Match / MatchHistory
//        Report / UserBlock
//        Notification / PhoneVerification / PasswordResetToken / MagicLinkToken
//        Session / Account / Order / TwoFactorSecret / Profile
//   3. Slett User til slutt.
//   4. Etter transaksjonen: slett bilde-objekta fra lagringen (best-effort, GDPR art. 17).
//
// BEHOLD: AuditLog der adminId peker på denne brukeren — SetNull setter adminId til null,
// slik at admin-sporing overlever (I-13).

import { prisma } from '@/lib/prisma';
import { getImageStorage } from '@/lib/storage';

export interface HardDeleteResult {
  ok: boolean;
  userId: string;
  /** E-posten til brukeren som ble slettet (for bekreftelse i UI). */
  email: string;
  /** Grunn for hopp: 'not_found'. */
  skipped?: 'not_found';
  /** Antall slettede rader per modell. */
  deleted: Record<string, number>;
  /** Antall bilde-objekter slettet fra lagringen. */
  imageObjects?: number;
}

/**
 * Slett én bruker permanent, med alt relasjonert innhold.
 * Returnerer hva som ble slettet, slik at API-tilleren kan logge og bekrefte.
 */
export async function hardDeleteUser(userId: string): Promise<HardDeleteResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!user) {
    return { ok: false, userId, email: '', skipped: 'not_found', deleted: {} };
  }

  // ── 1. Samle referanser FØR transaksjonen ────────────────────────────────
  const conversationIds = (
    await prisma.conversation.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
      select: { id: true },
    })
  ).map((c) => c.id);

  const journeyIds = (
    await prisma.journeyProgress.findMany({ where: { userId }, select: { id: true } })
  ).map((j) => j.id);

  // Bilde-nøkler for alle samtalen denne bruker er del av (for lagrings-sletting etterpå).
  const imageKeys: string[] = conversationIds.length
    ? (
        await prisma.message.findMany({
          where: { conversationId: { in: conversationIds }, imageKey: { not: null } },
          select: { imageKey: true },
        })
      )
        .map((m) => m.imageKey)
        .filter((k): k is string => typeof k === 'string' && k.length > 0)
    : [];

  // ── 2. Slett nedover i FK-treet ──────────────────────────────────────────
  const result = await prisma.$transaction(async (tx) => {
    const deleted: Record<string, number> = {};

    // Journey: milestones → progress
    if (journeyIds.length) {
      const m = await tx.journeyMilestone.deleteMany({ where: { progressId: { in: journeyIds } } });
      deleted.JourneyMilestone = (m as { count: number }).count ?? 0;
    }
    const jp = await tx.journeyProgress.deleteMany({ where: { userId } });
    deleted.JourneyProgress = (jp as { count: number }).count ?? 0;

    // Konversasjon-barn: state-logs, resonans, meldinger
    if (conversationIds.length) {
      const sl = await tx.journeyStateLog.deleteMany({ where: { conversationId: { in: conversationIds } } });
      deleted.JourneyStateLog = (sl as { count: number }).count ?? 0;

      const rs = await tx.resonanceSession.deleteMany({ where: { conversationId: { in: conversationIds } } });
      deleted.ResonanceSession = (rs as { count: number }).count ?? 0;

      const msg = await tx.message.deleteMany({ where: { conversationId: { in: conversationIds } } });
      deleted.Message = (msg as { count: number }).count ?? 0;

      const conv = await tx.conversation.deleteMany({ where: { id: { in: conversationIds } } });
      deleted.Conversation = (conv as { count: number }).count ?? 0;
    }

    // Matcher + historikk (plain FK — ingen cascade, slettes eksplisitt)
    const match = await tx.match.deleteMany({ where: { OR: [{ userAId: userId }, { userBId: userId }] } });
    deleted.Match = (match as { count: number }).count ?? 0;

    const mh = await tx.matchHistory.deleteMany({ where: { OR: [{ userAId: userId }, { userBId: userId }] } });
    deleted.MatchHistory = (mh as { count: number }).count ?? 0;

    // Rapporter og blokkeringer (plain FK)
    const rep = await tx.report.deleteMany({ where: { OR: [{ reporterId: userId }, { reportedId: userId }] } });
    deleted.Report = (rep as { count: number }).count ?? 0;

    const ub = await tx.userBlock.deleteMany({ where: { OR: [{ blockerId: userId }, { blockedId: userId }] } });
    deleted.UserBlock = (ub as { count: number }).count ?? 0;

    // Notifikasjoner
    const notif = await tx.notification.deleteMany({ where: { userId } });
    deleted.Notification = (notif as { count: number }).count ?? 0;

    // Auth-materiell
    const phones = await tx.phoneVerification.deleteMany({ where: { userId } });
    deleted.PhoneVerification = (phones as { count: number }).count ?? 0;

    const resets = await tx.passwordResetToken.deleteMany({ where: { userId } });
    deleted.PasswordResetToken = (resets as { count: number }).count ?? 0;

    const magic = await tx.magicLinkToken.deleteMany({ where: { email: user.email } });
    deleted.MagicLinkToken = (magic as { count: number }).count ?? 0;

    const sessions = await tx.session.deleteMany({ where: { userId } });
    deleted.Session = (sessions as { count: number }).count ?? 0;

    const accounts = await tx.account.deleteMany({ where: { userId } });
    deleted.Account = (accounts as { count: number }).count ?? 0;

    const orders = await tx.order.deleteMany({ where: { userId } });
    deleted.Order = (orders as { count: number }).count ?? 0;

    const two = await tx.twoFactorSecret.deleteMany({ where: { userId } });
    deleted.TwoFactorSecret = (two as { count: number }).count ?? 0;

    // Privat profil (Restrict-FK — slettes eksplisitt)
    const profile = await tx.profile.deleteMany({ where: { userId } });
    deleted.Profile = (profile as { count: number }).count ?? 0;

    // User slettes til slutt
    await tx.user.delete({ where: { id: userId } });
    deleted.User = 1;

    return deleted;
  }, {
    maxWait: 10_000,
    timeout: 30_000,
  });

  // ── 3. Slett bilde-objekter fra lagringen (best-effort) ──────────────────
  let imageObjects = 0;
  if (imageKeys.length > 0) {
    const storage = getImageStorage();
    for (const key of imageKeys) {
      try {
        await storage.deleteImage(key);
        imageObjects += 1;
      } catch (imgErr) {
        console.warn(`[hardDeleteUser] Kunne ikke slette bilde-objekt ${key}:`, imgErr);
      }
    }
  }

  return {
    ok: true,
    userId,
    email: user.email,
    deleted: result,
    imageObjects,
  };
}