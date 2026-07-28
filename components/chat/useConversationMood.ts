/**
 * ToSom — useConversationMood Hook
 * Bestemmer noverande stemning ut ifrå meldingar.
 * 
 * Moodar:
 * - calm (standard)
 * - warm (intim samtale, >10 meldingar)
 * - deep (refleksjonsspørsmål)
 * - gentle (opptakt, dag 1–5)
 * - joyful (milestone/markedering)
 */

import { useMemo } from "react";

/* ═══════════════════════════════════════
   TYPES
   ═══════════════════════════════════════ */

export type ConversationMood = "calm" | "warm" | "deep" | "gentle" | "joyful";

export interface MoodConfig {
  mood: ConversationMood;
  glowColor: string;
  glowIntensity: number; // 0–1
  backgroundGradient: string;
  tone: string; // mikrocopy-tone
}

/* ═══════════════════════════════════════
   THEME TOKENS
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldMuted: "rgba(212,175,55,0.15)",
  blueDeep: "#0A1A2A",
  blueGlow: "rgba(70,120,180,0.2)",
  greenSoft: "rgba(77,255,136,0.15)",
};

/* ═══════════════════════════════════════
   MOOD CONFIG MAPPING
   ═══════════════════════════════════════ */

const MOOD_CONFIGS: Record<ConversationMood, MoodConfig> = {
  calm: {
    mood: "calm",
    glowColor: G.gold,
    glowIntensity: 0.15,
    backgroundGradient: "radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.03) 0%, transparent 60%)",
    tone: "Roleg og nøytral",
  },
  warm: {
    mood: "warm",
    glowColor: G.goldLight,
    glowIntensity: 0.25,
    backgroundGradient: "radial-gradient(ellipse at 40% 40%, rgba(232,199,102,0.06) 0%, transparent 55%)",
    tone: "Varm og intim",
  },
  deep: {
    mood: "deep",
    glowColor: "rgba(70,120,180,0.6)",
    glowIntensity: 0.2,
    backgroundGradient: "radial-gradient(ellipse at 60% 50%, rgba(40,80,140,0.06) 0%, transparent 60%)",
    tone: "Djup og refleksiv",
  },
  gentle: {
    mood: "gentle",
    glowColor: "rgba(77,255,136,0.5)",
    glowIntensity: 0.2,
    backgroundGradient: "radial-gradient(ellipse at 45% 35%, rgba(77,255,136,0.04) 0%, transparent 55%)",
    tone: "Mjuk og forsiktig",
  },
  joyful: {
    mood: "joyful",
    glowColor: G.goldLight,
    glowIntensity: 0.3,
    backgroundGradient: "radial-gradient(ellipse at 50% 40%, rgba(232,199,102,0.08) 0%, transparent 50%)",
    tone: "Gleg og feirande",
  },
};

/* ═══════════════════════════════════════
   MOOD-DETERMINASJON
   ═══════════════════════════════════════ */

interface MessageLike {
  type?: string;
  content?: string;
}

export function determineMood(
  messages: MessageLike[],
  journeyDay?: number,
  hasMilestone?: boolean
): ConversationMood {
  // Joyful: milestone-markering
  if (hasMilestone) return "joyful";

  const totalMessages = messages.length;

  // Gentle: opptak (dag 1–5 og få meldingar)
  if (journeyDay !== undefined && journeyDay <= 5 && totalMessages < 8) {
    return "gentle";
  }

  // Deep: refleksjonsspørsmål i innhald
  const hasReflection = messages.some(
    (m) => m.type === "task" || (m.content?.includes("?") && m.content?.length > 40)
  );
  if (hasReflection) return "deep";

  // Warm: lang samtale (>10 meldingar)
  if (totalMessages > 10) return "warm";

  // Calm: standard
  return "calm";
}

/* ═══════════════════════════════════════
   MAIN HOOK — useConversationMood
   ═══════════════════════════════════════ */

export function useConversationMood(
  messages: MessageLike[],
  options?: {
    journeyDay?: number;
    hasMilestone?: boolean;
  }
): MoodConfig {
  const mood = useMemo(() => {
    return determineMood(messages, options?.journeyDay, options?.hasMilestone);
  }, [messages, options?.journeyDay, options?.hasMilestone]);

  return MOOD_CONFIGS[mood];
}

/* ═══════════════════════════════════════
   UTILITY — getMoodFromConversation (for ekstern bruk)
   ═══════════════════════════════════════ */

export function getMoodFromConversation(
  messages: MessageLike[],
  journeyDay?: number,
  hasMilestone?: boolean
): MoodConfig {
  const mood = determineMood(messages, journeyDay, hasMilestone);
  return MOOD_CONFIGS[mood];
}

export default useConversationMood;