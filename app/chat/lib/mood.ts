/**
 * Tosom — Mood Theme Module
 * Éin kjelde for alle mood-tema i chatten.
 * Hver mood har fullt tema: container-bg, boblar, input, aksenter.
 */

export type MoodId = "calm" | "warm" | "deep" | "gentle" | "joyful" | "romantic" | "cozy" | "dreamy" | "playful" | "cotton" | "flammus" | "sage";

export interface MoodTheme {
  id: MoodId;
  name: string;
  emoji: string;

  /** Dominant bakgrunn for heile chat-rommet */
  containerBg: string;

  /** Boble for "me" (eigne meldingar) */
  bubbleMeStart: string;
  bubbleMeEnd: string;
  bubbleMeBorder: string;
  bubbleMeGlow: string;

  /** Boble for partner */
  bubblePartnerBg: string;
  bubblePartnerBorder: string;

  /** Chat input */
  inputBorder: string;
  inputGlow: string;
  inputFocusBg: string;

  /** Aksentfarge (header, send-knapp, scrollbar, ring) */
  accent: string;
  accentLight: string;
  accentMuted: string;
  accentSoft: string;
  accentGlow: string;

  /** Send-knapp gradient */
  sendBtnStart: string;
  sendBtnEnd: string;

  /** Typing-indikator */
  typingBg: string;
  typingDot: string;

  /** Tekstfarger (tilpasset lys/mørk bakgrunn) */
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
}

export const moodOrder: MoodId[] = ["calm", "warm", "deep", "gentle", "joyful", "romantic", "cozy", "dreamy", "playful", "cotton", "flammus", "sage"];

export const moodThemes: Record<MoodId, MoodTheme> = {
  calm: {
    id: "calm",
    name: "Calm",
    emoji: "🌊",
    containerBg: "radial-gradient(ellipse at 50% 20%, rgba(30,64,175,0.25) 0%, rgba(15,26,46,0.95) 55%), linear-gradient(180deg, #0B1520 0%, #0A1428 100%)",
    bubbleMeStart: "rgba(30,64,175,0.35)",
    bubbleMeEnd: "rgba(59,130,246,0.12)",
    bubbleMeBorder: "rgba(59,130,246,0.4)",
    bubbleMeGlow: "rgba(59,130,246,0.2)",
    bubblePartnerBg: "rgba(15,23,42,0.6)",
    bubblePartnerBorder: "rgba(59,130,246,0.15)",
    inputBorder: "rgba(59,130,246,0.3)",
    inputGlow: "rgba(59,130,246,0.15)",
    inputFocusBg: "rgba(30,64,175,0.08)",
    accent: "#3B82F6",
    accentLight: "#60A5FA",
    accentMuted: "rgba(59,130,246,0.25)",
    accentSoft: "rgba(59,130,246,0.08)",
    accentGlow: "rgba(59,130,246,0.35)",
    sendBtnStart: "#3B82F6",
    sendBtnEnd: "#60A5FA",
    typingBg: "rgba(30,64,175,0.2)",
    typingDot: "rgba(96,165,250,0.7)",
    textPrimary: "rgba(255,255,255,0.95)",
    textSecondary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.4)",
  },

  warm: {
    id: "warm",
    name: "Warm",
    emoji: "☀️",
    containerBg: "radial-gradient(ellipse at 50% 20%, rgba(212,175,55,0.18) 0%, rgba(15,26,38,0.95) 55%), linear-gradient(180deg, #0B1520 0%, #121A1A 100%)",
    bubbleMeStart: "rgba(212,175,55,0.25)",
    bubbleMeEnd: "rgba(212,175,55,0.08)",
    bubbleMeBorder: "rgba(212,175,55,0.4)",
    bubbleMeGlow: "rgba(212,175,55,0.2)",
    bubblePartnerBg: "rgba(255,255,255,0.04)",
    bubblePartnerBorder: "rgba(212,175,55,0.15)",
    inputBorder: "rgba(212,175,55,0.3)",
    inputGlow: "rgba(212,175,55,0.15)",
    inputFocusBg: "rgba(212,175,55,0.06)",
    accent: "#D4AF37",
    accentLight: "#E8C766",
    accentMuted: "rgba(212,175,55,0.25)",
    accentSoft: "rgba(212,175,55,0.08)",
    accentGlow: "rgba(212,175,55,0.35)",
    sendBtnStart: "#D4AF37",
    sendBtnEnd: "#E8C766",
    typingBg: "rgba(212,175,55,0.1)",
    typingDot: "rgba(212,175,55,0.7)",
    textPrimary: "rgba(255,255,255,0.95)",
    textSecondary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.4)",
  },

  deep: {
    id: "deep",
    name: "Deep",
    emoji: "🔮",
    containerBg: "radial-gradient(ellipse at 50% 20%, rgba(88,28,135,0.3) 0%, rgba(15,10,30,0.95) 55%), linear-gradient(180deg, #0B0F1E 0%, #120A28 100%)",
    bubbleMeStart: "rgba(88,28,135,0.35)",
    bubbleMeEnd: "rgba(139,92,246,0.12)",
    bubbleMeBorder: "rgba(139,92,246,0.4)",
    bubbleMeGlow: "rgba(139,92,246,0.2)",
    bubblePartnerBg: "rgba(20,10,40,0.6)",
    bubblePartnerBorder: "rgba(139,92,246,0.15)",
    inputBorder: "rgba(139,92,246,0.3)",
    inputGlow: "rgba(139,92,246,0.15)",
    inputFocusBg: "rgba(88,28,135,0.08)",
    accent: "#8B5CF6",
    accentLight: "#A78BFA",
    accentMuted: "rgba(139,92,246,0.25)",
    accentSoft: "rgba(139,92,246,0.08)",
    accentGlow: "rgba(139,92,246,0.35)",
    sendBtnStart: "#8B5CF6",
    sendBtnEnd: "#A78BFA",
    typingBg: "rgba(88,28,135,0.2)",
    typingDot: "rgba(167,139,250,0.7)",
    textPrimary: "rgba(255,255,255,0.95)",
    textSecondary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.4)",
  },

  gentle: {
    id: "gentle",
    name: "Gentle",
    emoji: "🌿",
    containerBg: "radial-gradient(ellipse at 50% 20%, rgba(16,185,129,0.2) 0%, rgba(8,20,16,0.95) 55%), linear-gradient(180deg, #0A1510 0%, #0B1A14 100%)",
    bubbleMeStart: "rgba(16,185,129,0.25)",
    bubbleMeEnd: "rgba(52,211,153,0.08)",
    bubbleMeBorder: "rgba(16,185,129,0.4)",
    bubbleMeGlow: "rgba(16,185,129,0.2)",
    bubblePartnerBg: "rgba(10,25,20,0.6)",
    bubblePartnerBorder: "rgba(16,185,129,0.15)",
    inputBorder: "rgba(16,185,129,0.3)",
    inputGlow: "rgba(16,185,129,0.15)",
    inputFocusBg: "rgba(16,185,129,0.06)",
    accent: "#10B981",
    accentLight: "#34D399",
    accentMuted: "rgba(16,185,129,0.25)",
    accentSoft: "rgba(16,185,129,0.08)",
    accentGlow: "rgba(16,185,129,0.35)",
    sendBtnStart: "#10B981",
    sendBtnEnd: "#34D399",
    typingBg: "rgba(16,185,129,0.1)",
    typingDot: "rgba(52,211,153,0.7)",
    textPrimary: "rgba(255,255,255,0.95)",
    textSecondary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.4)",
  },

  joyful: {
    id: "joyful",
    name: "Joyful",
    emoji: "✨",
    containerBg: "radial-gradient(ellipse at 50% 20%, rgba(245,158,11,0.2) 0%, rgba(20,15,5,0.95) 55%), linear-gradient(180deg, #151008 0%, #1A1408 100%)",
    bubbleMeStart: "rgba(245,158,11,0.25)",
    bubbleMeEnd: "rgba(251,191,36,0.08)",
    bubbleMeBorder: "rgba(245,158,11,0.4)",
    bubbleMeGlow: "rgba(245,158,11,0.2)",
    bubblePartnerBg: "rgba(25,20,5,0.6)",
    bubblePartnerBorder: "rgba(245,158,11,0.15)",
    inputBorder: "rgba(245,158,11,0.3)",
    inputGlow: "rgba(245,158,11,0.15)",
    inputFocusBg: "rgba(245,158,11,0.06)",
    accent: "#F59E0B",
    accentLight: "#FBBF24",
    accentMuted: "rgba(245,158,11,0.25)",
    accentSoft: "rgba(245,158,11,0.08)",
    accentGlow: "rgba(245,158,11,0.35)",
    sendBtnStart: "#F59E0B",
    sendBtnEnd: "#FBBF24",
    typingBg: "rgba(245,158,11,0.1)",
    typingDot: "rgba(251,191,36,0.7)",
    textPrimary: "rgba(255,255,255,0.95)",
    textSecondary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.4)",
  },

  romantic: {
    id: "romantic",
    name: "Romantic",
    emoji: "🌹",
    containerBg: "radial-gradient(ellipse at 50% 20%, rgba(244,63,94,0.2) 0%, rgba(20,8,12,0.95) 55%), linear-gradient(180deg, #150A0E 0%, #1A0C10 100%)",
    bubbleMeStart: "rgba(244,63,94,0.25)",
    bubbleMeEnd: "rgba(251,113,133,0.08)",
    bubbleMeBorder: "rgba(244,63,94,0.4)",
    bubbleMeGlow: "rgba(244,63,94,0.2)",
    bubblePartnerBg: "rgba(25,8,12,0.6)",
    bubblePartnerBorder: "rgba(244,63,94,0.15)",
    inputBorder: "rgba(244,63,94,0.3)",
    inputGlow: "rgba(244,63,94,0.15)",
    inputFocusBg: "rgba(244,63,94,0.06)",
    accent: "#F43F5E",
    accentLight: "#FB7185",
    accentMuted: "rgba(244,63,94,0.25)",
    accentSoft: "rgba(244,63,94,0.08)",
    accentGlow: "rgba(244,63,94,0.35)",
    sendBtnStart: "#F43F5E",
    sendBtnEnd: "#FB7185",
    typingBg: "rgba(244,63,94,0.1)",
    typingDot: "rgba(251,113,133,0.7)",
    textPrimary: "rgba(255,255,255,0.95)",
    textSecondary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.4)",
  },

  cozy: {
    id: "cozy",
    name: "Cozy",
    emoji: "🕯️",
    containerBg: "radial-gradient(ellipse at 50% 20%, rgba(194,87,11,0.2) 0%, rgba(18,10,4,0.95) 55%), linear-gradient(180deg, #120C06 0%, #16100A 100%)",
    bubbleMeStart: "rgba(194,87,11,0.25)",
    bubbleMeEnd: "rgba(224,122,47,0.08)",
    bubbleMeBorder: "rgba(194,87,11,0.4)",
    bubbleMeGlow: "rgba(194,87,11,0.2)",
    bubblePartnerBg: "rgba(22,12,4,0.6)",
    bubblePartnerBorder: "rgba(194,87,11,0.15)",
    inputBorder: "rgba(194,87,11,0.3)",
    inputGlow: "rgba(194,87,11,0.15)",
    inputFocusBg: "rgba(194,87,11,0.06)",
    accent: "#C2570B",
    accentLight: "#E07A2F",
    accentMuted: "rgba(194,87,11,0.25)",
    accentSoft: "rgba(194,87,11,0.08)",
    accentGlow: "rgba(194,87,11,0.35)",
    sendBtnStart: "#C2570B",
    sendBtnEnd: "#E07A2F",
    typingBg: "rgba(194,87,11,0.1)",
    typingDot: "rgba(224,122,47,0.7)",
    textPrimary: "rgba(255,255,255,0.95)",
    textSecondary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.4)",
  },

  dreamy: {
    id: "dreamy",
    name: "Dreamy",
    emoji: "🌙",
    containerBg: "radial-gradient(ellipse at 50% 20%, rgba(147,163,248,0.2) 0%, rgba(12,14,28,0.95) 55%), linear-gradient(180deg, #0A0C18 0%, #0E1020 100%)",
    bubbleMeStart: "rgba(147,163,248,0.25)",
    bubbleMeEnd: "rgba(179,191,248,0.08)",
    bubbleMeBorder: "rgba(147,163,248,0.4)",
    bubbleMeGlow: "rgba(147,163,248,0.2)",
    bubblePartnerBg: "rgba(12,14,28,0.6)",
    bubblePartnerBorder: "rgba(147,163,248,0.15)",
    inputBorder: "rgba(147,163,248,0.3)",
    inputGlow: "rgba(147,163,248,0.15)",
    inputFocusBg: "rgba(147,163,248,0.06)",
    accent: "#93A3F8",
    accentLight: "#B3BFF8",
    accentMuted: "rgba(147,163,248,0.25)",
    accentSoft: "rgba(147,163,248,0.08)",
    accentGlow: "rgba(147,163,248,0.35)",
    sendBtnStart: "#93A3F8",
    sendBtnEnd: "#B3BFF8",
    typingBg: "rgba(147,163,248,0.1)",
    typingDot: "rgba(179,191,248,0.7)",
    textPrimary: "rgba(255,255,255,0.95)",
    textSecondary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.4)",
  },

  playful: {
    id: "playful",
    name: "Playful",
    emoji: "🎯",
    containerBg: "radial-gradient(ellipse at 50% 20%, rgba(6,182,212,0.2) 0%, rgba(4,18,22,0.95) 55%), linear-gradient(180deg, #060E10 0%, #0A1214 100%)",
    bubbleMeStart: "rgba(6,182,212,0.25)",
    bubbleMeEnd: "rgba(34,211,238,0.08)",
    bubbleMeBorder: "rgba(6,182,212,0.4)",
    bubbleMeGlow: "rgba(6,182,212,0.2)",
    bubblePartnerBg: "rgba(4,18,22,0.6)",
    bubblePartnerBorder: "rgba(6,182,212,0.15)",
    inputBorder: "rgba(6,182,212,0.3)",
    inputGlow: "rgba(6,182,212,0.15)",
    inputFocusBg: "rgba(6,182,212,0.06)",
    accent: "#06B6D4",
    accentLight: "#22D3EE",
    accentMuted: "rgba(6,182,212,0.25)",
    accentSoft: "rgba(6,182,212,0.08)",
    accentGlow: "rgba(6,182,212,0.35)",
    sendBtnStart: "#06B6D4",
    sendBtnEnd: "#22D3EE",
    typingBg: "rgba(6,182,212,0.1)",
    typingDot: "rgba(34,211,238,0.7)",
    textPrimary: "rgba(255,255,255,0.95)",
    textSecondary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.4)",
  },

  cotton: {
    id: "cotton",
    name: "Cotton",
    emoji: "☁️",
    containerBg: "linear-gradient(180deg, #F8F6F2 0%, #F0EDE8 100%)",
    bubbleMeStart: "rgba(255,255,255,0.85)",
    bubbleMeEnd: "rgba(255,255,255,0.65)",
    bubbleMeBorder: "rgba(0,0,0,0.08)",
    bubbleMeGlow: "rgba(0,0,0,0.04)",
    bubblePartnerBg: "rgba(255,255,255,0.55)",
    bubblePartnerBorder: "rgba(0,0,0,0.06)",
    inputBorder: "rgba(0,0,0,0.1)",
    inputGlow: "rgba(0,0,0,0.04)",
    inputFocusBg: "rgba(255,255,255,0.7)",
    accent: "#8C8278",
    accentLight: "#A69B90",
    accentMuted: "rgba(140,130,120,0.3)",
    accentSoft: "rgba(140,130,120,0.08)",
    accentGlow: "rgba(140,130,120,0.15)",
    sendBtnStart: "#8C8278",
    sendBtnEnd: "#A69B90",
    typingBg: "rgba(140,130,120,0.1)",
    typingDot: "rgba(140,130,120,0.6)",
    textPrimary: "rgba(26,26,36,0.92)",
    textSecondary: "rgba(26,26,36,0.55)",
    textMuted: "rgba(26,26,36,0.35)",
  },

  flammus: {
    id: "flammus",
    name: "Flammus",
    emoji: "🖤",
    containerBg: "linear-gradient(180deg, #000000 0%, #0A0A0A 100%)",
    bubbleMeStart: "rgba(255,255,255,0.12)",
    bubbleMeEnd: "rgba(255,255,255,0.04)",
    bubbleMeBorder: "rgba(255,255,255,0.15)",
    bubbleMeGlow: "rgba(255,255,255,0.06)",
    bubblePartnerBg: "rgba(255,255,255,0.06)",
    bubblePartnerBorder: "rgba(255,255,255,0.08)",
    inputBorder: "rgba(255,255,255,0.12)",
    inputGlow: "rgba(255,255,255,0.05)",
    inputFocusBg: "rgba(255,255,255,0.03)",
    accent: "#8A8A8A",
    accentLight: "#B0B0B0",
    accentMuted: "rgba(138,138,138,0.3)",
    accentSoft: "rgba(138,138,138,0.08)",
    accentGlow: "rgba(138,138,138,0.2)",
    sendBtnStart: "#8A8A8A",
    sendBtnEnd: "#B0B0B0",
    typingBg: "rgba(138,138,138,0.1)",
    typingDot: "rgba(176,176,176,0.6)",
    textPrimary: "rgba(255,255,255,0.92)",
    textSecondary: "rgba(255,255,255,0.55)",
    textMuted: "rgba(255,255,255,0.3)",
  },

  sage: {
    id: "sage",
    name: "Sage",
    emoji: "🌾",
    containerBg: "radial-gradient(ellipse at 50% 20%, rgba(120,140,120,0.15) 0%, rgba(10,14,10,0.95) 55%), linear-gradient(180deg, #0C120C 0%, #0F160F 100%)",
    bubbleMeStart: "rgba(120,140,120,0.25)",
    bubbleMeEnd: "rgba(160,180,155,0.08)",
    bubbleMeBorder: "rgba(140,160,140,0.35)",
    bubbleMeGlow: "rgba(140,160,140,0.15)",
    bubblePartnerBg: "rgba(12,20,12,0.6)",
    bubblePartnerBorder: "rgba(140,160,140,0.12)",
    inputBorder: "rgba(140,160,140,0.3)",
    inputGlow: "rgba(140,160,140,0.1)",
    inputFocusBg: "rgba(120,140,120,0.06)",
    accent: "#8FA68F",
    accentLight: "#A8C4A0",
    accentMuted: "rgba(143,166,143,0.25)",
    accentSoft: "rgba(143,166,143,0.08)",
    accentGlow: "rgba(143,166,143,0.3)",
    sendBtnStart: "#8FA68F",
    sendBtnEnd: "#A8C4A0",
    typingBg: "rgba(120,140,120,0.1)",
    typingDot: "rgba(168,196,160,0.6)",
    textPrimary: "rgba(255,255,255,0.95)",
    textSecondary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.4)",
  },
};

export function getMoodTheme(id: MoodId): MoodTheme {
  return moodThemes[id] || moodThemes.warm;
}

/** Valid mood IDs for storage validation */
export const VALID_MOODS = new Set<MoodId>(moodOrder);

/** Default mood */
export const DEFAULT_MOOD: MoodId = "warm";