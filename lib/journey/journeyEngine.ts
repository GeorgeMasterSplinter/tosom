// journeyEngine.ts — reiner motor for journey-progresjon
// Ingen sideeffektar — berre funksjonar som transformerer state.

export type JourneyPhase = "EARLY" | "BUILDING_TRUST" | "DEEPER" | "CHECKIN";

export interface JourneyState {
  day: number;
  phase: JourneyPhase;
  completedSteps: number;
  totalSteps: number;
  tasks: JourneyTask[];
  currentTask: JourneyTask | null;
  isComplete: boolean;
  phaseLabel: string;
  phaseDescription: string;
}

export interface JourneyTask {
  day: number;
  question: string;
  completed: boolean;
  phase: JourneyPhase;
}

export interface JourneyTransition {
  fromDay: number;
  toDay: number;
  fromPhase: JourneyPhase;
  toPhase: JourneyPhase;
  triggeredNewPhase: boolean;
  completedTask: JourneyTask | null;
}

// Totalt antal dagar i journey
export const JOURNEY_TOTAL_DAYS = 30;

// Felte per fase
const PHASE_LABELS: Record<JourneyPhase, string> = {
  EARLY: "Bli kjent",
  BUILDING_TRUST: "Bygger tillit",
  DEEPER: "Djupere samvær",
  CHECKIN: "Refleksjon",
};

const PHASE_DESCRIPTIONS: Record<JourneyPhase, string> = {
  EARLY: "Dere er i startfasen. Fokus på lette spørsmål og å lære hverandre å kjenne.",
  BUILDING_TRUST: "Tillit bygges. Spørsmålene blir meir personlege.",
  DEEPER: "No går vi djupare. Refleksjon om verdiar, livssyn og relasjon.",
  CHECKIN: "Tid for å sjå tilbake og vurdere reisen so langt.",
};

// Phases grenser (inclusive)
const PHASE_BOUNDARIES: [JourneyPhase, number, number][] = [
  ["EARLY", 1, 7],
  ["BUILDING_TRUST", 8, 14],
  ["DEEPER", 15, 25],
  ["CHECKIN", 26, 30],
];

/**
 * Berekn fase frå dag.
 */
export function dayToPhase(day: number): JourneyPhase {
  for (const [phase, from, to] of PHASE_BOUNDARIES) {
    if (day >= from && day <= to) return phase;
  }
  return "EARLY";
}

/**
 * Henta alle oppgåver for ein gitt dag.
 */
export function getTasksForDay(day: number): JourneyTask[] {
  const { journeyTasks } = require("@/lib/journeyTasks");
  return journeyTasks
    .filter((t: { day: number }) => t.day === day)
    .map((t: { day: number; question: string }) => ({
      day: t.day,
      question: t.question,
      completed: false,
      phase: dayToPhase(day),
    }));
}

/**
 * Henta alle oppgåver for heile journey-en.
 */
export function getAllTasks(): JourneyTask[] {
  const { journeyTasks } = require("@/lib/journeyTasks");
  return journeyTasks
    .map((t: { day: number; question: string }) => ({
      day: t.day,
      question: t.question,
      completed: false,
      phase: dayToPhase(t.day),
    }));
}

/**
 * Berekn transition når ein oppgåve blir fullført.
 */
export function advanceDay(state: JourneyState): JourneyTransition {
  if (state.isComplete) {
    return {
      fromDay: state.day,
      toDay: state.day,
      fromPhase: state.phase,
      toPhase: state.phase,
      triggeredNewPhase: false,
      completedTask: null,
    };
  }

  const newDay = Math.min(state.day + 1, JOURNEY_TOTAL_DAYS);
  const fromPhase = state.phase;
  const toPhase = dayToPhase(newDay);
  const triggeredNewPhase = fromPhase !== toPhase;

  const task = getTasksForDay(newDay)[0] ?? null;

  return {
    fromDay: state.day,
    toDay: newDay,
    fromPhase,
    toPhase,
    triggeredNewPhase,
    completedTask: task,
  };
}

/**
 * Fullført ein spesifikk dag.
 */
export function completeDay(state: JourneyState, day: number): JourneyState {
  if (day <= state.day) return state;
  return {
    ...state,
    day,
    completedSteps: day,
    phase: dayToPhase(day),
    isComplete: day >= JOURNEY_TOTAL_DAYS,
    currentTask: getTasksForDay(day)[0] ?? null,
    phaseLabel: PHASE_LABELS[dayToPhase(day)],
    phaseDescription: PHASE_DESCRIPTIONS[dayToPhase(day)],
  };
}

/**
 * Berekn heile journey-state frå grunnen.
 */
export function buildJourneyState(day: number, totalSteps: number = 0): JourneyState {
  const phase = dayToPhase(day);
  const tasks = getAllTasks();
  const currentTask = getTasksForDay(day)[0] ?? null;

  return {
    day,
    phase,
    completedSteps: day > 0 ? day : totalSteps,
    totalSteps: JOURNEY_TOTAL_DAYS,
    tasks,
    currentTask,
    isComplete: day >= JOURNEY_TOTAL_DAYS,
    phaseLabel: PHASE_LABELS[phase],
    phaseDescription: PHASE_DESCRIPTIONS[phase],
  };
}

//
// DB-skrivefunksjonar
//

/**
 * Startar ein ny journey for ein bruker (kallast ved match).
 */
export async function startJourney(userId: string): Promise<JourneyState> {
  const { prisma } = await import("@/lib/prisma");

  let journey = await prisma.journeyProgress.findUnique({
    where: { userId },
  });

  if (journey) {
    return buildJourneyState(journey.day, journey.day);
  }

  journey = await prisma.journeyProgress.create({
    data: {
      userId,
      phase: "EARLY",
      day: 1,
    },
  });

  return buildJourneyState(journey.day, journey.day);
}

/**
 * Avanserer journey med éin dag (kallast når ein oppgåve blir fullførd).
 */
export async function advanceJourney(userId: string): Promise<{
  state: JourneyState;
  transition: JourneyTransition;
}> {
  const { prisma } = await import("@/lib/prisma");

  const journey = await prisma.journeyProgress.findUnique({
    where: { userId },
  });

  if (!journey) {
    throw new Error("Journey ikkje funnen for brukar");
  }

  const prevState = buildJourneyState(journey.day, journey.day);
  const transition = advanceDay(prevState);

  if (transition.triggeredNewPhase) {
    await prisma.journeyProgress.update({
      where: { userId },
      data: {
        day: transition.toDay,
        phase: transition.toPhase,
      },
    });
  } else {
    await prisma.journeyProgress.update({
      where: { userId },
      data: { day: transition.toDay },
    });
  }

  const newState = buildJourneyState(transition.toDay, transition.toDay);

  return { state: newState, transition };
}

/**
 * Fullfører ein journey for ein bruker (reset).
 */
export async function resetJourney(userId: string): Promise<JourneyState> {
  const { prisma } = await import("@/lib/prisma");

  await prisma.journeyProgress.upsert({
    where: { userId },
    update: { day: 1, phase: "EARLY" },
    create: {
      userId,
      phase: "EARLY",
      day: 1,
    },
  });

  return buildJourneyState(1, 1);
}
