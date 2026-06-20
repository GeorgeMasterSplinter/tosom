/**
 * AIRewritePanel — AI message rewrite suggestions
 *
 * Usage:
 *   <AIRewritePanel
 *     original="Hey"
 *     suggestions={[
 *       { text: "Hi there! How are you?", tone: "friendly" },
 *     ]}
 *     onApply={handleApply}
 *   />
 */

import React from 'react';

export interface RewriteSuggestion {
  text: string;
  tone: 'friendly' | 'romantic' | 'humorous' | 'deep' | 'formal' | 'casual';
  confidence?: number;
}

export interface AIRewritePanelProps {
  original: string;
  suggestions: RewriteSuggestion[];
  /** On apply */
  onApply?: (text: string) => void;
  /** Tone options shown */
  tones?: RewriteSuggestion['tone'][];
  /** Custom class */
  className?: string;
}

const toneEmojis: Record<RewriteSuggestion['tone'], string> = {
  friendly: '😊',
  romantic: '💕',
  humorous: '😄',
  deep: '🔮',
  formal: '🎩',
  casual: '😎',
};

const AIRewritePanel: React.FC<AIRewritePanelProps> = ({
  original,
  suggestions,
  onApply,
  tones,
  className = '',
}) => {
  const filtered = tones ? suggestions.filter((s) => tones.includes(s.tone)) : suggestions;

  if (filtered.length === 0) {
    return (
      <div className={`rounded-2xl border border-white/8 bg-ts-glass/50 backdrop-blur-xl p-6 text-center ${className}`}>
        <span className="text-2xl">✨</span>
        <p className="text-sm text-ts-text-subtle mt-2">Ingen forslag ennå</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-white/8 bg-ts-glass/50 backdrop-blur-xl p-5 ${className}`}>
      {/* Original */}
      <div className="mb-4">
        <p className="text-xs font-medium text-ts-text-subtle mb-1">Original</p>
        <div className="rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2">
          <p className="text-sm text-ts-text-secondary">{original}</p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-ts-text-subtle">Forslag</p>
        {filtered.map((s, i) => (
          <button
            key={i}
            onClick={() => onApply?.(s.text)}
            className="w-full text-left rounded-xl border border-white/8 bg-ts-glass/30 px-3 py-3 transition-all hover:bg-ts-gold/10 hover:border-ts-gold/15 group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">{toneEmojis[s.tone]}</span>
              <span className="text-[10px] font-medium text-ts-text-subtle uppercase tracking-wider group-hover:text-ts-gold transition-colors">
                {s.tone}
              </span>
            </div>
            <p className="text-sm text-ts-text-secondary group-hover:text-ts-primary transition-colors">{s.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

AIRewritePanel.displayName = 'AIRewritePanel';
export default AIRewritePanel;