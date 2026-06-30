/**
 * ToSom — Premium Chat Animations
 * 
 * Chat føles levande og varm med:
 *   - Message bubble-animasjonar
 *   - Typing pulse
 *   - Resonance-glow på meldingar
 *   - Progressiv tekst-avdekking
 *   - Mood-basert chat-miljø
 * 
 * Dokumentasjon: docs/FEATURE-PREMIUM-CHAT.md
 */

import 'server-only'

// ─── TYPE DEFINISJONAR ─────────────────────────────────────

export type BubbleAnimationType =
  | 'pop-in'          // Pop inn (standard)
  | 'slide-fade'      // Glid + fade
  | 'warm-glow'       // Varm glow
  | 'soft-land'       // Milt land
  | 'breathe-in'      // Puste inn

export interface BubbleAnimation {
  type: BubbleAnimationType
  duration: number  // ms
  delay: number     // ms
  stagger: number   // ms mellom element
  easing: string
}

export interface ChatMessageAnimation {
  /** Animasjon for denne meldinga */
  bubble: BubbleAnimation
  /** Skal meldinga ha resonance-glow? */
  hasResonanceGlow: boolean
  /** Resonans-nivå for glow */
  resonanceLevel: number // 0-100
  /** Progressiv avdekking aktiv? */
  progressiveReveal: boolean
  /** Avdekkingsfart (ms per teikn) */
  revealSpeed: number
}

export interface TypingIndicatorConfig {
  /** Aktiv? */
  enabled: boolean
  /** Puls-varighet (ms) */
  pulseDuration: number
  /** Partiklar i pulsen */
  particleCount: number
  /** Farge */
  color: string
}

export interface ChatEnvironment {
  /** Bakgrunns-gradient */
  background: string
  /** Melding-overflater */
  messageSurface: string
  /** Kant */
  border: string
  /** Gjennomskinlegheit */
  opacity: number
  /** Mood */
  mood: MoodType
  /** Animasjonar */
  animations: ChatAnimationsConfig
}

export type MoodType =
  | 'calm'           // Rolig (standard)
  | 'warm'           // Varm (intim samtale)
  | 'deep'           // Dyp (refleksjon)
  | 'gentle'         // Mild (opptakt)
  | 'joyful'         // Glede (milestone)

// ─── BUBBLE-ANIMASJONAR ─────────────────────────────────────

export const BUBBLE_ANIMATIONS: Record<BubbleAnimationType, BubbleAnimation> = {
  'pop-in': {
    type: 'pop-in',
    duration: 400,
    delay: 0,
    stagger: 50,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  'slide-fade': {
    type: 'slide-fade',
    duration: 500,
    delay: 100,
    stagger: 80,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  'warm-glow': {
    type: 'warm-glow',
    duration: 600,
    delay: 200,
    stagger: 100,
    easing: 'ease-in-out',
  },
  'soft-land': {
    type: 'soft-land',
    duration: 450,
    delay: 50,
    stagger: 60,
    easing: 'cubic-bezier(0.6, 0, 0.4, 1)',
  },
  'breathe-in': {
    type: 'breathe-in',
    duration: 800,
    delay: 300,
    stagger: 120,
    easing: 'ease-in-out',
  },
}

// ─── MOOD-FARGAR FOR CHAT ──────────────────────────────────

export const CHAT_MOOD_COLORS: Record<MoodType, { bg: string; glow: string }> = {
  calm: { bg: 'rgba(255, 255, 255, 0.03)', glow: 'rgba(212, 175, 55, 0.15)' },
  warm: { bg: 'rgba(232, 199, 102, 0.05)', glow: 'rgba(232, 199, 102, 0.25)' },
  deep: { bg: 'rgba(168, 216, 234, 0.04)', glow: 'rgba(168, 216, 234, 0.20)' },
  gentle: { bg: 'rgba(136, 216, 176, 0.04)', glow: 'rgba(136, 216, 176, 0.20)' },
  joyful: { bg: 'rgba(255, 215, 0, 0.05)', glow: 'rgba(255, 215, 0, 0.30)' },
}

// ─── CHAT ANIMASJONAR-KONFIG ────────────────────────────────

export interface ChatAnimationsConfig {
  /** Default bubble-animasjon */
  defaultBubble: BubbleAnimationType
  /** Resonance-glow aktiv? */
  resonanceGlow: boolean
  /** Typing-indikator */
  typingIndicator: TypingIndicatorConfig
  /** Progressiv avdekking */
  progressiveReveal: boolean
  /** Mood-basert miljø */
  moodBasedEnvironment: boolean
}

export const DEFAULT_CHAT_ANIMATIONS: ChatAnimationsConfig = {
  defaultBubble: 'warm-glow',
  resonanceGlow: true,
  typingIndicator: {
    enabled: true,
    pulseDuration: 1200,
    particleCount: 3,
    color: '#D4AF37',
  },
  progressiveReveal: true,
  revealSpeed: 15,  // ms per teikn
  moodBasedEnvironment: true,
}

// ─── MOOD-DETERMINASJON ────────────────────────────────────

export function determineChatMood(conversationContext: {
  depth: string
  messageCount: number
  lastMessageTime: Date
  journeyPhase: string
}): MoodType {
  const hoursSinceLastMessage = (Date.now() - conversationContext.lastMessageTime.getTime()) / (1000 * 60 * 60)

  // Glede: mange meldingar raskt etter kvarandre
  if (conversationContext.messageCount > 20 && hoursSinceLastMessage < 1) {
    return 'joyful'
  }

  // Dyp: djup samtal
  if (conversationContext.depth === 'deep' || journeyPhase === 'DEEPER') {
    return 'deep'
  }

  // Varm: intim samtale (senkveld)
  const hour = new Date().getHours()
  if (hour >= 20 || hour <= 2) {
    return 'warm'
  }

  // Mild: tidleg i reisa
  if (journeyPhase === 'EARLY' || conversationContext.messageCount < 10) {
    return 'gentle'
  }

  // Standard
  return 'calm'
}

// ─── CHAT MILJØ ─────────────────────────────────────────────

export function getChatEnvironment(
  mood: MoodType = 'calm',
  animations: ChatAnimationsConfig = DEFAULT_CHAT_ANIMATIONS
): ChatEnvironment {
  const moodColors = CHAT_MOOD_COLORS[mood]

  return {
    background: `radial-gradient(ellipse at 50% 50%, ${moodColors.glow} 0%, transparent 70%), #0B1520`,
    messageSurface: moodColors.bg,
    border: 'rgba(255, 255, 255, 0.08)',
    opacity: 0.95,
    mood,
    animations,
  }
}

// ─── RESONANCE GLOW ─────────────────────────────────────────

export function getResonanceGlowStyle(resonanceLevel: number): {
  boxShadow: string
  borderColor: string
  glowOpacity: number
} {
  const intensity = Math.min(resonanceLevel / 100, 1)

  return {
    boxShadow: `0 0 ${20 * intensity}px ${10 * intensity}px rgba(212, 175, 55, ${0.15 * intensity})`,
    borderColor: `rgba(212, 175, 55, ${0.25 + 0.25 * intensity})`,
    glowOpacity: intensity,
  }
}

// ─── PROGRESSIVE REVEAL ─────────────────────────────────────

export function getProgressiveRevealText(
  fullText: string,
  revealProgress: number // 0-1
): string {
  const charsToShow = Math.floor(fullText.length * revealProgress)
  return fullText.slice(0, charsToShow)
}

// ─── TYPING INDICATOR ────────────────────────────────────────

export interface TypingParticle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  phase: number // 0-2π
}

export function generateTypingParticles(count: number = 3): TypingParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 20 + i * 30,
    y: 0,
    size: 4 + Math.random() * 4,
    opacity: 0.4 + Math.random() * 0.4,
    phase: (i / count) * Math.PI * 2,
  }))
}

// ─── ANIMASJON-HJELPE ─────────────────────────────────────

export function getBubbleCSS(animation: BubbleAnimation): string {
  const { type, duration, delay, stagger, easing } = animation

  const animations: Record<BubbleAnimationType, string> = {
    'pop-in': `popIn ${duration}ms ${easing} ${delay}ms both`,
    'slide-fade': `slideFade ${duration}ms ${easing} ${delay}ms both`,
    'warm-glow': `warmGlow ${duration}ms ${easing} ${delay}ms both`,
    'soft-land': `softLand ${duration}ms ${easing} ${delay}ms both`,
    'breathe-in': `breatheIn ${duration}ms ${easing} ${delay}ms both`,
  }

  return animations[type]
}

// ─── HEIL FUNKSJON ───────────────────────────────────────

export function getPremiumChatConfig(
  mood: MoodType = 'calm',
  resonanceLevel: number = 50
): {
  environment: ChatEnvironment
  resonanceGlow: ReturnType<typeof getResonanceGlowStyle>
  typingIndicator: TypingParticle[]
  animations: ChatAnimationsConfig
} {
  const environment = getChatEnvironment(mood)
  const resonanceGlow = getResonanceGlowStyle(resonanceLevel)
  const typingIndicator = generateTypingParticles()
  const animations = DEFAULT_CHAT_ANIMATIONS

  return {
    environment,
    resonanceGlow,
    typingIndicator,
    animations,
  }
}