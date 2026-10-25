// ═══════════════════════════════════════════
// ToSom Journey Engine – ÉN kilde for ALT journey
// ═══════════════════════════════════════════
// 
// Konsoliderer:
//   - lib/journey/journeyPhases.ts     (fase-konfig, Prisma JourneyPhase)
//   - lib/journey/milestones.ts         (milepælmeldingar)
//   - lib/journey/progression.ts        (theme-progresjon, UserProgress)
//   - lib/journey/journeyEngine.ts      (DB-funksjonar, advanceJourney) ⚠️ SLEPP
//   - lib/journey/journeyStateEngine.ts (MatchFlow + systemMessages) ⚠️ SLEPP
//   - lib/journey/getJourneyState.ts    (getOrCreateJourney) ⚠️ SLEPP
//   - components/journey/journeyEngine.ts (dagetekster 1-14, theme-ranges) ⚠️ SLETTES
//   - lib/resonance.ts                  (resonans-berekning)
//   - lib/warmIndicator.ts              (warmth-score)
//   - lib/silentMoments.ts              (silent moments detection)
//   - lib/generateFirstMessage.ts       (match-melding)
//   - lib/getJourneyImpulse.ts          (daglige prompts 1-14)

// ═══════════════════════════════════════════
// TYPE DEFINISJONAR
// ═══════════════════════════════════════════

import { JourneyPhase } from "@prisma/client";
import type { SystemMessage, SystemEvent } from "../system/systemMessages";
import {
  JOURNEY_TOTAL_DAYS,
  PHOTO_REVEAL_DAY,
  JOURNEY_START_WINDOW_DAYS,
  JOURNEY_PHASES,
  JOURNEY_THEME_RANGES,
} from "@/config/journey";
import type { JourneyTheme } from "@/config/journey";

// Re-eksporterer dagstallene fra @/config/journey slik at eksisterende import
// fra engine fremdeles fungerer. @/config/journey er den eneste kilden.
export { JOURNEY_TOTAL_DAYS, PHOTO_REVEAL_DAY, JOURNEY_START_WINDOW_DAYS };

/* ---------- JourneyState — én interface for heile systemet ---------- */

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

/* ---------- MatchState — én interface for match-flow ---------- */

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

export type Theme = JourneyTheme;

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
// KONSTANTER — én kilde for alt
// (De faktiske dagstallene ligger i @/config/journey)
// ═══════════════════════════════════════════

/** Fase-konfigurasjon — 4 faser over 14 dager (fra @/config/journey) */
export const PHASE_CONFIGS: Array<{
  phase: JourneyPhase;
  startDay: number;
  endDay: number;
  description: string;
}> = JOURNEY_PHASES;

/** Theme-progresjon — 5 tema over 14 dager (fra @/config/journey) */
export const THEME_RANGES: Array<{ start: number; end: number; theme: Theme }> =
  JOURNEY_THEME_RANGES;

/** Phase labels for UI */
const PHASE_LABELS: Record<JourneyPhase, string> = {
  [JourneyPhase.EARLY]: "Bli kjent",
  [JourneyPhase.BUILDING_TRUST]: "Bygger tillit",
  [JourneyPhase.DEEPER]: "Dypere samvær",
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

/** Map phase order → UI phase name (fra phase.ts) */
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
  return day >= PHOTO_REVEAL_DAY;
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

/**
 * PL-06 / K-4: Beregner reisedagen deterministisk ut fra starttidspunktet
 * (bothSeenAt), i stedet for å telle +1 per cron-kjøring.
 *
 * Dag 1 er startdøgnet (norsk tid). Differansen er alltid hele kalenderdøgn,
 * også over overgangen mellom sommertid og vintertid, fordi begge
 * tidspunktene snapes til Oslo-dato før de trekkes fra. Begrenset til 1–14.
 *
 * Begge partnere deler samme bothSeenAt og får derfor alltid samme dag,
 * uavhengig av når hver sin reiserad prosesseres.
 */
export function journeyDayFor(start: Date, now: Date = new Date()): number {
  const osloDato = (d: Date) =>
    new Date(d.toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' }));
  const MS_PER_DAG = 24 * 60 * 60 * 1000;
  const dager = Math.round(
    (osloDato(now).getTime() - osloDato(start).getTime()) / MS_PER_DAG
  );
  return Math.max(1, Math.min(JOURNEY_TOTAL_DAYS, 1 + dager));
}

// ═══════════════════════════════════════════
// MILEPÆLS-FUNKSJONAR (fra milestones.ts)
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
    title: "Dag 7 – en uke sammen",
    body: "Én uke har gått. Dere har latt samtalen lede. Nå kommer bildet deres – ta det rolig, uten press.",
    level: "success",
  },
  {
    day: 10,
    title: "Dag 10 – vendepunkt",
    body: "Nå har dere kommet et stykke. Det er vanlig å kjenne usikkerhet – og det er helt greit.",
    level: "info",
  },
  {
    day: 14,
    title: "Dag 14 – reisen avsluttes",
    body: "Den guidede Tosom-reisen er nå ferdig. Dere velger hva som skjer videre – helt fritt.",
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
// BUILD JOURNEY STATE — én kilde for heile systemet
// ═══════════════════════════════════════════

function buildMessages(matchState: MatchState, day: number): SystemMessage[] {
  const raw: SystemMessage[] = [];

  /* Milepæls-meldinger */
  if (matchState === "in_journey") {
    const milestone = getMilestoneForDay(day);
    if (milestone) {
      raw.push(milestone);
    }
  }

  /* Phasedeklarasjon — bilde-status */
  const photosAllowed = isPhotosAllowed(day);
  if (photosAllowed) {
    raw.push({
      event: "phase2_active" as const,
      title: "Bildet deres er nå tilgjengelig.",
      body: "Dere har hatt én uke der samtalen kom først. Fysisk tiltrekning er en del av bildet – men bildet alene er ikke hele personen. Ta det rolig, begge to.",
      level: "success",
    });
  } else {
    raw.push({
      event: "phase1_active" as const,
      title: "Denne uken er uten bilder.",
      body: "La ord og tanker være veien mellom dere – i alle fall for nå.",
      level: "info",
    });
  }

  /* Dag 14 – reisen avsluttes */
  if (day >= JOURNEY_TOTAL_DAYS) {
    raw.push({
      event: "journey_completed" as const,
      title: "Reisen er ferdig.",
      body: "Den guidede reisen er over. Dere velger hva som skjer videre – helt fritt.",
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
 * Bygg hele journey-state fra grunnen.
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
// USER PROGRESS (fra progression.ts)
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

  progress.photosEnabled = isPhotosAllowed(progress.currentDay);

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
// RESONANCE MOTOR (fra resonance.ts)
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
    { modifier: 0.8, focus: 'Introduksjon — bygger grunnlag', description: 'Resonansen er lavere i starten — det er normalt.' },
    { modifier: 0.9, focus: 'Trygghet — utdyper båndet', description: 'Resonansen øker når tryggheten kommer.' },
    { modifier: 1.0, focus: 'Sårbarhet — mest autentisk resonans', description: 'Dette er kjernen i resonans — sårbarhet skaper ekte resonans.' },
    { modifier: 1.1, focus: 'Fremtid — resonansen modnes', description: 'Resonansen er høy når fremtidstemaene kommer.' },
    { modifier: 1.15, focus: 'Dybde — full resonans', description: 'Maksimal resonans — begge er helt til stede.' },
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
  return { color: '#8282FF', label: 'Tidlig resonans', glow: '0 0 8px rgba(130, 130, 255, 0.1)', intensity: 0.2 };
}

// ═══════════════════════════════════════════
/** @deprecated (V2) Warmth-score er en del av resonans-systemet. Fjerna. Beholdes for bakover-kompatibilitet. */
// WARMTH MOTOR (fra warmIndicator.ts)
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
  let description = 'Fortsatt kjølig.';
  let color = '#8282FF';
  let glow = '0 0 12px rgba(130,130,255,0.15)';

  if (warmth >= 80) {
    level = 'Ekko';
    description = 'Dype, varme ekkoer — begge er helt til stede.';
    color = '#FFD700';
    glow = '0 0 28px rgba(255,215,0,0.35)';
  } else if (warmth >= 60) {
    level = 'Glødende';
    description = 'Gløden i samtalen øker.';
    color = '#FF8C42';
    glow = '0 0 24px rgba(255,140,66,0.3)';
  } else if (warmth >= 40) {
    level = 'Varm';
    description = 'Varmen kommer sakte og støtt.';
    color = '#FFB86C';
    glow = '0 0 20px rgba(255,184,108,0.25)';
  } else if (warmth >= 20) {
    level = 'Lunken';
    description = 'En svak varme — det tar tid.';
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
// SILENT MOMENTS MOTOR (fra silentMoments.ts)
// ═══════════════════════════════════════════

export const SILENT_MOMENT_CONFIG: SilentMomentConfig = {
  inactivityThreshold: 30000,
  displayDuration: 8000,
  minMessages: 3,
/** @deprecated (V2) Silent moments er en del av resonans-systemet. Fjerna. Beholdes for bakover-kompatibilitet. */
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
// DAY TEXTS — 14 dager med tema og prompts (7/14-modell)
// Uke 1 (1–7): personen først, uten bilder. Uke 2 (8–14): helheten, med bilde.
// ═══════════════════════════════════════════

const dayData: Record<number, {
  title: string;
  focus: string;
  reflectionPrompt: string;
  microInsight: string;
  progressionHint: string;
}> = {
  1: { title: "Start", focus: "Første møte – ta det i deres eget tempo.", reflectionPrompt: "Hva håper du denne uken gir dere?", microInsight: "Det første steget er alltid det viktigste.", progressionHint: "I morgen handler det om hverdagen." },
  2: { title: "Hverdagen", focus: "La hverdagen bli del av samtalen.", reflectionPrompt: "Hva gjør en hverdagsgod dag for deg?", microInsight: "Små steg betyr mer enn du tror.", progressionHint: "I morgen: hva betyr noe for dere?" },
  3: { title: "Det som betyr noe", focus: "Snakk om det dere brenner for.", reflectionPrompt: "Hva er noe du virkelig setter pris på?", microInsight: "Interesser er en dør inn til hverandre.", progressionHint: "I morgen blir det lettere." },
  4: { title: "Letthet", focus: "Det er lov å le – og å være lett.", reflectionPrompt: "Hva får dere til å le?", microInsight: "Humor er en form for tillit.", progressionHint: "I morgen blir det litt mer personlig." },
  5: { title: "Litt personlig", focus: "Hold døren åpen for noe mer personlig.", reflectionPrompt: "Hva er noe du ikke forteller ofte?", microInsight: "Åpenhet krever mot – og gir frihet.", progressionHint: "I morgen: hvordan er dere med andre?" },
  6: { title: "Med andre", focus: "Hvordan er dere i møte med andre mennesker?", reflectionPrompt: "Hva gjør dere trygge i et møte?", microInsight: "Trygghet bygges i små, jevne øyeblikk.", progressionHint: "I morgen: en refleksjon før bildet." },
  7: { title: "Før bildet", focus: "Én uke der samtalen kom først.", reflectionPrompt: "Hva har overrasket deg denne uken?", microInsight: "Bildet er bare en del av personen – ikke hele.", progressionHint: "Snart får dere se hverandre. Ta det rolig." },
  8: { title: "Følelser", focus: "Nå ser dere hverandre. Gi rom for hva dere kjenner.", reflectionPrompt: "Hva kjenner du nå, når du kan se dem?", microInsight: "Fysisk tiltrekning er en del av bildet – ikke hele.", progressionHint: "I morgen handler det om tillit." },
  9: { title: "Sårbarhet og tillit", focus: "Sårbarhet bygger tillit – i det tempo dere begge er trygge med.", reflectionPrompt: "Hva gjør det lettere for deg å åpne deg?", microInsight: "Å våge litt er ofte nok.", progressionHint: "I morgen: hva håper dere?" },
  10: { title: "Håp", focus: "Snakk om hva dere håper på.", reflectionPrompt: "Hva håper du å finne i en partner?", microInsight: "Håp er et kompass, ikke et kart.", progressionHint: "I morgen: trygghet med hverandre." },
  11: { title: "Trygghet med andre", focus: "Trygghet er et felles verk.", reflectionPrompt: "Hva får deg til å kjenne trygghet ved dem?", microInsight: "Trygghet bygges sammen, ikke alene.", progressionHint: "I morgen: gi og ta." },
  12: { title: "Giv og ta", focus: "Balansen mellom å gi og å ta imot.", reflectionPrompt: "Hva er viktigst for deg i å gi og ta imot?", microInsight: "Å kunne ta imot er like viktig som å gi.", progressionHint: "I morgen: vokse og møte redsler." },
  13: { title: "Vokse", focus: "Vokse – og møte det som krever mot.", reflectionPrompt: "Hva har krevd mot av deg?", microInsight: "Mot er ikke fravær av redsel – det er et valg.", progressionHint: "I morgen er siste dag." },
  14: { title: "Helheten", focus: "Se helheten – og velg hva som skjer videre.", reflectionPrompt: "Hva tar dere med dere videre?", microInsight: "Reisen er ferdig. Valget er deres.", progressionHint: "Takk for at dere ga hverandre denne reisen." },
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

/** Default current day for demo/bruk uten argument */
export function getCurrentDay(): number {
  return 1;
}

// ═══════════════════════════════════════════
// JOURNEY IMPULSE — daglige prompts (fra getJourneyImpulse.ts)
// ═══════════════════════════════════════════

export function getJourneyImpulse({ day, name }: { day: number; name: string }): string | null {
  const impulses: Record<number, string> = {
    1: `Det er helt fint å ta det rolig. Et enkelt hei til ${name} kan være en god start.`,
    2: `Hvis du føler for det, kan du dele noe lite om hverdagen din. Det trenger ikke være stort.`,
    3: `Samtaler vokser ofte av det dere brenner for. En interesse, noe du liker, en tanke.`,
    4: `Noen ganger er det fint bare å le. Del gjerne noe som fikk deg til å le denne uken.`,
    5: `Hvis du føler for det, kan du dele noe litt mer personlig. Små ærlige ting bygger tillit.`,
    6: `Du kan spørre ${name} om hvordan de er i møte med andre. Det viser interesse uten press.`,
    7: `Én uke er bak dere. Del gjerne noe som overrasket deg denne uken – og ta det rolig før bildet åpnes.`,
    8: `Nå kan dere se hverandre. Det er helt greit å la det synke inn – i deres eget tempo.`,
    9: `Hvis dere er trygge med det, kan en liten åpen tanke bygge tillit. I deres eget tempo.`,
    10: `Du kan dele litt av hva du håper på. Det åpner ofte for en god samtale.`,
    11: `Samtaler blir dypere når dere deler hva som gir trygghet. Del gjerne en liten refleksjon.`,
    12: `Hvis du vil, kan du dele litt om hvordan du liker at det er med å gi og ta imot.`,
    13: `Noen ganger er det fint å dele noe som har krevd litt mot. Det skaper ekte kontakt.`,
    14: `Reisen avsluttes snart. Del gjerne noe du setter pris på ved måten dere har vært sammen.`,
  };

  return impulses[day] ?? null;
}

// ═══════════════════════════════════════════
// FIRST MESSAGE (fra generateFirstMessage.ts)
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
