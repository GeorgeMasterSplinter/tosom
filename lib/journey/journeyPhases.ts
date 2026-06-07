// ToSom JourneyPhases-API – fase-inndeling av 35-dagers reise
// Ren logikk, ingen sideeffekter, ingen IO.
// Bruker Prisma JourneyPhase-enum som sannhet.

import { JourneyPhase } from "@prisma/client";

export interface JourneyPhaseConfig {
  phase: JourneyPhase;
  startDay: number;
  endDay: number;
  description: string;
}

// Standardkonfigurasjon: 35-dagers reise
const phaseConfigs: JourneyPhaseConfig[] = [
  {
    phase: JourneyPhase.EARLY,
    startDay: 1,
    endDay: 14,
    description: "Denne delen av reisen er uten bilder.",
  },
  {
    phase: JourneyPhase.BUILDING_TRUST,
    startDay: 15,
    endDay: 21,
    description: "Nå kan dere se hverandres bilder. Ta det rolig.",
  },
  {
    phase: JourneyPhase.DEEPER,
    startDay: 22,
    endDay: 30,
    description: "Dypere samtaler. Kjenne etter retning og forventninger.",
  },
  {
    phase: JourneyPhase.CHECKIN,
    startDay: 31,
    endDay: 35,
    description: "Avslutning og valg. Dere bestemmer veien videre.",
  },
];

// Fallback når dag er utenfor 1–35
const fallbackConfig: JourneyPhaseConfig = {
  phase: JourneyPhase.CHECKIN,
  startDay: 1,
  endDay: 35,
  description: "Ukjent fase – reisa er kanskje ferdig.",
};

// getPhaseForDay
export function getPhaseForDay(day: number): JourneyPhaseConfig {
  return (
    phaseConfigs.find((p) => day >= p.startDay && day <= p.endDay) ?? fallbackConfig
  );
}

// isPhotosAllowed: true fra dag 15
export function isPhotosAllowed(day: number): boolean {
  return day >= 15;
}

// isJourneyActive: true for dag 1–35
export function isJourneyActive(day: number): boolean {
  return day >= 1 && day <= 35;
}

// isJourneyCompleted: true etter dag 35
export function isJourneyCompleted(day: number): boolean {
  return day > 35;
}

// Eksporter journeyPhasesAPI
export const journeyPhasesAPI = {
  getPhaseForDay,
  isPhotosAllowed,
  isJourneyActive,
  isJourneyCompleted,
  phaseConfigs,
  fallbackConfig,
};
