/* ═══════════════════════════════════════════
   ToSom Premium — Design Tokens
   Nordic Deep Blue · Gold Premium
   ═══════════════════════════════════════════ */

/* ── Color Palette ── */
export const colors = {
  /* Background */
  bgPrimary: '#0A0F1F',
  bgSecondary: '#111827',
  bgSurface: '#1A1A1D',
  bgSurfaceElevated: '#222226',

  /* Text */
  textPrimary: '#F5F5F5',
  textSecondary: '#E5E7EB',
  textMuted: 'rgba(255, 255, 255, 0.65)',
  textSubtle: 'rgba(255, 255, 255, 0.45)',

  /* Gold Accent */
  gold: '#D4AF37',
  goldLight: '#E8C766',
  goldDark: '#C19A2F',
  goldGlow: 'rgba(212, 175, 55, 0.25)',
  goldSoft: 'rgba(212, 175, 55, 0.1)',

  /* Glassmorphism */
  glassBg: 'rgba(255, 255, 255, 0.04)',
  glassBgHover: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassBorderHover: 'rgba(255, 255, 255, 0.14)',

  /* Border */
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.06)',

  /* Status */
  success: '#4DFF88',
  error: '#FF4D4D',
  warning: '#FBBF24',
  info: '#60A5FA',
} as const;

/* ── Spacing Scale ── */
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '80px',
} as const;

/* ── Radius Scale ── */
export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
} as const;

/* ── Shadow Scale ── */
export const shadow = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 16px rgba(0, 0, 0, 0.25)',
  lg: '0 8px 30px rgba(0, 0, 0, 0.3)',
  xl: '0 12px 40px rgba(0, 0, 0, 0.35)',
  gold: '0 0 20px rgba(212, 175, 55, 0.15)',
  goldHover: '0 0 28px rgba(212, 175, 55, 0.25)',
} as const;

/* ── Typography Scale ── */
export const typography = {
  headingXL: {
    fontSize: '32px',
    fontWeight: 600,
    lineHeight: '1.2',
  },
  headingL: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: '1.25',
  },
  headingM: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '1.3',
  },
  body: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '1.65',
  },
  small: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '1.6',
  },
  xs: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '1.5',
  },
} as const;

/* ── Transition ── */
export const transition = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '400ms ease-out',
} as const;

/* ── Motion / Animation ── */
export const motion = {
  /* Durations */
  instant: '100ms ease',
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '400ms ease-out',
  slower: '600ms ease-out',

  /* Easing curves */
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  linear: 'linear',

  /* Keyframes */
  fadeIn: 'fadeInUp',
  fadeOut: 'fadeOutDown',
  scaleIn: 'scaleIn',
  scaleOut: 'scaleOut',
  slideUp: 'fadeInUp',
  slideDown: 'fadeOutDown',
  slideLeft: 'slideInLeft',
  slideRight: 'slideInRight',
  shimmer: 'shimmer',
  goldGlow: 'goldGlow',
  dotPulse: 'dotPulse',
  bounceIn: 'bounceIn',
  flipIn: 'flipIn',

  /* Animation utilities */
  animateFadeIn: '0.25s ease-out forwards',
  animateScaleIn: '0.2s ease-out forwards',
  animateSlideUp: '0.3s ease-out forwards',
  animateShimmer: '1.5s ease-in-out infinite',
} as const;

/* ── Z-Index Scale ── */
export const zIndex = {
  dropdown: 1000,
  sticky: 1100,
  elevated: 1200,
  modal: 1300,
  drawer: 1400,
  overlay: 1500,
  toast: 1600,
  notification: 1700,
} as const;

/* ── Breakpoints ── */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/* ── Border Radius Tokens ── */
export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
} as const;

/* ── Export as CSS Variable Map ── */
export const cssTokens = `
  /* Background */
  --ts-bg-primary: ${colors.bgPrimary};
  --ts-bg-secondary: ${colors.bgSecondary};
  --ts-bg-surface: ${colors.bgSurface};
  --ts-bg-surface-elevated: ${colors.bgSurfaceElevated};

  /* Text */
  --ts-text-primary: ${colors.textPrimary};
  --ts-text-secondary: ${colors.textSecondary};
  --ts-text-muted: ${colors.textMuted};
  --ts-text-subtle: ${colors.textSubtle};

  /* Gold */
  --ts-gold: ${colors.gold};
  --ts-gold-light: ${colors.goldLight};
  --ts-gold-dark: ${colors.goldDark};
  --ts-gold-glow: ${colors.goldGlow};
  --ts-gold-soft: ${colors.goldSoft};

  /* Glass */
  --ts-glass-bg: ${colors.glassBg};
  --ts-glass-bg-hover: ${colors.glassBgHover};
  --ts-glass-border: ${colors.glassBorder};
  --ts-glass-border-hover: ${colors.glassBorderHover};
  --ts-glass-blur: 12px;

  /* Border */
  --ts-border: ${colors.border};
  --ts-border-light: ${colors.borderLight};

  /* Status */
  --ts-success: ${colors.success};
  --ts-error: ${colors.error};
  --ts-warning: ${colors.warning};
  --ts-info: ${colors.info};

  /* Spacing */
  --ts-spacing-xs: ${spacing.xs};
  --ts-spacing-sm: ${spacing.sm};
  --ts-spacing-md: ${spacing.md};
  --ts-spacing-lg: ${spacing.lg};
  --ts-spacing-xl: ${spacing.xl};
  --ts-spacing-2xl: ${spacing['2xl']};
  --ts-spacing-3xl: ${spacing['3xl']};
  --ts-spacing-4xl: ${spacing['4xl']};

  /* Radius */
  --ts-radius-sm: ${radius.sm};
  --ts-radius-md: ${radius.md};
  --ts-radius-lg: ${radius.lg};
  --ts-radius-xl: ${radius.xl};
  --ts-radius-2xl: ${radius['2xl']};
  --ts-radius-full: ${radius.full};

  /* Shadow */
  --ts-shadow-sm: ${shadow.sm};
  --ts-shadow-md: ${shadow.md};
  --ts-shadow-lg: ${shadow.lg};
  --ts-shadow-xl: ${shadow.xl};
  --ts-shadow-gold: ${shadow.gold};
  --ts-shadow-gold-hover: ${shadow.goldHover};

  /* Typography */
  --ts-font-heading-xl: ${typography.headingXL.fontSize} / ${typography.headingXL.lineHeight}, ${typography.headingXL.fontWeight};
  --ts-font-heading/l: ${typography.headingL.fontSize} / ${typography.headingL.lineHeight}, ${typography.headingL.fontWeight};
  --ts-font-heading/m: ${typography.headingM.fontSize} / ${typography.headingM.lineHeight}, ${typography.headingM.fontWeight};
  --ts-font-body: ${typography.body.fontSize} / ${typography.body.lineHeight}, ${typography.body.fontWeight};
  --ts-font-small: ${typography.small.fontSize} / ${typography.small.lineHeight}, ${typography.small.fontWeight};

  /* Transition */
  --ts-transition-fast: ${transition.fast};
  --ts-transition-normal: ${transition.normal};
  --ts-transition-slow: ${transition.slow};
`.trim();
