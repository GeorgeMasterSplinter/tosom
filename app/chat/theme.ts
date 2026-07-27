/**
 * ToSom Chat Theme (Premium Nordic Gold 2026) 🟡
 * Alle design-tokens for chat — konsistent med Settings/Onboarding
 */

export const chatTheme = {
  // Fargar
  colors: {
    tosomBlue: "#0B1520",
    tosomBlueLight: "#0F1A26",
    nordicGold: "#D4AF37",
    goldLight: "#E8C766",
    softWhite: "#F8F9FA",
    deepGrey: "#9CA3AF",
    whitePrimary: "#E5E7EB",
    glassBg: "rgba(255,255,255,0.04)",
    glassBorder: "rgba(255,255,255,0.1)",
    goldMuted: "rgba(212,175,55,0.2)",
    dangerRed: "#FF4D4D",
    greenPrimary: "#10B981",
    orangePrimary: "#F59E0B",
  },

  // Radius
  radius: {
    card: "20px",
    button: "16px",
    input: "20px",
    bubble: "16px",
  },

  // Spacing
  spacing: {
    pagePaddingY: "96px",
    containerMaxWidth: "720px",
    cardPadding: "32px",
    sectionGap: "32px",
    messageGap: "16px",
    headerPadding: "24px",
  },

  // Typografi
  typography: {
    h1Size: "42px",
    h1Weight: 600 as const,
    sectionTitleSize: "24px",
    sectionTitleWeight: 600 as const,
    bodyFontSize: "16px",
    microSize: "14px",
  },

  // Shadow
  shadow: {
    card: "0 8px 32px rgba(0,0,0,0.25)",
    bubble: "0 2px 8px rgba(0,0,0,0.15)",
    glow: "0 0 20px rgba(212,175,55,0.3)",
  },

  // Animasjonar
  animation: {
    fadeIn: "fadeIn 0.4s ease-out",
    slideUp: "slideUp 0.3s ease-out",
    bubblePop: "bubblePop 0.2s ease-out",
  },
} as const;

export type ChatTheme = typeof chatTheme;