/**
 * ToSom UI 3.0 — AI Components Mobile
 *
 * Mobile-optimized AI assistant components.
 * - AIInsightsPanel -> bottom sheet
 * - AIRewritePanel -> slide-up panel
 * - AIIcebreakers -> chip row
 * - AIJourneyGuide -> card stack
 *
 * Usage:
 *   import { AIInsightsMobile, AIRewriteMobile, AIIcebreakersMobile, AIJourneyGuideMobile } from '@/components/ui/aiMobile'
 */

import React from 'react';

/* ── AI Insights Panel (bottom sheet) ── */
export const AIInsightsMobile: React.FC<{
  insights: Array<{ title: string; description: string; icon?: string }>;
  onClose?: () => void;
}> = ({ insights, onClose }) => (
  <div className="fixed bottom-0 left-0 right-0 z-[9998] flex justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative w-full max-w-lg bg-[#111827] border-t border-white/8 rounded-t-3xl backdrop-blur-xl p-6 pb-8">
      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 text-white/45 hover:text-white/70 text-lg">✕</button>
      )}
      <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mb-6" />
      <h3 className="text-white font-semibold text-lg mb-4">AI Innsikt</h3>
      <div className="space-y-3">
        {insights.map((ins, i) => (
          <div key={i} className="bg-white/[0.04] border border-white/8 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              {ins.icon && <span className="text-lg">{ins.icon}</span>}
              <span className="text-white font-medium text-sm">{ins.title}</span>
            </div>
            <p className="text-white/55 text-sm leading-relaxed">{ins.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── AI Rewrite Panel (slide-up) ── */
export const AIRewriteMobile: React.FC<{
  suggestions?: Array<{ original: string; suggestion: string; tone?: string }>;
  onClose?: () => void;
  onApply?: (i: number) => void;
}> = ({ suggestions = [], onClose, onApply }) => (
  <div className="fixed bottom-0 left-0 right-0 z-[9998] flex justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative w-full max-w-lg bg-[#111827] border-t border-white/8 rounded-t-3xl backdrop-blur-xl p-6 pb-8">
      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 text-white/45 hover:text-white/70 text-lg">✕</button>
      )}
      <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mb-6" />
      <h3 className="text-white font-semibold text-lg mb-2">AI Omskriving</h3>
      <p className="text-white/45 text-sm mb-4">Forbedre tonen eller tydeligheten</p>
      <div className="space-y-4">
        {suggestions.map((s, i) => (
          <div key={i} className="border border-white/8 rounded-xl overflow-hidden">
            <div className="bg-white/[0.02] px-4 py-2.5 border-b border-white/6">
              <span className="text-white/35 text-xs">Opprinnelig</span>
              <p className="text-white/60 text-sm mt-1">{s.original}</p>
            </div>
            <div className="bg-[#D4AF37]/5 px-4 py-2.5 border-b border-[#D4AF37]/10">
              <span className="text-[#D4AF37] text-xs">Forslag</span>
              <p className="text-white/70 text-sm mt-1">{s.suggestion}</p>
            </div>
            <div className="flex gap-2 px-4 py-3">
              <button onClick={() => onApply?.(i)} className="flex-1 bg-[#D4AF37] text-[#0B0E11] text-sm font-semibold py-2 rounded-lg">Bruk</button>
              <button className="bg-white/[0.04] text-white/60 text-sm px-4 rounded-lg">Skip</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── AI Icebreakers (chip row) ── */
export const AIIcebreakersMobile: React.FC<{
  icebreakers: string[];
  onSelect?: (text: string) => void;
}> = ({ icebreakers, onSelect }) => (
  <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-4 backdrop-blur-xl">
    <h4 className="text-white/70 text-sm font-medium mb-3">💡 Spørsg\u00E5 r for\u00E5 rder</h4>
    <div className="flex flex-wrap gap-2">
      {icebreakers.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect?.(q)}
          className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] px-3 py-1.5 rounded-full text-xs font-medium active:scale-[0.96] transition-transform"
        >
          {q}
        </button>
      ))}
    </div>
  </div>
);

/* ── AI Journey Guide (card stack) ── */
export const AIJourneyGuideMobile: React.FC<{
  steps: Array<{ title: string; description: string; icon: string }>;
  currentStep?: number;
  onComplete?: (i: number) => void;
}> = ({ steps, currentStep = 0, onComplete }) => (
  <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-5 backdrop-blur-xl">
    <h4 className="text-white font-semibold text-base mb-4">Reiseguide</h4>
    <div className="space-y-4">
      {steps.map((step, i) => {
        const isActive = i === currentStep;
        const isPast = i < currentStep;
        return (
          <div key={i} className={`flex gap-3 ${isActive ? 'opacity-100' : isPast ? 'opacity-50' : 'opacity-30'}`}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                isPast ? 'bg-[#D4AF37]/20 text-[#D4AF37]' :
                isActive ? 'bg-[#D4AF37] text-[#0B0E11]' :
                'bg-white/10 text-white/40'
              }`}>
                {isPast ? '\u2713' : step.icon}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 h-8 ${isPast ? 'bg-[#D4AF37]/30' : 'bg-white/10'}`} />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>{step.title}</p>
              <p className="text-white/45 text-xs mt-1 leading-relaxed">{step.description}</p>
              {isActive && onComplete && (
                <button onClick={() => onComplete(i)} className="mt-2 bg-[#D4AF37] text-[#0B0E11] text-xs font-semibold px-4 py-2 rounded-lg">Fullfør steg</button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const AITools = { AIInsightsMobile, AIRewriteMobile, AIIcebreakersMobile, AIJourneyGuideMobile };
export default AITools;
