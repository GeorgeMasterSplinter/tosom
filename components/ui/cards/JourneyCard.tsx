/**
 * JourneyCard — Relationship milestone/journey card
 *
 * Usage:
 *   <JourneyCard
 *     title="First Date"
 *     date={new Date('2025-06-15')}
 *     description="Our first meeting at the coffee shop"
 *     icon={<HeartIcon />}
 *   />
 */

import React from 'react';

export interface JourneyCardProps {
  /** Milestone title */
  title: string;
  /** Event date */
  date?: Date | string;
  /** Description text */
  description?: string;
  /** Icon element */
  icon?: React.ReactNode;
  /** Milestone type */
  type?: 'milestone' | 'memory' | 'achievement' | 'anniversary';
  /** Color variant */
  color?: 'gold' | 'pink' | 'teal' | 'purple';
  /** Achievement level (1-5 stars) */
  level?: number;
  /** Custom class */
  className?: string;
}

const colorMap: Record<NonNullable<JourneyCardProps['color']>, { bg: string; border: string; icon: string; badge: string }> = {
  gold: {
    bg: 'bg-ts-gold/10',
    border: 'border-ts-gold/20',
    icon: 'text-ts-gold',
    badge: 'bg-ts-gold/20 text-ts-gold border border-ts-gold/20',
  },
  pink: {
    bg: 'bg-ts-pink/10',
    border: 'border-ts-pink/20',
    icon: 'text-ts-pink',
    badge: 'bg-ts-pink/20 text-ts-pink border border-ts-pink/20',
  },
  teal: {
    bg: 'bg-ts-teal/10',
    border: 'border-ts-teal/20',
    icon: 'text-ts-teal',
    badge: 'bg-ts-teal/20 text-ts-teal border border-ts-teal/20',
  },
  purple: {
    bg: 'bg-ts-purple/10',
    border: 'border-ts-purple/20',
    icon: 'text-ts-purple',
    badge: 'bg-ts-purple/20 text-ts-purple border border-ts-purple/20',
  },
};

const JourneyCard: React.FC<JourneyCardProps> = ({
  title,
  date,
  description,
  icon,
  type = 'milestone',
  color = 'gold',
  level,
  className = '',
}) => {
  const colors = colorMap[color];

  const formattedDate = date
    ? new Date(date).toLocaleDateString('no-NO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const typeLabels: Record<NonNullable<JourneyCardProps['type']>, string> = {
    milestone: 'Milstolpe',
    memory: 'Minne',
    achievement: 'Nasjon',
    anniversary: 'Dag',
  };

  return (
    <div
      className={`
        rounded-2xl
        border border-white/8
        bg-white/[0.04]
        backdrop-blur-xl
        shadow-[0_4px_20px_rgba(0,0,0,0.4)]
        overflow-hidden
        transition-all
        hover:bg-white/[0.06]
        ${className}
      `}
    >
      <div className="p-6">
        {/* Header: icon + type badge */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center`}>
            <span className={colors.icon}>{icon || <HeartIcon />}</span>
          </div>
          <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full ${colors.badge}`}>
            {typeLabels[type]}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-ts-primary mb-1">{title}</h3>

        {/* Date */}
        {formattedDate && (
          <p className="text-sm text-ts-text-subtle mb-3 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </p>
        )}

        {/* Level stars */}
        {level && (
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < level ? colors.icon : 'text-ts-text-subtle opacity-30'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-ts-text-secondary leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
};

/** Default heart icon */
function HeartIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

JourneyCard.displayName = 'JourneyCard';
export default JourneyCard;