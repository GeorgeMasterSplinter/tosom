/**
 * ToSom — Daily Journey Cron-Job (Fase C3)
 * 
 * GET /api/cron/journey
 * - Aukar JourneyProgress.day +1 for alle brukarar som har passert nextDayAt
 * - Sjekkar fase-endring og sender notification
 * - Avslutt reise ved dag 30
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JourneyPhase } from '@prisma/client';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  
  // Valider cron-secret
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Ugyldig secret' }, { status: 401 });
  }

  try {
    // Hent alle brukarar med aktiv reise som har passert nextDayAt
    const eligibleJourneys = await prisma.journeyProgress.findMany({
      where: {
        endedAt: null, // ikkje fullført
        pausedAt: null, // ikkje pauset
        nextDayAt: {
          lte: new Date(), // har passert låsetidspunktet
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      take: 100, // maksimum per run for performance
    });

    let processed = 0;
    let advanced = 0;
    let ended = 0;
    const errors: string[] = [];

    for (const journey of eligibleJourneys) {
      try {
        // Sjekk om brukaren har ein match (for å bekrefte reise er gyldig)
        const activeMatch = await prisma.match.findFirst({
          where: {
            OR: [
              { userAId: journey.user.id, status: 'active' },
              { userBId: journey.user.id, status: 'active' },
            ],
          },
          select: { id: true },
        });

        if (!activeMatch) {
          // Ingen aktiv match — reisa kan avsluttast
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
              userId: journey.user.id,
              type: 'JOURNEY',
              message: 'Reisa di er fullført. Takk for at du gav 30 dagar.',
            },
          });
          continue;
        }

        // Bestem ny phase basert på dag
        function getPhaseForDay(day: number): JourneyPhase {
          if (day <= 14) return JourneyPhase.EARLY;
          if (day <= 21) return JourneyPhase.BUILDING_TRUST;
          if (day <= 30) return JourneyPhase.DEEPER;
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

        // Lagre milestone ved ny dag
        await prisma.journeyMilestone.create({
          data: {
            progressId: journey.id,
            day: newDay,
            title: `Dag ${newDay}`,
            summary: `Ny dag i reisa di: Dag ${newDay} av 30.`,
          },
        });

        // Send notification ved fase-endring
        if (phaseChanged) {
          await prisma.notification.create({
            data: {
              userId: journey.user.id,
              type: 'JOURNEY',
              message: `Fase-endring: Du er no i fase ${newPhase}.`,
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
    
    // Logg til SystemLog
    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        message: `Cron journey: ${advanced} framrykte, ${ended} avslutta for ${processed} brukarar`,
        module: 'cron/journey',
        metadata: { processed, advanced, ended, duration, errors: errors.slice(0, 10) },
      },
    });

    return NextResponse.json({
      ok: true,
      processed,
      advanced,
      ended,
      duration: `${duration}ms`,
      message: `Prosessert ${processed} brukarar — ${advanced} framrykte, ${ended} avslutta`,
      errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
    });
  } catch (err) {
    console.error('[cron] Journey feil:', err);
    
    await prisma.systemLog.create({
      data: {
        level: 'ERROR',
        message: `Cron journey feil: ${(err as Error).message}`,
        module: 'cron/journey',
        metadata: {},
      },
    });

    return NextResponse.json(
      { error: 'Kunne ikkje køyre cron journey', details: (err as Error).message },
      { status: 500 }
    );
  }
}

// Ingen caching for cron-endepunkt
export const revalidate = 0;