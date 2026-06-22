/*
 * ToSom UI5 Tokens — Global Export
 * 
 * Denne fila eksporterer alle design-tokens fra prosjektet.
 * Importer herfra når du treng tilgang til alle tokens.
 * 
 * Eksempel:
 *   import { tokens, color, spacing, radius, typography } from '@/brand/ui5-tokens';
 */

/* ========================
   IMPORTS
   ======================== */

export { color, spacing, radius, shadow, blur, glassVariant } from '@/config/design-tokens';
export { 
  font, 
  fontSize, 
  fontWeight, 
  lineHeight, 
  letterSpacing, 
  typographyStyles, 
  typographyToStyle, 
  tailwindTypography 
} from '@/config/typography';
export { componentRadius, radiusToStyle, radiusToTailwind } from '@/config/radius-pa';

/* ========================
   AGGREGATED TOKENS
   ======================== */

/**
 * Alle tokens samlet i ett objekt.
 */
export const tokens = {
  /* Farger */
  color: {
    bg: {
      primary:   '#0B1520',
      secondary: '#121E2E',
      tertiary:  '#1A2A3E',
      surface:   '#070D14',
    },
    brand: {
      gold:       '#D4AF37',
      goldHover:  '#E8C766',
      goldActive: '#C49F2F',
      blue:       '#4A7BA7',
      blueHover:  '#6A9BC7',
    },
    text: {
      primary:   '#FFFFFF',
      secondary: 'rgba(255,255,255,0.65)',
      muted:     'rgba(255,255,255,0.45)',
      subtle:    'rgba(255,255,255,0.30)',
      inverse:   '#0B1520',
      gold:      '#D4AF37',
      goldSoft:  'rgba(212,175,55,0.7)',
    },
    border: {
      default: 'rgba(255,255,255,0.08)',
      light:   'rgba(255,255,255,0.12)',
      dark:    'rgba(255,255,255,0.04)',
      gold:    'rgba(212,175,55,0.25)',
      goldSoft:'rgba(212,175,55,0.08)',
      blue:    'rgba(80,120,255,0.20)',
      error:   'rgba(255,77,77,0.4)',
      success: 'rgba(77,255,136,0.4)',
    },
    status: {
      error: '#FF4D4D',
      success: '#4DFF88',
      warning: '#FFB84D',
      info: '#4DA8FF',
    },
    glass: {
      bg:          'rgba(255,255,255,0.04)',
      bgHover:     'rgba(255,255,255,0.06)',
      bgActive:    'rgba(255,255,255,0.08)',
      border:      'rgba(255,255,255,0.08)',
      borderHover: 'rgba(255,255,255,0.12)',
      highlight:   'rgba(255,255,255,0.15)',
      goldBg:      'rgba(212,175,55,0.06)',
      goldBorder:  'rgba(212,175,55,0.20)',
      blueBg:      'rgba(80,120,255,0.06)',
      blueBorder:  'rgba(80,120,255,0.20)',
    },
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
  },

  /* Spacing */
  spacing: {
    xs:  4,
    sm:  8,
    md:  16,
    lg:  24,
    xl:  32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 80,
    '5xl': 96,
    '6xl': 120,
  },

  /* Radius */
  radius: {
    xs:  4,
    sm:  8,
    md:  12,
    lg:  16,
    xl:  20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },

  /* Typography */
  typography: {
    font: {
      primary: 'Inter',
      secondary: 'Playfair Display',
      mono: 'JetBrains Mono',
    },
    fontSize: {
      xs:  12,
      sm:  14,
      base: 16,
      lg:  18,
      xl:  20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 42,
      '6xl': 48,
      hero: 60,
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.15,
      snug: 1.3,
      normal: 1.5,
      relaxed: 1.7,
      loose: 1.9,
    },
    letterSpacing: {
      tight: '-0.03em',
      normal: '0',
      wide: '0.02em',
      wider: '0.08em',
      widest: '0.15em',
    },
  },

  /* Shadows */
  shadow: {
    none:  'none',
    sm:    '0 1px 2px rgba(0,0,0,0.15)',
    md:    '0 4px 12px rgba(0,0,0,0.2)',
    lg:    '0 4px 20px rgba(0,0,0,0.3)',
    xl:    '0 8px 32px rgba(0,0,0,0.35)',
    '2xl': '0 16px 48px rgba(0,0,0,0.4)',
    gold:  '0 0 40px rgba(212,175,55,0.25)',
    blue:  '0 0 32px rgba(80,120,255,0.15)',
  },

  /* Blur */
  blur: {
    none:  '0',
    sm:    '4px',
    md:    '8px',
    lg:    '12px',
    xl:    '16px',
    '2xl': '24px',
    '3xl': '32px',
  },

  /* Gradients */
  gradient: {
    hero:    'linear-gradient(180deg, #162032 0%, #0B1520 100%)',
    footer:  'linear-gradient(180deg, #0B1520 0%, #060B10 100%)',
    gold:    'linear-gradient(90deg, #D4AF37, #E8C766)',
    blue:    'linear-gradient(90deg, #4A7BA7, #6A9BC7)',
  },
};

/* ========================
   COMPONENT DEFAULTS
   ======================== */

/**
 * Standard verdier som brukes i alle UI-komponenter.
 */
export const componentDefaults = {
  button: {
    radius: 12,
    padding: { horizontal: 20, vertical: 12 },
    minHeight: 44,
    fontSize: 16,
    fontWeight: 500,
  },
  input: {
    radius: 16,
    padding: { horizontal: 16, vertical: 12 },
    minHeight: 48,
    fontSize: 16,
    border: '1px solid rgba(255,255,255,0.12)',
    focusBorder: '1px solid #D4AF37',
    focusShadow: '0 0 0 3px rgba(212,175,55,0.25)',
  },
  card: {
    radius: 20,
    padding: 24,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    shadow: '0 4px 20px rgba(0,0,0,0.3)',
    backdropBlur: '12px',
  },
  modal: {
    radius: 24,
    padding: 32,
    background: 'rgba(11,21,32,0.95)',
    border: '1px solid rgba(255,255,255,0.08)',
    shadow: '0 16px 48px rgba(0,0,0,0.4)',
    backdropBlur: '16px',
  },
  glassPanel: {
    radius: 20,
    padding: 24,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    shadow: '0 4px 20px rgba(0,0,0,0.3)',
    backdropBlur: '12px',
  },
};

/* ========================
   THEME CONFIGURATION
   ======================== */

/**
 * Theme-konfigurasjon for framtida (theme switching).
 */
export const themeConfig = {
  dark: {
    name: 'dark',
    label: 'Mørk',
    background: '#0B1520',
    surface: '#121E2E',
    text: '#FFFFFF',
    accent: '#D4AF37',
  },
  light: {
    name: 'light',
    label: 'Lys',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#0A0A0A',
    accent: '#D4AF37',
  },
};

export type Theme = keyof typeof themeConfig;

/* ========================
   EXPORTS
   ======================== */

export default tokens;