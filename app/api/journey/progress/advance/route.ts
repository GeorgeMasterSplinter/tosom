/** @deprecated (V2) Oppgåver er valfrie — ikke pliktige lenger. */
/**
 * POST /api/journey/progress/advance
 * 
 * Marker dag som fullført og auk til neste dag.
 * 
 * Core-definition: Dagleg progresjon med 24t-lås. Ingen gamification.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/requireAuth";
import { JourneyPhase } from "@prisma/client";
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const result = await requireAuth(req);
    if (result instanceof NextResponse) {
      return result;
    }
    const user = result.user;

    // 2. Finn aktiv journey for brukaren
    const journey = await prisma.journeyProgress.findFirst({
      where: { userId: user.id },
      select: {
        id: true,
        day: true,
        phase: true,
        completedDays: true,
        nextDayAt: true,
        endedAt: true,
      },
    });

    if (!journey) {
      return NextResponse.json(
        { error: "Ingen aktiv reise funnet. Start ein match for å starte reise.", noJourney: true },
        { status: 404 }
      );
    }

    // 3. Sjekk om reise er fullført
    if (journey.endedAt) {
      return NextResponse.json(
        { error: "Reisa di er allerede fullført.", alreadyEnded: true },
        { status: 409 }
      );
    }

    // 4. Sjekk om neste dag er låst (24t-syklus)
    const now = new Date();
    const nextDayAt = journey.nextDayAt as Date | null;
    if (nextDayAt && now < nextDayAt) {
      return NextResponse.json(
        { 
          error: "Vent til dagen er låst opp.", 
          locked: true,
          nextDayAt: nextDayAt.toISOString(),
        },
        { status: 429 }
      );
    }

    // 5. Sjekk om dag er fullført (completedDays skal være lik noverande day)
    if (journey.completedDays >= journey.day && journey.day < 30) {
      return NextResponse.json(
        { 
          error: "Dagen er allerede markert som fullført.",
          alreadyCompleted: true,
        },
        { status: 409 }
      );
    }

    // 6. Auk completedDays for noverande dag
    const newCompletedDays = journey.completedDays + 1;

    // 7. Bestem ny phase basert på day
    function getPhaseForDay(day: number): JourneyPhase {
      if (day <= 14) return JourneyPhase.EARLY;
      if (day <= 21) return JourneyPhase.BUILDING_TRUST;
      if (day <= 25) return JourneyPhase.DEEPER;
      return JourneyPhase.CHECKIN;
    }

    // 8. Auk til neste dag (dersom ikke allerede ferdig)
    let newDay = journey.day;
    let phaseChangeNotification = false;
    let newPhase: JourneyPhase | undefined;
    const oldPhase = journey.phase;

    if (journey.day < 30) {
      newPhase = getPhaseForDay(journey.day + 1);
      
      // Sjekk om fase-endring skjer
      if (newPhase !== oldPhase) {
        phaseChangeNotification = true;
      }

      newDay = journey.day + 1;
    }

    // 9. Oppdater JourneyProgress
    const updatedJourney = await prisma.journeyProgress.update({
      where: { id: journey.id },
      data: {
        day: newDay,
        completedDays: newCompletedDays,
        phase: getPhaseForDay(newDay),
        nextDayAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // lås neste dag i 24t
      },
      select: {
        id: true,
        day: true,
        phase: true,
        completedDays: true,
        nextDayAt: true,
        startedAt: true,
        endedAt: true,
      },
    });

    // 10. Lagre milestone dersom ny dag
    if (journey.day !== newDay) {
      await prisma.journeyMilestone.create({
        data: {
          progressId: journey.id,
          day: newDay,
          title: `Dag ${newDay} — ${getPhaseForDay(newDay)}`,
          summary: `Ny dag i reisa di: Dag ${newDay} av 30.`,
        },
      });
    }

    // 11. Send notification ved fase-endring
    if (phaseChangeNotification && newPhase) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: "JOURNEY",
          message: `Fase-endring: Du er no i fase ${newPhase}.`,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      journey: {
        day: updatedJourney.day,
        phase: updatedJourney.phase,
        completedDays: updatedJourney.completedDays,
        nextDayAt: (updatedJourney.nextDayAt ?? new Date()).toISOString(),
      },
      milestone: journey.day !== newDay 
        ? { day: newDay, title: `Dag ${newDay}`, created: true }
        : null,
    });
  } catch (error) {
    console.error("POST /api/journey/progress/advance error:", error);
    return NextResponse.json(
      { error: "Internt feil ved framrykking i reisa.", internal: true },
      { status: 500 }
    );
  }
}

// Ingen caching for denne endepunktet
export const revalidate = 0;