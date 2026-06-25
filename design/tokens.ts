/**
 * ToSom Design Tokens
 * 
 * Foundations for the ToSom Design System.
 * All values derived from the established landing page system.
 */

/* ═══════════════════════════════════════════
   SPACING SCALE (4–72px)
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   RADIUS SCALE (8–32px)
   ═══════════════════════════════════════════ */
export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
} as const;

/* ═══════════════════════════════════════════
   BLUR SCALE (spotlights + vignette)
   ═══════════════════════════════════════════ */
export const blur = {
  sm: '4px',
  md: '12px',
  lg: '24px',
  xl: '60px',
  '2xl': '80px',
  '3xl': '100px',
  '4xl': '120px',
} as const;

/* ═══════════════════════════════════════════
   TYPOGRAPHY TOKENS
   ═══════════════════════════════════════════ */
export const typography = {
  heroTitle: {
    fontSize: { base: '48px', md: '88px' },
    fontWeight: '600' as const,
    tracking: '-0.03em',
    lineHeight: '1.12',
  },
  sectionTitle: {
    fontSize: { base: '42px', md: '54px' },
    fontWeight: '600' as const,
    tracking: '-0.02em',
    lineHeight: '1.2',
  },
  ctaHeading: {
    fontSize: { base: '40px', md: '60px' },
    fontWeight: '600' as const,
    tracking: '-0.02em',
    lineHeight: '1.1',
  },
  ctaSubtitle: {
    fontSize: { base: '22px', md: '26px' },
    fontWeight: '400' as const,
    opacity: 0.9,
    lineHeight: '1.65',
  },
  ctaGoldButton: {
    fontSize: { base: '24px', md: '28px' },
    fontWeight: '600' as const,
    tracking: '0.02em',
    lineHeight: '1',
  },
  ctaDarkButton: {
    fontSize: { base: '24px', md: '28px' },
    fontWeight: '600' as const,
    lineHeight: '1',
  },
  body: {
    fontSize: '16px',
    lineHeight: '1.65',
  },
  footerTagline: {
    fontSize: { base: '16px', md: '18px' },
    fontWeight: '400' as const,
    tracking: '0.03em',
    opacity: 0.85,
    lineHeight: '1.7',
  },
  footerBadge: {
    fontSize: { base: '14px', md: '16px' },
    fontWeight: '500' as const,
    tracking: '0.15em',
  },
  navLink: {
    fontSize: '16px',
    fontWeight: '500' as const,
  },
} as const;

/* ═══════════════════════════════════════════
   MOTION TOKENS (durations + easing)
   ═══════════════════════════════════════════ */
export const motion = {
  durations: {
    instant: '80ms',
    faster: '120ms',
    fast: '200ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
    slowest: '700ms',
    fadeInUp: '400ms',
    riseIn: '800ms',
    fadeIn: '300ms',
    microBounce: '250ms',
  },
  easings: {
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    overshoot: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    subtleBounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    fadeIn: 'cubic-bezier(0.4, 0, 0.2, 1)',
    slideIn: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  staggers: {
    fast: '50ms',
    normal: '80ms',
    slow: '120ms',
  },
} as const;

/* ═══════════════════════════════════════════
   COLORS
   ═══════════════════════════════════════════ */
export const colors = {
  bgPrimary: '#0B0E11',
  bgSecondary: '#11151A',
  surface: '#1A1F26',
  surfaceElevated: '#222830',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.65)',
  textMuted: 'rgba(255,255,255,0.45)',
  textSubtle: 'rgba(255,255,255,0.30)',
  gold: '#D4AF37',
  goldLight: '#E8C766',
  goldDark: '#B8942E',
  goldSoft: 'rgba(212,175,55,0.10)',
  goldGlow: 'rgba(212,175,55,0.25)',
  goldGlowStrong: 'rgba(212,175,55,0.40)',
  success: '#4DFF88',
  error: '#FF4D4D',
  warning: '#FBBF24',
  border: 'rgba(255,255,255,0.08)',
  borderSubtle: 'rgba(255,255,255,0.03)',
  glassBg: 'rgba(255,255,255,0.04)',
  glassBgHover: 'rgba(255,255,255,0.07)',
  glassBorder: 'rgba(255,255,255,0.08)',
} as const;

/* ═══════════════════════════════════════════
   SHADOWS
   ═══════════════════════════════════════════ */
export const shadows = {
  sm: '0 2px 8px rgba(0,0,0,0.3)',
  md: '0 4px 20px rgba(0,0,0,0.4)',
  lg: '0 8px 32px rgba(0,0,0,0.45)',
  xl: '0 16px 48px rgba(0,0,0,0.5)',
  gold: '0 0 24px rgba(212,175,55,0.12)',
  goldHover: '0 0 32px rgba(212,175,55,0.25)',
  goldSoft: '0 0 16px rgba(212,175,55,0.08)',
  soft: '0 2px 12px rgba(0,0,0,0.2)',
} as const;

/* ═══════════════════════════════════════════
   EXPORT ALL
   ═══════════════════════════════════════════ */
export const tokens = {
  spacing,
  radius,
  blur,
  typography,
  motion,
  colors,
  shadows,
};

export default tokens;