/**
 * ToSom — Partner Presence Engine
 * 
 * Kjenne hvar part er i reisa, og vise det på ein varm og roleg måte.
 * 
 * Funksjonar:
 *   - Presence tracking (online/offline/in-journey)
 *   - Activity feed (quiet, non-intrusive)
 *   - Shared resonance display
 *   - "De er på same stad i reisa" indikator
 *   - Gentle nudge ved stans
 * 
 * Dokumentasjon: docs/FEATURE-PARTNER-PRESENCE.md
 */

import 'server-only'

// ─── TYPE DEFINISJONAR ───────────────────────────────────────

export interface PresenceState {
  /** Er brukaren online no? */
  isOnline: boolean
  /** Sidan hva tid var brukaren sist aktiv? */
  lastSeenAt: Date | null
  /** Kva gjer brukaren no? */
  activity: ActivityType
  /** Kor i reisa er brukaren? */
  journeyPosition: JourneyPosition | null
}

export type ActivityType = 
  | 'idle'           // Ikkje aktiv
  | 'reading'        // Lesar meldingar
  | 'writing'        // Skriv melding
  | 'reflecting'     // Gjer refleksjon
  | 'viewing-match'  // Ser på match
  | 'in-journey'     // Aktiv i reise
  | 'paused'         // Pauert reise

export interface JourneyPosition {
  /** Dag i reisa (1-30) */
  day: number
  /** Fase i reisa */
  phase: 'EARLY' | 'BUILDING_TRUST' | 'DEEPER' | 'CHECKIN'
  /** Progresjon (0-100%) */
  progress: number
  /** Dagen som kjem */
  nextDay: {
    title: string
    prompt: string
  }
}

export interface PartnerPresence {
  /** Part A sin tilstand */
  userA: PresenceState
  /** Part B sin tilstand */
  userB: PresenceState
  /** Samanfall i reise-posisjon */
  sharedPosition: SharedPosition
  /** Resonans mellom partane */
  resonance: ResonanceData
}

export interface SharedPosition {
  /** Er dei på same dag i reisa? */
  sameDay: boolean
  /** Er dei i same fase? */
  samePhase: boolean
  /** Progresjons-farge (grøn/gull/blå) */
  alignmentColor: 'green' | 'gold' | 'blue'
  /** Korts melding om de samanfall */
  message: string
}

export interface ResonanceData {
  /** Dagleg resonansscore (0-100) */
  dailyScore: number
  /** Gjennomsnitt over reisa */
  averageScore: number
  /** Retning (stigande/stigande/stabil) */
  trend: 'rising' | 'stable' | 'falling'
  /** Resonans-nivå */
  level: 'gentle' | 'moderate' | 'strong' | 'deep'
}

// ─── PRESENCE ENGINE ─────────────────────────────────────────

/**
 * Hent presence-state for ein brukar
 */
export async function getUserPresence(userId: string): Promise<PresenceState> {
  // I produksjon: Hent frå Redis/Pusher presence
  // For no: Simulert data basert på siste aktivitet
  
  return {
    isOnline: Math.random() > 0.5, // Simulert
    lastSeenAt: new Date(Date.now() - Math.random() * 3600000),
    activity: Math.random() > 0.5 ? 'reading' : 'idle',
    journeyPosition: null, // Hents separat
  }
}

/**
 * Hent journey-position for ein brukar
 */
export async function getJourneyPosition(userId: string): Promise<JourneyPosition | null> {
  // Simulert data — erstatt med ekte DB-spørring
  return {
    day: Math.floor(Math.random() * 30) + 1,
    phase: ['EARLY', 'BUILDING_TRUST', 'DEEPER', 'CHECKIN'][Math.floor(Math.random() * 4)] as JourneyPosition['phase'],
    progress: Math.floor(Math.random() * 100),
    nextDay: {
      title: 'Dag ' + (Math.floor(Math.random() * 30) + 2) + ' kjem snart',
      prompt: 'Kva har du lært om deg sjølv denne veka?',
    },
  }
}

/**
 * Beregn shared position mellom to brukarar
 */
export function calculateSharedPosition(
  posA: JourneyPosition | null,
  posB: JourneyPosition | null
): SharedPosition {
  if (!posA || !posB) {
    return {
      sameDay: false,
      samePhase: false,
      alignmentColor: 'blue',
      message: 'Vent på at begge er i reisa...',
    }
  }

  const sameDay = posA.day === posB.day
  const samePhase = posA.phase === posB.phase

  let color: SharedPosition['alignmentColor']
  let message: string

  if (sameDay && samePhase) {
    color = 'green'
    message = 'De er på same stad i reisa — eit vakkert samfall 🌿'
  } else if (samePhase) {
    color = 'gold'
    message = 'De er i same fase, men litt ulike dagar'
  } else {
    color = 'blue'
    message = 'De utforsker ulike delar av reisa — hvar med sin tempo 🌊'
  }

  return { sameDay, samePhase, alignmentColor: color, message }
}

/**
 * Beregn resonans-data mellom to brukarar
 */
export function calculateResonance(
  userAId: string,
  userBId: string
): ResonanceData {
  // I produksjon: Hent frå ResonanceSession i DB
  const dailyScore = Math.floor(Math.random() * 40) + 60 // 60-100
  const averageScore = Math.floor(Math.random() * 30) + 65 // 65-95
  
  let trend: ResonanceData['trend']
  if (dailyScore > averageScore) trend = 'rising'
  else if (dailyScore < averageScore - 10) trend = 'falling'
  else trend = 'stable'

  let level: ResonanceData['level']
  if (averageScore >= 85) level = 'deep'
  else if (averageScore >= 70) level = 'strong'
  else if (averageScore >= 55) level = 'moderate'
  else level = 'gentle'

  return { dailyScore, averageScore, trend, level }
}

// ─── GENTLE NUDGE ────────────────────────────────────────────

/**
 * Sjekk om brukar bur få ein gentle nudge
 */
export function shouldSendNudge(
  lastActivityAt: Date | null,
  journeyDay: number
): { shouldNudge: boolean; message: string } {
  if (!lastActivityAt) return { shouldNudge: false, message: '' }

  const hoursSinceActivity = (Date.now() - lastActivityAt.getTime()) / (1000 * 60 * 60)
  
  // Send nudge etter 48 timer utan aktivitet i reise
  if (hoursSinceActivity > 48 && journeyDay < 30) {
    return {
      shouldNudge: true,
      message: 'Din partner savnar deg i reisa. Korleis har det gått dei siste dagane?',
    }
  }

  return { shouldNudge: false, message: '' }
}

// ─── HEARTBEAT ───────────────────────────────────────────────

/**
 * Oppdater presence-heartbeat (kalles frå frontend)
 */
export async function updatePresenceHeartbeat(
  userId: string,
  activity: ActivityType
): Promise<void> {
  // I produksjon: Push til Redis/Pusher
  // For no: Ingenting
}

// ─── FRONTEND HJELPEFUNKSJONAR ───────────────────────────────

/**
 * Hent heile partner presence-data
 */
export async function getPartnerPresenceData(
  userAId: string,
  userBId: string
): Promise<PartnerPresence> {
  const [posA, posB] = await Promise.all([
    getJourneyPosition(userAId),
    getJourneyPosition(userBId),
  ])

  const presenceA = await getUserPresence(userAId)
  const presenceB = await getUserPresence(userBId)

  // Legg til journey position på presence
  presenceA.journeyPosition = posA
  presenceB.journeyPosition = posB

  return {
    userA: presenceA,
    userB: presenceB,
    sharedPosition: calculateSharedPosition(posA, posB),
    resonance: calculateResonance(userAId, userBId),
  }
}