/**
 * ToSom Design Theme
 * 
 * Unified theme object — imports all tokens, exports a single theme for components.
 */

import { spacing, radius, blur, typography, motion, colors, shadows, tokens } from './tokens';

export { spacing, radius, blur, typography, motion, colors, shadows, tokens };

/**
 * Theme object — use in components via:
 *   import { theme } from '@/design/theme';
 */
export const theme = {
  spacing,
  radius,
  blur,
  typography,
  motion,
  colors,
  shadows,
};

export default theme;