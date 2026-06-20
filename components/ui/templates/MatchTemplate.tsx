/**
 * MatchTemplate — Full match/detail page layout
 *
 * Usage:
 *   <MatchTemplate match={matchData}>
 *     <MatchDetails />
 *   </MatchTemplate>
 */

import React from 'react';

export interface MatchTemplateProps {
  /** Page children */
  children: React.ReactNode;
  /** Match data */
  match?: {
    name: string;
    avatar?: string;
    age?: number;
    location?: string;
    bio?: string;
    tags?: string[];
    compatibility?: number;
    lastActive?: string;
  };
  /** Match actions */
  actions?: Array<{ label: string; icon: string; onClick: () => void; color?: string }>;
  /** Compatibility breakdown */
  breakdown?: Array<{ label: string; score: number; color: string }>;
  /** Custom class */
  className?: string;
}

const MatchTemplate: React.FC<MatchTemplateProps> = ({
  children,
  match,
  actions,
  breakdown,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-ts-bg-primary ${className}`}>
      {/* Hero */}
      <div className="relative h-64 sm:h-80 bg-gradient-to-br from-ts-gold/20 via-ts-purple/10 to-transparent">
        {match?.avatar && (
          <img src={match.avatar} alt={match.name} className="absolute inset-0 w-full h-full object-cover opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ts-bg-primary via-ts-bg-primary/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative -mt-32 px-6 pb-6 max-w-3xl mx-auto">
        {/* Name card */}
        <div className="rounded-2xl border border-white/8 bg-ts-glass/80 backdrop-blur-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            {match?.avatar ? (
              <img src={match.avatar} alt={match.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-ts-gold/20" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-ts-gold/20 border-2 border-ts-gold/20 flex items-center justify-center">
                <span className="text-xl font-bold text-ts-gold">{match?.name?.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-ts-primary">
                {match?.name}
                {match?.age && <span className="text-base text-ts-text-subtle font-normal">, {match.age}</span>}
              </h1>
              {match?.location && (
                <p className="text-sm text-ts-text-subtle mt-0.5">📍 {match.location}</p>
              )}
              {match?.lastActive && (
                <p className="text-xs text-ts-text-subtle mt-0.5">Sist aktiv {new Date(match.lastActive).toLocaleDateString('no-NO')}</p>
              )}
            </div>
          </div>

          {/* Compatibility */}
          {match?.compatibility !== undefined && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-ts-gold">Resonans</span>
                <span className="text-xs font-bold text-ts-gold">{match.compatibility}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-ts-gold to-ts-gold/60" style={{ width: `${match.compatibility}%` }} />
              </div>
            </div>
          )}

          {/* Bio */}
          {match?.bio && (
            <p className="text-sm text-ts-text-secondary mt-4 leading-relaxed">{match.bio}</p>
          )}

          {/* Tags */}
          {match?.tags && match.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {match.tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-ts-glass/50 border border-white/8 text-xs text-ts-text-secondary">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex gap-3 mb-6">
            {actions.map((a, i) => (
              <button
                key={i}
                onClick={a.onClick}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  a.color === 'gold'
                    ? 'bg-ts-gold text-ts-bg border-ts-gold'
                    : 'bg-ts-glass/50 border-white/8 text-ts-primary hover:bg-ts-glass hover:border-ts-gold/20'
                }`}
              >
                <span>{a.icon}</span>
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Breakdown */}
        {breakdown && (
          <div className="rounded-2xl border border-white/8 bg-ts-glass/50 backdrop-blur-xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-ts-primary mb-4">Resonans analyse</h3>
            <div className="space-y-3">
              {breakdown.map((b, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-ts-text-secondary">{b.label}</span>
                    <span className="text-xs font-medium text-ts-primary">{b.score}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${b.score}%`, backgroundColor: b.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Children */}
        {children}
      </div>
    </div>
  );
};

MatchTemplate.displayName = 'MatchTemplate';
export default MatchTemplate;