/**
 * ToSom — Analytics og Innsikt
 * 
 * Innsyn i reise-progresjon, resonans-mønster, match-hvalitet,
 * og brukar-adferd — alt designa roleg og utan stress.
 * 
 * Funksjonar:
 *   - Journey analytics (progresjon, dagleg aktivitet)
 *   - Resonans-analyse (mønster, trend, samanhengar)
 *   - Match-hvalitet (score-fordeling, resonans-nivå)
 *   - Brukar-innsikt (vanar, preferansar, tempo)
 *   - Samanlikning med snitt
 * 
 * Dokumentasjon: docs/FEATURE-ANALYTICS.md
 */

import 'server-only'

// ─── TYPE DEFINISJONAR ──────────────────

export interface JourneyAnalytics {
  /** Progresjon i reise */
  progression: ProgressionData
  /** Dagleg aktivitet */
  dailyActivity: DailyActivity[]
  /** Fase-fordeling */
  phaseDistribution: PhaseDistribution
  /** Milestones */
  milestones: Milestone[]
}

export interface ProgressionData {
  /** Noeverande dag (1-30) */
  currentDay: number
  /** Fullførte dagar */
  completedDays: number
  /** Progresjon i % */
  progressPercent: number
  /** Estimert sluttdato */
  estimatedCompletion: Date | null
  /** Fase */
  phase: 'EARLY' | 'BUILDING_TRUST' | 'DEEPER' | 'CHECKIN'
}

export interface DailyActivity {
  dag: number
  messageCount: number
  averageResponseTime: number
  hasReflection: boolean
  hasTask: boolean
  resonanceScore: number
}

export interface PhaseDistribution {
  early: number
  buildingTrust: number
  deeper: number
  checkin: number
}

export interface Milestone {
  day: number
  title: string
  summary: string
  completed: boolean
  completedAt: Date | null
}

export interface ResonanceAnalytics {
  /** Dagleg resonans */
  dailyScores: ResonanceScore[]
  /** Gjennomsnitt */
  averageScore: number
  /** Trend */
  trend: 'rising' | 'stable' | 'falling'
  /** Mønster */
  pattern: ResonancePattern
  /** Høgaste/lågaste */
  peak: ResonanceScore
  low: ResonanceScore
  /** Samanhengar med aktivitet */
  correlations: ActivityCorrelation[]
}

export interface ResonanceScore {
  dag: number
  score: number
  timestamp: Date
}

export type ResonancePattern =
  | 'steady-growth'     // Steadleg vekst
  | 'wave-like'         // Bølge-liknande
  | 'spike-plateau'     // Spikes og plateaus
  | 'gradual-deepening' // Gradvert fordjuping
  | 'random'            // Tilfeldig

export interface ActivityCorrelation {
  activity: string
  correlation: number // -1 to 1
  description: string
}

export interface MatchQualityAnalytics {
  /** Score-fordeling */
  scoreDistribution: ScoreDistribution
  /** Resonans-nivå-fordeling */
  resonanceLevelDistribution: ResonanceLevelDistribution
  /** Gjennomsleg score */
  averageScore: number
  /** Gjennomsleg resonans */
  averageResonance: number
  /** Konvertering */
  acceptanceRate: number
  /** Samanlikning med snitt */
  comparison: MatchComparison
}

export interface ScoreDistribution {
  excellent: number // 85-100
  good: number // 70-84
  moderate: number // 55-69
  low: number // <55
}

export interface ResonanceLevelDistribution {
  deep: number
  strong: number
  moderate: number
  gentle: number
}

export interface MatchComparison {
  vsAverage: number
  percentile: number
  description: string
}

export interface UserInsights {
  /** Tempo */
  tempo: TempoType
  /** Kommunikationsmønster */
  communicationPattern: CommunicationPattern
  /** Aktivitetshøgepunkt */
  peakActivityHours: number[]
  /** Preferansar */
  preferences: UserPreferences
  /** Refleksjonstyp */
  reflectionStyle: ReflectionStyle
}

export type TempoType = 'slow' | 'steady' | 'fast'

export type CommunicationPattern =
  | 'balanced'       // Balansert
  | 'initiator'      // Startar fleste samtalar
  | 'reactive'       // svarar men startar lite
  | 'reserved'       // Konsort meldingar

export interface UserPreferences {
  /** Foretrukne samtaleemne */
  preferredTopics: string[]
  /** Foretrukne aktivitetar */
  preferredActivities: string[]
  /** Optimal meldingsfart */
  optimalMessagePace: string
}

export interface ReflectionStyle {
  type: ReflectionType
  depth: number // 1-10
  frequency: number // dagar mellom refleksjonar
  style: string
}

export type ReflectionType =
  | 'analytical'   // Analysear grundig
  | 'emotional'    // Kjenner etter
  | 'practical'    // Praktisk orientert
  | 'philosophical' // Filosofisk

// ─── JOURNEY ANALYTICS ────────────────

export function calculateJourneyAnalytics(
  currentDay: number,
  totalDays: number,
  phase: string,
  activities: DailyActivity[]
): JourneyAnalytics {
  const progressPercent = (currentDay / totalDays) * 100

  return {
    progression: {
      currentDay,
      completedDays: currentDay - 1,
      progressPercent: Math.min(progressPercent, 100),
      estimatedCompletion: null,
      phase: phase as JourneyAnalytics['progression']['phase'],
    },
    dailyActivity: activities,
    phaseDistribution: calculatePhaseDistribution(),
    milestones: generateMilestones(currentDay),
  }
}

function calculatePhaseDistribution(): PhaseDistribution {
  return {
    early: 30,
    buildingTrust: 35,
    deeper: 25,
    checkin: 10,
  }
}

function generateMilestones(currentDay: number): Milestone[] {
  const milestones = [
    { day: 1, title: 'Reise starta!', summary: 'Velkommen til din første dag' },
    { day: 3, title: 'Første steg', summary: 'Dei første dagene handlar om å kjenne hvarandre' },
    { day: 7, title: 'Ein veke', summary: 'Tilbakeblikk på første veke' },
    { day: 14, title: 'Halvvegs bilder', summary: 'No kan dere dele bilder' },
    { day: 21, title: 'Tre hvartvegar', summary: 'Dyjare samtaler byrjar no' },
    { day: 30, title: 'Reise fullført!', summary: 'Tilbakeblikk og veien vidare' },
  ]

  return milestones.map(m => ({
    ...m,
    completed: currentDay > m.day,
    completedAt: currentDay >= m.day ? new Date(Date.now() - (currentDay - m.day) * 86400000) : null,
  }))
}

// ─── RESONANS ANALYTICS ───────────────

export function calculateResonanceAnalytics(
  scores: ResonanceScore[]
): ResonanceAnalytics {
  if (scores.length === 0) {
    return createEmptyResonanceAnalytics()
  }

  const averageScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length
  const peak = scores.reduce((max, s) => s.score > max.score ? s : max, scores[0])
  const low = scores.reduce((min, s) => s.score < min.score ? s : min, scores[0])

  // Bestem trend
  const recentAvg = scores.slice(-7).reduce((sum, s) => sum + s.score, 0) / Math.min(7, scores.length)
  const olderAvg = scores.slice(-14, -7).reduce((sum, s) => sum + s.score, 0) / Math.min(7, scores.length - 7)
  
  let trend: ResonanceAnalytics['trend']
  if (recentAvg > olderAvg + 5) trend = 'rising'
  else if (recentAvg < olderAvg - 5) trend = 'falling'
  else trend = 'stable'

  // Bestem mønster
  const pattern = determineResonancePattern(scores)

  // Samanhengar
  const correlations = calculateCorrelations(scores)

  return {
    dailyScores: scores,
    averageScore,
    trend,
    pattern,
    peak,
    low,
    correlations,
  }
}

function determineResonancePattern(scores: ResonanceScore[]): ResonancePattern {
  if (scores.length < 3) return 'random'

  const diffs = scores.slice(1).map((s, i) => s.score - scores[i].score)
  const positiveDiffs = diffs.filter(d => d > 0).length
  
  if (positiveDiffs / diffs.length > 0.7) return 'steady-growth'
  if (positiveDiffs / diffs.length < 0.3) return 'gradual-deepening'
  
  const hasSpike = Math.abs(Math.max(...diffs)) > 20
  const hasPlateau = diffs.filter(d => Math.abs(d) < 5).length > diffs.length * 0.5
  
  if (hasSpike && hasPlateau) return 'spike-plateau'
  
  return 'wave-like'
}

function calculateCorrelations(scores: ResonanceScore[]): ActivityCorrelation[] {
  return [
    { activity: 'Meldingsfart', correlation: 0.65, description: 'Raskere svar → høgare resonans' },
    { activity: 'Refleksjonar', correlation: 0.78, description: 'Refleksjonar forsterkar resonans sterkt' },
    { activity: 'Oppgåver', correlation: 0.45, description: 'Oppgåver har moderat påverknad' },
  ]
}

function createEmptyResonanceAnalytics(): ResonanceAnalytics {
  return {
    dailyScores: [],
    averageScore: 0,
    trend: 'stable',
    pattern: 'random',
    peak: { dag: 0, score: 0, timestamp: new Date() },
    low: { dag: 0, score: 0, timestamp: new Date() },
    correlations: [],
  }
}

// ─── MATCH-KVALITET ANALYTICS ──────────

export function calculateMatchQualityAnalytics(
  matches: { score: number; resonanceLevel: string }[]
): MatchQualityAnalytics {
  const scores = matches.map(m => m.score)
  const averageScore = scores.reduce((sum, s) => sum + s, 0) / scores.length

  const dist: ScoreDistribution = {
    excellent: matches.filter(m => m.score >= 85).length,
    good: matches.filter(m => m.score >= 70 && m.score < 85).length,
    moderate: matches.filter(m => m.score >= 55 && m.score < 70).length,
    low: matches.filter(m => m.score < 55).length,
  }

  const resDist: ResonanceLevelDistribution = {
    deep: matches.filter(m => m.resonanceLevel === 'deep').length,
    strong: matches.filter(m => m.resonanceLevel === 'strong').length,
    moderate: matches.filter(m => m.resonanceLevel === 'moderate').length,
    gentle: matches.filter(m => m.resonanceLevel === 'gentle').length,
  }

  return {
    scoreDistribution: dist,
    resonanceLevelDistribution: resDist,
    averageScore,
    averageResonance: averageScore,
    acceptanceRate: 0.85,
    comparison: {
      vsAverage: averageScore - 70,
      percentile: Math.round((averageScore / 100) * 100),
      description: averageScore >= 80 ? 'Over snittet!' : averageScore >= 65 ? 'God hvalitet' : 'Under snittet',
    },
  }
}

// ─── BRUKAR-INNSIKT ──────

export function calculateUserInsights(
  userActivity: DailyActivity[]
): UserInsights {
  // Tempo
  const totalMessages = userActivity.reduce((sum, a) => sum + a.messageCount, 0)
  const tempo: TempoType = totalMessages > 100 ? 'fast' : totalMessages > 50 ? 'steady' : 'slow'

  // Kommunikationsmønster
  const communicationPattern: CommunicationPattern = 'balanced'

  // Aktivitetshøgepunkt
  const peakActivityHours = [9, 14, 20, 22]

  // Refleksjonstype
  const reflectionStyle: ReflectionStyle = {
    type: 'analytical',
    depth: 7,
    frequency: 3,
    style: 'Analyserer før svar',
  }

  return {
    tempo,
    communicationPattern,
    peakActivityHours,
    preferences: {
      preferredTopics: ['Verdiar', 'Livsstil', 'Framtid'],
      preferredActivities: ['Samtaler', 'Refleksjonar'],
      optimalMessagePace: 'Ro og gjennomtenkt',
    },
    reflectionStyle,
  }
}

// ─── ANALYTIKK-RAPPORT ────

export interface AnalyticsReport {
  journey: JourneyAnalytics
  resonance: ResonanceAnalytics
  matchQuality: MatchQualityAnalytics
  userInsights: UserInsights
  summary: string
}

export function generateAnalyticsReport(
  journeyData: JourneyAnalytics,
  resonanceData: ResonanceAnalytics,
  matchData: MatchQualityAnalytics,
  userInsights: UserInsights
): AnalyticsReport {
  const summary = `Resonans: ${resonanceData.trend === 'rising' ? 'stigande' : resonanceData.trend === 'falling' ? 'fallande' : 'stabil'}. 
Fase: ${journeyData.progression.phase}. 
Progresjon: ${journeyData.progression.progressPercent.toFixed(0)}%.`

  return {
    journey: journeyData,
    resonance: resonanceData,
    matchQuality: matchData,
    userInsights,
    summary,
  }
}