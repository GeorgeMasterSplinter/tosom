/**
 * WeeklyDigestV2 — Weekly relationship summary card
 *
 * Usage:
 *   <WeeklyDigestV2
 *     week="2026-W24"
 *     stats={{ messages: 142, matches: 5, timeTogether: 12 }}
 *     highlights={[...]}
 *   />
 */

import React from 'react';

export interface WeeklyDigestStats {
  messages?: number;
  matches?: number;
  timeTogether?: number; // hours
  deepConversations?: number;
  icebreakers?: number;
  milestones?: number;
}

export interface WeeklyHighlight {
  type: 'message' | 'match' | 'milestone' | 'moment';
  text: string;
  date?: Date | string;
}

export interface WeeklyDigestV2Props {
  /** Week label */
  week?: string;
  /** Stats */
  stats: WeeklyDigestStats;
  /** Highlights */
  highlights?: WeeklyHighlight[];
  /** Custom class */
  className?: string;
}

const statIcons: Record<keyof WeeklyDigestStats, string> = {
  messages: 'M12 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0 1c-4.97 0-9 2.686-9 6v3h18v-3c0-3.314-4.03-6-9-6zm-8 15h16v-1c0-3.866-5.373-7-10-7-4.626 0-10 3.134-10 7v1z',
  matches: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  timeTogether: 'M12 6v6l4 2',
  deepConversations: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.92A9.001 9.001 0 012.25 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  icebreakers: 'M13 10V3L4 14h7v7l9-11h-7z',
  milestones: 'M5 3v18l7-4 7 4V3l-7 4-7-4z',
};

const WeeklyDigestV2: React.FC<WeeklyDigestV2Props> = ({
  week = 'Uke 24',
  stats,
  highlights = [],
  className = '',
}) => {
  const statCards = [
    { label: 'Meldingar', value: stats.messages || 0, icon: statIcons.messages, color: 'gold' },
    { label: 'Matches', value: stats.matches || 0, icon: statIcons.matches, color: 'pink' },
    { label: 'Timar saman', value: stats.timeTogether || 0, icon: statIcons.timeTogether, color: 'teal' },
    { label: 'Dype samtal', value: stats.deepConversations || 0, icon: statIcons.deepConversations, color: 'purple' },
    { label: 'Isbrytarar', value: stats.icebreakers || 0, icon: statIcons.icebreakers, color: 'gold' },
    { label: 'Milstreper', value: stats.milestones || 0, icon: statIcons.milestones, color: 'pink' },
  ];

  return (
    <div
      className={`
        rounded-2xl
        border border-white/8
        bg-white/[0.04]
        backdrop-blur-xl
        shadow-[0_4px_20px_rgba(0,0,0,0.4)]
        ${className}
      `}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5">
        <h3 className="text-lg font-semibold text-ts-primary">Veckesamandrag</h3>
        <p className="text-sm text-ts-text-subtle mt-0.5">{week}</p>
      </div>

      {/* Stats grid */}
      <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statCards.map(({ label, value, icon, color }, i) => {
          const colorMap: Record<string, { bg: string; text: string }> = {
            gold: { bg: 'bg-ts-gold/10', text: 'text-ts-gold' },
            pink: { bg: 'bg-ts-pink/10', text: 'text-ts-pink' },
            teal: { bg: 'bg-ts-teal/10', text: 'text-ts-teal' },
            purple: { bg: 'bg-ts-purple/10', text: 'text-ts-purple' },
          };
          return (
            <div key={i} className={`rounded-xl ${colorMap[color].bg} p-3 text-center`}>
              <p className={`text-2xl font-bold ${colorMap[color].text}`}>{value}</p>
              <p className="text-xs text-ts-text-subtle mt-1">{label}</p>
            </div>
          );
        })}
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div className="px-6 py-4 border-t border-white/5">
          <h4 className="text-sm font-medium text-ts-primary mb-3">Høgdepunkt</h4>
          <div className="space-y-2">
            {highlights.slice(0, 5).map((h, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  h.type === 'milestone' ? 'bg-ts-gold' : h.type === 'match' ? 'bg-ts-pink' : 'bg-ts-glass'
                }`} />
                <p className="text-sm text-ts-text-secondary">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

WeeklyDigestV2.displayName = 'WeeklyDigestV2';
export default WeeklyDigestV2;