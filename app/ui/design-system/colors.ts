/**
 * Tosom Design System — Farger
 * 
 * Nordic Gold Premium: mørk base, gullaksentar, glassmorphism
 * Core-definition: Ro, varm, moden
 */

export const COLORS = {
  // Base
  bgPrimary: "#0B0E11",
  bgSecondary: "#111418",
  surface: "rgba(255, 255, 255, 0.04)",
  border: "rgba(255, 255, 255, 0.08)",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.65)",
  textMuted: "rgba(255, 255, 255, 0.45)",

  // Accent
  gold: "#D4AF37",
  goldHover: "#E8C766",

  // State
  error: "#FF4D4D",
  success: "#4DFF88",
} as const;

// Tailwind utility classes for colors
export const colorClasses = {
  bgPrimary: "bg-[#0B0E11]",
  bgSecondary: "bg-[#111418]",
  textPrimary: "text-white",
  textSecondary: "text-white/65",
  textMuted: "text-white/45",
  gold: "text-[#D4AF37]",
  goldBg: "bg-[#D4AF37]",
  goldBorder: "border-[#D4AF37]",
  border: "border-white/10",
  glass: "bg-white/[0.04] border border-white/10",
  glassLight: "bg-white/[0.02] border border-white/8",
} as const;