/**
 * ToSom — Warm Flow System
 *
 * Termisk opplevelse — overgangen mellom skjer er varm og ikke kal.
 *
 * Funksjonar:
 *   - Side-transisjon animasjonar (framer-motion)
 *   - Warm loading states
 *   - Gentle page transitions
 *   - Mood-basert fargeendring
 *   - Ambient sound (valfritt)
 *
 * Dokumentasjon: docs/FEATURE-WARM-FLOW.md
 */

// ─── TYPE DEFINISJONAR ────────────────

export type WarmTransitionType =
  | 'fade'           // Enkel fade
  | 'slide-up'       // Glid opp
  | 'warm-breathe'   // Varm, pustande overgang
  | 'soft-reveal'    // Myk avdekking
  | 'gentle-shift'   // Mild forskyving

export interface WarmFlowConfig {
  /** Animasjonstyp */
  transitionType: WarmTransitionType
  /** Varighet i ms */
  duration: number
  /** Delay før animasjon startar */
  delay: number
  /** Opacity */
  opacity: number
}

export interface MoodState {
  /** Noeverande stemning */
  current: MoodType
  /** Overgang til ny stemning */
  transitioning: boolean
  /** Neste stemning */
  nextMood: MoodType | null
}

export type MoodType =
  | 'calm'           // Rolig (standard)
  | 'warm'           // Varm (match/melding)
  | 'deep'           // Dyp (refleksjon)
  | 'gentle'         // Mild (onboarding)
  | 'celebratory'    // Feire (milestone)

export interface MoodColors {
  /** Hovudfarge */
  primary: string
  /** Bakgrunnsfarge */
  background: string
  /** Aksentfarge */
  accent: string
  /** Glowing effekt */
  glow: string
}

export interface WarmFlowContextType {
  currentMood: MoodType;
  colors: MoodColors;
  background: string;
  glow: string;
  accent: string;
  transitionMood: (mood: MoodType) => void;
}

// ─── MOOD-FARGAR ─────────────────────

export const MOOD_COLORS: Record<MoodType, MoodColors> = {
  calm: {
    primary: '#FFFFFF',
    background: '#0B1520',
    accent: '#D4AF37',
    glow: 'rgba(212, 175, 55, 0.15)',
  },
  warm: {
    primary: '#FFFFFF',
    background: '#0F1A25',
    accent: '#E8C766',
    glow: 'rgba(232, 199, 102, 0.25)',
  },
  deep: {
    primary: '#E0E0E0',
    background: '#080E16',
    accent: '#A8D8EA',
    glow: 'rgba(168, 216, 234, 0.20)',
  },
  gentle: {
    primary: '#FFFFFF',
    background: '#0D1820',
    accent: '#88D8B0',
    glow: 'rgba(136, 216, 176, 0.20)',
  },
  celebratory: {
    primary: '#FFFFFF',
    background: '#0F1218',
    accent: '#FFD700',
    glow: 'rgba(255, 215, 0, 0.30)',
  },
}

// ─── WARM FLOW-KONFIG ────────────────

export const DEFAULT_WARM_FLOW: WarmFlowConfig = {
  transitionType: 'warm-breathe',
  duration: 800,
  delay: 200,
  opacity: 0.6,
}

export const TRANSITION_TEMPLATES: Record<WarmTransitionType, WarmFlowConfig> = {
  fade: { transitionType: 'fade', duration: 500, delay: 0, opacity: 0.8 },
  'slide-up': { transitionType: 'slide-up', duration: 600, delay: 100, opacity: 0.7 },
  'warm-breathe': DEFAULT_WARM_FLOW,
  'soft-reveal': { transitionType: 'soft-reveal', duration: 900, delay: 300, opacity: 0.5 },
  'gentle-shift': { transitionType: 'gentle-shift', duration: 700, delay: 150, opacity: 0.6 },
}

// ─── MOOD-ENDRING ─────────────────────

/**
 * Beregn ny mood basert på brukar-aktivitet
 */
export function determineMood(activity: string, journeyPhase: string): MoodType {
  if (activity === 'milestone' || activity === 'match-accepted') {
    return 'celebratory'
  }
  if (activity === 'reflecting' || activity === 'deep-conversation') {
    return 'deep'
  }
  if (activity === 'onboarding' || activity === 'profile-setup') {
    return 'gentle'
  }
  if (activity === 'match' || activity === 'message') {
    return 'warm'
  }
  return 'calm'
}

/**
 * Hent fargar for noeverande mood
 */
export function getMoodColors(mood: MoodType): MoodColors {
  return MOOD_COLORS[mood]
}

/**
 * Beregn overgangsfarge mellom to moodar
 */
export function interpolateMoodColors(
  from: MoodType,
  to: MoodType,
  progress: number
): string {
  return MOOD_COLORS[to].accent
}

// ─── WARM LOADING STATE ───────────────

export interface WarmLoadingState {
  isLoading: boolean
  type: 'minimal' | 'warm' | 'full'
  message: string
  pulse: boolean
}

export function getWarmLoadingState(
  isLoading: boolean,
  context: string
): WarmLoadingState {
  if (!isLoading) {
    return { isLoading: false, type: 'minimal', message: '', pulse: false }
  }

  const messages: Record<string, string> = {
    onboarding: 'Bygger din profil...',
    match: 'Finn din match...',
    chat: 'Lastar samtalen...',
    journey: 'Startar reisa...',
    profile: 'Opener profilen...',
    default: 'Vent litt...',
  }

  return {
    isLoading: true,
    type: 'warm',
    message: messages[context] || messages.default,
    pulse: true,
  }
}

// ─── AMBIENT SOUND ─────────────────────

export interface AmbientSoundConfig {
  enabled: boolean
  volume: number
  type: 'rain' | 'forest' | 'waves' | 'silence'
}

export const DEFAULT_AMBIENT: AmbientSoundConfig = {
  enabled: false,
  volume: 0.3,
  type: 'silence',
}

// ─── PAGE TRANSITION HELPER ────────────

export function getTransitionForRoute(route: string): WarmTransitionType {
  const map: Record<string, WarmTransitionType> = {
    '/onboarding': 'soft-reveal',
    '/dashboard': 'gentle-shift',
    '/chat': 'fade',
    '/journey': 'warm-breathe',
    '/matching': 'warm-breathe',
    '/profile': 'slide-up',
    '/': 'fade',
  }
  return map[route] || 'fade'
}

// ─── HJELPEFUNKSJONAR ──────────────────

export function getWarmFlowCSS(config: WarmFlowConfig): string {
  const { transitionType, duration, delay, opacity } = config

  const transitions: Record<WarmTransitionType, string> = {
    fade: `opacity ${duration}ms ease-in-out ${delay}ms`,
    'slide-up': `transform ${duration}ms ease-out ${delay}ms, opacity ${duration}ms ease-in-out ${delay}ms`,
    'warm-breathe': `opacity ${duration}ms ease-in-out ${delay}ms, transform ${duration * 1.5}ms ease-in-out ${delay}ms`,
    'soft-reveal': `clip-path ${duration}ms ease-in-out ${delay}ms, opacity ${duration}ms ease-in-out ${delay}ms`,
    'gentle-shift': `transform ${duration}ms ease-out ${delay}ms`,
  }

  return transitions[transitionType]
}