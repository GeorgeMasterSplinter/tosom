/**
 * SharedHome — Couple's shared home dashboard overview
 *
 * Usage:
 *   <SharedHome
 *     partnerName="Anna"
 *     partnerAvatar="/avatar.jpg"
 *     daysTogether={142}
 *     mood="happy"
 *   />
 */

import React from 'react';

export interface SharedHomeProps {
  /** Partner name */
  partnerName: string;
  /** Partner avatar */
  partnerAvatar?: string;
  /** Days together */
  daysTogether?: number;
  /** Current mood */
  mood?: 'happy' | 'loving' | 'excited' | 'calm';
  /** Recent activity count */
  recentActivity?: number;
  /** Active goals count */
  activeGoals?: number;
  /** Upcoming events count */
  upcomingEvents?: number;
  /** Custom class */
  className?: string;
}

const moodIcons: Record<NonNullable<SharedHomeProps['mood']>, { emoji: string; color: string }> = {
  happy: { emoji: '😊', color: 'text-ts-gold' },
  loving: { emoji: '💕', color: 'text-ts-pink' },
  excited: { emoji: '✨', color: 'text-ts-gold' },
  calm: { emoji: '🌙', color: 'text-ts-teal' },
};

const SharedHome: React.FC<SharedHomeProps> = ({
  partnerName,
  partnerAvatar,
  daysTogether,
  mood = 'happy',
  recentActivity = 0,
  activeGoals = 0,
  upcomingEvents = 0,
  className = '',
}) => {
  const moodData = moodIcons[mood];

  return (
    <div
      className={`
        rounded-2xl
        border border-white/8
        bg-gradient-to-br from-ts-gold/10 via-transparent to-transparent
        backdrop-blur-xl
        shadow-[0_4px_20px_rgba(0,0,0,0.4)]
        ${className}
      `}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          {partnerAvatar ? (
            <img src={partnerAvatar} alt={partnerName} className="w-12 h-12 rounded-full object-cover border-2 border-ts-gold/20" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-ts-gold/20 flex items-center justify-center border-2 border-ts-gold/20">
              <span className="text-sm font-semibold text-ts-gold">{partnerName?.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div>
            <h3 className="text-base font-semibold text-ts-primary">Dere to</h3>
            <p className="text-sm text-ts-text-subtle">
              {daysTogether !== undefined ? `${daysTogether} dagar saman` : 'Dekk delar heimen'}
            </p>
          </div>
          <span className="text-2xl ml-auto">{moodData.emoji}</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="px-6 py-4 grid grid-cols-3 gap-3">
        {[
          { label: 'Aktivitet', value: recentActivity, icon: '🔔' },
          { label: 'Mål', value: activeGoals, icon: '🎯' },
          { label: 'Arr', value: upcomingEvents, icon: '📅' },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl bg-ts-glass/50 p-3 text-center">
            <span className="text-lg">{stat.icon}</span>
            <p className="text-xl font-bold text-ts-primary mt-1">{stat.value}</p>
            <p className="text-xs text-ts-text-subtle">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="px-6 py-4 border-t border-white/5 flex gap-2">
        {[
          { label: 'Skriv', icon: '✍️' },
          { label: 'Minne', icon: '📸' },
          { label: 'Spør', icon: '💬' },
        ].map((action, i) => (
          <button
            key={i}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-ts-glass/50 border border-white/8 text-sm text-ts-text-secondary hover:bg-ts-gold/10 hover:text-ts-gold hover:border-ts-gold/20 transition-all"
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

SharedHome.displayName = 'SharedHome';
export default SharedHome;