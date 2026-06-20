/**
 * ToSom 4.0 — Success States System
 *
 * 8 success state variants with warm animations and microcopy.
 *
 * Usage:
 *   import { SuccessState, type SuccessVariant } from '@/components/ui/successStates'
 */

import React from 'react';

/* ── Success Variants ── */
export type SuccessVariant =
  | 'matchSuccess'
  | 'memoryAdded'
  | 'milestoneUnlocked'
  | 'journeyCompleted'
  | 'profileUpdated'
  | 'messageSent'
  | 'goalCreated'
  | 'connectionMade';

export interface SuccessStateProps {
  variant?: SuccessVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  showConfetti?: boolean;
  className?: string;
}

/* ── Variant Map ── */
const variantMap: Record<SuccessVariant, { title: string; description: string; icon: string; color: string; anim: string }> = {
  matchSuccess: {
    title: 'Resonans funnet ♡',
    description: 'Dere har en naturlig forbindelse. La samtalen begynne.',
    icon: '💛',
    color: 'from-[#D4AF37]/20 to-[#E8C766]/10',
    anim: 'bounce',
  },
  memoryAdded: {
    title: 'Minne lagret',
    description: 'Dette øyeblikket vil alltid være verdt å huske.',
    icon: '📖',
    color: 'from-[#60A5FA]/20 to-transparent',
    anim: 'fade',
  },
  milestoneUnlocked: {
    title: 'Milestone oppnådd!',
    description: 'En milepæl på reisen deres. Stolt av dere.',
    icon: '🏔️',
    color: 'from-[#F472B6]/20 to-[#D4AF37]/10',
    anim: 'pop',
  },
  journeyCompleted: {
    title: 'Kapittel fullført',
    description: 'Dere har fullført et viktig steg. Neste venter.',
    icon: '🗺️',
    color: 'from-[#34D399]/20 to-transparent',
    anim: 'slide',
  },
  profileUpdated: {
    title: 'Profil oppdatert',
    description: 'Din profil er friskt oppdatert. Se bra ut!',
    icon: '✨',
    color: 'from-[#C084FC]/20 to-transparent',
    anim: 'fade',
  },
  messageSent: {
    title: 'Melding sendt',
    description: 'Dine ord er på vei. De vil bli mottatt med varme.',
    icon: '💌',
    color: 'from-[#D4AF37]/20 to-[#60A5FA]/10',
    anim: 'slide',
  },
  goalCreated: {
    title: 'Mål satt',
    description: 'Samlede mål er et skritt mot en dypere forbindelse.',
    icon: '🎯',
    color: 'from-[#34D399]/20 to-transparent',
    anim: 'pop',
  },
  connectionMade: {
    title: 'Forbindelse opprettet',
    description: 'Dere er offisielt koblet. Reisen deres starter nå.',
    icon: '♡',
    color: 'from-[#F472B6]/20 to-[#D4AF37]/10',
    anim: 'bounce',
  },
};

/* ── Confetti Particles ── */
const Confetti: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {Array.from({ length: 24 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 rounded-full animate-confetti"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 60}%`,
          backgroundColor: ['#D4AF37', '#F472B6', '#60A5FA', '#34D399', '#C084FC', '#E8C766'][i % 6],
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${1.5 + Math.random() * 2}s`,
        }}
      />
    ))}
  </div>
);

/* ── Pulse Ring ── */
const PulseRing: React.FC<{ color: string }> = ({ color }) => (
  <div className="relative flex items-center justify-center">
    <div className={`absolute w-28 h-28 rounded-full bg-gradient-to-br ${color} animate-ping opacity-20`} style={{ animationDuration: '2s' }} />
    <div className={`absolute w-22 h-22 rounded-full bg-gradient-to-br ${color} animate-ping opacity-10`} style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
  </div>
);

/* ── SuccessIcon ── */
const SuccessIcon: React.FC<{ icon: string; anim: string; color: string }> = ({ icon, anim, color }) => {
  const animClass = anim === 'bounce' ? 'animate-bounce' : anim === 'pop' ? 'animate-[popIn_0.4s_ease-out]' : 'animate-[fadeIn_0.5s_ease-out]';
  return (
    <div className={`relative w-32 h-32 mx-auto mb-6 bg-gradient-to-br ${color} rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/8 ${animClass}`}>
      <span className="text-5xl">{icon}</span>
    </div>
  );
};

/* ── SuccessState Component ── */
const SuccessState: React.FC<SuccessStateProps> = ({
  variant = 'matchSuccess',
  title,
  description,
  actionLabel,
  onAction,
  showConfetti = true,
  className = '',
}) => {
  const v = variantMap[variant];
  return (
    <div className={`relative flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      {showConfetti && <Confetti />}
      <PulseRing color={v.color} />
      <SuccessIcon icon={v.icon} anim={v.anim} color={v.color} />
      <h3 className="text-white font-semibold text-lg text-center mb-2">{title || v.title}</h3>
      <p className="text-white/50 text-sm text-center max-w-xs leading-relaxed mb-6">{description || v.description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-[#D4AF37] text-[#0B0E11] px-6 py-3 rounded-xl font-semibold text-sm active:scale-[0.97] transition-transform"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

/* ── Pre-built Success States ── */
export const MatchSuccess = (props: Omit<SuccessStateProps, 'variant'>) => (
  <SuccessState variant="matchSuccess" {...props} />
);

export const MemoryAddedSuccess = (props: Omit<SuccessStateProps, 'variant'>) => (
  <SuccessState variant="memoryAdded" {...props} />
);

export const MilestoneUnlockedSuccess = (props: Omit<SuccessStateProps, 'variant'>) => (
  <SuccessState variant="milestoneUnlocked" {...props} />
);

export const JourneyCompletedSuccess = (props: Omit<SuccessStateProps, 'variant'>) => (
  <SuccessState variant="journeyCompleted" {...props} />
);

export const ProfileUpdatedSuccess = (props: Omit<SuccessStateProps, 'variant'>) => (
  <SuccessState variant="profileUpdated" {...props} />
);

export { SuccessState };
export default SuccessState;