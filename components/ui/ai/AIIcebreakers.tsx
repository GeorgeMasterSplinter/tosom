/**
 * AIIcebreakers — AI-generated icebreaker questions for couples
 *
 * Usage:
 *   <AIIcebreakers
 *     questions={[
 *       { question: "Hva er din beste felles minne?", category: "reflection" },
 *     ]}
     depth="light"
 *   />
 */

import React from 'react';

export interface Icebreaker {
  id: string;
  question: string;
  category: 'light' | 'deep' | 'fun' | 'reflection' | 'intimate';
  difficulty?: 1 | 2 | 3;
  hint?: string;
}

export interface AIIcebreakersProps {
  questions: Icebreaker[];
  /** Current depth level */
  depth?: 'light' | 'medium' | 'deep';
  /** Show hint */
  showHint?: boolean;
  /** On new set */
  onNewSet?: () => void;
  /** On answer submitted */
  onAnswer?: (q: Icebreaker) => void;
  /** Custom class */
  className?: string;
}

const categoryEmojis: Record<Icebreaker['category'], string> = {
  light: '☀️',
  deep: '🌊',
  fun: '🎉',
  reflection: '🪞',
  intimate: '💕',
};

const depthLabel: Record<string, string> = {
  light: 'Lett',
  medium: 'Middels',
  deep: 'Dyp',
};

const AIIcebreakers: React.FC<AIIcebreakersProps> = ({
  questions,
  depth = 'medium',
  showHint = false,
  onNewSet,
  onAnswer,
  className = '',
}) => {
  if (questions.length === 0) {
    return (
      <div className={`rounded-2xl border border-white/8 bg-ts-glass/50 backdrop-blur-xl p-8 text-center ${className}`}>
        <span className="text-3xl">💬</span>
        <p className="text-ts-text-subtle mt-3">Ingen isbrytarar enda</p>
        {onNewSet && (
          <button onClick={onNewSet} className="mt-4 px-4 py-2 rounded-xl bg-ts-gold text-ts-bg text-sm font-medium hover:bg-ts-gold/90 transition-all">
            Generer isbrytarar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">💬</span>
          <h3 className="text-sm font-semibold text-ts-primary">Isbrytarar</h3>
          <span className="text-xs text-ts-text-subtle bg-ts-glass/50 px-2 py-0.5 rounded-full">
            {depthLabel[depth]}
          </span>
        </div>
        {onNewSet && (
          <button onClick={onNewSet} className="text-xs text-ts-text-subtle hover:text-ts-gold transition-colors">
            🔄 Nye
          </button>
        )}
      </div>

      {questions.map((q, i) => (
        <div
          key={q.id}
          className="rounded-2xl border border-white/8 bg-ts-glass/50 backdrop-blur-xl p-5 transition-all hover:bg-ts-glass"
        >
          {/* Number + Category */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-ts-gold">#{i + 1}</span>
            <span className="text-sm">{categoryEmojis[q.category]}</span>
            {q.difficulty && (
              <span className="text-xs text-ts-text-subtle">{'⭐'.repeat(q.difficulty)}</span>
            )}
          </div>

          {/* Question */}
          <p className="text-sm text-ts-primary font-medium leading-relaxed mb-3">{q.question}</p>

          {/* Hint */}
          {showHint && q.hint && (
            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-3 mb-3">
              <p className="text-xs text-ts-text-subtle">💡 {q.hint}</p>
            </div>
          )}

          {/* Answer button */}
          {onAnswer && (
            <button
              onClick={() => onAnswer(q)}
              className="w-full px-3 py-2 rounded-lg bg-ts-gold/10 text-ts-gold text-xs font-medium border border-ts-gold/20 hover:bg-ts-gold/20 transition-all"
            >
              Svar
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

AIIcebreakers.displayName = 'AIIcebreakers';
export default AIIcebreakers;