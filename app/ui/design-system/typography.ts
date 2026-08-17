/**
 * Tosom Design System — Typografi
 * 
 * Font: Inter (system fallback)
 * Core-definition: Rolig, lessel, moden
 */

export const TYPOGRAPHY = {
  // Title sizes (px / weight)
  titleXL: { size: 32, weight: 600 as const },
  titleL: { size: 24, weight: 600 as const },
  titleM: { size: 20, weight: 600 as const },
  titleS: { size: 16, weight: 600 as const },
  body: { size: 16, weight: 400 as const },
  small: { size: 14, weight: 400 as const },
  xs: { size: 12, weight: 400 as const },
} as const;

export const typographyClasses = {
  titleXL: "text-[32px] font-semibold leading-tight",
  titleL: "text-[24px] font-semibold leading-snug",
  titleM: "text-[20px] font-semibold leading-snug",
  titleS: "text-[16px] font-semibold leading-normal",
  body: "text-[16px] font-normal leading-relaxed",
  small: "text-[14px] font-normal leading-relaxed",
  xs: "text-[12px] font-normal leading-normal",
} as const;