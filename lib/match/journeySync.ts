// lib/match/journeySync.ts — DB-basert journey (match-scoped etter B4)
// ONE record per user per match (composite unique [userId, matchId])

import prisma from "@/lib/prisma";
import type { JourneyPhase } from "@prisma/client";
// M-5: Én kilde for fasedefinisjon — importerer fra engine (DEEPER 22-25, CHECKIN 26-30).
import { dayToPhase } from "@/lib/journey/engine";

const TOTAL_DAYS = 30;

// findFirst uses WhereInput — simple { userId, matchId } works
const whereForFind = (userId: string, matchId: string) => ({ userId, matchId });
// update/delete use WhereUniqueInput — needs composite key name
const whereUnique = (userId: string, matchId: string) => ({ jp_user_match: { userId, matchId } });

export async function startJourneyOnMatch(
  userId: string,
  matchId: string,
): Promise<{ day: number; phase: string; photosEnabled: boolean }> {
  let jp = await prisma.journeyProgress.findFirst({ where: whereForFind(userId, matchId) });
  if (!jp) {
    jp = await prisma.journeyProgress.create({
      data: { userId, matchId, phase: "EARLY" as JourneyPhase, day: 0 },
    });
  }
  return { day: jp.day, phase: jp.phase, photosEnabled: jp.day >= 13 };
}

export async function advanceMatchJourney(
  userId: string,
  matchId: string,
): Promise<{ day: number; changed: boolean; completed: boolean; phase: string }> {
  let jp = await prisma.journeyProgress.findFirst({ where: whereForFind(userId, matchId) });
  if (!jp) {
    jp = await prisma.journeyProgress.create({
      data: { userId, matchId, phase: "EARLY" as JourneyPhase, day: 1 },
    });
    return { day: 1, changed: false, completed: false, phase: "EARLY" };
  }
  if (jp.day >= TOTAL_DAYS) {
    return { day: jp.day, changed: false, completed: true, phase: jp.phase };
  }
  const newDay = jp.day + 1;
  jp = await prisma.journeyProgress.update({
    where: whereUnique(userId, matchId),
    data: { day: newDay, phase: dayToPhase(newDay) },
  });
  return { day: jp.day, changed: true, completed: jp.day >= TOTAL_DAYS, phase: jp.phase };
}

export async function resetMatchJourney(
  userId: string,
  matchId: string,
): Promise<{ day: number; phase: string }> {
  let jp = await prisma.journeyProgress.findFirst({ where: whereForFind(userId, matchId) });
  if (!jp) { return { day: 0, phase: "EARLY" }; }
  jp = await prisma.journeyProgress.update({
    where: whereUnique(userId, matchId),
    data: { day: 1, phase: "EARLY" as JourneyPhase },
  });
  return { day: jp.day, phase: jp.phase };
}

export async function isMatchJourneyComplete(userId: string, matchId: string): Promise<boolean> {
  const jp = await prisma.journeyProgress.findFirst({ where: whereForFind(userId, matchId) });
  return jp ? jp.day >= TOTAL_DAYS : false;
}

export async function getMatchJourney(
  userId: string,
  matchId: string,
): Promise<{ day: number; phase: string; photosEnabled: boolean }> {
  const jp = await prisma.journeyProgress.findFirst({ where: whereForFind(userId, matchId) });
  if (!jp) { return { day: 0, phase: "EARLY", photosEnabled: false }; }
  return { day: jp.day, phase: jp.phase, photosEnabled: jp.day >= 13 };
}