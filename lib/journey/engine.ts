// ═══════════════════════════════════════════
// ToSom Journey Engine – ÉIN kjelde for ALT journey
// ═══════════════════════════════════════════
// 
// Konsoliderer:
//   - lib/journey/journeyPhases.ts     (fase-konfig, Prisma JourneyPhase)
//   - lib/journey/milestones.ts         (milepælmeldingar)
//   - lib/journey/progression.ts        (theme-progresjon, UserProgress)
//   - lib/journey/journeyEngine.ts      (DB-funksjonar, advanceJourney) ⚠️ SLEPP
//   - lib/journey/journeyStateEngine.ts (MatchFlow + systemMessages) ⚠️ SLEPP
//   - lib/journey/getJourneyState.ts    (getOrCreateJourney) ⚠️ SLEPP
//   - components/journey/journeyEngine.ts (dagetekster 1-30, theme-ranges) ⚠️ SLETTES
//   - lib/resonance.ts                  (resonans-berekning)
//   - lib/warmIndicator.ts              (warmth-score)
//   - lib/silentMoments.ts              (silent moments detection)
//   - lib/generateFirstMessage.ts       (match-melding)
//   - lib/getJourneyImpulse.ts          (daglige prompts 1-30)

// ═══════════════════════════════════════════
// TYPE DEFINISJONAR
// ═══════════════════════════════════════════

import { JourneyPhase } from "@prisma/client";
import type { SystemMessage, SystemEvent } from "../system/systemMessages";

/* ---------- JourneyState — éin interface for heile systemet ---------- */

export interface JourneyState {
  currentDay: number;
  phase: JourneyPhase;
  phaseLabel: string;
  phaseDescription: string;
  photosAllowed: boolean;
  journeyActive: boolean;
  journeyCompleted: boolean;
  matchState: MatchState;
  messages: SystemMessage[];
  progress: number;           // 0–100
  phaseProgress: number;      // 0–100 (innanfor noverande fase)
  daysRemaining: number;
  currentTask?: JourneyTask | null;
}

export interface JourneyTask {
  day: number;
  question: string;
  completed: boolean;
  phase: JourneyPhase;
}

/* ---------- MatchState — éin interface for match-flow ---------- */

export type MatchState =
  | "ready_for_match"
  | "searching"
  | "matched"
  | "in_journey"
  | "completed";

export interface MatchContext {
  matchState: MatchState;
  conversationId?: string;
}

/* ---------- UserProgress — progresjonshantering ---------- */

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

/* ---------- ResonanceScores — resonans-motor ---------- */

export interface ResonanceScores {
  resonance: number;    // 0–100
  trygghet: number;     // 0–100
  dybde: number;        // 0–100
  varme: number;        // 0–100
  samtaleKvalitet: number;  // 0–100
}

export interface ResonanceInput {
  conversationId: string;
  userId: string;
  partnerId: string;
  messageCount: number;
  responseTimeAvg: number;
  longestStreak: number;
  phaseOrder: number;
  daysTogether: number;
  mutualDepth: number;
  reflectionCount: number;
  taskCompletion: number;
}

export interface ResonanceSnapshot {
  conversationId: string;
  scores: ResonanceScores;
  timestamp: string;
  phaseOrder: number;
  messageCount: number;
  daysTogether: number;
}

/* ---------- WarmScore — warmth-motor ---------- */

export interface WarmScore {
  score: number;
  level: string;
  description: string;
  color: string;
  glow: string;
}

export interface WarmHistoryEntry {
  conversationId: string;
  score: number;
  timestamp: string;
  messageCount: number;
  phaseOrder: number;
}

export interface WarmTrend {
  direction: 'opp' | 'ned' | 'flat';
  change: number;
  history: WarmHistoryEntry[];
}

/* ---------- SilentMoment — silence-motor ---------- */

export interface SilentMomentConfig {
  inactivityThreshold: number;
  displayDuration: number;
  minMessages: number;
  minPhaseOrder: number;
  cooldownMs: number;
}

export interface SilentMoment {
  id: string;
  conversationId: string;
  text: string;
  timestamp: string;
  phaseOrder: number;
  displayed: boolean;
}

export interface SilenceDetection {
  isSilent: boolean;
  elapsedMs: number;
  nextMomentInMs: number;
  shouldTrigger: boolean;
}

/* ---------- DayConfig — daglege tema og prompts ---------- */

export type DayTheme = Theme;

export interface DayConfig {
  dayNumber: number;
  title: string;
  theme: DayTheme;
  icon: string;
  focus: string;
  reflectionPrompt: string;
  microInsight: string;
  progressionHint: string;
}

// ═══════════════════════════════════════════
// KONSTANTAR — éin kilde for alt
// ═══════════════════════════════════════════

/** Totalt antal dagar i journey — ENKELT svar */
export const JOURNEY_TOTAL_DAYS = 30;

/** Fase-konfigurasjon — 4 faser over 30 dager (frå journeyPhases) */
export const PHASE_CONFIGS: Array<{
  phase: JourneyPhase;
  startDay: number;
  endDay: number;
  description: string;
}> = [
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
    endDay: 25,
    description: "Dypere samtaler. Kjenne etter retning og forventninger.",
  },
  {
    phase: JourneyPhase.CHECKIN,
    startDay: 26,
    endDay: 30,
    description: "Tid for refleksjon og oppsummering av reisen så langt.",
  },
];

/** Theme-progresjon — 5 tema over 30 dagar (frå progression.ts) */
export const THEME_RANGES: Array<{ start: number; end: number; theme: Theme }> = [
  { start: 1, end: 5, theme: "intro" },
  { start: 6, end: 12, theme: "trygghet" },
  { start: 13, end: 20, theme: "fordypning" },
  { start: 21, end: 26, theme: "modning" },
  { start: 27, end: 30, theme: "integrasjon" },
];

/** Phase labels for UI */
const PHASE_LABELS: Record<JourneyPhase, string> = {
  [JourneyPhase.EARLY]: "Bli kjent",
  [JourneyPhase.BUILDING_TRUST]: "Bygger tillit",
  [JourneyPhase.DEEPER]: "Djupere samvær",
  [JourneyPhase.CHECKIN]: "Refleksjon",
};

const PHASE_DESCRIPTIONS: Record<JourneyPhase, string> = {
  [JourneyPhase.EARLY]: "Dere er i startfasen. Fokus på lette spørsmål og å lære hverandre å kjenne.",
  [JourneyPhase.BUILDING_TRUST]: "Tillit bygges. Spørsmålene blir mer personlige.",
  [JourneyPhase.DEEPER]: "Nå går vi dypere. Refleksjon om verdier, livssyn og relasjon.",
  [JourneyPhase.CHECKIN]: "Tid for å se tilbake og vurdere reisen så langt.",
};

// ═══════════════════════════════════════════
// HJELPEFUNKSJONAR
// ═══════════════════════════════════════════

/** Map journey phase order (1–4) → UI phase order */
export function getPhaseOrder(phase: JourneyPhase): number {
  switch (phase) {
    case JourneyPhase.EARLY: return 1;
    case JourneyPhase.BUILDING_TRUST: return 2;
    case JourneyPhase.DEEPER: return 3;
    case JourneyPhase.CHECKIN: return 4;
  }
}

/** Map phase order → UI phase name (frå phase.ts) */
export function getPhaseName(order: number): string {
  const names = [
    '',
    'Introduksjon',
    'Trygghet',
    'Sårbarhet',
    'Fremtid',
  ];
  return names[order] || '';
}

// ═══════════════════════════════════════════
// FASE-FUNKSJONAR (én kilde)
// ═══════════════════════════════════════════

export function getPhaseForDay(day: number): {
  phase: JourneyPhase;
  startDay: number;
  endDay: number;
  description: string;
} {
  const config = PHASE_CONFIGS.find((p) => day >= p.startDay && day <= p.endDay);
  return config ?? {
    phase: JourneyPhase.CHECKIN,
    startDay: 1,
    endDay: JOURNEY_TOTAL_DAYS,
    description: "Ukjent fase – reisen er kanskje ferdig.",
  };
}

export function getThemeForDay(day: number): Theme {
  const theme = THEME_RANGES.find((r) => day >= r.start && day <= r.end);
  return theme?.theme ?? "intro";
}

export function isPhotosAllowed(day: number): boolean {
  return day >= 15;
}

export function isJourneyActive(day: number): boolean {
  return day >= 1 && day <= JOURNEY_TOTAL_DAYS;
}

export function isJourneyCompleted(day: number): boolean {
  return day > JOURNEY_TOTAL_DAYS;
}

export function dayToPhase(day: number): JourneyPhase {
  return getPhaseForDay(day).phase;
}

// ═══════════════════════════════════════════
// MILEPÆLS-FUNKSJONAR (frå milestones.ts)
// ═══════════════════════════════════════════

export interface Milestone {
  day: number;
  title: string;
  body: string;
  level: "info" | "success" | "warning";
}

const MILESTONE_MESSAGES: Milestone[] = [
  {
    day: 3,
    title: "Dag 3 – refleksjon",
    body: "Du har kommet tre dager inn i reisen. Hva har overrasket deg så langt?",
    level: "info",
  },
  {
    day: 7,
    title: "Dag 7 – innsikt",
    body: "En uke med selvoppdagelse. Hva har du forstått bedre om deg selv?",
    level: "success",
  },
  {
    day: 10,
    title: "Dag 10 – vendepunkt",
    body: "Nå har du kommet et stykke. Det er vanlig å kjenne usikkerhet nå – og det er helt greit.",
    level: "info",
  },
  {
    day: 14,
    title: "Dag 14 – fordypning",
    body: "Du er nå djupt inne i reisen. La deg ikke skremme av følelser som kommer – de er en del av veksten.",
    level: "success",
  },
  {
    day: 21,
    title: "Dag 21 – sammenheng",
    body: "Tre uker med reise. Hva tråder ser du nå som ikke var tydelige tidligere?",
    level: "success",
  },
  {
    day: 28,
    title: "Dag 28 – modning",
    body: "Seks uker. Du har lært noe om deg selv som du ikke visste før. Ta det med deg.",
    level: "success",
  },
  {
    day: 30,
    title: "Dag 30 – avslutning",
    body: "Reisen er nå over. Takk for at du gav deg selv 30 dager med innsikt og vekst.",
    level: "warning",
  },
];

export function getMilestoneForDay(day: number): SystemMessage | null {
  const milestone = MILESTONE_MESSAGES.find((m) => m.day === day);
  if (!milestone) return null;
  return {
    event: "milestone_reached" as const,
    title: milestone.title,
    body: milestone.body,
    level: milestone.level,
  };
}

export function isMilestoneDay(day: number): boolean {
  return MILESTONE_MESSAGES.some((m) => m.day === day);
}

export function getMilestoneDays(): number[] {
  return MILESTONE_MESSAGES.map((m) => m.day).sort((a, b) => a - b);
}

// ═══════════════════════════════════════════
// BUILD JOURNEY STATE — éin kilde for heile systemet
// ═══════════════════════════════════════════

function buildMessages(matchState: MatchState, day: number): SystemMessage[] {
  const raw: SystemMessage[] = [];

  /* Milepæls-meldingar */
  if (matchState === "in_journey") {
    const milestone = getMilestoneForDay(day);
    if (milestone) {
      raw.push(milestone);
    }
  }

  /* Phasedeklarasjon — bilete-status */
  const photosAllowed = isPhotosAllowed(day);
  if (photosAllowed) {
    raw.push({
      event: "phase2_active" as const,
      title: "Nå kan dere dele bilder hvis dere ønsker.",
      body: "Bildene kommer til å gi dere en ny dimensjon sammen.",
      level: "success",
    });
  } else {
    raw.push({
      event: "phase1_active" as const,
      title: "Denne delen av reisen er uten bilder.",
      body: "La ord og tanker være veien mellom dere – i alle fall for nå.",
      level: "info",
    });
  }

  /* Dag 30 avslutning */
  if (day >= 30) {
    raw.push({
      event: "journey_completed" as const,
      title: "Reisen er ferdig.",
      body: "Takk for at dere ga hverandre 30 dager.",
      level: "warning",
    });
  }

  /* Fjern duplikatar */
  const seen = new Set<string>();
  const unique = raw.filter((msg) => {
    const key = `${msg.event}||${msg.body}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  /* Sorter etter priority */
  const levelOrder: Record<string, number> = { warning: 0, info: 1, success: 2 };
  unique.sort((a, b) => (levelOrder[a.level] ?? 9) - (levelOrder[b.level] ?? 9));

  return unique;
}

/**
 * Build heile journey-state frå grunnen.
 * Éin funksjon som leverer alt systemet treng.
 */
export function buildJourneyState(
  currentDay: number,
  matchContext: MatchContext,
  totalDays: number = JOURNEY_TOTAL_DAYS
): JourneyState {
  const day = Math.max(1, Math.min(currentDay, totalDays));
  const phaseConfig = getPhaseForDay(day);
  const phaseLabel = PHASE_LABELS[phaseConfig.phase] || "";
  const phaseDescription = PHASE_DESCRIPTIONS[phaseConfig.phase] || "";

  const phaseStart = phaseConfig.startDay;
  const phaseEnd = phaseConfig.endDay;
  const phaseProgress = Math.round(((day - phaseStart) / (phaseEnd - phaseStart)) * 100);

  const progress = Math.round((day / totalDays) * 100);

  return {
    currentDay: day,
    phase: phaseConfig.phase,
    phaseLabel,
    phaseDescription,
    photosAllowed: isPhotosAllowed(day),
    journeyActive: isJourneyActive(day),
    journeyCompleted: isJourneyCompleted(day),
    matchState: matchContext.matchState,
    messages: buildMessages(matchContext.matchState, day),
    progress: Math.min(progress, 100),
    phaseProgress: Math.min(Math.max(phaseProgress, 0), 100),
    daysRemaining: Math.max(0, totalDays - day),
  };
}

// ═══════════════════════════════════════════
// MATCH STATE HELPERS
// ═══════════════════════════════════════════

export const dummyMatchContext: MatchContext = {
  matchState: "in_journey",
};

// ═══════════════════════════════════════════
// USER PROGRESS (frå progression.ts)
// ═══════════════════════════════════════════

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

export function getUserProgress(
  userId: string,
  matchId: string,
  progressStore?: Record<string, UserProgress>
): UserProgress {
  if (!progressStore) return getDefaultProgress(userId, matchId);
  const key = `${userId}:${matchId}`;
  return progressStore[key] ?? getDefaultProgress(userId, matchId);
}

export function advanceOneDay(
  userId: string,
  matchId: string,
  progressStore?: Record<string, UserProgress>
): { progress: UserProgress; changed: boolean } {
  const key = `${userId}:${matchId}`;
  const existing = progressStore?.[key];

  let progress = existing
    ? { ...existing, lastActiveAt: Date.now() }
    : getDefaultProgress(userId, matchId);

  if (progress.currentDay >= JOURNEY_TOTAL_DAYS) {
    return { progress, changed: false };
  }

  const previousDay = progress.currentDay;
  progress.currentDay = Math.min(JOURNEY_TOTAL_DAYS, progress.currentDay + 1);
  progress.lastActiveAt = Date.now();

  if (!progress.completedDays.includes(previousDay)) {
    progress.completedDays = [...progress.completedDays, previousDay];
  }

  progress.photosEnabled = progress.currentDay >= 15;

  // Lagre tilbake til store så neste kall ser oppdateringa
  if (progressStore) {
    progressStore[key] = progress;
  }

  return { progress, changed: true };
}

export function resetUserProgress(
  userId: string,
  matchId: string,
  progressStore?: Record<string, UserProgress>
): UserProgress {
  const key = `${userId}:${matchId}`;
  if (progressStore) {
    delete progressStore[key];
  }
  return getDefaultProgress(userId, matchId);
}

export function isUserJourneyComplete(
  userId: string,
  matchId: string,
  progressStore?: Record<string, UserProgress>
): boolean {
  const progress = getUserProgress(userId, matchId, progressStore);
  return progress.currentDay >= JOURNEY_TOTAL_DAYS && progress.completedDays.length >= JOURNEY_TOTAL_DAYS;
}

export function getCompletedDaysOverview(
  userId: string,
  matchId: string,
  progressStore?: Record<string, UserProgress>
): number[] {
  const progress = getUserProgress(userId, matchId, progressStore);
  return [...progress.completedDays].sort((a, b) => a - b);
}

// ═══════════════════════════════════════════
/**
 * @deprecated (V2) Resonansmåling fjerna — beholdes for bakover-kompatibilitet.
 *
 * V2-prinsipp: Matching er nok. Resten er kommunikasjon mellom to folk.
 * Ingen måling av resonans under reisen. La folk finne ut av det selv.
 * Se docs/tosom-concept-v2-skisse.md for detaljer.
 */
// RESONANCE MOTOR (frå resonance.ts)
// ═══════════════════════════════════════════

export function calculateResonance(input: ResonanceInput): ResonanceScores {
  const {
    messageCount,
    responseTimeAvg,
    longestStreak,
    phaseOrder,
    daysTogether,
    mutualDepth,
    reflectionCount,
    taskCompletion,
  } = input;

  let trygghet = 0;
  trygghet += mutualDepth * 0.4;
  trygghet += Math.min(reflectionCount * 15, 30);
  trygghet += Math.min(daysTogether * 3, 15);
  trygghet += Math.min(taskCompletion * 15, 15);
  trygghet = Math.min(trygghet, 100);

  let dybde = 0;
  dybde += Math.min(messageCount * 5, 30);
  dybde += Math.min(reflectionCount * 10, 25);
  dybde += phaseOrder * 12.5;
  dybde += Math.min(longestStreak * 3, 20);
  dybde = Math.min(dybde, 100);

  let varme = 0;
  if (responseTimeAvg <= 10) varme += 40;
  else if (responseTimeAvg <= 60) varme += 30;
  else varme += 20;
  varme += Math.min(taskCompletion * 25, 25);
  varme += Math.min(longestStreak * 5, 20);
  varme += phaseOrder * 5;
  varme = Math.min(varme, 100);

  let samtaleKvalitet = 0;
  samtaleKvalitet += Math.min(messageCount * 4, 35);
  samtaleKvalitet += Math.min(reflectionCount * 12, 30);
  samtaleKvalitet += Math.min(daysTogether * 2, 15);
  samtaleKvalitet += Math.min(longestStreak * 4, 20);
  samtaleKvalitet = Math.min(samtaleKvalitet, 100);

  const resonance = Math.round(
    trygghet * 0.3 +
    dybde * 0.25 +
    varme * 0.25 +
    samtaleKvalitet * 0.2
  );

  return {
    resonance: Math.min(Math.max(resonance, 0), 100),
    trygghet: Math.min(Math.max(Math.round(trygghet), 0), 100),
    dybde: Math.min(Math.max(Math.round(dybde), 0), 100),
    varme: Math.min(Math.max(Math.round(varme), 0), 100),
    samtaleKvalitet: Math.min(Math.max(Math.round(samtaleKvalitet), 0), 100),
  };
}

export function createResonanceSnapshot(
  input: ResonanceInput,
  scores: ResonanceScores
): ResonanceSnapshot {
  return {
    conversationId: input.conversationId,
    scores,
    timestamp: new Date().toISOString(),
    phaseOrder: input.phaseOrder,
    messageCount: input.messageCount,
    daysTogether: input.daysTogether,
  };
}

export function getPhaseResonanceBias(phaseOrder: number): {
  modifier: number;
  focus: string;
  description: string;
} {
  const phases = [
    { modifier: 0.8, focus: 'Introduksjon — bygger grunnlag', description: 'Resonans er lågare i starten — det er normalt.' },
    { modifier: 0.9, focus: 'Trygghet — dypnar sambandet', description: 'Resonans aukar når trygghet kjem.' },
    { modifier: 1.0, focus: 'Sårbarhet — mest autentisk resonans', description: 'Dette er kjernen i resonans — sårlegskap skapar ekte resonans.' },
    { modifier: 1.1, focus: 'Fremtid — resonans mognar', description: 'Resonans er høg når framtidsteam kjem.' },
    { modifier: 1.15, focus: 'Djupne — full resonans', description: 'Maksimal resonans — begge er heilt til stades.' },
  ];

  const idx = Math.min(Math.max(phaseOrder - 1, 0), phases.length - 1);
  return phases[idx];
}

export function getResonanceVisual(score: number): {
  color: string;
  label: string;
  glow: string;
  intensity: number;
} {
  if (score >= 80) {
    return { color: '#4DFF88', label: 'Djuk resonans', glow: '0 0 24px rgba(77, 255, 136, 0.3)', intensity: 1.0 };
  }
  if (score >= 60) {
    return { color: '#D4AF37', label: 'Sterk resonans', glow: '0 0 20px rgba(212, 175, 55, 0.25)', intensity: 0.8 };
  }
  if (score >= 40) {
    return { color: '#FFB86C', label: 'God resonans', glow: '0 0 16px rgba(255, 184, 108, 0.2)', intensity: 0.6 };
  }
  if (score >= 20) {
    return { color: '#FF82C8', label: 'Moder resonans', glow: '0 0 12px rgba(255, 130, 200, 0.15)', intensity: 0.4 };
  }
  return { color: '#8282FF', label: 'Tidleg resonans', glow: '0 0 8px rgba(130, 130, 255, 0.1)', intensity: 0.2 };
}

// ═══════════════════════════════════════════
/** @deprecated (V2) Warmth-score er ein del av resonans-systemet. Fjerna. Beholdes for bakover-kompatibilitet. */
// WARMTH MOTOR (frå warmIndicator.ts)
// ═══════════════════════════════════════════

export function calculateWarmScore(inputs: {
  messageCount: number;
  responseTimeAvg: number;
  phaseOrder: number;
  taskCompletion: number;
  reflectionCount: number;
  longestStreak: number;
}): WarmScore {
  const { messageCount, responseTimeAvg, phaseOrder, taskCompletion, reflectionCount, longestStreak } = inputs;
  let warmth = 0;

  warmth += Math.min(messageCount * 3, 25);
  if (responseTimeAvg <= 5) warmth += 25;
  else if (responseTimeAvg <= 15) warmth += 20;
  else if (responseTimeAvg <= 60) warmth += 15;
  else warmth += 10;
  warmth += Math.min(taskCompletion * 0.2, 20);
  warmth += Math.min(reflectionCount * 5, 15);
  warmth += Math.min(longestStreak * 2, 10);
  warmth += phaseOrder;
  warmth = Math.min(Math.max(warmth, 0), 100);

  let level = 'Kald';
  let description = 'Enno kjølig.';
  let color = '#8282FF';
  let glow = '0 0 12px rgba(130,130,255,0.15)';

  if (warmth >= 80) {
    level = 'Ekko';
    description = 'Dykk varme ekkoer — begge er heilt til stades.';
    color = '#FFD700';
    glow = '0 0 28px rgba(255,215,0,0.35)';
  } else if (warmth >= 60) {
    level = 'Glødande';
    description = 'Gløden i samtalen aukar.';
    color = '#FF8C42';
    glow = '0 0 24px rgba(255,140,66,0.3)';
  } else if (warmth >= 40) {
    level = 'Varm';
    description = 'Varmen kjem sakt og støtt.';
    color = '#FFB86C';
    glow = '0 0 20px rgba(255,184,108,0.25)';
  } else if (warmth >= 20) {
    level = 'Lukten';
    description = 'Ein svak lukte — det tek tid.';
    color = '#FF82C8';
    glow = '0 0 16px rgba(255,130,200,0.2)';
  }

  return { score: Math.round(warmth), level, description, color, glow };
}

export function addWarmHistoryEntry(
  conversationId: string,
  score: number,
  history: WarmHistoryEntry[],
  messageCount: number,
  phaseOrder: number
): WarmHistoryEntry {
  const entry = { conversationId, score, timestamp: new Date().toISOString(), messageCount, phaseOrder };
  return [...history, entry].slice(-30)[29] ?? entry;
}

export function calculateWarmTrend(history: WarmHistoryEntry[]): WarmTrend {
  if (history.length < 3) return { direction: 'flat', change: 0, history };
  const recent = history.slice(-5);
  const change = recent[recent.length - 1].score - recent[Math.floor(recent.length / 2)].score;
  return { direction: change > 5 ? 'opp' : change < -5 ? 'ned' : 'flat', change, history };
}

export function getWarmUI(score: number) {
  if (score >= 80) return { bg: 'rgba(255,215,0,0.08)', border: 'rgba(255,215,0,0.2)', icon: '🔥', label: 'Ekko', gradient: 'linear-gradient(135deg, #FFD700, #FF8C42)' };
  if (score >= 60) return { bg: 'rgba(255,140,66,0.08)', border: 'rgba(255,140,66,0.2)', icon: '☀️', label: 'Glødande', gradient: 'linear-gradient(135deg, #FF8C42, #FFB86C)' };
  if (score >= 40) return { bg: 'rgba(255,184,108,0.08)', border: 'rgba(255,184,108,0.2)', icon: '🌅', label: 'Varm', gradient: 'linear-gradient(135deg, #FFB86C, #D4AF37)' };
  if (score >= 20) return { bg: 'rgba(255,130,200,0.06)', border: 'rgba(255,130,200,0.15)', icon: '🌸', label: 'Lukten', gradient: 'linear-gradient(135deg, #FF82C8, #B48CFF)' };
  return { bg: 'rgba(130,130,255,0.05)', border: 'rgba(130,130,255,0.12)', icon: '🌙', label: 'Kald', gradient: 'linear-gradient(135deg, #8282FF, #4D8CFF)' };
}

// ═══════════════════════════════════════════
// SILENT MOMENTS MOTOR (frå silentMoments.ts)
// ═══════════════════════════════════════════

export const SILENT_MOMENT_CONFIG: SilentMomentConfig = {
  inactivityThreshold: 30000,
  displayDuration: 8000,
  minMessages: 3,
/** @deprecated (V2) Silent moments er ein del av resonans-systemet. Fjerna. Beholdes for bakover-kompatibilitet. */
  minPhaseOrder: 3,
  cooldownMs: 300000,
};

const SILENT_MOMENTS_BY_PHASE: Record<number, string[]> = {
  3: ['Ta deg tid. Det viktigste kommer ikke av seg selv.', 'Stille øyeblikk er der vi vokser mest.', 'I ro finner vi svarene.'],
  4: ['Fremtiden bygges i stille øyeblikk.', 'Når vi er stille sammen, hører vi hverandre best.'],
  5: ['Maksimal resonans finnes i stillheten.', 'Her er du trygg. Her er du deg selv.'],
};

const DEFAULT_MOMENTS = ['Ta deg tid. Det viktigste kommer ikke av seg selv.', 'I ro finner vi svarene.'];

export function getRandomSilentMoment(phaseOrder: number): string {
  const moments = SILENT_MOMENTS_BY_PHASE[phaseOrder] || DEFAULT_MOMENTS;
  return moments[Math.floor(Math.random() * moments.length)];
}

export function detectSilence(lastActivity: number, config: SilentMomentConfig = SILENT_MOMENT_CONFIG): SilenceDetection {
  const now = Date.now();
  const elapsed = now - lastActivity;
  const isSilent = elapsed >= config.inactivityThreshold;
  return {
    isSilent,
    elapsedMs: elapsed,
    nextMomentInMs: isSilent ? 0 : config.inactivityThreshold - elapsed,
    shouldTrigger: isSilent && elapsed < config.cooldownMs,
  };
}

export function getSilentMomentUI(moment: string, phaseOrder: number) {
  const colors = {
    3: { bg: 'rgba(180,140,255,0.05)', border: 'rgba(180,140,255,0.12)', text: 'rgba(180,140,255,0.5)' },
    4: { bg: 'rgba(255,130,200,0.05)', border: 'rgba(255,130,200,0.12)', text: 'rgba(255,130,200,0.5)' },
    5: { bg: 'rgba(255,215,0,0.05)', border: 'rgba(255,215,0,0.12)', text: 'rgba(255,215,0,0.5)' },
  };
  const fallback = { bg: 'rgba(212,175,55,0.03)', border: 'rgba(212,175,55,0.08)', text: 'rgba(212,175,55,0.4)' };
  const c = colors[phaseOrder] || fallback;
  return {
    text: moment,
    style: { background: c.bg, border: `1px solid ${c.border}`, animation: 'silentFade 8s infinite ease-in-out' },
    textStyle: { color: c.text, fontSize: '13px', fontStyle: 'italic' },
  };
}

export function shouldTriggerSilentMoment(
  lastTrigger: string | null,
  phaseOrder: number,
  messageCount: number
): boolean {
  if (phaseOrder < SILENT_MOMENT_CONFIG.minPhaseOrder) return false;
  if (messageCount < SILENT_MOMENT_CONFIG.minMessages) return false;
  if (lastTrigger) {
    const elapsed = Date.now() - new Date(lastTrigger).getTime();
    if (elapsed < SILENT_MOMENT_CONFIG.cooldownMs) return false;
  }
  return true;
}

// ═══════════════════════════════════════════
// DAY TEXTS — 30 dagar med tema og prompts
// (frå components/journey/journeyEngine.ts)
// ═══════════════════════════════════════════

const dayData: Record<number, {
  title: string;
  focus: string;
  reflectionPrompt: string;
  microInsight: string;
  progressionHint: string;
}> = {
  1: { title: "Start", focus: "Bli kjent med deg selv i denne reisen.", reflectionPrompt: "Hvorfor valgte du å starte denne reisen?", microInsight: "Det første steget er alltid det viktigste.", progressionHint: "I morgen utforsker vi hva trygghet betyr for deg." },
  2: { title: "Nysgjerrig", focus: "La nysgjerrigheten føre deg.", reflectionPrompt: "Hva er du mest nysgjerrig på om deg selv?", microInsight: "Små steg betyr mer enn du tror.", progressionHint: "Fortsett med et rolig blikk på deg selv." },
  3: { title: "Rolig start", focus: "Ta det rolig – det er plass til alt du kjenner.", reflectionPrompt: "Hva gir deg ro i hverdagen?", microInsight: "Ro er et startpunkt, ikke et mål.", progressionHint: "Neste dag bygger vi videre på dette." },
  4: { title: "Åpen", focus: "Hold dørene åpne for det ukjente.", reflectionPrompt: "Hva er vanskeligst ved å åpne seg for nye ting?", microInsight: "Åpenhet krever mot, men gir frihet.", progressionHint: "I morgen snakker vi om grenser." },
  5: { title: "Reflekter", focus: "Tilbakeblikk på de første dagene.", reflectionPrompt: "Hva har overrasket deg de første dagene?", microInsight: "Selvrefleksjon er en styrke, ikke en svakhet.", progressionHint: "Nå går vi dypere." },
  6: { title: "Trygghet", focus: "Utforsk hva trygghet betyr for deg.", reflectionPrompt: "Hva gjør deg trygg i et møte med en annen?", microInsight: "Trygghet bygges i små, konsistente øyeblikk.", progressionHint: "Vi tar dette med oss dypere." },
  7: { title: "Verdier", focus: "Snakk om hva som betyr noe for deg.", reflectionPrompt: "Hvilke verdier styrer valene dine?", microInsight: "Verdier er kompasset ditt – følg dem.", progressionHint: "I morgen utforsker vi verdiene videre." },
  8: { title: "Dypde", focus: "Ta det neste steget inn i deg selv.", reflectionPrompt: "Hvilke ting i livet er viktigst for deg?", microInsight: "Dypde kommer når man tør å bli værende.", progressionHint: "Nå går vi i dybden." },
  9: { title: "Grenser", focus: "Kjenne igjen egne grenser.", reflectionPrompt: "Hva er dine viktigste grenser i en relasjon?", microInsight: "Grenser er en form for omsorg – mot andre og deg selv.", progressionHint: "I morgen handler det om å sette ord på det." },
  10: { title: "Mot", focus: "Kjente til motet ditt.", reflectionPrompt: "Hva krever mot av deg?", microInsight: "Mot er ikke fravær av redsel – det er valg om redsler.", progressionHint: "Vi bygger videre på dette motet." },
  11: { title: "Forventning", focus: "Hva du forventer av deg selv og andre.", reflectionPrompt: "Hva forventer du av en trygg relasjon?", microInsight: "Forventninger kan være en bro eller en mur.", progressionHint: "I morgen ser vi på hva som bygger bro." },
  12: { title: "Halvvegs", focus: "Halvveis i trygghetsdelen.", reflectionPrompt: "Hva har endret syn underveis?", microInsight: "Å endre sinn er styrke, ikke svikt.", progressionHint: "Nå går vi inn i fordypningen." },
  13: { title: "Fordypning", focus: "Dykk dypere inn i deg selv.", reflectionPrompt: "Hva føler du har vært viktigst hittil?", microInsight: "Fordypning krever tid – og vilje til å bli værende.", progressionHint: "Vi tar det dypere i morgen." },
  14: { title: "Sjølinnsikt", focus: "Innsikt i egne mønster.", reflectionPrompt: "Hvilke mønster gjentar du med deg selv?", microInsight: "Å se mønsteret er første steg til endring.", progressionHint: "I morgen handler det om å bryte mønsteret." },
  15: { title: "Kjensler", focus: "Gi rom for hva du føler.", reflectionPrompt: "Hvilke kjensler har dukket opp hos deg?", microInsight: "Kjensler er meldinger – ikke instruksjoner.", progressionHint: "Vi tar videre med rolighet." },
  16: { title: "Sårbarhet", focus: "Tør å være sårbar.", reflectionPrompt: "Hva gjør deg sårbar, og hvorfor er det viktig?", microInsight: "Sårbarhet er like modig som det er vakkert.", progressionHint: "I morgen utforsker vi tillit." },
  17: { title: "Tillit", focus: "Bygge og forstå tillit.", reflectionPrompt: "Hva trenger du for å bygge tillit?", microInsight: "Tillit bygges i øyeblikk, ikke i ord.", progressionHint: "Vi går dypere inn i det samme rommet." },
  18: { title: "Egna styrker", focus: "Kjenne igjen styrkene dine.", reflectionPrompt: "Hva er de sterkeste sidene dine?", microInsight: "Styrker er ofte det vi ikke ser selv.", progressionHint: "I morgen handler det om aksept." },
  19: { title: "Aksept", focus: "Akseptere seg selv slik en er.", reflectionPrompt: "Hva er vanskelig for deg å akseptere ved deg selv?", microInsight: "Aksept er ikke resignasjon – det er startpunkt.", progressionHint: "Vi bygger videre på denne aksepten." },
  20: { title: "Samling", focus: "Samle trådene fra fordypning.", reflectionPrompt: "Hva har gitt deg mest innsikt så langt?", microInsight: "Innsikt kommer ikke av å haste – men av å være tilstede.", progressionHint: "Nå går vi inn i modningsdelen." },
  21: { title: "Modning", focus: "Modning handler om tid, ikke perfektjon.", reflectionPrompt: "Hva har gjort deg modning i livet?", microInsight: "Modning er ikke å bli fullkommen – det er å bli hel.", progressionHint: "I morgen utforsker vi hva modning betyr for relasjoner." },
  22: { title: "Vokse", focus: "Vokse gjennom utfordringer.", reflectionPrompt: "Hva har krevd mest av deg å vokse gjennom?", microInsight: "Vekst kommer ofte når man minst tror på det.", progressionHint: "Vi ser på hva som har formet deg." },
  23: { title: "Redsel og mot", focus: "Møte det du er redd for.", reflectionPrompt: "Hva er du redd for i relasjoner?", microInsight: "Redsel er en vaktmester – ikke en dommer.", progressionHint: "I morgen handler det om å møtes." },
  24: { title: "Håp", focus: "Hva du håper å finne.", reflectionPrompt: "Hva håper du å finne i en partner?", microInsight: "Håp er et kompass, ikke et kart.", progressionHint: "Vi ser på hva som fyller håpet." },
  25: { title: "Trygghet med andre", focus: "Trygghet i møte med et annet menneske.", reflectionPrompt: "Hva får deg til å kjenne trygghet med et annet menneske?", microInsight: "Trygghet er et felles verk.", progressionHint: "I morgen handler det om å gi og ta." },
  26: { title: "Gjeving", focus: "Hva du kan gi og hva du kan ta imot.", reflectionPrompt: "Hva er viktigst for deg i å gi og ta imot?", microInsight: "Å kunne ta imot er like viktig som å gi.", progressionHint: "Vi ser på balansen mellom gi og ta." },
  27: { title: "Balansen", focus: "Finn balansen i deg selv.", reflectionPrompt: "Hva handler balansen om for deg?", microInsight: "Balansen er ikke stillstand – det er bevegelse.", progressionHint: "I morgen nærmer vi oss slutten av modningen." },
  28: { title: "Oppsummering modning", focus: "Hva du har vært gjennom.", reflectionPrompt: "Hva har modningsdelen lært deg om deg selv?", microInsight: "Du har kommet lenger enn du tror.", progressionHint: "Nå går vi inn i integrasjonen." },
  29: { title: "Integrasjon", focus: "Samle alt du har lært.", reflectionPrompt: "Hva tar du med deg videre fra hele reisen?", microInsight: "Integrasjon er ikke slutten – det er en overgang.", progressionHint: "I morgen er siste dag." },
  30: { title: "Framover", focus: "Ta med reisen videre.", reflectionPrompt: "Hva vil du si til deg selv som starta denne reisen?", microInsight: "Du er ikke den samme som da du starta – og det er nettopp poenget.", progressionHint: "Reisen din fortsetter – nå med mer kunnskap." },
};

const FALLBACK_DAY: DayConfig = {
  dayNumber: 0,
  title: "Ukjent dag",
  theme: "intro",
  icon: "❓",
  focus: "Reisen lastes.",
  reflectionPrompt: "Hva kjenner du nå?",
  microInsight: "Ta det rolig.",
  progressionHint: "Vi er her sammen.",
};

const THEME_ICONS: Record<Theme, string> = {
  intro: "🌱",
  trygghet: "🕊️",
  fordypning: "🌊",
  modning: "🌿",
  integrasjon: "✨",
};

function getDayConfig(dayNumber: number): DayConfig {
  const data = dayData[dayNumber];
  if (!data) return FALLBACK_DAY;
  return {
    dayNumber,
    theme: getThemeForDay(dayNumber),
    icon: THEME_ICONS[getThemeForDay(dayNumber)],
    ...data,
  } as DayConfig;
}

function getNextDay(dayNumber: number): number {
  return Math.min(JOURNEY_TOTAL_DAYS, dayNumber + 1);
}

function getPreviousDay(dayNumber: number): number {
  return Math.max(1, dayNumber - 1);
}

/** Resolve theme for UI (emoji-mapping) */
export function resolveTheme(day: number): Theme {
  return getThemeForDay(day);
}

/** Default current day for demo/use utan argument */
export function getCurrentDay(): number {
  return 1;
}

// ═══════════════════════════════════════════
// JOURNEY IMPULSE — daglege prompts (frå getJourneyImpulse.ts)
// ═══════════════════════════════════════════

export function getJourneyImpulse({ day, name }: { day: number; name: string }): string | null {
  const impulses: Record<number, string> = {
    1: `Det er helt fint å ta det rolig. Et enkelt hei til ${name} kan være en god start.`,
    2: `Hvis du føler for det, kan du dele noe lite om deg selv. Det trenger ikke være stort.`,
    3: `Samtaler vokser ofte av små ting. En tanke, en observasjon, noe du liker.`,
    4: `Noen ganger kan det være fint å dele noe du setter pris på i hverdagen. Det kan åpne for en god samtale.`,
    5: `${name} kan være nysgjerrig på hvem du er. En liten historie eller tanke kan være en fin invitasjon.`,
    6: `Samtaler vokser ofte når man deler noe ekte, men lite. Det trenger ikke være personlig – bare ærlig.`,
    7: `Hvis du føler deg komfortabel, kan du spørre ${name} om noe enkelt. Det viser interesse uten press.`,
    8: `Noen ganger kan det være fint å dele noe du ser frem til. Det åpner ofte for gode samtaler.`,
    9: `${name} kan sette pris på å høre om noe som betyr noe for deg – stort eller lite.`,
    10: `Hvis du føler deg komfortabel, kan du dele en liten tanke om hva du liker i mennesker. Det kan skape nærhet.`,
    11: `Samtaler blir ofte dypere når man deler noe ekte, men fortsatt trygt. En liten refleksjon kan være nok.`,
    12: `Du kan spørre ${name} om noe som betyr noe for dem. Det viser interesse uten press.`,
    13: `Det er helt fint å være litt personlig hvis du føler for det. Små ærlige ting bygger tillit.`,
    14: `Hvis du vil, kan du dele noe du setter pris på i relasjoner. Det kan åpne for en fin samtale.`,
    15: `Noen ganger kan det være fint å dele noe som har gjort deg glad i det siste. Det åpner for varme samtaler.`,
    16: `${name} kan sette pris på å høre om noe som inspirerer deg – stort eller lite.`,
    17: `Hvis du føler deg komfortabel, kan du dele en liten tanke om hva som gir deg trygghet i relasjoner.`,
    18: `Samtaler blir ofte dypere når man deler noe som betyr noe for en, uten at det blir for personlig.`,
    19: `Du kan spørre ${name} om noe de setter pris på i hverdagen. Det skaper nærhet uten press.`,
    20: `Hvis du vil, kan du dele noe du verdsetter i mennesker. Det kan åpne for en fin resonans.`,
    21: `Det er helt fint å være litt mer åpen hvis du føler deg trygg. Små ærlige ting bygger ekte kontakt.`,
    22: `Noen ganger kan det være fint å dele noe du har lært om deg selv i det siste. Det åpner for ekte samtaler.`,
    23: `${name} kan sette pris på å høre om hva som gir deg ro eller balanse i hverdagen.`,
    24: `Hvis du føler deg trygg, kan du dele en liten refleksjon om hva som betyr noe for deg i relasjoner.`,
    25: `Samtaler blir ofte dypere når man deler noe som har formet en – uten at det blir for personlig.`,
    26: `Du kan spørre ${name} om noe som inspirerer dem. Det skaper en fin emosjonell resonans.`,
    27: `Hvis du vil, kan du dele noe du setter pris på ved mennesker du føler deg trygg med.`,
    28: `Det er helt fint å være litt mer åpen hvis du føler deg komfortabel. Små refleksjoner bygger ekte kontakt.`,
    29: `Noen ganger kan det være fint å dele noe som gir deg stabilitet i livet. Det åpner for rolige, gode samtaler.`,
    30: `Reisen nærmer seg slutten. Del gjerne noe du setter pris på ved måten samtalen deres har utviklet seg.`,
  };

  return impulses[day] ?? null;
}

// ═══════════════════════════════════════════
// FIRST MESSAGE (frå generateFirstMessage.ts)
// ═══════════════════════════════════════════

export function generateFirstMessage({ name, score, explanation }: {
  name: string;
  score: number;
  explanation: string;
}): string {
  return `Dere er matchet med ${name}.

Matchscore: ${score}/100

${explanation}

Ta det i deres eget tempo. En enkel hei er alltid en fin start.`;
}

// ═══════════════════════════════════════════
// JOURNEY API — UI-komponentar eksporterer herifrå
// ═══════════════════════════════════════════

export const journeyAPI = {
  /* Fase */
  getPhaseForDay,
  getThemeForDay,
  dayToPhase,
  getPhaseOrder,
  getPhaseName,

  /* Status */
  isPhotosAllowed,
  isJourneyActive,
  isJourneyCompleted,

  /* Konfigurasjon */
  PHASE_CONFIGS,
  THEME_RANGES,
  JOURNEY_TOTAL_DAYS,

  /* Milepælar */
  getMilestoneForDay,
  isMilestoneDay,
  getMilestoneDays,

  /* Dag-textar */
  getDayConfig,
  getNextDay,
  getPreviousDay,

  /* State-building */
  buildJourneyState,
  getUserProgress,
  advanceOneDay,
  resetUserProgress,
  isUserJourneyComplete,
  getCompletedDaysOverview,

  /* Resonans */
  calculateResonance,
  createResonanceSnapshot,
  getPhaseResonanceBias,
  getResonanceVisual,

  /* Warmth */
  calculateWarmScore,
  addWarmHistoryEntry,
  calculateWarmTrend,
  getWarmUI,

  /* Silent Moments */
  SILENT_MOMENT_CONFIG,
  getRandomSilentMoment,
  detectSilence,
  getSilentMomentUI,
  shouldTriggerSilentMoment,

  /* Impulse & First Message */
  getJourneyImpulse,
  generateFirstMessage,

  /* Helpers */
  resolveTheme,
  getCurrentDay,
};

// Ingen ekstra exports trengst — alle er allerede eksporterte øvst i fila.
