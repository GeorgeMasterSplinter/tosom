/**
 * ToSom Design System — Border Radii
 * 
 * Store, blide hjørne — aldri skarpe
 * Core-definition: Ro, varm, myk
 */

export const RADII = {
  sm: 8,    // Små input, badges
  md: 12,   // Buttons, kort
  lg: 16,   // Panel, glassmorphism
  xl: 20,   // Store kort, modaler
  full: 9999, // Pill, progress
} as const;

export const radiiClasses = {
  sm: "rounded-[8px]",
  md: "rounded-[12px]",
  lg: "rounded-[16px]",
  xl: "rounded-[20px]",
  full: "rounded-full",
} as const;