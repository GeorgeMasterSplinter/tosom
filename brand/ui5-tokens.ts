/**
 * ToSom UI 5.0 — Design Tokens
 * 
 * Nordisk sort og gull premium — komplett tokensystem
 */

// ════ Colors ════
export const colors = {
  // Background
  bgPrimary: '#0B0E11',
  bgSecondary: '#11151A',
  bgSurface: '#1A1F26',
  bgSurfaceElevated: '#222830',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.65)',
  textMuted: 'rgba(255, 255, 255, 0.45)',
  textSubtle: 'rgba(255, 255, 255, 0.30)',

  // Gold
  gold: '#D4AF37',
  goldLight: '#E8C766',
  goldDark: '#B8942E',
  goldSoft: 'rgba(212, 175, 55, 0.10)',
  goldGlow: 'rgba(212, 175, 55, 0.25)',
  goldGlowStrong: 'rgba(212, 175, 55, 0.40)',

  // Glass
  glassBg: 'rgba(255, 255, 255, 0.04)',
  glassBgHover: 'rgba(255, 255, 255, 0.07)',
  glassBgStrong: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassBorderHover: 'rgba(255, 255, 255, 0.14)',
  glassBorderGold: 'rgba(212, 175, 55, 0.25)',

  // Border
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.04)',
  borderSubtle: 'rgba(255, 255, 255, 0.03)',

  // Status
  success: '#4DFF88',
  error: '#FF4D4D',
  warning: '#FBBF24',
  info: '#5B9FC4',

  // Shadows
  shadowSm: '0 2px 8px rgba(0, 0, 0, 0.3)',
  shadowMd: '0 4px 20px rgba(0, 0, 0, 0.4)',
  shadowLg: '0 8px 32px rgba(0, 0, 0, 0.45)',
  shadowXl: '0 16px 48px rgba(0, 0, 0, 0.5)',
  shadowGold: '0 0 24px rgba(212, 175, 55, 0.12)',
  shadowGoldHover: '0 0 32px rgba(212, 175, 55, 0.25)',
  shadowGoldSoft: '0 0 16px rgba(212, 175, 55, 0.08)',
} as const;

// ════ Typography ════
export const typography = {
  font: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  displayXL: '64px',
  displayL: '56px',
  displayM: '48px',
  heading2XL: '48px',
  headingXL: '32px',
  headingL: '28px',
  headingM: '24px',
  headingS: '20px',
  body: '16px',
  small: '14px',
  xs: '12px',
  letterSpacing: '-0.01em',
  letterSpacingTight: '-0.02em',
  lineHeightTight: '1.1',
  lineHeightNormal: '1.65',
} as const;

// ════ Spacing ════
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '80px',
  '5xl': '96px',
  '6xl': '120px',
  '7xl': '160px',
} as const;

// ════ Radius ════
export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
} as const;

// ════ Motion ════
export const motion = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
  spring: '300ms',
  page: '400ms',
  easeSmooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  easeFadeIn: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// ════ Container ════
export const container = {
  max: '1600px',
  narrow: '720px',
  wide: '1200px',
} as const;

// ════ Layout ════
export const layout = {
  navbarHeight: '64px',
  navbarHeightSticky: '56px',
  sectionPaddingY: '120px',
  sectionPaddingX: '32px',
} as const;