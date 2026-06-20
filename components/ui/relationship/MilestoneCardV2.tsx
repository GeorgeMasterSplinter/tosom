/**
 * MilestoneCardV2 — Achievement milestone card
 *
 * Usage:
 *   <MilestoneCardV2
 *     title="100 dager sammen"
 *     level={5}
 *     achieved={true}
 *     description="Vi har fylt 100 dager sammen!"
 *     icon={<HeartIcon />}
 *   />
 */

import React from 'react';

export interface MilestoneCardV2Props {
  /** Milestone title */
  title: string;
  /** Achievement level (1-5) */
  level?: number;
  /** Whether achieved */
  achieved?: boolean;
  /** Description */
  description?: string;
  /** Icon */
  icon?: React.ReactNode;
  /** Color */
  color?: 'gold' | 'pink' | 'teal' | 'purple';
  /** Date achieved */
  date?: Date | string;
  /** Custom class */
  className?: string;
}

const colorMap: Record<NonNullable<MilestoneCardV2Props['color']>, { bg: string; border: string; text: string; icon: string; star: string }> = {
  gold: {
    bg: 'from-ts-gold/15 via-ts-gold/5 to-transparent',
    border: 'border-ts-gold/20',
    text: 'text-ts-gold',
    icon: 'bg-ts-gold/20 text-ts-gold',
    star: 'text-ts-gold',
  },
  pink: {
    bg: 'from-ts-pink/15 via-ts-pink/5 to-transparent',
    border: 'border-ts-pink/20',
    text: 'text-ts-pink',
    icon: 'bg-ts-pink/20 text-ts-pink',
    star: 'text-ts-pink',
  },
  teal: {
    bg: 'from-ts-teal/15 via-ts-teal/5 to-transparent',
    border: 'border-ts-teal/20',
    text: 'text-ts-teal',
    icon: 'bg-ts-teal/20 text-ts-teal',
    star: 'text-ts-teal',
  },
  purple: {
    bg: 'from-ts-purple/15 via-ts-purple/5 to-transparent',
    border: 'border-ts-purple/20',
    text: 'text-ts-purple',
    icon: 'bg-ts-purple/20 text-ts-purple',
    star: 'text-ts-purple',
  },
};

const MilestoneCardV2: React.FC<MilestoneCardV2Props> = ({
  title,
  level = 3,
  achieved = false,
  description,
  icon,
  color = 'gold',
  date,
  className = '',
}) => {
  const colors = colorMap[color];

  const formattedDate = date
    ? new Date(date).toLocaleDateString('no-NO', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-2xl
        border ${achieved ? colors.border : 'border-white/8'}
        bg-gradient-to-br ${colors.bg}
        backdrop-blur-xl
        shadow-[0_4px_20px_rgba(0,0,0,0.4)]
        transition-all
        ${achieved ? 'hover:scale-[1.01]' : 'opacity-60'}
        ${className}
      `}
    >
      {/* Content */}
      <div className="p-6">
        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl ${colors.icon} flex items-center justify-center flex-shrink-0`}>
            {icon || (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-ts-primary truncate">{title}</h3>
          </div>
          {achieved && (
            <span className={`flex-shrink-0 text-xs font-semibold ${colors.text}`}>
              Fullfort!
            </span>
          )}
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < level ? colors.star : 'text-ts-text-subtle opacity-20'}`}
              fill={i < level ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>

        {/* Date */}
        {formattedDate && (
          <p className="text-xs text-ts-text-subtle mb-2">{formattedDate}</p>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-ts-text-secondary leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
};

MilestoneCardV2.displayName = 'MilestoneCardV2';
export default MilestoneCardV2;