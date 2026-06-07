/** ToSom-typografi
 *  BR3 — Definer typografi */

export const brandTypography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

  title: 'text-xl font-semibold tracking-tight',
  subtitle: 'text-base text-gray-600',
  body: 'text-[15px] leading-relaxed',

  heading1: 'text-3xl font-semibold tracking-tight',
  heading2: 'text-2xl font-semibold tracking-tight',
  heading3: 'text-xl font-semibold tracking-tight',
  heading4: 'text-lg font-semibold',

  bodyLarge: 'text-[15px] leading-relaxed',
  bodyMedium: 'text-sm leading-relaxed',
  bodySmall: 'text-xs leading-relaxed',

  caption: 'text-xs text-gray-500',
  overline: 'text-[11px] uppercase tracking-wider font-medium text-gray-500',
} as const;

export const brandTypographyNames = Object.keys(brandTypography) as (keyof typeof brandTypography)[];
