/**
 * ToSom — Atmosphere Layer
 * 
 * Miljø-lag som forsterkar kjensla av reisa.
 * 
 * Funksjonar:
 *   - Ambient bakgrunnsanimasjonar
 *   - Mood-basert fargepalett
 *   - Progressiv disclosing
 *   - Gentle haptic feedback (valfritt)
 *   - Seasonal theming (sesong-basert teming)
 * 
 * Dokumentasjon: docs/FEATURE-ATMOSPHERE.md
 */

// ─── TYPE DEFINISJONAR ────────────────────────────────────

export type AtmospherePreset = 
  | 'midnight-gold'     // Midnight + gull (standard)
  | 'dawn-blue'         // Morgon-blå
  | 'twilight-purple'   // Skumring-lilla
  | 'forest-green'      // Skog-grøn
  | 'deep-ocean'        // Dyp-hav
  | 'golden-hour'       // Gyllen time
  | 'winter-frost'      // Vinter-frost
  | 'spring-bloom'      // Vår-blom
  | 'summer-warm'       // Sommer-varm
  | 'autumn-fire'       // Høst-eld

export interface AtmosphereConfig {
  /** Namn på preset */
  preset: AtmospherePreset
  /** Animasjon aktiv? */
  animationEnabled: boolean
  /** Intensitet (0-1) */
  intensity: number
  /** Sesong */
  season: Season
  /** Progressiv disclosing aktiv? */
  progressiveDisclosure: boolean
}

export type Season = 'winter' | 'spring' | 'summer' | 'autumn'

export interface ColorPalette {
  /** Bakgrunn */
  background: string
  /** Andre bakgrunn */
  secondaryBg: string
  /** Kort-overflate */
  surface: string
  /** Kant */
  border: string
  /** Hovudtekst */
  primaryText: string
  /** Sekundær tekst */
  secondaryText: string
  /** Gull-aksent */
  gold: string
  /** Gull-hover */
  goldHover: string
  /** Glowing */
  glow: string
}

export interface AmbientParticle {
  /** Posisjon (x, y) */
  x: number
  y: number
  /** Storleik */
  size: number
  /** Opacity */
  opacity: number
  /** Fart */
  speed: number
  /** Retning */
  angle: number
}

// ─── ATMOSFERE-PRESETAR ──────────────────────────────────────

export const ATMOSPHERE_PRESETS: Record<AtmospherePreset, AtmosphereConfig> = {
  'midnight-gold': {
    preset: 'midnight-gold',
    animationEnabled: true,
    intensity: 0.6,
    season: 'winter',
    progressiveDisclosure: true,
  },
  'dawn-blue': {
    preset: 'dawn-blue',
    animationEnabled: true,
    intensity: 0.4,
    season: 'spring',
    progressiveDisclosure: true,
  },
  'twilight-purple': {
    preset: 'twilight-purple',
    animationEnabled: true,
    intensity: 0.5,
    season: 'autumn',
    progressiveDisclosure: true,
  },
  'forest-green': {
    preset: 'forest-green',
    animationEnabled: true,
    intensity: 0.3,
    season: 'summer',
    progressiveDisclosure: true,
  },
  'deep-ocean': {
    preset: 'deep-ocean',
    animationEnabled: true,
    intensity: 0.7,
    season: 'winter',
    progressiveDisclosure: true,
  },
  'golden-hour': {
    preset: 'golden-hour',
    animationEnabled: true,
    intensity: 0.8,
    season: 'autumn',
    progressiveDisclosure: true,
  },
  'winter-frost': {
    preset: 'winter-frost',
    animationEnabled: true,
    intensity: 0.4,
    season: 'winter',
    progressiveDisclosure: true,
  },
  'spring-bloom': {
    preset: 'spring-bloom',
    animationEnabled: true,
    intensity: 0.5,
    season: 'spring',
    progressiveDisclosure: true,
  },
  'summer-warm': {
    preset: 'summer-warm',
    animationEnabled: true,
    intensity: 0.6,
    season: 'summer',
    progressiveDisclosure: true,
  },
  'autumn-fire': {
    preset: 'autumn-fire',
    animationEnabled: true,
    intensity: 0.7,
    season: 'autumn',
    progressiveDisclosure: true,
  },
}

// ─── FARGEPALLAR ────────────────────────────────────────────

export const ATMOSPHERE_COLORS: Record<AtmospherePreset, ColorPalette> = {
  'midnight-gold': {
    background: '#0B1520',
    secondaryBg: '#0F1A25',
    surface: 'rgba(255, 255, 255, 0.04)',
    border: 'rgba(255, 255, 255, 0.08)',
    primaryText: '#FFFFFF',
    secondaryText: 'rgba(255, 255, 255, 0.65)',
    gold: '#D4AF37',
    goldHover: '#E8C766',
    glow: 'rgba(212, 175, 55, 0.20)',
  },
  'dawn-blue': {
    background: '#0A1628',
    secondaryBg: '#0E1E35',
    surface: 'rgba(168, 216, 234, 0.04)',
    border: 'rgba(168, 216, 234, 0.08)',
    primaryText: '#E0F0FF',
    secondaryText: 'rgba(168, 216, 234, 0.60)',
    gold: '#A8D8EA',
    goldHover: '#C8E8F4',
    glow: 'rgba(168, 216, 234, 0.15)',
  },
  'twilight-purple': {
    background: '#120E1F',
    secondaryBg: '#1A1530',
    surface: 'rgba(200, 160, 255, 0.04)',
    border: 'rgba(200, 160, 255, 0.08)',
    primaryText: '#F0E8FF',
    secondaryText: 'rgba(200, 160, 255, 0.60)',
    gold: '#C8A0FF',
    goldHover: '#D8B8FF',
    glow: 'rgba(200, 160, 255, 0.15)',
  },
  'forest-green': {
    background: '#0A1A14',
    secondaryBg: '#0F2518',
    surface: 'rgba(136, 216, 176, 0.04)',
    border: 'rgba(136, 216, 176, 0.08)',
    primaryText: '#E0FFF0',
    secondaryText: 'rgba(136, 216, 176, 0.60)',
    gold: '#88D8B0',
    goldHover: '#A8E8C8',
    glow: 'rgba(136, 216, 176, 0.15)',
  },
  'deep-ocean': {
    background: '#060E1A',
    secondaryBg: '#0A1628',
    surface: 'rgba(100, 180, 255, 0.04)',
    border: 'rgba(100, 180, 255, 0.08)',
    primaryText: '#D0E8FF',
    secondaryText: 'rgba(100, 180, 255, 0.55)',
    gold: '#64B4FF',
    goldHover: '#84C8FF',
    glow: 'rgba(100, 180, 255, 0.20)',
  },
  'golden-hour': {
    background: '#1A1510',
    secondaryBg: '#252018',
    surface: 'rgba(255, 215, 0, 0.04)',
    border: 'rgba(255, 215, 0, 0.08)',
    primaryText: '#FFF8E0',
    secondaryText: 'rgba(255, 215, 0, 0.60)',
    gold: '#FFD700',
    goldHover: '#FFE440',
    glow: 'rgba(255, 215, 0, 0.25)',
  },
  'winter-frost': {
    background: '#0C1018',
    secondaryBg: '#121820',
    surface: 'rgba(200, 220, 255, 0.03)',
    border: 'rgba(200, 220, 255, 0.06)',
    primaryText: '#E8F0FF',
    secondaryText: 'rgba(200, 220, 255, 0.55)',
    gold: '#C8DCFF',
    goldHover: '#D8E8FF',
    glow: 'rgba(200, 220, 255, 0.12)',
  },
  'spring-bloom': {
    background: '#0E1A12',
    secondaryBg: '#142518',
    surface: 'rgba(180, 255, 180, 0.03)',
    border: 'rgba(180, 255, 180, 0.06)',
    primaryText: '#E8FFEA',
    secondaryText: 'rgba(180, 255, 180, 0.55)',
    gold: '#B4FFB4',
    goldHover: '#C8FFC8',
    glow: 'rgba(180, 255, 180, 0.12)',
  },
  'summer-warm': {
    background: '#1A140E',
    secondaryBg: '#252014',
    surface: 'rgba(255, 200, 120, 0.04)',
    border: 'rgba(255, 200, 120, 0.08)',
    primaryText: '#FFF0D8',
    secondaryText: 'rgba(255, 200, 120, 0.60)',
    gold: '#FFC878',
    goldHover: '#FFD898',
    glow: 'rgba(255, 200, 120, 0.20)',
  },
  'autumn-fire': {
    background: '#1A100A',
    secondaryBg: '#251810',
    surface: 'rgba(255, 140, 50, 0.04)',
    border: 'rgba(255, 140, 50, 0.08)',
    primaryText: '#FFF0E0',
    secondaryText: 'rgba(255, 140, 50, 0.60)',
    gold: '#FF8C32',
    goldHover: '#FFA858',
    glow: 'rgba(255, 140, 50, 0.20)',
  },
}

// ─── SESONG-BASERT OVERRIDING ─────────────────────────────

export function getSeasonalOverrides(preset: AtmospherePreset): Partial<ColorPalette> {
  const seasonal: Record<Season, Partial<ColorPalette>> = {
    winter: { glow: 'rgba(200, 220, 255, 0.15)' },
    spring: { glow: 'rgba(180, 255, 180, 0.15)' },
    summer: { glow: 'rgba(255, 200, 120, 0.25)' },
    autumn: { glow: 'rgba(255, 140, 50, 0.20)' },
  }

  const now = new Date()
  const month = now.getMonth()
  let season: Season
  if (month >= 2 && month <= 4) season = 'spring'
  else if (month >= 5 && month <= 7) season = 'summer'
  else if (month >= 8 && month <= 10) season = 'autumn'
  else season = 'winter'

  return seasonal[season]
}

// ─── AMBIENT PARTICLES ────────────────────────────────────

/**
 * Generer ambient partiklar for bakgrunn
 */
export function generateAmbientParticles(count: number = 30): AmbientParticle[] {
  const particles: AmbientParticle[] = []

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.3 + 0.05,
      speed: Math.random() * 0.5 + 0.1,
      angle: Math.random() * Math.PI * 2,
    })
  }

  return particles
}

// ─── PROGRESSIV DISCLOSING ─────────────────────────────────

export interface DisclosureState {
  /** Kva delar er synlege no? */
  revealedSections: Set<string>
  /** Kva delar er skjulte? */
  hiddenSections: Set<string>
  /** Progresjon (0-100%) */
  progress: number
  /** NESTE del å avsløre */
  nextReveal: string | null
}

/**
 * Beregn progressiv disclosing basert på reise-fase
 */
export function calculateDisclosure(journeyPhase: string, day: number): DisclosureState {
  const totalSections = 10
  const revealedCount = Math.floor((day / 30) * totalSections)
  const progress = (revealedCount / totalSections) * 100

  const allSections = [
    'intro', 'values', 'lifestyle', 'personality',
    'relationship', 'communication', 'intimacy',
    'future', 'boundaries', 'summary'
  ]

  return {
    revealedSections: new Set(allSections.slice(0, revealedCount)),
    hiddenSections: new Set(allSections.slice(revealedCount)),
    progress: Math.min(progress, 100),
    nextReveal: allSections[revealedCount] || null,
  }
}

// ─── HAPTIC FEEDBACK ───────────────────────────────────────

export interface HapticConfig {
  /** Aktivert? */
  enabled: boolean
  /** Intensitet (0-2) */
  intensity: number
}

export const DEFAULT_HAPTIC: HapticConfig = {
  enabled: false,
  intensity: 0.5,
}

// ─── HOVEDFUNKSJONAR ──────────────────────────────────────

/**
 * Hent heile atmospheresystemet for ein brukar
 */
export function getAtmosphereSystem(
  preset: AtmospherePreset = 'midnight-gold',
  journeyPhase: string = 'EARLY',
  day: number = 1
): {
  config: AtmosphereConfig
  colors: ColorPalette
  particles: AmbientParticle[]
  disclosure: DisclosureState
  seasonalOverride: Partial<ColorPalette>
} {
  const config = ATMOSPHERE_PRESETS[preset]
  const colors = ATMOSPHERE_COLORS[preset]
  const particles = generateAmbientParticles(30)
  const disclosure = calculateDisclosure(journeyPhase, day)
  const seasonal = getSeasonalOverrides(preset)

  return {
    config,
    colors: { ...colors, ...seasonal },
    particles,
    disclosure,
    seasonalOverride: seasonal,
  }
}