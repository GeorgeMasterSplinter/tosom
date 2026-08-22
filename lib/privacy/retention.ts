// lib/privacy/retention.ts — S-10: Oppbevaringskron (retention) for inaktive kontoer.
//
// Kjører fra den daglige journey-cronen (Hobby-plan: maks 2 cron-jobber, så
// dette er IKKE en egen cron-endepunkt). Den:
//   1. Varsler kontoer som har vært inaktive ~11 mnd (30 dager før anonymisering)
//      via en in-app Notification + SystemLog. (E-post-kanal er ikke implementert
//      enda — se lib/email.ts som er en stub. Rolig, ærlig tone.)
//   2. Anonymiserer kontoer som har vært inaktive ≥12 mnd via anonymizeUser().
//
// Inaktivitetstegn: User.updatedAt som proksy. Merk: dette er IKKE presis
// "siste innlogging" (User har ingen lastLoginAt ennå) — updatedAt bumpes også
// av matching/profilendring. Presis lastLoginAt er en dokumentert follow-up.
//
// Sikkerhetsnetter:
//   - RETENTION_ENABLED må være true (config/features.ts, default OFF) — ellers
//     returneres en stat med skipped=true og ingenting skjer (opt-in).
//   - Batch-tak (MAX_PER_RUN) holder innen tidsbudsjettet.
//   - Hver bruker behandles best-effort: én feil bryter aldri resten.
//   - Idempotent: anonymizeUser setter deletedAt; varsel dedupliseres via
//     nylig [RETENTION]-notification.

import { prisma } from '@/lib/prisma';
import { anonymizeUser } from '@/lib/privacy/anonymize';
import { isRetentionEnabled } from '@/config/features';

/** ~11 mnd (30 dager før 12 mnd). Varsel-terskel. */
const WARN_THRESHOLD_MS = 11 * 30 * 24 * 60 * 60 * 1000;
/** 12 mnd. Anonymiserings-terskel. */
const ANONYMIZE_THRESHOLD_MS = 12 * 30 * 24 * 60 * 60 * 1000;
/** Maks brukere behandlet per kjøring (holder innen tidsbudsjett). */
const MAX_PER_RUN = 100;

export interface RetentionStats {
  /** true hvis RETENTION_ENABLED er av (hopp). */
  skipped: boolean;
  /** Antall kontoer varslet (Notification sendt). */
  warned: number;
  /** Antall kontoer anonymisert. */
  anonymized: number;
  /** Antall feil (best-effort — runden fortsetter). */
  errors: number;
}

/**
 * Kjør én pass av oppbevaringskronen. Best-effort — kaster aldri.
 * Returnerer en stat med skipped=true hvis RETENTION_ENABLED er av (default).
 */
export async function runRetention(): Promise<RetentionStats> {
  // Kill switch: default OFF. Ingen sletting/anonymisering uten eksplisitt opt-in.
  if (!isRetentionEnabled()) {
    return { skipped: true, warned: 0, anonymized: 0, errors: 0 };
  }

  const now = Date.now();
  const warnCutoff = new Date(now - WARN_THRESHOLD_MS);

  // Inaktive = ikke slettet, ikke utestengt, og siste aktivitet (updatedAt)
  // eldre enn varsel-terskelen. De over 12 mnd filtreres ut i løkken.
  const candidates = await prisma.user.findMany({
    where: {
      deletedAt: null,
      bannedAt: null,
      updatedAt: { lte: warnCutoff },
    },
    orderBy: { updatedAt: 'asc' },
    take: MAX_PER_RUN,
    select: { id: true, updatedAt: true },
  });

  let warned = 0;
  let anonymized = 0;
  let errors = 0;

  for (const user of candidates) {
    try {
      const ageMs = now - user.updatedAt.getTime();

      if (ageMs >= ANONYMIZE_THRESHOLD_MS) {
        // OBSERVABILITY O-12: Aggregert data beholdes også etter anonymisering.
        // Før anonymisering: lagre sammenfatte tall (matcher, reiser, meldinger) i SystemLog.
        try {
          const matchCount = await prisma.match.count({
            where: { OR: [{ userAId: user.id }, { userBId: user.id }] },
          });
          const journeyCount = await prisma.journeyProgress.count({
            where: { userId: user.id, endedAt: { not: null } },
          });
          const messageCount = await prisma.message.count({
            where: { senderId: user.id },
          });
          await prisma.systemLog.create({
            data: {
              level: 'INFO',
              message: `Retention aggregate for anonymized user`,
              module: 'retention:aggregate',
              metadata: {
                userId_hash: user.id.slice(0, 8),
                matches: matchCount,
                journeys_completed: journeyCount,
                messages_sent: messageCount,
                inactive_days: Math.round(ageMs / 86_400_000),
              },
            },
          });
        } catch { /* aggregate-feil bryter aldri anonymisering */ }

        // 12+ mnd inaktiv → anonymiser (idempotent; anonymizeUser sjekker deletedAt).
        const res = await anonymizeUser(user.id, 'inactivity_12m');
        if (res.anonymized) anonymized++;
      } else {
        // 11–12 mnd → varsel. Dedupliseres: send kun om ingen nylig [RETENTION]-varsel.
        const recentWarning = await prisma.notification.findFirst({
          where: {
            userId: user.id,
            type: 'SYSTEM',
            message: { startsWith: '[RETENTION]' },
            createdAt: { gte: new Date(now - 30 * 24 * 60 * 60 * 1000) },
          },
          select: { id: true },
        });
        if (!recentWarning) {
          await prisma.notification.create({
            data: {
              userId: user.id,
              type: 'SYSTEM',
              // Prefix gjør at neste kjøring kan finne og deduplikere.
              message:
                '[RETENTION] Det har vært stille hos deg lenge. Om kontoen forblir inaktiv ' +
                'til neste mnd vil vi anonymisere personopplysningene. Innlogging forlenger perioden.',
            },
          });
          warned++;
        }
      }
    } catch (err) {
      // Best-effort: én feil bryter ikke de andre.
      errors++;
      console.warn(`[retention] Feil for ${user.id}:`, (err as Error).message);
    }
  }

  // Samlet logg (for observabilitet + S-17-liknende varsling om noe gikk galt).
  try {
    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        message: `Retention: ${anonymized} anonymisert, ${warned} varslet, ${errors} feil`,
        module: 'cron:retention',
        metadata: { candidates: candidates.length, warned, anonymized, errors },
      },
    });
  } catch {
    // Logg skal aldri kaste.
  }

  return { skipped: false, warned, anonymized, errors };
}
