/**
 * ToSom — Daily Journey Cron-Job (Fase C3)
 * 
 * GET /api/cron/journey
 * - Aukar JourneyProgress.day +1 for alle brukere som har passert nextDayAt
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
  const errors: string[] = [];

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
      // B9: Hent alle aktive reiser der begge har vært innom og det er tid for ny dag
      const eligibleJourneys = await prisma.journeyProgress.findMany({
        where: {
          endedAt: null,       // ikke fullført
          pausedAt: null,      // ikke pauset
          bothSeenAt: { not: null }, // B9: reisen har faktisk startet
          nextDayAt: {
            lte: new Date(),   // har passert låsetidspunktet
          },
        },
        take: 100, // maksimum per run for performance
      });

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

          // Bestem ny phase basert på dag
          function getPhaseForDay(day: number): JourneyPhase {
            if (day <= 14) return JourneyPhase.EARLY;
            if (day <= 21) return JourneyPhase.BUILDING_TRUST;
            if (day <= 25) return JourneyPhase.DEEPER;
            return JourneyPhase.CHECKIN;
          }

          const oldPhase = journey.phase;
          const newDay = journey.day + 1;
          const newPhase = getPhaseForDay(newDay);
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
      // i samtalen fra ToSom selv. Maks én impuls per 48 timer (sjekkes via
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

            // Legg inn varm impuls fra ToSom (senderId = første bruker i samtalen, type = system)
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

      const duration = Date.now() - startedAt;

      return NextResponse.json({
        ok: true,
        processed,
        advanced,
        ended,
        expired,
        stillhetsImpulser,
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

    return NextResponse.json(
      { error: 'Kunne ikke kjøre cron journey', details: (err as Error).message },
      { status: 500 }
    );
  } finally {
    // STEG 1.3: Heartbeat — logg ALLTID til SystemLog (også ved feil)
    const durationMs = Date.now() - startedAt;
    try {
      await prisma.systemLog.create({
        data: {
          level: 'INFO',
          message: `Cron journey heartbeat: ${advanced} framrykte, ${ended} avsluttet, ${expired} utløpt for ${processed} reiser`,
          module: 'cron:journey',
          metadata: { processed, advanced, ended, expired, durationMs, errors: errors.slice(0, 10) },
        },
      });
    } catch (logErr) {
      console.error('[cron/journey] Kunne ikke skrive heartbeat:', logErr);
    }
  }
}

// Ingen caching for cron-endepunkt
export const revalidate = 0;