/*
 * ToSom UI5 Tokens — Global Export
 * 
 * Denne fila eksporterer alle design-tokens fra prosjektet.
 */

import {
  color,
  spacing,
  radius,
  shadow,
  blur,
  glassVariant,
  typography,
  typographyStyles,
  typographyToStyle,
  type TypographyStyle,
} from '@/config/design-tokens';

export { color, spacing, radius, shadow, blur, glassVariant, typography, typographyStyles, typographyToStyle, type TypographyStyle } from '@/config/design-tokens';

// Legacy typography exports
export const font = typography.font;
export const fontSize = typography.fontSize;
export const fontWeight = typography.fontWeight;
export const lineHeight = typography.lineHeight;
export const letterSpacing = typography.letterSpacing;

/* ========================
   AGGREGATED TOKENS
   ======================== */

export const tokens = {
  color,
  spacing,
  radius,
  shadow,
  blur,
  typography,
};

export default tokens;