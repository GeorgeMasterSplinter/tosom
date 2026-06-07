// lib/match/journeySync.ts — DB-basert journey (frå nytt schema)
// Ingen mock store meir. All progresjon lagrast i JourneyProgress (user-basert).

import prisma from "@/lib/prisma";
import type { JourneyPhase } from "@prisma/client";

const TOTAL_DAYS = 35;

function phaseForDay(day: number): JourneyPhase {
  if (day <= 14) return "EARLY";
  if (day <= 21) return "BUILDING_TRUST";
  if (day <= 30) return "DEEPER";
  return "CHECKIN";
}

/**
 * Startar ei ny reise når ein match opprettast.
 */
export async function startJourneyOnMatch(
  userId: string
): Promise<{
  day: number;
  phase: string;
  photosEnabled: boolean;
}> {
  let jp = await prisma.journeyProgress.findUnique({
    where: { userId },
  });

  if (!jp) {
    jp = await prisma.journeyProgress.create({
      data: {
        userId,
        phase: "EARLY" as JourneyPhase,
        day: 1,
      },
    });
  }

  return {
    day: jp.day,
    phase: jp.phase,
    photosEnabled: jp.day >= 13,
  };
}

/**
 * Flyttar reisa ein dag framover.
 */
export async function advanceMatchJourney(
  userId: string
): Promise<{ day: number; changed: boolean; completed: boolean; phase: string }> {
  let jp = await prisma.journeyProgress.findUnique({
    where: { userId },
  });

  if (!jp) {
    jp = await prisma.journeyProgress.create({
      data: {
        userId,
        phase: "EARLY" as JourneyPhase,
        day: 1,
      },
    });
    return { day: 1, changed: false, completed: false, phase: "EARLY" };
  }

  if (jp.day >= TOTAL_DAYS) {
    return { day: jp.day, changed: false, completed: true, phase: jp.phase };
  }

  const newDay = jp.day + 1;
  jp = await prisma.journeyProgress.update({
    where: { userId },
    data: {
      day: newDay,
      phase: phaseForDay(newDay) as JourneyPhase,
    },
  });

  return {
    day: jp.day,
    changed: true,
    completed: jp.day >= TOTAL_DAYS,
    phase: jp.phase,
  };
}

/**
 * Nullstiller reisa for ein brukar.
 */
export async function resetMatchJourney(
  userId: string
): Promise<{ day: number; phase: string }> {
  let jp = await prisma.journeyProgress.findUnique({
    where: { userId },
  });

  if (!jp) {
    return { day: 0, phase: "EARLY" };
  }

  jp = await prisma.journeyProgress.update({
    where: { userId },
    data: {
      day: 1,
      phase: "EARLY" as JourneyPhase,
    },
  });

  return { day: jp.day, phase: jp.phase };
}

/**
 * Sjekkar om reisa er fullført.
 */
export async function isMatchJourneyComplete(userId: string): Promise<boolean> {
  const jp = await prisma.journeyProgress.findUnique({
    where: { userId },
  });
  return jp ? jp.day >= TOTAL_DAYS : false;
}

/**
 * Hentar progresjonen for ein brukar.
 */
export async function getMatchJourney(userId: string): Promise<{
  day: number;
  phase: string;
  photosEnabled: boolean;
}> {
  const jp = await prisma.journeyProgress.findUnique({
    where: { userId },
  });

  if (!jp) {
    return { day: 0, phase: "EARLY", photosEnabled: false };
  }

  return {
    day: jp.day,
    phase: jp.phase,
    photosEnabled: jp.day >= 13,
  };
}
