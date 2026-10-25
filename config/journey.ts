/**
 * Tosom — Canonical journey config (Én kilde for alle journey-dagstall)
 *
 * Dette er den ENSTE plassen der reisevarigheten, bildeåpning og startvindu
 * defineres. Alt annet (engine, cron, journeySync, legal, admin, copy, tests)
 * importerer fra her.
 *
 * Ny 7/14-modell (fra PLAN J1):
 *   - Dag 1–7  : ingen bilder (samtalen først)
 *   - Dag 8    : bildet blir tilgjengelig (efter eksisterende sikre reveal-regler)
 *   - Dag 8–14 : samtalen fortsetter med bildet som del av helheten
 *   - Dag 14   : den guidede reisen avsluttes
 *
 * Dette er produktdesign — ikke et vitenskapelig optimalt tidsintervall.
 * Ingen copy må påstå at "syv dager er optimalt".
 *
 * Filen er isomorf (ingen lib/- eller prisma-instans-importer) slik at den
 * kan brukes både på client og server uten problematiske avhengigheter.
 */

import { JourneyPhase } from "@prisma/client";

/** Totalt antall dager i den guidede reisen. */
export const JOURNEY_TOTAL_DAYS = 14;

/** Hvilken dag bildet blir tilgjengelig. */
export const PHOTO_REVEAL_DAY = 8;

/** Startvindu (i dager) før en match som aldri startet utløper. */
export const JOURNEY_START_WINDOW_DAYS = 7;

/** Tema-ranger for dagtekstene (5 tema over 14 dager). */
export type JourneyTheme =
  | "intro"
  | "trygghet"
  | "fordypning"
  | "modning"
  | "integrasjon";

export interface JourneyPhaseConfig {
  phase: JourneyPhase;
  startDay: number;
  endDay: number;
  description: string;
}

/**
 * Fasesamletningen — 4 faser over 14 dager.
 *   Fase 1 (1–7)  : PERSON FIRST / EARLY
 *   Fase 2 (8–10) : WHOLE PICTURE / BUILDING TRUST
 *   Fase 3 (11–12): DEEPER
 *   Fase 4 (13–14): CHECK-IN / COMPLETION
 */
export const JOURNEY_PHASES: JourneyPhaseConfig[] = [
  {
    phase: JourneyPhase.EARLY,
    startDay: 1,
    endDay: 7,
    description: "Den første uken er uten bilder. Fokus på personen, ikke utseendet.",
  },
  {
    phase: JourneyPhase.BUILDING_TRUST,
    startDay: 8,
    endDay: 10,
    description: "Nå kan dere se hverandres bilder. Ta det rolig.",
  },
  {
    phase: JourneyPhase.DEEPER,
    startDay: 11,
    endDay: 12,
    description: "Dypere samtaler. Kjenne etter retning og forventninger.",
  },
  {
    phase: JourneyPhase.CHECKIN,
    startDay: 13,
    endDay: 14,
    description: "Tid for refleksjon og oppsummering av reisen.",
  },
];

export interface JourneyThemeRange {
  start: number;
  end: number;
  theme: JourneyTheme;
}

/** Tema-progresjon — 5 tema over 14 dager. */
export const JOURNEY_THEME_RANGES: JourneyThemeRange[] = [
  { start: 1, end: 3, theme: "intro" },
  { start: 4, end: 7, theme: "trygghet" },
  { start: 8, end: 10, theme: "fordypning" },
  { start: 11, end: 13, theme: "modning" },
  { start: 14, end: 14, theme: "integrasjon" },
];