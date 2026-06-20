/**
 * AIJourneyGuide — AI-guided relationship journey steps
 *
 * Usage:
 *   <AIJourneyGuide
 *     steps={[
 *       { title: "Dyp samtale", prompt: "Spør partneren om...", difficulty: 3 },
 *     ]}
 *     currentStep={0}
 *   />
 */

import React from 'react';

export interface JourneyStep {
  id: string;
  title: string;
  prompt: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  category?: 'conversation' | 'activity' | 'reflection' | 'game';
  estimatedMinutes?: number;
}

export interface AIJourneyGuideProps {
  steps: JourneyStep[];
  /** Current step index */
  currentStep?: number;
  /** On complete step */
  onComplete?: (stepId: string) => void;
  /** On skip */
  onSkip?: () => void;
  /** Custom class */
  className?: string;
}

const categoryEmojis: Record<NonNullable<JourneyStep['category']>, string> = {
  conversation: '💬',
  activity: '🎯',
  reflection: '🪞',
  game: '🎲',
};

const difficultyStars: Record<number, string> = {
  1: '⭐',
  2: '⭐⭐',
  3: '⭐⭐⭐',
  4: '⭐⭐⭐⭐',
  5: '⭐⭐⭐⭐⭐',
};

const AIJourneyGuide: React.FC<AIJourneyGuideProps> = ({
  steps,
  currentStep = 0,
  onComplete,
  onSkip,
  className = '',
}) => {
  if (steps.length === 0) {
    return (
      <div className={`rounded-2xl border border-white/8 bg-ts-glass/50 backdrop-blur-xl p-8 text-center ${className}`}>
        <span className="text-3xl">🧭</span>
        <p className="text-ts-text-subtle mt-3">Ingen reise steg enda</p>
      </div>
    );
  }

  const step = steps[currentStep] || steps[0];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={`rounded-2xl border border-white/8 bg-gradient-to-br from-ts-gold/10 via-transparent to-transparent backdrop-blur-xl p-6 ${className}`}>
      {/* Progress */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full bg-ts-gold transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs text-ts-text-subtle">{currentStep + 1}/{steps.length}</span>
      </div>

      {/* Category badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">{categoryEmojis[step.category || 'conversation']}</span>
        <span className="text-xs font-medium text-ts-gold uppercase tracking-wider">
          {step.category || 'conversation'}
        </span>
        <span className="text-xs text-ts-text-subtle ml-auto">{difficultyStars[step.difficulty]}</span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-ts-primary mb-2">{step.title}</h3>

      {/* Prompt */}
      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 mb-4">
        <p className="text-sm text-ts-text-secondary leading-relaxed">{step.prompt}</p>
      </div>

      {/* Meta */}
      {step.estimatedMinutes && (
        <p className="text-xs text-ts-text-subtle mb-4">⏱ ca. {step.estimatedMinutes} min</p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {onComplete && (
          <button
            onClick={() => onComplete(step.id)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-ts-gold text-ts-bg text-sm font-medium hover:bg-ts-gold/90 transition-all"
          >
            Fullfør
          </button>
        )}
        {onSkip && (
          <button
            onClick={onSkip}
            className="px-4 py-2.5 rounded-xl bg-ts-glass/50 border border-white/8 text-ts-text-secondary text-sm font-medium hover:bg-ts-glass hover:text-ts-primary transition-all"
          >
            Hopp over
          </button>
        )}
      </div>

      {/* Step list indicator */}
      <div className="flex gap-1 mt-4">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i <= currentStep ? 'bg-ts-gold/40' : 'bg-white/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

AIJourneyGuide.displayName = 'AIJourneyGuide';
export default AIJourneyGuide;