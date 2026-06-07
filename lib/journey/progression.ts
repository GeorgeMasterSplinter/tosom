// ToSom Progresjonshøgd – dag 1–35
// Rene funksjonar, ingen sideeffektar, ingen IO.
// Kan seinare koplast til backend, brukarprofil eller AI.

/* ---------- Typer ---------- */

export type Theme =
  | "intro"
  | "trygghet"
  | "fordypning"
  | "modning"
  | "integrasjon";

export interface UserProgress {
  userId: string;
  matchId: string;
  currentDay: number;
  startedAt: number;
  lastActiveAt: number;
  completedDays: number[];
  reflectionsCompleted: number;
  photosEnabled: boolean;
}

/* ---------- Konstanter ---------- */

const MAX_DAY = 35;
const PHASE1_LIMIT = 12; // Fase 1 (utan bilete) går til dag 12
const PHASE2_START = 13; // Fase 2 (med bilete) startar dag 13

// Tema-progresjon: intro → trygghet → fordypning → modning → integrasjon
const themeRanges: { start: number; end: number; theme: Theme }[] = [
  { start: 1, end: 5, theme: "intro" },
  { start: 6, end: 12, theme: "trygghet" },
  { start: 13, end: 20, theme: "fordypning" },
  { start: 21, end: 28, theme: "modning" },
  { start: 29, end: 35, theme: "integrasjon" },
];

/* ---------- Hjelpefunksjonar ---------- */

function resolveTheme(day: number): Theme {
  return (
    themeRanges.find((r) => day >= r.start && day <= r.end)?.theme ??
    themeRanges[0].theme
  );
}

function getDefaultProgress(userId: string, matchId: string): UserProgress {
  const now = Date.now();
  return {
    userId,
    matchId,
    currentDay: 1,
    startedAt: now,
    lastActiveAt: now,
    completedDays: [],
    reflectionsCompleted: 0,
    photosEnabled: false,
  };
}

/* ---------- Offentlig API ---------- */

/**
 * Hentar progresjonen for ein brukar.
 * Dersom ingen progresjon finst, returnerer ein standardverdi.
 */
export function getUserProgress(
  userId: string,
  matchId: string,
  progressStore?: Record<string, UserProgress>
): UserProgress {
  if (!progressStore) return getDefaultProgress(userId, matchId);
  const key = `${userId}:${matchId}`;
  return progressStore[key] ?? getDefaultProgress(userId, matchId);
}

/**
 * Fører ein dag framover.
 * Kan ikkje gå utover dag 35.
 * Legg til dag i completedDays og oppdaterar photosEnabled.
 */
export function advanceOneDay(
  userId: string,
  matchId: string,
  progressStore?: Record<string, UserProgress>
): { progress: UserProgress; changed: boolean } {
  const key = `${userId}:${matchId}`;
  const existing = progressStore?.[key];

  // Lagar ny progresjon dersom ingen finst
  let progress = existing
    ? { ...existing, lastActiveAt: Date.now() }
    : getDefaultProgress(userId, matchId);

  // Kan ikkje gå vidare etter dag 35
  if (progress.currentDay >= MAX_DAY) {
    return { progress, changed: false };
  }

  const previousDay = progress.currentDay;
  progress.currentDay = Math.min(MAX_DAY, progress.currentDay + 1);
  progress.lastActiveAt = Date.now();

  // Legg til i completedDays dersom ikkje allereie der
  if (!progress.completedDays.includes(previousDay)) {
    progress.completedDays = [...progress.completedDays, previousDay];
  }

  // Opne for bilete frå fase 2
  progress.photosEnabled = progress.currentDay >= PHASE2_START;

  return { progress, changed: true };
}

/**
 * Nullstiller heile reisa for ein brukar.
 */
export function resetJourney(
  userId: string,
  matchId: string,
  progressStore?: Record<string, UserProgress>
): UserProgress {
  const key = `${userId}:${matchId}`;
  // Fjern frå store
  if (progressStore) {
    delete progressStore[key];
  }
  return getDefaultProgress(userId, matchId);
}

/**
 * Sjekkar om reisa er fullført.
 */
export function isJourneyComplete(
  userId: string,
  matchId: string,
  progressStore?: Record<string, UserProgress>
): boolean {
  const progress = getUserProgress(userId, matchId, progressStore);
  return progress.currentDay >= MAX_DAY && progress.completedDays.length >= MAX_DAY;
}

/**
 * Hentar temaet for ein gitt dag.
 */
export function getThemeForDay(day: number): Theme {
  return resolveTheme(day);
}

/**
 * Sjekkar om ein dag er fullført.
 */
export function isDayComplete(
  userId: string,
  matchId: string,
  day: number,
  progressStore?: Record<string, UserProgress>
): boolean {
  const progress = getUserProgress(userId, matchId, progressStore);
  return progress.completedDays.includes(day);
}

/**
 * Hentar ferdig dag-oversikt for ein brukar.
 */
export function getCompletedDaysOverview(
  userId: string,
  matchId: string,
  progressStore?: Record<string, UserProgress>
): number[] {
  const progress = getUserProgress(userId, matchId, progressStore);
  return [...progress.completedDays].sort((a, b) => a - b);
}

/**
 * Hentar faseinformasjon for ein dag.
 */
export function getPhaseForDay(day: number): {
  phase: number;
  name: string;
  description: string;
  photosAllowed: boolean;
} {
  if (day < PHASE2_START) {
    return {
      phase: 1,
      name: "Kjennskap",
      description: "Utan bilete — fokuser på ord og tankar.",
      photosAllowed: false,
    };
  }
  return {
    phase: 2,
    name: "Djupning",
    description: "Med bilete — del opplevingar og kvardag.",
    photosAllowed: true,
  };
}
