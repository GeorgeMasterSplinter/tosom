/**
 * ToSom — useConversationMood Hook (Premium v2026) 🟡⭐
 * Bestemmer noverande stemning ut ifrå meldingar + animasjonar.
 * 
 * Moodar:
 * - calm (standard, roleg bakgrunn)
 * - warm (intim samtale, >10 meldingar)
 * - deep (refleksjonsspørsmål, blå tonar)
 * - gentle (opptakt, dag 1–5, grønne akcentar)
 * - joyful (milestone/feiring, gull-glow)
 * 
 * Design:
 * - Animerte gradient-overgangar (CSS transition)
 * - Subtilt pulse-animasjon for bakgrunnen
 * - Glow-effekt som responsar på samtale-djupde
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
  animationKey?: string; // for CSS-transition-triggering
}

/* ═══════════════════════════════════════
   THEME TOKENS
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldDeep: "#C49F2F",
  goldMuted: "rgba(212,175,55,0.15)",
  goldSoft: "rgba(212,175,55,0.06)",
  blueDeep: "#0A1A2A",
  blueGlow: "rgba(70,120,180,0.2)",
  greenSoft: "rgba(77,255,136,0.15)",
  pinkSoft: "rgba(255,107,138,0.12)",
};

/* ═══════════════════════════════════════
   MOOD CONFIG MAPPING — Premium V2
   ═══════════════════════════════════════ */

const MOOD_CONFIGS: Record<ConversationMood, MoodConfig> = {
  calm: {
    mood: "calm",
    glowColor: G.gold,
    glowIntensity: 0.12,
    backgroundGradient: `radial-gradient(ellipse at 50% 30%, ${G.goldSoft} 0%, transparent 60%)`,
    tone: "Roleg og nøytral",
    animationKey: "calm-grad",
  },
  warm: {
    mood: "warm",
    glowColor: G.goldLight,
    glowIntensity: 0.25,
    backgroundGradient: `radial-gradient(ellipse at 40% 40%, rgba(232,199,102,0.08) 0%, transparent 55%)`,
    tone: "Varm og intim",
    animationKey: "warm-grad",
  },
  deep: {
    mood: "deep",
    glowColor: "rgba(70,120,180,0.6)",
    glowIntensity: 0.2,
    backgroundGradient: `radial-gradient(ellipse at 60% 50%, rgba(40,80,140,0.08) 0%, transparent 60%)`,
    tone: "Djup og refleksiv",
    animationKey: "deep-grad",
  },
  gentle: {
    mood: "gentle",
    glowColor: "rgba(77,255,136,0.4)",
    glowIntensity: 0.18,
    backgroundGradient: `radial-gradient(ellipse at 45% 35%, rgba(77,255,136,0.05) 0%, transparent 55%)`,
    tone: "Mjuk og forsiktig",
    animationKey: "gentle-grad",
  },
  joyful: {
    mood: "joyful",
    glowColor: G.goldLight,
    glowIntensity: 0.35,
    backgroundGradient: `radial-gradient(ellipse at 50% 40%, rgba(232,199,102,0.1) 0%, transparent 50%)`,
    tone: "Gleg og feirande",
    animationKey: "joyful-grad",
  },
};

/* ═══════════════════════════════════════
   MOOD-DETERMINASJON — Smart analyse
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
   MAIN HOOK — useConversationMood V2
   Med animasjons-key for transitionar
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

  // Legg til animasjons-key for transition-triggering
  const config = MOOD_CONFIGS[mood];
  
  return {
    ...config,
    animationKey: `${mood}-${messages.length}`,
  };
}

/* ═══════════════════════════════════════
   PREMIUM CSS — Animerte overgangar
   Bruk denne inline i ChatContainer eller layout.tsx
   ═══════════════════════════════════════ */

export function MoodAnimationStyles() {
  return (
    <style>{`
      /* Bakgrunnsgradient-overgang — mjuk animasjon */
      .mood-background {
        transition: background-image 1.5s ease-in-out, background-color 1.5s ease-in-out;
      }

      /* Subtil pulse for joyful mood */
      @keyframes mood-pulse-joyful {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.5; }
      }

      .mood-pulse-joyful {
        animation: mood-pulse-joyful 4s ease-in-out infinite;
      }

      /* Gentle boble — mjuk opning */
      @keyframes mood-gentle-bloom {
        0% { transform: scale(0.95); opacity: 0.7; }
        50% { transform: scale(1.02); opacity: 0.8; }
        100% { transform: scale(0.95); opacity: 0.7; }
      }

      .mood-pulse-gentle {
        animation: mood-gentle-bloom 6s ease-in-out infinite;
      }

      /* Deep rotate — langsom snurring */
      @keyframes mood-deep-rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .mood-pulse-deep {
        animation: mood-deep-rotate 30s linear infinite;
      }

      /* Warm shimmer — gull-shimmer effekt */
      @keyframes mood-warm-shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }

      .mood-pulse-warm {
        background-size: 200% 200%;
        animation: mood-warm-shimmer 8s ease-in-out infinite;
      }

      /* Calm breathe — roleg pusting */
      @keyframes mood-calm-breathe {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.01); }
      }

      .mood-pulse-calm {
        animation: mood-calm-breathe 5s ease-in-out infinite;
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════
   UTILITY — getMoodFromConversation
   ═══════════════════════════════════════ */

export function getMoodFromConversation(
  messages: MessageLike[],
  journeyDay?: number,
  hasMilestone?: boolean
): MoodConfig {
  const mood = determineMood(messages, journeyDay, hasMilestone);
  return {
    ...MOOD_CONFIGS[mood],
    animationKey: `${mood}-${messages.length}`,
  };
}

export default useConversationMood;