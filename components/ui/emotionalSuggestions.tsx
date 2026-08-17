/**
 * Tosom 5.0 — Emotional Suggestions
 *
 * AI-powered suggestion cards for messages, questions, and reassurances.
 * Uses StaggeredChildren animation + GlowEffect.
 *
 * Usage:
 *   import { EmotionalSuggestions } from '@/components/ui'
 *   <EmotionalSuggestions suggestions={suggestions} mood="warm" />
 */

import React from 'react';
import { moodPalettes, type Mood, type EmotionalSuggestion } from './emotionTypes';

/* ── Props ── */
export interface EmotionalSuggestionsProps {
  suggestions: EmotionalSuggestion[];
  mood?: Mood;
  onSelect?: (suggestion: EmotionalSuggestion) => void;
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

/* ── StaggeredChildren ── */
const StaggeredChildren: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const childArray = React.Children.toArray(children);
  return (
    <div className={className}>
      {childArray.map((child, i) => (
        <div
          key={i}
          className="animate-[slideUp_0.5s_ease-out]"
          style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' } as React.CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

/* ── Type Badge ── */
const typeConfig = {
  message: { label: 'Melding', emoji: '💌', color: '#D4AF37' },
  question: { label: 'Spørsmål', emoji: '❓', color: '#60A5FA' },
  reassurance: { label: 'Trygghet', emoji: '💛', color: '#F472B6' },
};

const TypeBadge: React.FC<{ type: EmotionalSuggestion['type'] }> = ({ type }) => {
  const config = typeConfig[type];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{ backgroundColor: `${config.color}15`, color: config.color, border: `1px solid ${config.color}30` }}>
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
};

/* ── Suggestion Card ── */
const SuggestionCard: React.FC<{
  suggestion: EmotionalSuggestion;
  mood: Mood;
  onSelect?: (s: EmotionalSuggestion) => void;
}> = ({ suggestion, mood, onSelect }) => {
  const palette = moodPalettes[mood];
  const config = typeConfig[suggestion.type];

  return (
    <button
      onClick={() => onSelect?.(suggestion)}
      className="w-full text-left group relative overflow-hidden rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-5 hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300"
    >
      <GlowEffect color={palette.color} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <TypeBadge type={suggestion.type} />
          <div className="flex items-center gap-1">
            <span className="text-white/30 text-xs">Varme</span>
            <div className="h-1.5 w-16 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${suggestion.warmth}%`, backgroundColor: config.color }}
              />
            </div>
            <span className="text-white/40 text-xs">{Math.round(suggestion.warmth)}%</span>
          </div>
        </div>
        <p className="text-white/80 text-sm leading-relaxed mb-3">{suggestion.text}</p>
        <p className="text-white/30 text-xs">{suggestion.reason}</p>
        <div className="mt-3 flex items-center gap-1 text-white/20 group-hover:text-white/40 transition-colors">
          <span className="text-xs">Bruk dette</span>
          <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </button>
  );
};

/* ── Empty Suggestions ── */
const EmptySuggestions: React.FC<{ mood: Mood }> = ({ mood }) => {
  const palette = moodPalettes[mood];
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#D4AF37]/15 to-transparent rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/8">
        <span className="text-3xl">💡</span>
      </div>
      <p className="text-white/40 text-sm">
        AI analyserer tonen din...<br />
        Forslag kommer snart.
      </p>
    </div>
  );
};

/* ── Main EmotionalSuggestions ── */
const EmotionalSuggestions: React.FC<EmotionalSuggestionsProps> = ({
  suggestions,
  mood = 'warm',
  onSelect,
  className = '',
}) => {
  const palette = moodPalettes[mood];

  if (suggestions.length === 0) {
    return <EmptySuggestions mood={mood} />;
  }

  const byType = {
    message: suggestions.filter((s) => s.type === 'message'),
    question: suggestions.filter((s) => s.type === 'question'),
    reassurance: suggestions.filter((s) => s.type === 'reassurance'),
  };

  return (
    <div className={`relative w-full ${className}`}>
      <GlowEffect color={palette.color} />
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37]/20 to-transparent flex items-center justify-center">
            <span className="text-lg">💡</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">AI-Forslag</h3>
            <p className="text-white/30 text-xs">Basert på din stemning</p>
          </div>
        </div>

        {/* Sections */}
        <StaggeredChildren className="space-y-6">
          {byType.message.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">💌</span>
                <span className="text-white/60 text-xs font-medium">Prøv denne meldingen</span>
              </div>
              {byType.message.map((s, i) => (
                <div key={s.type + i} className="mb-2">
                  <SuggestionCard suggestion={s} mood={mood} onSelect={onSelect} />
                </div>
              ))}
            </section>
          )}

          {byType.question.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">❓</span>
                <span className="text-white/60 text-xs font-medium">Prøv dette spørsmålet</span>
              </div>
              {byType.question.map((s, i) => (
                <div key={s.type + i} className="mb-2">
                  <SuggestionCard suggestion={s} mood={mood} onSelect={onSelect} />
                </div>
              ))}
            </section>
          )}

          {byType.reassurance.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">💛</span>
                <span className="text-white/60 text-xs font-medium">Prøv denne tryggheten</span>
              </div>
              {byType.reassurance.map((s, i) => (
                <div key={s.type + i} className="mb-2">
                  <SuggestionCard suggestion={s} mood={mood} onSelect={onSelect} />
                </div>
              ))}
            </section>
          )}
        </StaggeredChildren>
      </div>
    </div>
  );
};

export { EmotionalSuggestions, SuggestionCard };
export default EmotionalSuggestions;