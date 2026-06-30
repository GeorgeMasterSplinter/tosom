/**
 * ToSom 5.0 — Emotion-Aware Templates 5.0
 *
 * Updated ChatTemplate, CoupleTemplate, JourneyTemplate with emotional intelligence layers.
 * Integrates: ToneMeter, MoodTag, EmotionalSuggestions, RelationshipHealth, etc.
 *
 * Usage:
 *   import { ChatTemplate5, CoupleTemplate5, JourneyTemplate5 } from '@/components/ui'
 */

import React, { useState } from 'react';
import type {
  Mood, HealthSignal, EmotionalSuggestion, ToneSignal, MemoryHighlight,
} from './emotionTypes';
import { moodPalettes } from './emotionTypes';

/* ── Props ── */
export interface ChatTemplate5Props {
  mood?: Mood;
  moodHistory?: { mood: Mood; timestamp: number }[];
  suggestions?: EmotionalSuggestion[];
  onSuggestionSelect?: (s: EmotionalSuggestion) => void;
  className?: string;
}

export interface CoupleTemplate5Props {
  healthSignals: HealthSignal[];
  mood?: Mood;
  className?: string;
}

export interface JourneyTemplate5Props {
  mood?: Mood;
  memories?: MemoryHighlight[];
  className?: string;
}

/* ── GlowEffect ── */
const GlowEffect: React.FC<{ color?: string; className?: string }> = ({ color = '#D4AF37', className = '' }) => (
  <div className={`absolute inset-0 pointer-events-none ${className}`}>
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl"
      style={{ backgroundColor: color }}
    />
  </div>
);

/* ── ChatTemplate5 ── */
export const ChatTemplate5: React.FC<ChatTemplate5Props> = ({
  mood = 'warm',
  moodHistory = [],
  suggestions = [],
  onSuggestionSelect,
  className = '',
}) => {
  const palette = moodPalettes[mood];

  return (
    <div className={`relative w-full min-h-screen bg-[#0B0E11] overflow-hidden ${className}`}>
      <GlowEffect color={palette.color} />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-[#0B0E11]/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-transparent flex items-center justify-center">
            <span className="text-xl">♡</span>
          </div>
          <div>
            <div className="text-white font-medium text-sm">Din reise</div>
            <div className="flex items-center gap-1">
              <span className="text-lg">{moodPalettes[mood].emoji}</span>
              <span className="text-white/40 text-xs">{moodPalettes[mood].label}</span>
            </div>
          </div>
        </div>
        {moodHistory.length > 0 && (
          <div className="flex items-center gap-1">
            {moodHistory.slice(-3).map((m, i) => (
              <span key={i} className="text-base">{moodPalettes[m.mood].emoji}</span>
            ))}
          </div>
        )}
      </div>

      {/* Emotional Context Bar */}
      <div className="relative z-10 px-4 py-3 bg-white/[0.02] border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30">Tone:</span>
          <div className="flex items-center gap-2 flex-1">
            <div className="h-1 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#D4AF37]/60 to-[#D4AF37]" />
            </div>
            <span className="text-white/40 text-xs">Varm</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 p-4 space-y-4">
        {/* Sample messages */}
        <div className="flex gap-2">
          <div className="max-w-[80%] p-4 rounded-2xl rounded-bl-md bg-white/[0.06] border border-white/8 backdrop-blur-xl">
            <p className="text-white/80 text-sm leading-relaxed">
              Jeg har tenkt på det vi snakket om sist. Det betydde mye for meg.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <div className="max-w-[80%] p-4 rounded-2xl rounded-br-md bg-[#D4AF37]/15 border border-[#D4AF37]/25 backdrop-blur-xl">
            <p className="text-white/80 text-sm leading-relaxed">
              Det er fint å høre det. Jeg har det også. Vi bygger noe vakkert her.
            </p>
          </div>
        </div>
      </div>

      {/* AI Suggestions Panel */}
      {suggestions.length > 0 && (
        <div className="relative z-10 px-4 pb-3">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">💡</span>
              <span className="text-white/60 text-xs font-medium">AI-Forslag</span>
            </div>
            <div className="space-y-2">
              {suggestions.slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSuggestionSelect?.(s)}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.04] border border-white/8 hover:bg-white/[0.06] transition-all"
                >
                  <p className="text-white/70 text-xs leading-relaxed">{s.text}</p>
                  <p className="text-white/30 text-[10px] mt-1">{s.reason}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="relative z-10 p-4 bg-[#0B0E11]/80 backdrop-blur-xl border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex-1 p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
            <input
              type="text"
              placeholder="Skriv en melding med hjertet..."
              className="w-full bg-transparent text-white text-sm placeholder:text-white/30 focus:outline-none"
            />
          </div>
          <button className="w-12 h-12 rounded-2xl bg-[#D4AF37] flex items-center justify-center active:scale-[0.95] transition-transform">
            <span className="text-lg">♡</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── CoupleTemplate5 ── */
export const CoupleTemplate5: React.FC<CoupleTemplate5Props> = ({
  healthSignals,
  mood = 'warm',
  className = '',
}) => {
  const palette = moodPalettes[mood];
  const overall = healthSignals.reduce((a, s) => a + s.score, 0) / healthSignals.length;

  return (
    <div className={`relative w-full min-h-screen bg-[#0B0E11] overflow-hidden ${className}`}>
      <GlowEffect color={palette.color} />

      {/* Header */}
      <div className="relative z-10 px-6 pt-8 pb-4">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-transparent border-2 border-[#0B0E11] flex items-center justify-center">
              <span className="text-2xl">♡</span>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F472B6]/30 to-transparent border-2 border-[#0B0E11] flex items-center justify-center">
              <span className="text-2xl">♡</span>
            </div>
          </div>
          <div>
            <h1 className="text-white font-semibold text-xl">Vår felles rom</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg">{moodPalettes[mood].emoji}</span>
              <span className="text-white/40 text-xs">{moodPalettes[mood].label}</span>
              <span className="text-white/20">•</span>
              <span className="text-[#D4AF37] text-xs font-medium">{Math.round(overall)}% helse</span>
            </div>
          </div>
        </div>
      </div>

      {/* Health Section */}
      <div className="relative z-10 px-6 py-6">
        <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">💚</span>
            <span className="text-white font-semibold text-sm">Relasjons-helse</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {healthSignals.map((s) => (
              <div key={s.dimension} className="text-center">
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden mb-1">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.score}%`, backgroundColor: '#D4AF37' }}
                  />
                </div>
                <span className="text-white/30 text-[10px]">{s.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="relative z-10 px-6 py-4 grid grid-cols-3 gap-3">
        <button className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:bg-white/[0.06] transition-all text-center">
          <span className="text-2xl block mb-2">💌</span>
          <span className="text-white/60 text-xs">Skriv brev</span>
        </button>
        <button className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:bg-white/[0.06] transition-all text-center">
          <span className="text-2xl block mb-2">📸</span>
          <span className="text-white/60 text-xs">Lag minne</span>
        </button>
        <button className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:bg-white/[0.06] transition-all text-center">
          <span className="text-2xl block mb-2">🎯</span>
          <span className="text-white/60 text-xs">Øvelse</span>
        </button>
      </div>

      {/* Connection Moments */}
      <div className="relative z-10 px-6 pb-6">
        <h2 className="text-white font-semibold text-sm mb-3">Siste forbindelsesøyeblikk</h2>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">♡</span>
                <span className="text-white/60 text-xs">Øyeblikk #{i}</span>
              </div>
              <p className="text-white/40 text-xs">Dere delte et dyp øyeblikk sammen.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── JourneyTemplate5 ── */
export const JourneyTemplate5: React.FC<JourneyTemplate5Props> = ({
  mood = 'warm',
  memories = [],
  className = '',
}) => {
  const palette = moodPalettes[mood];

  return (
    <div className={`relative w-full min-h-screen bg-[#0B0E11] overflow-hidden ${className}`}>
      <GlowEffect color={palette.color} />

      {/* Header */}
      <div className="relative z-10 px-6 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-semibold text-xl">Din reise</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg">{moodPalettes[mood].emoji}</span>
              <span className="text-white/40 text-xs">{moodPalettes[mood].label}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/15 flex items-center justify-center">
            <span className="text-xl">🗺️</span>
          </div>
        </div>
      </div>

      {/* Journey Progress */}
      <div className="relative z-10 px-6 py-6">
        <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-semibold text-sm">Reise-fremgang</span>
            <span className="text-[#D4AF37] font-bold text-sm">Steg 3/6</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#D4AF37]/60 to-[#D4AF37]" />
          </div>
        </div>
      </div>

      {/* Memory Highlights */}
      <div className="relative z-10 px-6 pb-6">
        <h2 className="text-white font-semibold text-sm mb-3">Emosjonelle høydepunkter</h2>
        <div className="space-y-2">
          {(memories.length > 0 ? memories : [
            { id: '1', type: 'connection' as const, summary: 'Dere delte et dypt øyeblikk om drømmene deres.', mood: 'warm' as Mood, date: Date.now() - 86400000 },
            { id: '2', type: 'growth' as const, summary: 'En viktig lærdom om tillit og sårbarhet.', mood: 'reflective' as Mood, date: Date.now() - 172800000 },
          ]).slice(0, 3).map((m) => (
            <div key={m.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">
                  {m.type === 'connection' ? '🔗' : m.type === 'growth' ? '🌱' : m.type === 'joy' ? '✨' : '💡'}
                </span>
                <span className="text-lg">{moodPalettes[m.mood].emoji}</span>
                <span className="text-white/60 text-xs">{moodPalettes[m.mood].label}</span>
              </div>
              <p className="text-white/40 text-xs leading-relaxed">{m.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Journey Step */}
      <div className="relative z-10 px-6 pb-6">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/15">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🌉</span>
            <span className="text-white font-semibold text-sm">Neste steg</span>
          </div>
          <p className="text-white/50 text-xs leading-relaxed">
            Del en historie som viser hvem du er — noe lite, men ekte.
          </p>
          <button className="mt-3 px-6 py-2.5 bg-[#D4AF37] text-[#0B0E11] rounded-xl text-xs font-semibold active:scale-[0.95] transition-transform">
            Start steg
          </button>
        </div>
      </div>
    </div>
  );
};

const EmotionTemplates = { ChatTemplate5, CoupleTemplate5, JourneyTemplate5 };
export default EmotionTemplates;
