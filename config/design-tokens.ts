/*
 * ToSom Design Tokens — Foundation Layer
 * 
 * Alle farger, spacing, radius, shadows og elevation
 * benyttes gjennom hele applikasjonen.
 * Ingen hardkodede verdier utover denne fila.
 */

/* ========================
   COLOR PALETTE
   ======================== */

export const color = {
  /* ---- Primary Background ---- */
  bg: {
    primary:   '#0B1520',    /* Mørk blå-nordisk basis */
    secondary: '#121E2E',    /* Litt lysere bakgrunn */
    tertiary:  '#1A2A3E',    /* Terceriell bakgrunn */
    surface:   '#070D14',    /* Overflater / footers */
  },

  /* ---- Gradients ---- */
  gradient: {
    /* Horisontale gradienter */
    'hero':       'linear-gradient(180deg, #162032 0%, #0B1520 100%)',
    'hero-fade':  'linear-gradient(180deg, transparent 0%, rgba(11,21,32,0.5) 100%)',
    'footer':     'linear-gradient(180deg, #0B1520 0%, #060B10 100%)',
    'cta-glow':   'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.03) 100%)',
    
    /* Horisontale */
    'gold': 'linear-gradient(90deg, #D4AF37, #E8C766)',
    'blue': 'linear-gradient(90deg, #4A7BA7, #6A9BC7)',
  },

  /* ---- Ambient Light ---- */
  ambient: {
    blue: {
      strong:  'rgba(80,120,255,0.08)',
      medium:  'rgba(80,120,255,0.05)',
      soft:    'rgba(80,120,255,0.03)',
      glow:    'rgba(80,120,255,0.12)',
    },
    gold: {
      strong:  'rgba(212,175,55,0.10)',
      medium:  'rgba(212,175,55,0.06)',
      soft:    'rgba(212,175,55,0.03)',
      glow:    'rgba(212,175,55,0.15)',
    },
  },

  /* ---- Primary Brand ---- */
  brand: {
    gold:   '#D4AF37',
    'gold-hover': '#E8C766',
    'gold-active': '#C49F2F',
    blue:   '#4A7BA7',
    'blue-hover': '#6A9BC7',
  },

  /* ---- Text Colors ---- */
  text: {
    primary:   '#FFFFFF',       /* Hovedtekst */
    secondary: 'rgba(255,255,255,0.65)',  /* Sekundær tekst */
    muted:     'rgba(255,255,255,0.45)',  /* Dempet tekst */
    subtle:    'rgba(255,255,255,0.30)',  /* Subtil tekst */
    inverse:   '#0B1520',       /* Tekst på lys bakgrunn */
    gold:      '#D4AF37',
    'gold-soft': 'rgba(212,175,55,0.7)',
  },

  /* ---- Border Colors ---- */
  border: {
    default: 'rgba(255,255,255,0.08)',
    light:   'rgba(255,255,255,0.12)',
    dark:    'rgba(255,255,255,0.04)',
    gold:    'rgba(212,175,55,0.25)',
    'gold-soft': 'rgba(212,175,55,0.08)',
    blue:    'rgba(80,120,255,0.20)',
    error:   'rgba(255,77,77,0.4)',
    success: 'rgba(77,255,136,0.4)',
  },

  /* ---- Status Colors ---- */
  status: {
    error:   '#FF4D4D',
    'error-soft': 'rgba(255,77,77,0.12)',
    success: '#4DFF88',
    'success-soft': 'rgba(77,255,136,0.12)',
    warning: '#FFB84D',
    'warning-soft': 'rgba(255,184,77,0.12)',
    info:    '#4DA8FF',
    'info-soft': 'rgba(77,168,255,0.12)',
  },

  /* ---- Glassmorphism ---- */
  glass: {
    bg:         'rgba(255,255,255,0.04)',
    'bg-hover': 'rgba(255,255,255,0.06)',
    'bg-active':'rgba(255,255,255,0.08)',
    border:     'rgba(255,255,255,0.08)',
    'border-hover':'rgba(255,255,255,0.12)',
    highlight:  'rgba(255,255,255,0.15)',
    goldBg:     'rgba(212,175,55,0.06)',
    goldBorder: 'rgba(212,175,55,0.20)',
    blueBg:     'rgba(80,120,255,0.06)',
    blueBorder: 'rgba(80,120,255,0.20)',
  },

  /* ---- Neutral Grays ---- */
  gray: {
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#C5C5C5',
    400: '#9A9A9A',
    500: '#6A6A6A',
    600: '#3A3A3A',
    700: '#2A2A2A',
    800: '#1A1A1A',
    900: '#0A0A0A',
  },
} as const;

/* ========================
   SPACING SYSTEM
   ======================== */

export const spacing = {
  xs:  4,   /* 0.25rem */
  sm:  8,   /* 0.5rem  */
  md:  16,  /* 1rem    */
  lg:  24,  /* 1.5rem  */
  xl:  32,  /* 2rem    */
  '2xl': 48, /* 3rem    */
  '3xl': 64, /* 4rem    */
  '4xl': 80, /* 5rem    */
  '5xl': 96, /* 6rem    */
  '6xl': 120, /* 7.5rem  */
} as const;

/* ========================
   RADIUS SYSTEM
   ======================== */

export const radius = {
  xs:  4,   /* Tiny: badges, pills */
  sm:  8,   /* Small: tags, chips   */
  md:  12,  /* Medium: buttons      */
  lg:  16,  /* Large: cards         */
  xl:  20,  /* XL: glass panels     */
  '2xl': 24, /* 2XL: modals        */
  '3xl': 32, /* 3XL: overlays      */
  full: 9999, /* Pill / circle    */
} as const;

/* ========================
   SHADOW / ELEVATION
   ======================== */

export const shadow = {
  none:    'none',
  sm:      '0 1px 2px rgba(0,0,0,0.15)',
  md:      '0 4px 12px rgba(0,0,0,0.2)',
  lg:      '0 4px 20px rgba(0,0,0,0.3)',
  xl:      '0 8px 32px rgba(0,0,0,0.35)',
  '2xl':   '0 16px 48px rgba(0,0,0,0.4)',
  gold:    '0 0 40px rgba(212,175,55,0.25)',
  'gold-lg': '0 0 55px rgba(212,175,55,0.35)',
  blue:    '0 0 32px rgba(80,120,255,0.15)',
  inset:   'inset 0 1px 0 rgba(255,255,255,0.05)',
} as const;

/* ========================
   BACKDROP BLUR
   ======================== */

export const blur = {
  none:  '0',
  sm:    '4px',
  md:    '8px',
  lg:    '12px',
  xl:    '16px',
  '2xl': '24px',
  '3xl': '32px',
} as const;

/* ========================
    TYPOGRAPHY SYSTEM
    ======================== */

export const typography = {
  font: {
    primary: 'Inter',
    secondary: 'Playfair Display',
    mono: 'JetBrains Mono',
  } as const,
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 42,
    '6xl': 48,
    hero: 60,
  } as const,
  
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  } as const,
  
  lineHeight: {
    tight: 1.15,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.7,
    loose: 1.9,
  } as const,
  
  letterSpacing: {
    tight: '-0.03em',
    normal: '0',
    wide: '0.02em',
    wider: '0.08em',
    widest: '0.15em',
  } as const,
  
  /** Legacy footer tagline style token */
  footerTagline: {
    fontWeight: 300,
    tracking: '0.12em',
    opacity: 0.85,
    lineHeight: 1.7,
  } as const,
} as const;

export type TypographyStyle =
  | 'hero'
  | 'heading-xl'
  | 'heading-lg'
  | 'heading-md'
  | 'heading-sm'
  | 'body-lg'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'overline'
  | 'cta';

export const typographyStyles: Record<TypographyStyle, { fontSize: number; fontWeight: number; lineHeight: number; letterSpacing?: string }> = {
  hero: { fontSize: typography.fontSize.hero, fontWeight: typography.fontWeight.semibold, lineHeight: typography.lineHeight.tight, letterSpacing: typography.letterSpacing.tight },
  'heading-xl': { fontSize: typography.fontSize['6xl'], fontWeight: typography.fontWeight.semibold, lineHeight: typography.lineHeight.tight, letterSpacing: typography.letterSpacing.tight },
  'heading-lg': { fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.semibold, lineHeight: typography.lineHeight.tight, letterSpacing: '-0.02em' },
  'heading-md': { fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, lineHeight: typography.lineHeight.snug, letterSpacing: '-0.01em' },
  'heading-sm': { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, lineHeight: typography.lineHeight.snug },
  'body-lg': { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.regular, lineHeight: typography.lineHeight.relaxed },
  body: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.regular, lineHeight: typography.lineHeight.normal },
  'body-sm': { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.regular, lineHeight: typography.lineHeight.normal },
  caption: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.regular, lineHeight: typography.lineHeight.tight, letterSpacing: typography.letterSpacing.wider },
  overline: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, lineHeight: typography.lineHeight.normal, letterSpacing: typography.letterSpacing.widest },
  cta: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.medium, lineHeight: typography.lineHeight.normal, letterSpacing: '-0.01em' },
};

export function typographyToStyle(style: TypographyStyle): React.CSSProperties {
  const token = typographyStyles[style];
  return {
    fontSize: `${token.fontSize}px`,
    fontWeight: token.fontWeight,
    lineHeight: token.lineHeight,
    ...(token.letterSpacing && { letterSpacing: token.letterSpacing }),
  };
}

/**
 * Legacy typography properties for backwards compatibility.
 */
export const footerTagline = {
  fontWeight: 300,
  tracking: '0.12em',
  opacity: 0.85,
  lineHeight: 1.7,
} as const;

/* ========================
    HELPERS
    ======================== */

/**
 * Genererer en glassmorphism-variabel for bruk i inline styles.
 */
export function glassVariant(
  variant: 'default' | 'gold' | 'blue' = 'default',
  intensity: 'soft' | 'medium' | 'strong' = 'medium'
): React.CSSProperties {
  const bgMap = {
    default: {
      soft:   color.glass.bg,
      medium: color.glass['bg-hover'],
      strong: color.glass['bg-active'],
    },
    gold: {
      soft:   'rgba(212,175,55,0.04)',
      medium: 'rgba(212,175,55,0.06)',
      strong: 'rgba(212,175,55,0.10)',
    },
    blue: {
      soft:   'rgba(80,120,255,0.04)',
      medium: 'rgba(80,120,255,0.06)',
      strong: 'rgba(80,120,255,0.10)',
    },
  };

  const borderMap = {
    default: {
      soft:   color.glass.border,
      medium: color.glass.border,
      strong: color.glass['border-hover'],
    },
    gold: {
      soft:   'rgba(212,175,55,0.12)',
      medium: 'rgba(212,175,55,0.20)',
      strong: 'rgba(212,175,55,0.30)',
    },
    blue: {
      soft:   'rgba(80,120,255,0.12)',
      medium: 'rgba(80,120,255,0.20)',
      strong: 'rgba(80,120,255,0.30)',
    },
  };

  return {
    background: bgMap[variant][intensity],
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid ${borderMap[variant][intensity]}`,
    borderRadius: `${radius.xl}px`,
    boxShadow: shadow.lg,
  } as React.CSSProperties;
}

/* ========================
   EXPORTS
   ======================== */

/** Legacy color alias for components */
export const colors = {
  ...color,
  gold: '#D4AF37',
  softWhite: '#F5F5F5',
  deepBlack: '#0A0A0A',
  calmBlue: '#4A7BA7',
  error: '#FF4D4D',
  success: '#4DFF88',
  warning: '#FFB84D',
  info: '#4DA8FF',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.65)',
  textMuted: 'rgba(255,255,255,0.45)',
  bgPrimary: '#0B1520',
  bgSecondary: '#121E2E',
  bgSurface: '#070D14',
  borderDefault: 'rgba(255,255,255,0.08)',
} as const;

/** Shadow alias for backwards compatibility */
export const shadows = shadow;

/** Motion tokens for components */
export const motion = {
  durations: { fast: '150ms', normal: '300ms', slow: '500ms' },
  easings: { easeOut: 'cubic-bezier(0.21, 1.02, 0.73, 1)', easeIn: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)', easeInOut: 'cubic-bezier(0.48, 0, 0.52, 1)', fadeIn: 'cubic-bezier(0.21, 1.02, 0.73, 1)', smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)', spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
};

/** Theme object for backwards compatibility. */
export const theme = {
  color,
  spacing,
  radius,
  shadow,
  blur,
  glassVariant,
  footerTagline,
};

export default {
  color,
  spacing,
  radius,
  shadow,
  blur,
  glassVariant,
  footerTagline,
};
