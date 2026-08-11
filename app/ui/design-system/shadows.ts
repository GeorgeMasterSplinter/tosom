/**
 * ToSom Design System — Shadows
 * 
 * Mjuka, ikke-aggressive skyggar
 * Core-definition: Ro, varm, trygg
 */

export const SHADOWS = {
  sm: "0 2px 8px rgba(0,0,0,0.3)",
  md: "0 4px 16px rgba(0,0,0,0.4)",
  lg: "0 8px 32px rgba(0,0,0,0.5)",
  gold: "0 4px 20px rgba(212,175,55,0.2)",
  none: "none",
} as const;

export const shadowClasses = {
  sm: "shadow-[0_2px_8px_rgba(0,0,0,0.3)]",
  md: "shadow-[0_4px_16px_rgba(0,0,0,0.4)]",
  lg: "shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
  gold: "shadow-[0_4px_20px_rgba(212,175,55,0.2)]",
} as const;