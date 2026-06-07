// JourneyStateEngine – samler MatchFlow + JourneyPhases + JourneyEngine
// i én samlet tilstand. Ren logikk, ingen sideeffekter, ingen IO.
// TODO: matchContext skal senere komme fra backend (API eller zustand).

import { JourneyPhase } from "@prisma/client";
import { getPhaseForDay, isPhotosAllowed, isJourneyActive, isJourneyCompleted } from "./journeyPhases";
import { systemMessagesAPI } from "../system/systemMessages";
import { milestonesAPI } from "./milestones";
import type { SystemMessage, SystemEvent } from "../system/systemMessages";

/* --------------*/
/*  MatchState   */
/* --------------*/

export type MatchState =
  | "ready_for_match"
  | "searching"
  | "matched"
  | "in_journey"
  | "completed";

/* --------------*/
/*  MatchContext */
/* --------------*/

export interface MatchContext {
  matchState: MatchState;
  conversationId?: string;
}

/* --------------*/
/*  JourneyState */
/* --------------*/

export interface JourneyState {
  currentDay: number;
  phase: JourneyPhase;
  photosAllowed: boolean;
  journeyActive: boolean;
  journeyCompleted: boolean;
  matchState: MatchState;
  messages: SystemMessage[];
}

/* --------------*/
/*  JourneyStateInput */
/* --------------*/

export interface JourneyStateInput {
  matchContext: MatchContext;
  currentDay?: number;
}

/* --------------*/
/*  buildMessages */
/* --------------*/

function buildMessages(matchState: MatchState, day: number): SystemMessage[] {
  const raw: SystemMessage[] = [];

  /* Milepæls-meldingar skal triggest før vanlege journey-steg */
  if (matchState === "in_journey") {
    const milestone = milestonesAPI.getMilestoneForDay(day);
    if (milestone) {
      raw.push(milestone);
    }
  }

  const base = systemMessagesAPI.getMessagesForState(matchState, day);
  raw.push(...base);

  const phase = getPhaseForDay(day);
  if (phase.phase === JourneyPhase.EARLY || phase.phase === JourneyPhase.BUILDING_TRUST) {
    raw.push({
      event: "phase1_active",
      title: "Denne delen av reisen er uten bilder.",
      body: "La ord og tanker være veien mellom dere – i alle fall for nå.",
      level: "info",
    });
  } else {
    raw.push({
      event: "phase2_active",
      title: "Nå kan dere dele bilder hvis dere ønsker.",
      body: "Bildene kommer til å gi dere en ny dimensjon sammen.",
      level: "success",
    });
  }

  if (day === 14) {
    raw.push({
      event: "phase1_active",
      title: "I morgen blir bilder tilgjengelige.",
      body: "Du får vite når dere kan begynne å dele bilder.",
      level: "info",
    });
  }

  if (day === 35) {
    raw.push({
      event: "journey_completed",
      title: "Reisen er ferdig.",
      body: "Takk for at dere ga hverandre 35 dager.",
      level: "warning",
    });
  }

  const seen = new Set<string>();
  const unique = raw.filter((msg) => {
    const key = `${msg.event}||${msg.body}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const levelOrder: Record<string, number> = { warning: 0, info: 1, success: 2 };
  unique.sort((a, b) => (levelOrder[a.level] ?? 9) - (levelOrder[b.level] ?? 9));

  return unique;
}

/* --------------*/
/*  getJourneyState */
/* --------------*/

export function getJourneyState(input: JourneyStateInput): JourneyState {
  let day = input.currentDay ?? 1;

  if (day < 1) day = 1;
  if (day > 35) day = 35;

  const phaseConfig = getPhaseForDay(day);
  const photosAllowed = isPhotosAllowed(day);
  const journeyActive = isJourneyActive(day);
  const journeyCompleted = isJourneyCompleted(day);
  const matchState = input.matchContext.matchState;
  const messages = buildMessages(matchState, day);

  return {
    currentDay: day,
    phase: phaseConfig.phase,
    photosAllowed,
    journeyActive,
    journeyCompleted,
    matchState,
    messages,
  };
}

/* --------------*/
/*  journeyStateAPI */
/* --------------*/

export const journeyStateAPI = {
  getJourneyState,
};

export const dummyMatchContext: MatchContext = {
  matchState: "in_journey",
};
