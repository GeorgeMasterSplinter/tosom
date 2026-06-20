/**
 * ToSom UI 2.0 — Design Tokens
 * TypeScript-accessible design tokens for consistent UI development.
 * All values map to CSS custom properties (--ts-*) defined in styles/globals.css
 *
 * Usage:
 *   import { tokens } from '@/components/ui/tokens'
 *   const color = tokens.colors.gold
 *   const space = tokens.spacing.lg
 */

/* ── Color Tokens (UI 4.1 — Nordic Calm & Gold Noir) ── */
export const colors = {
  /* Background */
  bg: {
    primary: 'var(--ts-bg-primary)',
    secondary: 'var(--ts-bg-secondary)',
    surface: 'var(--ts-bg-surface)',
    elevated: 'var(--ts-bg-surface-elevated)',
    calmDeep: 'var(--ts-bg-calm-deep)',
    calmWarm: 'var(--ts-bg-calm-warm)',
  } as const,

  /* Text */
  text: {
    primary: 'var(--ts-text-primary)',
    secondary: 'var(--ts-text-secondary)',
    muted: 'var(--ts-text-muted)',
    subtle: 'var(--ts-text-subtle)',
    goldAccent: 'var(--ts-text-gold-accent)',
  } as const,

  /* Gold Accent */
  gold: {
    DEFAULT: 'var(--ts-gold)',
    light: 'var(--ts-gold-light)',
    dark: 'var(--ts-gold-dark)',
    glow: 'var(--ts-gold-glow)',
    soft: 'var(--ts-gold-soft)',
    noir: 'var(--ts-gold-noir)',
    glowStrong: 'var(--ts-gold-glow-strong)',
  } as const,

  /* Nordic Calm Accents */
  calm: {
    blue: 'var(--ts-calm-blue)',
    blueSoft: 'var(--ts-calm-blue-soft)',
    green: 'var(--ts-calm-green)',
    greenSoft: 'var(--ts-calm-green-soft)',
    rose: 'var(--ts-calm-rose)',
    roseSoft: 'var(--ts-calm-rose-soft)',
    violet: 'var(--ts-calm-violet)',
    violetSoft: 'var(--ts-calm-violet-soft)',
  } as const,

  /* Glassmorphism */
  glass: {
    bg: 'var(--ts-glass-bg)',
    bgHover: 'var(--ts-glass-bg-hover)',
    bgStrong: 'var(--ts-glass-bg-strong)',
    border: 'var(--ts-glass-border)',
    borderHover: 'var(--ts-glass-border-hover)',
    borderGold: 'var(--ts-glass-border-gold)',
    blur: 'var(--ts-glass-blur)',
    blurStrong: 'var(--ts-glass-blur-strong)',
    blurUltra: 'var(--ts-glass-blur-ultra)',
  } as const,

  /* Border */
  border: {
    DEFAULT: 'var(--ts-border)',
    light: 'var(--ts-border-light)',
    subtle: 'var(--ts-border-subtle)',
  } as const,

  /* Status */
  status: {
    success: 'var(--ts-success)',
    error: 'var(--ts-error)',
    warning: 'var(--ts-warning)',
    info: 'var(--ts-info)',
  } as const,
} as const;

/* ── Spacing Tokens (UI 4.1 — expanded) ── */
export const spacing = {
  xs: 'var(--ts-spacing-xs)',
  sm: 'var(--ts-spacing-sm)',
  md: 'var(--ts-spacing-md)',
  lg: 'var(--ts-spacing-lg)',
  xl: 'var(--ts-spacing-xl)',
  '2xl': 'var(--ts-spacing-2xl)',
  '3xl': 'var(--ts-spacing-3xl)',
  '4xl': 'var(--ts-spacing-4xl)',
  '5xl': 'var(--ts-spacing-5xl)',
  '6xl': 'var(--ts-spacing-6xl)',
  '7xl': 'var(--ts-spacing-7xl)',
} as const;

/* ── Border Radius Tokens ── */
export const borderRadius = {
  none: '0px',
  sm: 'var(--ts-radius-sm)',
  md: 'var(--ts-radius-md)',
  lg: 'var(--ts-radius-lg)',
  xl: 'var(--ts-radius-xl)',
  '2xl': 'var(--ts-radius-2xl)',
  '3xl': 'var(--ts-radius-3xl)',
  full: 'var(--ts-radius-full)',
} as const;

/* ── Shadow Tokens (UI 4.1 — soft + gold-soft) ── */
export const shadows = {
  sm: 'var(--ts-shadow-sm)',
  md: 'var(--ts-shadow-md)',
  lg: 'var(--ts-shadow-lg)',
  xl: 'var(--ts-shadow-xl)',
  gold: 'var(--ts-shadow-gold)',
  goldHover: 'var(--ts-shadow-gold-hover)',
  goldSoft: 'var(--ts-shadow-gold-soft)',
  soft: 'var(--ts-shadow-soft)',
} as const;

/* ── Typography Tokens (UI 4.1 — Display + Heading 2XL) ── */
export const typography = {
  displayXL: { fontSize: 'var(--ts-font-display-xl)', fontWeight: 600, lineHeight: '1.1', letterSpacing: '-0.03em' } as const,
  displayL: { fontSize: 'var(--ts-font-display-l)', fontWeight: 600, lineHeight: '1.15', letterSpacing: '-0.025em' } as const,
  displayM: { fontSize: 'var(--ts-font-display-m)', fontWeight: 600, lineHeight: '1.2', letterSpacing: '-0.02em' } as const,
  heading2XL: { fontSize: 'var(--ts-font-heading-2xl)', fontWeight: 600, lineHeight: '1.2' } as const,
  headingXL: { fontSize: 'var(--ts-font-heading-xl)', fontWeight: 600, lineHeight: '1.2' } as const,
  headingL: { fontSize: 'var(--ts-font-heading-l)', fontWeight: 600, lineHeight: '1.25' } as const,
  headingM: { fontSize: 'var(--ts-font-heading-m)', fontWeight: 600, lineHeight: '1.3' } as const,
  headingS: { fontSize: 'var(--ts-font-heading-s)', fontWeight: 600, lineHeight: '1.35' } as const,
  body: { fontSize: 'var(--ts-font-body)', fontWeight: 400, lineHeight: '1.65' } as const,
  bodySmall: { fontSize: 'var(--ts-font-small)', fontWeight: 400, lineHeight: '1.6' } as const,
  caption: { fontSize: 'var(--ts-font-xs)', fontWeight: 400, lineHeight: '1.5' } as const,
} as const;

/* ── Motion / Animation Tokens ── */
export const motion = {
  /* Durations */
  duration: {
    instant: 'var(--ts-motion-duration-instant)',
    faster: 'var(--ts-motion-duration-faster)',
    fast: 'var(--ts-motion-duration-fast)',
    normal: 'var(--ts-motion-duration-normal)',
    slow: 'var(--ts-motion-duration-slow)',
    slower: 'var(--ts-motion-duration-slower)',
    slowest: 'var(--ts-motion-duration-slowest)',
    pageTransition: 'var(--ts-motion-duration-pageTransition)',
  } as const,

  /* Easing curves */
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
    // Premium smooth
    smooth: 'var(--ts-motion-easing-smooth)',
    // Soft spring bounce
    spring: 'var(--ts-motion-easing-spring)',
    // Gentle overshoot
    overshoot: 'var(--ts-motion-easing-overshoot)',
    // Subtle bounce
    subtleBounce: 'var(--ts-motion-easing-subtleBounce)',
    // Fade curve
    fadeIn: 'var(--ts-motion-easing-fadeIn)',
    // Slide curve
    slideIn: 'var(--ts-motion-easing-slideIn)',
  } as const,

  /* Combined transition strings */
  transition: {
    fast: 'var(--ts-transition-fast)',
    normal: 'var(--ts-transition-normal)',
    slow: 'var(--ts-transition-slow)',
    spring: 'var(--ts-transition-spring)',
    pageTransition: 'var(--ts-transition-page)',
  } as const,

  /* Animation keyframes (CSS @keyframes names) */
  keyframes: {
    fadeIn: 'fadeIn',
    fadeOut: 'fadeOut',
    slideUp: 'slideUp',
    slideDown: 'slideDown',
    slideLeft: 'slideLeft',
    slideRight: 'slideRight',
    scaleIn: 'scaleIn',
    scaleOut: 'scaleOut',
    bounceIn: 'bounceIn',
    popIn: 'popIn',
    shimmer: 'shimmer',
    pulse: 'pulse',
    breathe: 'breathe',
    typewriter: 'typewriter',
    carouselSlide: 'carouselSlide',
    progressFill: 'progressFill',
  } as const,

  /* Stagger delays for list animations */
  stagger: {
    fast: 'var(--ts-motion-stagger-fast)',
    normal: 'var(--ts-motion-stagger-normal)',
    slow: 'var(--ts-motion-stagger-slow)',
  } as const,

  /* Scroll-related */
  scroll: {
    parallaxFactor: '0.3',
    fadeThreshold: '100px',
    progressAnimation: '600ms',
  } as const,

  /* Haptics */
  haptics: {
    light: '50ms',
    medium: '100ms',
    heavy: '150ms',
    success: [
      { duration: 50, offset: 0 },
      { duration: 80, offset: 80 },
    ],
    error: [
      { duration: 100, offset: 0 },
      { duration: 100, offset: 120 },
    ],
  } as const,

  /* Gesture */
  gesture: {
    swipeThreshold: '80px',
    swipeVelocity: '0.5px/ms',
    pullToRefreshThreshold: '100px',
    longPressDelay: '500ms',
  } as const,
} as const;

/* ── Platform Detection ── */
export type Platform = 'web' | 'pwa' | 'mobile' | 'desktop';

export const platform = {
  /** Current detected platform */
  current: typeof window !== 'undefined'
    ? (typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
        ? 'mobile'
        : (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches
            ? 'pwa'
            : (typeof process !== 'undefined' && (process as any).platform?.startsWith('win') || (process as any).platform?.startsWith('linux')
                ? 'desktop'
                : 'web')))
    : 'web',

  /** Whether current environment supports CSS custom properties */
  supportsCSSVars: typeof CSS !== 'undefined',

  /** Whether current environment is touch-enabled */
  isTouch: typeof window !== 'undefined' && 'ontouchstart' in window,

  /** Whether current environment is a native mobile platform */
  isNative: typeof navigator !== 'undefined' && navigator.product === 'ReactNative',

  /** Whether current environment is a desktop app (Electron) */
  isDesktop: typeof process !== 'undefined' && (process as any).type === 'browser',

  /** Whether current environment is a PWA */
  isPWA: typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches,

  /** Whether current environment is a web browser */
  isWeb: true,

  /** Platform detection utility */
  detect(): Platform {
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') return 'mobile';
    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) return 'pwa';
    if (typeof process !== 'undefined' && (process as any).type === 'browser') return 'desktop';
    return 'web';
  },

  /** Platform-specific tokens */
  tokens: {
    /** Touch target sizes (WCAG 2.5.5 minimum) */
    touchTarget: {
      standard: '44px',
      large: '56px',
      small: '36px',
      native: '44', // RN point values
    } as const,

    /** Safe area insets (iOS notch, Android gesture bar) */
    safeArea: {
      top: 'env(safe-area-inset-top, 0px)',
      right: 'env(safe-area-inset-right, 0px)',
      bottom: 'env(safe-area-inset-bottom, 0px)',
      left: 'env(safe-area-inset-left, 0px)',
      padding: 'env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px)',
    } as const,

    /** Platform-specific border radius (web = glass, mobile = more rounded) */
    radius: {
      web: 'var(--ts-radius-md)',
      mobile: 'var(--ts-radius-lg)',
      pwa: 'var(--ts-radius-lg)',
      desktop: 'var(--ts-radius-md)',
      native: 12, // RN uses raw numbers
    } as const,

    /** Platform-specific shadows */
    shadow: {
      web: 'var(--ts-shadow-md)',
      mobile: '0 2px 8px rgba(0,0,0,0.2)',
      pwa: 'var(--ts-shadow-md)',
      desktop: '0 4px 12px rgba(0,0,0,0.3)',
      native: '0 1px 4px rgba(0,0,0,0.15)',
    } as const,

    /** Platform-specific spacing scale */
    spacing: {
      web: {
        xs: 'var(--ts-spacing-xs)',
        sm: 'var(--ts-spacing-sm)',
        md: 'var(--ts-spacing-md)',
        lg: 'var(--ts-spacing-lg)',
        xl: 'var(--ts-spacing-xl)',
      } as const,
      mobile: {
        xs: '4dp',
        sm: '8dp',
        md: '16dp',
        lg: '24dp',
        xl: '32dp',
      } as const,
      desktop: {
        xs: 'var(--ts-spacing-xs)',
        sm: 'var(--ts-spacing-sm)',
        md: 'var(--ts-spacing-md)',
        lg: 'var(--ts-spacing-lg)',
        xl: 'var(--ts-spacing-xl)',
      } as const,
    } as const,

    /** Platform-specific corner rounding style */
    cornerStyle: {
      web: 'glass',
      mobile: 'rounded',
      pwa: 'rounded',
      desktop: 'rounded',
    } as const,

    /** Platform-specific glass intensity (UI 4.1 — updated to match CSS) */
    glassIntensity: {
      web: '16px',
      mobile: '8px',
      pwa: '10px',
      desktop: '6px',
    } as const,

    /** Platform-specific motion preferences */
    motion: {
      web: {
        duration: 'var(--ts-motion-duration-normal)',
        easing: 'var(--ts-motion-easing-smooth)',
      } as const,
      mobile: {
        duration: 250, // ms
        easing: 'spring',
      } as const,
      desktop: {
        duration: 'var(--ts-motion-duration-normal)',
        easing: 'var(--ts-motion-easing-smooth)',
      } as const,
    } as const,
  } as const,
} as const;

/* ── Z-Index Tokens ── */
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

/* ── Component-Specific Tokens ── */
export const components = {
  button: {
    borderRadius: 'var(--ts-radius-md)',
    padding: 'var(--ts-spacing-sm) var(--ts-spacing-lg)',
    fontSize: '16px',
    fontWeight: 500,
    minHeight: '44px', // WCAG touch target
  } as const,

  input: {
    borderRadius: 'var(--ts-radius-md)',
    padding: 'var(--ts-spacing-sm) var(--ts-spacing-md)',
    fontSize: '16px',
    borderWidth: '1px',
    borderColor: 'var(--ts-glass-border)',
    focusBorderColor: 'var(--ts-gold)',
    focusShadow: '0 0 0 3px var(--ts-gold-glow)',
  } as const,

  card: {
    borderRadius: 'var(--ts-radius-xl)',
    padding: 'var(--ts-spacing-xl)',
    glassBg: 'var(--ts-glass-bg)',
    glassBorder: 'var(--ts-glass-border)',
    backdropBlur: 'var(--ts-glass-blur)',
    shadow: 'var(--ts-shadow-lg)',
  } as const,

  navbar: {
    height: 'var(--ts-navbar-height)',
    glassBg: 'var(--ts-glass-bg)',
    glassBorder: 'var(--ts-glass-border)',
    backdropBlur: 'var(--ts-glass-blur)',
  } as const,

  modal: {
    borderRadius: 'var(--ts-radius-2xl)',
    padding: 'var(--ts-spacing-xl)',
    maxWidth: 'var(--ts-container-max)',
    overlayBg: 'rgba(0, 0, 0, 0.6)',
    overlayBlur: '4px',
  } as const,

  glass: {
    bg: 'var(--ts-glass-bg)',
    bgHover: 'var(--ts-glass-bg-hover)',
    border: 'var(--ts-glass-border)',
    borderHover: 'var(--ts-glass-border-hover)',
    blur: 'var(--ts-glass-blur)',
    shadow: 'var(--ts-shadow-md)',
  } as const,

  layout: {
    sidebarWidth: 'var(--ts-sidebar-width)',
    navbarHeight: 'var(--ts-navbar-height)',
    containerMax: 'var(--ts-container-max)',
  } as const,
} as const;

/* ── Combined Token Export ── */
export const tokens = {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  motion,
  zIndex,
  breakpoints,
  components,
} as const;

/* ── CSS Variable Names (UI 4.1 — full) ── */
export const cssVarNames = {
  /* Background */
  bgPrimary: '--ts-bg-primary',
  bgSecondary: '--ts-bg-secondary',
  bgSurface: '--ts-bg-surface',
  bgElevated: '--ts-bg-surface-elevated',
  bgCalmDeep: '--ts-bg-calm-deep',
  bgCalmWarm: '--ts-bg-calm-warm',

  /* Text */
  textPrimary: '--ts-text-primary',
  textSecondary: '--ts-text-secondary',
  textMuted: '--ts-text-muted',
  textSubtle: '--ts-text-subtle',
  textGoldAccent: '--ts-text-gold-accent',

  /* Gold */
  gold: '--ts-gold',
  goldLight: '--ts-gold-light',
  goldDark: '--ts-gold-dark',
  goldGlow: '--ts-gold-glow',
  goldSoft: '--ts-gold-soft',
  goldNoir: '--ts-gold-noir',
  goldGlowStrong: '--ts-gold-glow-strong',

  /* Nordic Calm */
  calmBlue: '--ts-calm-blue',
  calmBlueSoft: '--ts-calm-blue-soft',
  calmGreen: '--ts-calm-green',
  calmGreenSoft: '--ts-calm-green-soft',
  calmRose: '--ts-calm-rose',
  calmRoseSoft: '--ts-calm-rose-soft',
  calmViolet: '--ts-calm-violet',
  calmVioletSoft: '--ts-calm-violet-soft',

  /* Glass */
  glassBg: '--ts-glass-bg',
  glassBgHover: '--ts-glass-bg-hover',
  glassBgStrong: '--ts-glass-bg-strong',
  glassBorder: '--ts-glass-border',
  glassBorderHover: '--ts-glass-border-hover',
  glassBorderGold: '--ts-glass-border-gold',
  glassBlur: '--ts-glass-blur',
  glassBlurStrong: '--ts-glass-blur-strong',
  glassBlurUltra: '--ts-glass-blur-ultra',

  /* Border */
  border: '--ts-border',
  borderLight: '--ts-border-light',
  borderSubtle: '--ts-border-subtle',

  /* Status */
  success: '--ts-success',
  error: '--ts-error',
  warning: '--ts-warning',
  info: '--ts-info',

  /* Spacing */
  spacing: {
    xs: '--ts-spacing-xs',
    sm: '--ts-spacing-sm',
    md: '--ts-spacing-md',
    lg: '--ts-spacing-lg',
    xl: '--ts-spacing-xl',
    '2xl': '--ts-spacing-2xl',
    '3xl': '--ts-spacing-3xl',
    '4xl': '--ts-spacing-4xl',
    '5xl': '--ts-spacing-5xl',
    '6xl': '--ts-spacing-6xl',
    '7xl': '--ts-spacing-7xl',
  } as const,

  /* Radius */
  radius: {
    sm: '--ts-radius-sm',
    md: '--ts-radius-md',
    lg: '--ts-radius-lg',
    xl: '--ts-radius-xl',
    '2xl': '--ts-radius-2xl',
    '3xl': '--ts-radius-3xl',
    full: '--ts-radius-full',
  } as const,

  /* Shadow */
  shadow: {
    sm: '--ts-shadow-sm',
    md: '--ts-shadow-md',
    lg: '--ts-shadow-lg',
    xl: '--ts-shadow-xl',
    gold: '--ts-shadow-gold',
    goldHover: '--ts-shadow-gold-hover',
    goldSoft: '--ts-shadow-gold-soft',
    soft: '--ts-shadow-soft',
  } as const,

  /* Typography */
  typography: {
    displayXL: '--ts-font-display-xl',
    displayL: '--ts-font-display-l',
    displayM: '--ts-font-display-m',
    heading2XL: '--ts-font-heading-2xl',
    headingXL: '--ts-font-heading-xl',
    headingL: '--ts-font-heading-l',
    headingM: '--ts-font-heading-m',
    headingS: '--ts-font-heading-s',
    body: '--ts-font-body',
    small: '--ts-font-small',
    xs: '--ts-font-xs',
  } as const,
} as const;

export default tokens;
