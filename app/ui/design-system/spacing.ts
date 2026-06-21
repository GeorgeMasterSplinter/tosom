/**
 * ToSom Design System — Spacing
 * 
 * Konsistent mellomrom: XS → XL
 * Core-definition: Ro, luftig, ikkje-overfylt
 */

export const SPACING = {
  xs: 4,    // 4px
  s: 8,     // 8px
  m: 16,    // 16px
  l: 24,    // 24px
  xl: 32,   // 32px
  xxl: 48,  // 48px
  xxxl: 64, // 64px
} as const;

// Tailwind utility classes for spacing
export const spacingClasses = {
  xs: "gap-[4px]",
  s: "gap-[8px]",
  m: "gap-[16px]",
  l: "gap-[24px]",
  xl: "gap-[32px]",
  pxS: "px-[8px]",
  pxM: "px-[16px]",
  pxL: "px-[24px]",
  pyS: "py-[8px]",
  pyM: "py-[16px]",
  pyL: "py-[24px]",
  pS: "p-[8px]",
  pM: "p-[16px]",
  pL: "p-[24px]",
} as const;