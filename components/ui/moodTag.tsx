/**
 * ToSom 5.0 — Mood Tag
 *
 * Display and visualise current mood with color, emoji, and animated glow.
 *
 * Usage:
 *   import { MoodTag, type Mood } from '@/components/ui'
 *   <MoodTag mood="warm" showDetail />
 */

import React from 'react';
import { moodPalettes, type Mood } from './emotionTypes';

/* ── Props ── */
export interface MoodTagProps {
  mood: Mood;
  confidence?: number;
  showDetail?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

/* ── Mood Display Sizes ── */
const sizeStyles = {
  sm: { emoji: 'text-lg', text: 'text-xs', badge: 'px-2 py-1' },
  md: { emoji: 'text-2xl', text: 'text-sm', badge: 'px-3 py-1.5' },
  lg: { emoji: 'text-4xl', text: 'text-base', badge: 'px-5 py-3' },
};

/* ── Glow Orb ── */
const GlowOrb: React.FC<{ color: string; size?: number; animated?: boolean }> = ({
  color, size = 64, animated = true,
}) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div
      className={`absolute rounded-full opacity-15 blur-2xl`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        ...(animated ? { animation: 'pulse 3s ease-in-out infinite' } : {}),
      }}
    />
  </div>
);

/* ── MoodTag ── */
const MoodTag: React.FC<MoodTagProps> = ({
  mood,
  confidence = 0,
  showDetail = false,
  size = 'md',
  animated = true,
  className = '',
}) => {
  const palette = moodPalettes[mood];
  const styles = sizeStyles[size];

  return (
    <div className={`relative ${styles.badge} ${className}`}>
      <GlowOrb color={palette.color} size={size === 'lg' ? 120 : size === 'md' ? 80 : 56} animated={animated} />
      <div className="relative flex items-center gap-2 bg-white/[0.04] border border-white/8 backdrop-blur-xl rounded-xl px-4 py-3">
        <span className={styles.emoji}>{palette.emoji}</span>
        <div className="flex flex-col">
          <span className="text-white font-medium">{palette.label}</span>
          {showDetail && (
            <>
              <span className="text-white/40 text-xs">{palette.desc}</span>
              {confidence > 0 && (
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="h-1 w-12 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${confidence}%`, backgroundColor: palette.color }}
                    />
                  </div>
                  <span className="text-white/30 text-xs">{confidence}%</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Mood Grid ── */
export interface MoodGridProps {
  currentMood: Mood;
  onSelect?: (mood: Mood) => void;
  size?: 'sm' | 'md';
  className?: string;
}

const MoodGrid: React.FC<MoodGridProps> = ({
  currentMood,
  onSelect,
  size = 'md',
  className = '',
}) => {
  const allMoods: Mood[] = ['calm', 'excited', 'curious', 'romantic', 'stressed', 'unsure', 'distant', 'warm', 'playful', 'reflective', 'hopeful', 'connected'];

  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-white font-semibold text-sm mb-3">Hvordan føler du deg?</h3>
      <div className="grid grid-cols-4 gap-2">
        {allMoods.map((m) => {
          const p = moodPalettes[m];
          const isActive = m === currentMood;
          return (
            <button
              key={m}
              onClick={() => onSelect?.(m)}
              className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                isActive ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/5 bg-white/[0.02] hover:border-white/10'
              }`}
            >
              <GlowOrb color={p.color} size={size === 'sm' ? 40 : 56} animated={false} />
              <span className={`relative z-10 ${size === 'sm' ? 'text-xl' : 'text-2xl'}`}>{p.emoji}</span>
              <span className={`relative z-10 text-white/60 text-xs`}>{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ── Mood History ── */
export interface MoodHistoryProps {
  moods: { mood: Mood; timestamp: number }[];
  className?: string;
}

const MoodHistory: React.FC<MoodHistoryProps> = ({ moods, className = '' }) => {
  if (moods.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <span className="text-white/30 text-sm">Ingen stemninger registrert ennå</span>
      </div>
    );
  }

  const recent = moods.slice(-7);

  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-white font-semibold text-sm mb-3">Siste stemninger</h3>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        {recent.map((m, i) => {
          const p = moodPalettes[m.mood];
          const date = new Date(m.timestamp);
          return (
            <div key={i} className="flex flex-col items-center gap-0.5 min-w-[40px]">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/5">
                <span className="text-base">{p.emoji}</span>
              </div>
              <span className="text-white/30 text-[10px]">{date.getHours().toString().padStart(2, '0')}:{date.getMinutes().toString().padStart(2, '0')}</span>
            </div>
          );
        })}
        <div className="w-8 h-8 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center ml-1">
          <span className="text-white/20 text-lg">+</span>
        </div>
      </div>
    </div>
  );
};

/* ── Mood in Chat (ChatBubble integration) ── */
export interface ChatMoodBadgeProps {
  mood: Mood;
  className?: string;
}

const ChatMoodBadge: React.FC<ChatMoodBadgeProps> = ({ mood, className = '' }) => {
  const p = moodPalettes[mood];
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/5 ${className}`}>
      <span className="text-xs">{p.emoji}</span>
      <span className="text-white/40 text-[10px]">{p.label}</span>
    </div>
  );
};

export { MoodTag, MoodGrid, MoodHistory, ChatMoodBadge };
export default MoodTag;