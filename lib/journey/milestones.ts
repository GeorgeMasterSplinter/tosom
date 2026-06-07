// ToSom Milepælmeldingar – systemmeldingar for viktige steg i reisa
// Rene funksjonar, ingen sideeffektar, ingen IO.

import type { SystemMessage } from "../system/systemMessages";

/* ------ Milepælpunkt med melding per dag ------ */

export interface Milestone {
  day: number;
  title: string;
  body: string;
  level: "info" | "success" | "warning";
}

export const milestoneMessages: Milestone[] = [
  {
    day: 3,
    title: "Dag 3 – refleksjon",
    body: "Du har kome tre dagar inn i reisa. Kva har overraska deg så langt?",
    level: "info",
  },
  {
    day: 7,
    title: "Dag 7 – innsikt",
    body: "Ein veke med sjølvoppdaging. Kva har du forstått betre om deg sjølv?",
    level: "success",
  },
  {
    day: 10,
    title: "Dag 10 – vendepunkt",
    body: "No har du kome eit stykke. Det er vanleg å kjenne usikkerheit no – og det er heilt greit.",
    level: "info",
  },
  {
    day: 14,
    title: "Dag 14 – fordypning",
    body: "Du er no djupt inne i reisa. La deg ikkje skremje av kjensler som kjem – dei er ein del av veksten.",
    level: "success",
  },
  {
    day: 21,
    title: "Dag 21 – sammenheng",
    body: "Tre veker med reise. Kva trådar ser du no som ikkje var tydelege tidlegare?",
    level: "success",
  },
  {
    day: 28,
    title: "Dag 28 – modning",
    body: "Seks veker. Du har lært noko om deg sjølv som du ikkje visste før. Ta det med deg.",
    level: "success",
  },
  {
    day: 30,
    title: "Dag 30 – evaluering",
    body: "Kva har denne reisa gjort med deg? Kva vil du ta med deg vidare?",
    level: "info",
  },
  {
    day: 35,
    title: "Dag 35 – avslutning",
    body: "Reisen er no over. Takk for at du gav deg sjølv 35 dagar med innsikt og vekst.",
    level: "warning",
  },
];

/* ------ Offentlig API ------ */

/**
 * Hentar milepæls-melding for ein gitt dag.
 * Returnerer null dersom ingen milepæl finst for dagen.
 */
export function getMilestoneForDay(day: number): SystemMessage | null {
  const milestone = milestoneMessages.find((m) => m.day === day);
  if (!milestone) return null;

  return {
    event: "milestone_reached" as const,
    title: milestone.title,
    body: milestone.body,
    level: milestone.level,
  };
}

/**
 * Sjekkar om ein dag er ein milepæl.
 */
export function isMilestoneDay(day: number): boolean {
  return milestoneMessages.some((m) => m.day === day);
}

/**
 * Hentar alle milepæls-dagar (for UI-komponentar som JourneyTimeline).
 */
export function getMilestoneDays(): number[] {
  return milestoneMessages.map((m) => m.day).sort((a, b) => a - b);
}

/* --------------*/
/*  milestonesAPI */
/* --------------*/

export const milestonesAPI = {
  milestoneMessages,
  getMilestoneForDay,
  isMilestoneDay,
  getMilestoneDays,
};
