/**
 * TimelineV2 — Vertical timeline with milestones
 *
 * Usage:
 *   <TimelineV2
 *     events={[
 *       { date: ..., title: ..., description: ... },
 *     ]}
 *   />
 */

import React from 'react';

export interface TimelineEvent {
  date: Date | string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  color?: 'gold' | 'pink' | 'teal' | 'purple';
}

export interface TimelineV2Props {
  events: TimelineEvent[];
  /** Timeline direction */
  direction?: 'vertical' | 'horizontal';
  /** Custom class */
  className?: string;
}

const colorMap: Record<NonNullable<TimelineEvent['color']>, { line: string; dot: string; ring: string }> = {
  gold: { line: 'bg-ts-gold/30', dot: 'bg-ts-gold', ring: 'border-ts-gold/30' },
  pink: { line: 'bg-ts-pink/30', dot: 'bg-ts-pink', ring: 'border-ts-pink/30' },
  teal: { line: 'bg-ts-teal/30', dot: 'bg-ts-teal', ring: 'border-ts-teal/30' },
  purple: { line: 'bg-ts-purple/30', dot: 'bg-ts-purple', ring: 'border-ts-purple/30' },
};

const TimelineV2: React.FC<TimelineV2Props> = ({ events, direction = 'vertical', className = '' }) => {
  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-ts-text-subtle">
        <p>Ingen hendigheter ennå</p>
      </div>
    );
  }

  return (
    <div className={`${direction === 'vertical' ? 'space-y-6' : 'flex gap-6 overflow-x-auto'} ${className}`}>
      {events.map((event, i) => {
        const colors = colorMap[event.color || 'gold'];
        const formattedDate = new Date(event.date).toLocaleDateString('no-NO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        return (
          <div
            key={i}
            className={`
              relative flex items-start gap-4
              ${direction === 'vertical' ? 'pl-8' : ''}
            `}
          >
            {/* Vertical line */}
            {direction === 'vertical' && (
              <>
                {/* Line above */}
                {i > 0 && (
                  <div className={`absolute left-[11px] top-6 -translate-y-6 w-0.5 h-full ${colors.line}`} />
                )}
                {/* Dot */}
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ${colors.ring} border-2 flex items-center justify-center bg-ts-bg-primary z-10`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                </div>
              </>
            )}

            {/* Content */}
            <div className="flex-1">
              <div className="rounded-xl border border-white/5 bg-ts-glass/50 backdrop-blur-sm p-4">
                <p className="text-xs font-medium text-ts-gold mb-1">{formattedDate}</p>
                <h4 className="text-sm font-semibold text-ts-primary mb-1">{event.title}</h4>
                {event.description && (
                  <p className="text-xs text-ts-text-secondary leading-relaxed">{event.description}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

TimelineV2.displayName = 'TimelineV2';
export default TimelineV2;