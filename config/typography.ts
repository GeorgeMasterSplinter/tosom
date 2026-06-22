/*
 * ToSom Typography System
 * 
 * Definert typografi for hele plattformen.
 * Bruk denne fila for alle tekstelement.
 */

/* ========================
   FONT DEFINISJONER
   ======================== */

export const font = {
  primary: 'Inter',
  secondary: 'Playfair Display',
  mono: 'JetBrains Mono',
} as const;

/* ========================
   TEXT SIZES (i px)
   ======================== */

export const fontSize = {
  /* XS */
  'xs':  12,   /* Caption, badges        */
  'sm':  14,   /* Secondary text         */
  
  /* Base */
  'base': 16,  /* Body text              */
  'lg':  18,   /* Large body             */
  
  /* Titles */
  'xl':  20,   /* Section titles         */
  '2xl': 24,   /* Card titles            */
  '3xl': 30,   /* Hero subtitles         */
  
  /* XL */
  '4xl': 36,   /* Page titles            */
  '5xl': 42,   /* Hero titles            */
  '6xl': 48,   /* Hero titles large      */
  'hero': 60,  /* Hero title XL          */
} as const;

/* ========================
   FONT WEIGHTS
   ======================== */

export const fontWeight = {
  light:    300,
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
  extrabold: 800,
} as const;

/* ========================
   LINE HEIGHTS
   ======================== */

export const lineHeight = {
  tight:    1.15,
  snug:     1.3,
  normal:   1.5,
  relaxed:  1.7,
  loose:    1.9,
} as const;

/* ========================
   LETTER SPACING
   ======================== */

export const letterSpacing = {
  tight:   '-0.03em',
  normal:  '0',
  wide:    '0.02em',
  wider:   '0.08em',
  widest:  '0.15em',
} as const;

/* ========================
   TYPOGRAPHY STYLES
   ======================== */

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

export interface TypographyToken {
  fontSize:    number;
  fontWeight:  number;
  lineHeight:  number;
  letterSpacing?: string;
}

/**
 * Helt typografi-stiler som kan brukes i inline styles.
 */
export const typographyStyles: Record<TypographyStyle, TypographyToken> = {
  hero: {
    fontSize:    fontSize.hero,
    fontWeight:  fontWeight.semibold,
    lineHeight:  lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  'heading-xl': {
    fontSize:    fontSize['6xl'],
    fontWeight:  fontWeight.semibold,
    lineHeight:  lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  'heading-lg': {
    fontSize:    fontSize['4xl'],
    fontWeight:  fontWeight.semibold,
    lineHeight:  lineHeight.tight,
    letterSpacing: '-0.02em',
  },
  'heading-md': {
    fontSize:    fontSize['2xl'],
    fontWeight:  fontWeight.semibold,
    lineHeight:  lineHeight.snug,
    letterSpacing: '-0.01em',
  },
  'heading-sm': {
    fontSize:    fontSize.xl,
    fontWeight:  fontWeight.semibold,
    lineHeight:  lineHeight.snug,
  },
  'body-lg': {
    fontSize:    fontSize.lg,
    fontWeight:  fontWeight.regular,
    lineHeight:  lineHeight.relaxed,
  },
  body: {
    fontSize:    fontSize.base,
    fontWeight:  fontWeight.regular,
    lineHeight:  lineHeight.normal,
  },
  'body-sm': {
    fontSize:    fontSize.sm,
    fontWeight:  fontWeight.regular,
    lineHeight:  lineHeight.normal,
  },
  caption: {
    fontSize:    fontSize.xs,
    fontWeight:  fontWeight.regular,
    lineHeight:  lineHeight.tight,
    letterSpacing: letterSpacing.wider,
  },
  overline: {
    fontSize:    fontSize.sm,
    fontWeight:  fontWeight.medium,
    lineHeight:  lineHeight.normal,
    letterSpacing: letterSpacing.widest,
  },
  cta: {
    fontSize:    fontSize.lg,
    fontWeight:  fontWeight.medium,
    lineHeight:  lineHeight.normal,
    letterSpacing: '-0.01em',
  },
};

/**
 * Konverterer en typography token til React.CSSProperties
 */
export function typographyToStyle(style: TypographyStyle): React.CSSProperties {
  const token = typographyStyles[style];
  return {
    fontSize:    `${token.fontSize}px`,
    fontWeight:  token.fontWeight,
    lineHeight:  token.lineHeight,
    ...(token.letterSpacing && { letterSpacing: token.letterSpacing }),
  };
}

/* ========================
   HELPER FUNCTIONS
   ======================== */

/**
 * Generer en tekst-stil for TAILWIND-konvertering
 */
export function tailwindTypography(style: TypographyStyle): string {
  const map: Record<TypographyStyle, string> = {
    hero:      'text-[48px] font-semibold leading-tight tracking-tight',
    'heading-xl': 'text-[42px] font-semibold leading-tight tracking-tight',
    'heading-lg': 'text-[36px] font-semibold leading-tight tracking-tight',
    'heading-md': 'text-[24px] font-semibold leading-snug tracking-tight',
    'heading-sm': 'text-[20px] font-semibold leading-snug',
    'body-lg': 'text-[18px] font-normal leading-relaxed',
    body:      'text-[16px] font-normal leading-normal',
    'body-sm': 'text-[14px] font-normal leading-normal',
    caption:   'text-[12px] font-normal leading-tight tracking-widest',
    overline:  'text-[14px] font-medium leading-normal tracking-widest uppercase',
    cta:       'text-[18px] font-medium leading-normal tracking-tight',
  };
  return map[style];
}

/* ========================
   EXPORTS
   ======================== */

export default {
  font,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  typographyStyles,
  typographyToStyle,
  tailwindTypography,
};