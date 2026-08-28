/**
 * Tosom — Daily Journey Cron-Job (Fase C3)
 * 
 * GET /api/cron/journey
 * - Øker JourneyProgress.day +1 for alle brukere som har passert nextDayAt
 * - Sjekkar fase-endring og sender notification
 * - Avslutt reise ved dag 30
 * - B9: Reisen starter først når begge har vært innom (bothSeenAt ≠ null)
 * - B9: Utløp for reiser >14 dager uten at begge har vært innom
 */

import { NextRequest, NextResponse } from 'next/server';
import { Prisma, JourneyPhase } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { timingSafeEqual } from 'crypto';
import type { GuidedQuestion } from '@prisma/client';
import { sendAlert } from '@/lib/observability/alert'; // B5.6
import { getPhaseForDay } from '@/lib/journey/engine'; // ST3.1
import { runRetention } from '@/lib/privacy/retention'; // S-10
import { recordMetric, recordEvent } from '@/lib/observability/metric'; // O-3
import {
  thresholdQueueSize,
  thresholdRoundDuration,
  threshold5xxRate,
  thresholdOpenReports,
} from '@/components/admin/StatusBadge'; // O-11
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/** Constant-time string comparison */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// STEG 6.3: Fast advisory lock ID for journey-cron
const JOURNEY_CRON_LOCK_ID = 987654321;

// B2.5 — Stillhetsdeteksjon: 48 timer uten meldinger → varm impuls
const STILLHET_HOURS = 48;

// Skalerbarheit (før lansering): kor mange reisedagar som framrykkast per køring.
// Cronen kjører timevis (vercel.json), slik at JOURNEY_BATCH_SIZE=300 gir
// kapasitet for ~7 200 samtidige reiser. Standard 100 (uten env = gammal atferd).
const JOURNEY_BATCH_SIZE = Math.max(1, parseInt(process.env.JOURNEY_BATCH_SIZE ?? '100', 10));

export async function GET(req: NextRequest) {
  const startedAt = Date.now();

  // Valider cron-secret via Authorization-header (ikke query-param) med timing-safe sammenligning
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret) {
    return NextResponse.json({ error: 'Cron miskonfigurt' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const providedSecret = authHeader.slice(7);
  if (!safeCompare(providedSecret, expectedSecret)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let lockAcquired = false;
  // STEG 1.3: Hoist metrics for outer finally-heartbeat
  let processed = 0;
  let advanced = 0;
  let ended = 0;
  let expired = 0;
  let pendingJourneys = 0;
  const errors: string[] = [];
  let cronJobOutcome: 'ok' | 'error' = 'ok';

  try {
    // STEG 6.3: Ta advisory lock for å hindre overlappende cron-kjøringer
    const lockResult = await prisma.$queryRaw(
      Prisma.sql`SELECT pg_try_advisory_lock(${JOURNEY_CRON_LOCK_ID}) AS locked`
    );

    const result = Array.isArray(lockResult) ? (lockResult as any)[0] : (lockResult as any);
    if (result && result.locked) {
      lockAcquired = true;
    } else {
      // En annen kjøring er allerede i gang — returner uten feil
      return NextResponse.json({
        ok: true,
        skipped: true,
        message: 'Journey-cron er allerede i kjøring (advisory lock tatt)',
      });
    }

    try {
      // B9: Hent aktive reiser der begge har vært innom og det er tid for ny dag
      const eligibleWhere = {
        endedAt: null,       // ikke fullført
        pausedAt: null,      // ikke pauset
        bothSeenAt: { not: null }, // B9: reisen har faktisk startet
        nextDayAt: {
          lte: new Date(),   // har passert låsetidspunktet
        },
      };
      const [eligibleJourneys, eligibleTotal] = await Promise.all([
        prisma.journeyProgress.findMany({
          where: eligibleWhere,
          take: JOURNEY_BATCH_SIZE, // maksimum per run for performance
        }),
        prisma.journeyProgress.count({ where: eligibleWhere }),
      ]);
      // Reiser som passerte låsetidspunktet, men ikke rakk med i denne batchen.
      // Selvkorrigeres ved neste timekøring; vises i panelet via /api/admin/overview.
      pendingJourneys = Math.max(0, eligibleTotal - eligibleJourneys.length);

      for (const journey of eligibleJourneys) {
        try {
          // Sjekk om brukaren har ein match (for å bekrefte reise er gyldig)
          const activeMatch = await prisma.match.findFirst({
            where: {
              OR: [
                { userAId: journey.userId, status: 'active' },
                { userBId: journey.userId, status: 'active' },
              ],
            },
            select: { id: true },
          });

          if (!activeMatch) {
            // Ingen aktiv match — reisa kan avsluttes
            await prisma.journeyProgress.update({
              where: { id: journey.id },
              data: { endedAt: new Date() },
            });
            // OBSERVABILITY O-8: reisen ble avsluttet tidlig
            recordEvent('journey.ended_early', { day: String(journey.day), reason: 'no_active_match' });
            ended++;
            processed++;
            continue;
          }

          // Sjekk om dag 30 er nådd — avslutt reise
          if (journey.day >= 30) {
            await prisma.journeyProgress.update({
              where: { id: journey.id },
              data: { endedAt: new Date() },
            });
            ended++;
            processed++;

            // Send avslutningsnotification
            await prisma.notification.create({
              data: {
                userId: journey.userId,
                type: 'JOURNEY',
                message: 'Reisa di er fullført. Takk for at du gav 30 dager.',
              },
            });
            continue;
          }

          const oldPhase = journey.phase;
          const newDay = journey.day + 1;
          const newPhase = getPhaseForDay(newDay).phase;
          const phaseChanged = newPhase !== oldPhase;

          // Auk dag + phase + nextDayAt
          await prisma.journeyProgress.update({
            where: { id: journey.id },
            data: {
              day: newDay,
              phase: newPhase,
              nextDayAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // lås neste dag i 24t
            },
          });

          // OBSERVABILITY O-8: reisen nådde ny dag
          recordMetric('journey.day.reached', newDay, 'count', { phase: newPhase });

          // Lagre milestone ved ny dag (STEG 5.4 unik constraint hindrer duplikater)
          await prisma.journeyMilestone.create({
            data: {
              progressId: journey.id,
              day: newDay,
              title: `Dag ${newDay}`,
              summary: `Ny dag i reisa di: Dag ${newDay} av 30.`,
            },
          }).catch((err) => {
            // Ignorer duplikat-feil (kan hende ved race condition, STEG 5.4 fanger dette)
            if (!String(err).includes('Unique')) {
              console.warn(`[cron/journey] Kunne ikke opprette milestone:`, err);
            }
          });

          // Send notification ved fase-endring
          if (phaseChanged) {
            await prisma.notification.create({
              data: {
                userId: journey.userId,
                type: 'JOURNEY',
                message: `Fase-endring: Du er nå i fase ${newPhase}.`,
              },
            });
          }

          advanced++;
          processed++;
        } catch (journeyError) {
          console.error(`[cron/journey] Feil for journey ${journey.id}:`, journeyError);
          errors.push(`journey ${journey.id}: ${(journeyError as Error).message}`);
          processed++;
        }
      }

      // B9: Utløp — finn reiser der begge ALDRI har vært innom og matchen er >14 dager gammel
      const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const expiredMatches = await prisma.match.findMany({
        where: {
          status: 'active',
          createdAt: { lt: fourteenDaysAgo },
        },
        select: { id: true, userAId: true, userBId: true },
        take: 50,
      });

      for (const match of expiredMatches) {
        try {
          // Sjekk om noen av brukerne har en journey der bothSeenAt er null
          const pendingJourneys = await prisma.journeyProgress.findMany({
            where: {
              matchId: match.id,
              endedAt: null,
              bothSeenAt: null,
            },
          });

          if (pendingJourneys.length > 0) {
            // Markér journey som avsluttet (expired)
            for (const j of pendingJourneys) {
              await prisma.journeyProgress.update({
                where: { id: j.id },
                data: {
                  endedAt: new Date(),
                },
              });
              // OBSERVABILITY O-8: reisen utløp uten at begge startet
              recordEvent('journey.ended_early', { day: String(j.day), reason: 'expired' });
              expired++;

              // Send notifikasjon om utløp
              await prisma.notification.create({
                data: {
                  userId: j.userId,
                  type: 'JOURNEY',
                  message: 'Reisen har utløpt fordi dere ikke rakk å starte innen 14 dager.',
                },
              });
            }

            // Oppdater match-status til expired
            await prisma.match.update({
              where: { id: match.id },
              data: { status: 'expired' },
            });

            console.log(`[cron/journey] Match ${match.id} utløpt — ingen startet reisen innen 14 dager`);
          }
        } catch (expiryError) {
          console.error(`[cron/journey] Feil ved utløp for match ${match.id}:`, expiryError);
          errors.push(`expired match ${match.id}: ${(expiryError as Error).message}`);
        }
      }

      // B2.5 — STILLHETSDETEKSJON
      // Ingen meldinger i 48 timer og reisen er aktiv → legg ett varmt spørsmål
      // i samtalen fra Tosom selv. Maks én impuls per 48 timer (sjekkes via
      // siste meldingstype = system). Ikke en AI-partner — systemet velger et forhåndsskrevet spørsmål.
      let stillhetsImpulser = 0;
      try {
        const stillhetThreshold = new Date(Date.now() - STILLHET_HOURS * 60 * 60 * 1000);

        // Finn aktive konversasjoner med matchId der siste melding er > 48 timer gammel
        const stilleSamtaler = await prisma.conversation.findMany({
          where: {
            endedAt: null,
            matchId: { not: null },
            lastMessageAt: { lt: stillhetThreshold },
          },
          include: {
            messages: {
              take: 1,
              orderBy: { createdAt: 'desc' },
            },
          },
          take: 20,
        });

        for (const convo of stilleSamtaler) {
          try {
            // Sjekk at matchen er aktiv
            const activeMatch = await prisma.match.findFirst({
              where: { id: convo.matchId!, status: 'active' },
              select: { id: true },
            });
            if (!activeMatch) continue;

            // Sjekk at reisen er aktiv (begge har JourneyProgress uten endedAt og med bothSeenAt)
            const activeJourneys = await prisma.journeyProgress.findMany({
              where: {
                matchId: convo.matchId!,
                endedAt: null,
                bothSeenAt: { not: null },
              },
              select: { id: true },
            });
            if (activeJourneys.length < 2) continue;

            // Sjekk at siste melding IKKE er en system-melding (unngå mas)
            const lastMsg = convo.messages[0];
            if (lastMsg && lastMsg.type === 'system') {
              continue; // Allerede sendt impuls nylig
            }

            // Hent et forhåndsskrevet spørsmål fra GuidedQuestion
            const question = await prisma.guidedQuestion.findFirst({
              where: { depthLevel: { lte: 2 } }, // Lett/middels — ikke for dypt
              orderBy: { createdAt: 'asc' },
            });

            const questionText = question?.content || 'Hvordan har dere det i dag?';

            // Legg inn varm impuls fra Tosom (senderId = første bruker i samtalen, type = system)
            // Bruker convo.userAId som "avsender" siden system ikke er en User
            await prisma.message.create({
              data: {
                conversationId: convo.id,
                senderId: convo.userAId,
                content: `💛 ${questionText}`,
                type: 'system',
              },
            });

            // Oppdater lastMessageAt
            await prisma.conversation.update({
              where: { id: convo.id },
              data: { lastMessageAt: new Date() },
            });

            stillhetsImpulser++;
            console.log(`[cron/journey] Stillhetsimpuls sendt til konversasjon ${convo.id}`);
          } catch (impulsErr) {
            console.error(`[cron/journey] Feil ved stillhetsimpuls for ${convo.id}:`, impulsErr);
            errors.push(`stillhet ${convo.id}: ${(impulsErr as Error).message}`);
          }
        }
      } catch (stillhetErr) {
        console.error('[cron/journey] Stillhetsdeteksjon feilet:', stillhetErr);
        errors.push(`stillhetsdeteksjon: ${(stillhetErr as Error).message}`);
      }

      // OBSERVABILITY O-6: onboarding-frafall — brukere som startet men ikke fullførte
      // og har ingen aktivitet på 7 dager. Kun aggregert tall, ingen PII.
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const abandonedUsers = await prisma.user.groupBy({
        by: ['onboardingStep'],
        where: {
          onboardingStep: { gt: 0 },
          onboardingComplete: false,
          deletedAt: null,
          updatedAt: { lt: sevenDaysAgo },
        },
        _count: { _all: true },
      });
      for (const group of abandonedUsers) {
        recordEvent('onboarding.abandoned', { last_step: String(group.onboardingStep) });
      }

      const duration = Date.now() - startedAt;

      return NextResponse.json({
        ok: true,
        processed,
        advanced,
        ended,
        expired,
        stillhetsImpulser,
        pendingJourneys,
        duration: `${duration}ms`,
        message: `Prosessert ${processed} reiser — ${advanced} framrykte, ${ended} avsluttet, ${expired} utløpt, ${stillhetsImpulser} stillhetsimpulser`,
        errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
      });
    } finally {
      // Rydd opp advisory lock når vi er ferdig
      if (lockAcquired) {
        await prisma.$queryRaw(
          Prisma.sql`SELECT pg_advisory_unlock(${JOURNEY_CRON_LOCK_ID})`
        );
      }
    }
  } catch (err) {
    console.error('[cron] Journey feil:', err);
    cronJobOutcome = 'error';

    return NextResponse.json(
      { error: 'Kunne ikke kjøre cron journey', details: (err as Error).message },
      { status: 500 }
    );
  } finally {
    // STEG 1.3: Heartbeat — logg ALLTID til SystemLog (også ved feil)
    const durationMs = Date.now() - startedAt;
    // OBSERVABILITY O-3: cron-jobb som metrikk (Vercel viser kun HTTP-status;
    // dette sier om jobben faktisk fullførte).
    recordMetric('cron.duration_ms', durationMs, 'ms', { job: 'journey', outcome: cronJobOutcome });
    try {
      await prisma.systemLog.create({
        data: {
          level: 'INFO',
          message: `Cron journey heartbeat: ${advanced} framrykte, ${ended} avsluttet, ${expired} utløpt for ${processed} reiser`,
          module: 'cron:journey',
          metadata: { processed, advanced, ended, expired, pendingJourneys, durationMs, errors: errors.slice(0, 10) },
        },
      });
    } catch (logErr) {
      console.error('[cron/journey] Kunne ikke skrive heartbeat:', logErr);
    }

    // B5.6 — WATCHDOG: Sjekk om matcherunden uteble (kjøres på slutten av journey-cron)
    // Vercel Hobby tillater maks 2 cron-jobber — watchdog ligger her, ikke som egen jobb.
    try {
      const lastMatchingLog = await prisma.systemLog.findFirst({
        where: { module: 'cron:matching' },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      });

      const hoursSinceLastMatch = lastMatchingLog
        ? (Date.now() - lastMatchingLog.createdAt.getTime()) / (1000 * 60 * 60)
        : null;

      // Alert hvis matcherunde uteble i > 26 timer
      if (hoursSinceLastMatch === null || hoursSinceLastMatch > 26) {
        await sendAlert(
          hoursSinceLastMatch === null ? 'critical' : 'warning',
          'Matcherunde uteble',
          hoursSinceLastMatch === null
            ? 'Ingen matcherunde er logget noensinne. Sjekk cron-konfigurasjonen.'
            : `Siste matcherunde var for ${Math.round(hoursSinceLastMatch)} timer siden (terskel: 26 t).`
        );
      }
    } catch (watchdogErr) {
      console.error('[cron/journey] Watchdog feilet:', watchdogErr);
    }

    // S-10: Oppbevaring — anonymiserer inaktive kontoer (opt-in via RETENTION_ENABLED).
    // Kjører best-effort: en feil her bryter aldri heartbeat eller resten av cronen.
    // (Hobby: maks 2 cron-jobber — derfor i journey-cron, ikke som egen endpoint.)
    try {
      await runRetention();
    } catch (retErr) {
      console.error('[cron/journey] Retention feilet:', retErr);
    }

    // OBSERVABILITY O-11: Terskelvarsling.
    // Ett varsel per tilstand per døgn (SystemLog-markør som rate-limiter).
    try {
      const HOUR_MS = 3600_000;
      const DAY_MS = 86_400_000;
      const oneHourAgo = new Date(Date.now() - HOUR_MS);
      const oneDayAgo = new Date(Date.now() - DAY_MS);

      // Hent siste matcherunde-varighet
      const lastMatchLog = await prisma.systemLog.findFirst({
        where: { module: 'cron:matching' },
        orderBy: { createdAt: 'desc' },
        select: { metadata: true },
      });
      const roundDuration = (lastMatchLog?.metadata as Record<string, unknown> | null)?.durationMs as number | undefined;

      // Kø-størrelse
      const queueSize = await prisma.user.count({
        where: { journeyState: 'QUEUED', bannedAt: null, deletedAt: null },
      });

      // 5xx siste time (fra metric-metrikker)
      const fivexxCount = await prisma.systemLog.count({
        where: {
          module: 'metric',
          metadata: { path: ['metric'], equals: 'error.5xx' },
          createdAt: { gte: oneHourAgo },
        },
      });

      // Åpne rapporter
      const openReports = await prisma.report.count({ where: { status: 'OPEN' } });

      // Definer tilstander som bryter terskel
      const breaches: Array<{ key: string; severity: 'warning' | 'critical'; title: string; detail: string }> = [];

      if (thresholdQueueSize(queueSize) === 'critical') {
        breaches.push({ key: 'queue_zero', severity: 'critical', title: 'Match-køen er tom', detail: `Kø-størrelse: ${queueSize}. Ingen brukere venter på match.` });
      }
      if (pendingJourneys >= JOURNEY_BATCH_SIZE) {
        breaches.push({ key: 'journey_backlog', severity: 'critical', title: 'Reisekø er større enn batch', detail: `${pendingJourneys} reiser venter på fremrykk. Sjekk cronen (Vercel) og vurder å heve JOURNEY_BATCH_SIZE.` });
      } else if (pendingJourneys > 0) {
        breaches.push({ key: 'journey_backlog', severity: 'warning', title: 'Reiser venter på fremrykk', detail: `${pendingJourneys} reiser har passert nextDayAt men ble ikke framrykt. Selvkorrigeres ved neste timekøring.` });
      }
      if (thresholdRoundDuration(roundDuration ?? null) === 'critical') {
        breaches.push({ key: 'round_slow', severity: 'warning', title: 'Matcherunde over 50 s', detail: `Siste runde: ${roundDuration} ms. Høy last eller langsom DB.` });
      }
      if (threshold5xxRate(fivexxCount) === 'critical') {
        breaches.push({ key: 'fivexx_high', severity: 'critical', title: `${fivexxCount} 5xx-feil siste time`, detail: 'Uvant antall serverfeil. Sjekk Sentry.' });
      }
      if (thresholdOpenReports(openReports) === 'warn') {
        breaches.push({ key: 'open_reports', severity: 'warning', title: `${openReports} åpne rapporter`, detail: 'Ubehandlet trygghetsrapport i køen.' });
      }
      if (cronJobOutcome === 'error') {
        breaches.push({ key: 'cron_failed', severity: 'critical', title: 'Journey-cron feilet', detail: (errors[0] ?? 'Ukjent feil').slice(0, 200) });
      }

      // Fire alerts (max 1 per tilstand per døgn)
      for (const b of breaches) {
        // Sjekk om vi allerede har varslet denne tilstanden innenfor 24 t
        const alreadyAlerted = await prisma.systemLog.count({
          where: {
            module: 'cron:alerts',
            message: b.key,
            createdAt: { gte: oneDayAgo },
          },
        });
        if (alreadyAlerted > 0) continue; // allerede varslet i dag

        await sendAlert(b.severity, b.title, b.detail);
        // Marker at vi har varslet (rate-limiter)
        await prisma.systemLog.create({
          data: {
            level: 'WARN',
            message: b.key,
            module: 'cron:alerts',
            metadata: { severity: b.severity, title: b.title },
          },
        });
      }
    } catch (alertErr) {
      console.error('[cron/journey] Terskelvarsling feilet:', alertErr);
    }
  }
}

// Ingen caching for cron-endepunkt
export const revalidate = 0;