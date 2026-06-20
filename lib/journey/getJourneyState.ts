// getJourneyState.ts — henter eller oppretter journey-state for en bruker
// kompatibel med Prisma-schema: JourneyProgress har userId, phase, day
import prisma from "@/lib/prisma";
import { buildJourneyState, advanceDay, JOURNEY_TOTAL_DAYS } from "./journeyEngine";

/**
 * Henter eller oppretter journey for en bruker og returnerer journey-state.
 */
export async function getOrCreateJourney(userId: string) {
  let journey = await prisma.journeyProgress.findUnique({
    where: { userId },
  });

  if (!journey) {
    journey = await prisma.journeyProgress.create({
      data: {
        userId,
        phase: "EARLY",
        day: 1,
      },
    });
  }

  return buildJourneyState(journey.day, journey.day);
}

/**
 * Sjekker om journey er fullført for en bruker.
 */
export async function isJourneyComplete(userId: string): Promise<boolean> {
  const journey = await prisma.journeyProgress.findUnique({
    where: { userId },
    select: { day: true },
  });

  return journey ? journey.day >= JOURNEY_TOTAL_DAYS : false;
}

/**
 * Henter journey-status for en bruker (kort format).
 */
export async function getJourneyStatus(userId: string): Promise<{
  day: number;
  phase: string;
  isComplete: boolean;
  phaseLabel: string;
}> {
  const journey = await prisma.journeyProgress.findUnique({
    where: { userId },
    select: { day: true, phase: true },
  });

  if (!journey) {
    return { day: 0, phase: "EARLY", isComplete: false, phaseLabel: "Ikke startet" };
  }

  const state = buildJourneyState(journey.day, journey.day);

  return {
    day: journey.day,
    phase: journey.phase,
    isComplete: state.isComplete,
    phaseLabel: state.phaseLabel,
  };
}

// Alias for backward compatibility — imported as getJourneyState in some routes.
export const getJourneyState = getOrCreateJourney;
