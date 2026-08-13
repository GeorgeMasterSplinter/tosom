/**
 * ToSom — Daily Journey Cron-Job (Fase C3)
 * 
 * GET /api/cron/journey
 * - Aukar JourneyProgress.day +1 for alle brukarar som har passert nextDayAt
 * - Sjekkar fase-endring og sender notification
 * - Avslutt reise ved dag 30
 */

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { timingSafeEqual } from 'crypto';
import { JourneyPhase } from '@prisma/client';
export const dynamic = 'force-dynamic';

/** Constant-time string comparison */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// STEG 6.3: Fast advisory lock ID for journey-cron
const JOURNEY_CRON_LOCK_ID = 987654321;

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
      // Hent alle brukarar med aktiv reise som har passert nextDayAt
      const eligibleJourneys = await prisma.journeyProgress.findMany({
        where: {
          endedAt: null, // ikke fullført
          pausedAt: null, // ikke pauset
          nextDayAt: {
            lte: new Date(), // har passert låsetidspunktet
          },
        },
        // B4: user-relasjonen fjerna frå JourneyProgress — userId er direkte tilgjengeleg
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
              data: {
                endedAt: new Date(),
              },
            });
            ended++;
            processed++;
            continue;
          }

          // Sjekk om dag 30 er nådd — avslutt reise
          if (journey.day >= 30) {
            await prisma.journeyProgress.update({
              where: { id: journey.id },
              data: {
                endedAt: new Date(),
              },
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

      const duration = Date.now() - startedAt;

      return NextResponse.json({
        ok: true,
        processed,
        advanced,
        ended,
        duration: `${duration}ms`,
        message: `Prosessert ${processed} brukarar — ${advanced} framrykte, ${ended} avsluttet`,
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
          message: `Cron journey heartbeat: ${advanced} framrykte, ${ended} avsluttet for ${processed} brukarar`,
          module: 'cron:journey',
          metadata: { processed, advanced, ended, durationMs, errors: errors.slice(0, 10) },
        },
      });
    } catch (logErr) {
      console.error('[cron/journey] Kunne ikke skrive heartbeat:', logErr);
    }
  }
}

// Ingen caching for cron-endepunkt
export const revalidate = 0;