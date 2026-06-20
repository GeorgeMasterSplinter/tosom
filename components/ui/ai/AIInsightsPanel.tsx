/**
 * AIInsightsPanel — AI-generated relationship insights
 *
 * Usage:
 *   <AIInsightsPanel
 *     insights={[
 *       { title: "Sterk kommunikasjon", description: "...", confidence: 92 },
 *     ]}
 *     onApply={handleApply}
 *   />
 */

import React from 'react';

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  confidence: number; // 0-100
  category: 'communication' | 'intimacy' | 'growth' | 'trust' | 'fun';
  actionable?: boolean;
}

export interface AIInsightsPanelProps {
  insights: AIInsight[];
  /** On apply insight */
  onApply?: (insight: AIInsight) => void;
  /** On refresh */
  onRefresh?: () => void;
  /** Custom class */
  className?: string;
}

const categoryColors: Record<AIInsight['category'], { bg: string; border: string; text: string; icon: string }> = {
  communication: { bg: 'bg-ts-blue/10', border: 'border-ts-blue/20', text: 'text-ts-blue', icon: '💬' },
  intimacy: { bg: 'bg-ts-pink/10', border: 'border-ts-pink/20', text: 'text-ts-pink', icon: '💕' },
  growth: { bg: 'bg-ts-teal/10', border: 'border-ts-teal/20', text: 'text-ts-teal', icon: '🌱' },
  trust: { bg: 'bg-ts-gold/10', border: 'border-ts-gold/20', text: 'text-ts-gold', icon: '🤝' },
  fun: { bg: 'bg-ts-purple/10', border: 'border-ts-purple/20', text: 'text-ts-purple', icon: '✨' },
};

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ insights, onApply, onRefresh, className = '' }) => {
  if (insights.length === 0) {
    return (
      <div className={`rounded-2xl border border-white/8 bg-ts-glass/50 backdrop-blur-xl p-8 text-center ${className}`}>
        <span className="text-3xl">🤖</span>
        <p className="text-ts-text-subtle mt-3">Ingen innsikter ennå</p>
        {onRefresh && (
          <button onClick={onRefresh} className="mt-4 px-4 py-2 rounded-xl bg-ts-gold text-ts-bg text-sm font-medium hover:bg-ts-gold/90 transition-all">
            Generer innsikter
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-ts-primary">AI Innsikter</h3>
        {onRefresh && (
          <button onClick={onRefresh} className="text-xs text-ts-text-subtle hover:text-ts-gold transition-colors">
            Oppdater
          </button>
        )}
      </div>

      {insights.map((insight) => {
        const colors = categoryColors[insight.category];
        return (
          <div
            key={insight.id}
            className={`rounded-2xl border ${colors.border} ${colors.bg} backdrop-blur-xl p-5 transition-all hover:bg-opacity-60`}
          >
            {/* Title + Confidence */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{colors.icon}</span>
                <h4 className="text-sm font-semibold text-ts-primary">{insight.title}</h4>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full rounded-full ${colors.text.replace('text', 'bg')} `} style={{ width: `${insight.confidence}%` }} />
                </div>
                <span className={`text-xs font-medium ${colors.text}`}>{insight.confidence}%</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-ts-text-secondary leading-relaxed mb-3">{insight.description}</p>

            {/* Action */}
            {insight.actionable && onApply && (
              <button
                onClick={() => onApply(insight)}
                className="px-3 py-1.5 rounded-lg bg-ts-gold/15 text-ts-gold text-xs font-medium hover:bg-ts-gold/25 transition-all border border-ts-gold/20"
              >
                Bruk forslag
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

AIInsightsPanel.displayName = 'AIInsightsPanel';
export default AIInsightsPanel;