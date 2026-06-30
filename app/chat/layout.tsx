/**
 * ToSom — Chat Layout (WarmFlow-integrasjon)
 * 
 * Opprettar WarmFlowContext som omslutter heile chat-seksjon.
 * Mood endrar seg basert på:
 *   - Journey-fase (EARLY, BUILDING_TRUST, DEEPER, CHECKIN)
 *   - Resonance-nivå
 *   - Tid på døgnet (20:00-02:00 = warm)
 * 
 * Bruk:
 *   - Bakgrunnsfarge endrar seg med mood
 *   - Header glød basert på mood.glow
 *   - Input glød basert på mood.accent
 *   - Meldingsbobler basert på mood.farge
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MOOD_COLORS, determineMood, MoodType, MoodColors } from '@/lib/warmFlow/warmFlow';

// ─── CONTEXT ──────────────────────

export interface WarmFlowContextType {
  currentMood: MoodType;
  colors: MoodColors;
  background: string;
  glow: string;
  accent: string;
  transitionMood: (mood: MoodType) => void;
}

export const WarmFlowContext = createContext<WarmFlowContextType>({
  currentMood: 'calm',
  colors: MOOD_COLORS.calm,
  background: MOOD_COLORS.calm.background,
  glow: MOOD_COLORS.calm.glow,
  accent: MOOD_COLORS.calm.accent,
  transitionMood: () => {},
});

export const useWarmFlow = () => useContext(WarmFlowContext);

// ─── PROVIDER ─────────────────────

interface ChatLayoutProps {
  children: ReactNode;
  phase?: string;
  resonanceScore?: number;
}

export default function ChatLayout({ children, phase = 'EARLY', resonanceScore = 50 }: ChatLayoutProps) {
  const [currentMood, setCurrentMood] = useState<MoodType>('calm');
  const [colors, setColors] = useState<MoodColors>(MOOD_COLORS.calm);

  // Berek mood basert på fase, resonans, og tid
  useEffect(() => {
    const newMood = calculateChatMood(phase, resonanceScore);
    setCurrentMood(newMood);
    setColors(MOOD_COLORS[newMood]);
  }, [phase, resonanceScore]);

  // Transition-funksjon
  const transitionMood = (mood: MoodType) => {
    setCurrentMood(mood);
    setColors(MOOD_COLORS[mood]);
  };

  // Dynamisk bakgrunn med gradient
  const background = `radial-gradient(ellipse at 50% 0%, ${colors.glow} 0%, ${colors.background} 60%)`;

  return (
    <WarmFlowContext.Provider
      value={{
        currentMood,
        colors,
        background,
        glow: colors.glow,
        accent: colors.accent,
        transitionMood,
      }}
    >
      <div
        className="w-full h-[100dvh] flex flex-col transition-all duration-1000 ease-in-out"
        style={{ background }}
      >
        {/* Header med glød */}
        <div
          style={{
            background: `${colors.background}f2`,
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${colors.glow}`,
            boxShadow: `0 4px 30px ${colors.glow}`,
          }}
        >
          {/* Header-innhald (frå chat/page.tsx) */}
        </div>

        {/* Barn (ChatRoom) */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>

        {/* Input med glød */}
        <div
          style={{
            borderTop: `1px solid ${colors.glow}`,
            boxShadow: `0 -4px 30px ${colors.glow}`,
          }}
        >
          {/* Input-innhald */}
        </div>
      </div>
    </WarmFlowContext.Provider>
  );
}

// ─── MOOD-BEREKNING ───────────────

function calculateChatMood(phase: string, resonanceScore: number): MoodType {
  const hour = new Date().getHours();
  const isNightTime = hour >= 20 || hour <= 2;

  // Milestone (høg resonans + tidleg fase)
  if (resonanceScore >= 85 && (phase === 'EARLY' || phase === 'BUILDING_TRUST')) {
    return 'celebratory';
  }

  // Dyp samtale
  if (phase === 'DEEPER' && resonanceScore >= 60) {
    return 'deep';
  }

  // Varm kveldstemning
  if (isNightTime && resonanceScore >= 50) {
    return 'warm';
  }

  // Tidleg i reisa
  if (phase === 'EARLY') {
    return resonanceScore >= 70 ? 'warm' : 'gentle';
  }

  // Build trust
  if (phase === 'BUILDING_TRUST') {
    return resonanceScore >= 65 ? 'warm' : 'calm';
  }

  // Standard
  return 'calm';
}

export { MOOD_COLORS, determineMood, type MoodType, type MoodColors };