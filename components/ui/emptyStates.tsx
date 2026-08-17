/**
 * Tosom 4.0 — Empty States System
 *
 * 7 empty state variants with illustrations and warm microcopy.
 *
 * Usage:
 *   import { EmptyState, type EmptyStateVariant } from '@/components/ui/emptyStates'
 */

import React from 'react';

/* ── Empty State Variants ── */
export type EmptyStateVariant =
  | 'noMessages'
  | 'noMatches'
  | 'noMemories'
  | 'noMilestones'
  | 'noJourneySteps'
  | 'noAIInsights'
  | 'noCoupleData'
  | 'noGoals'
  | 'noCalendar'
  | 'noJournal'
  | 'noProfile'
  | 'noNotifications';

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/* ── Default Variant Map ── */
const variantMap: Record<EmptyStateVariant, { title: string; description: string; icon: string; gradient: string }> = {
  noMessages: {
    title: 'Ingen meldinger ennå',
    description: 'Når reisen deres tar tak, vil meldingene komme her. Ta det første skjeget.',
    icon: '💌',
    gradient: 'from-[#D4AF37]/10 to-transparent',
  },
  noMatches: {
    title: 'Din reise har nettopp begynt',
    description: 'Resonans tar tid. Vær tålmodig med deg selv og med dem som kommer.',
    icon: '🌱',
    gradient: 'from-[#4DFF88]/10 to-transparent',
  },
  noMemories: {
    title: 'Dere har ikke lagd noen minner ennå',
    description: 'Hvert øyeblikk er verdt å huske. Lag deres første minne sammen.',
    icon: '📖',
    gradient: 'from-[#60A5FA]/10 to-transparent',
  },
  noMilestones: {
    title: 'Ingen milepæler ennå',
    description: 'Hver reise har øyeblikker som fortjener å feires. Deres første venter.',
    icon: '🏔️',
    gradient: 'from-[#F472B6]/10 to-transparent',
  },
  noJourneySteps: {
    title: 'Reisen er klar',
    description: 'Deres første kapittel venter. La oss gå sammen inn i det.',
    icon: '🗺️',
    gradient: 'from-[#C084FC]/10 to-transparent',
  },
  noAIInsights: {
    title: 'AI-innsikt kommer snart',
    description: 'Jo mer dere deler, jo dypere blir innsikten. Vi lærer om dere over tid.',
    icon: '✨',
    gradient: 'from-[#D4AF37]/10 to-transparent',
  },
  noCoupleData: {
    title: 'Dere har ikke koblet sammen ennå',
    description: 'Når dere tar det første skjeget together, vil felles data vises her.',
    icon: '♡',
    gradient: 'from-[#F472B6]/10 to-transparent',
  },
  noGoals: {
    title: 'Ingen mål satt ennå',
    description: 'Delte mål binder to mennesker nærmere. Sett deres første sammen.',
    icon: '🎯',
    gradient: 'from-[#34D399]/10 to-transparent',
  },
  noCalendar: {
    title: 'Kalenderen er tom',
    description: 'Legg til en spesiell dato. En middag, en reise, et øyeblikk.',
    icon: '📅',
    gradient: 'from-[#60A5FA]/10 to-transparent',
  },
  noJournal: {
    title: 'Dagboken venter',
    description: 'Skriv første oppslag. Noe dere kan se tilbake på med varme.',
    icon: '📓',
    gradient: 'from-[#D4AF37]/10 to-transparent',
  },
  noProfile: {
    title: 'Profilen din er tom',
    description: 'Fortell verden hvem dere er. Bilder, bio, interesser.',
    icon: '👤',
    gradient: 'from-[#C084FC]/10 to-transparent',
  },
  noNotifications: {
    title: 'Ingen varsler',
    description: 'Når noe viktig skjer, vil det vises her. Ta det rolig.',
    icon: '🔔',
    gradient: 'from-[#94A3B8]/10 to-transparent',
  },
};

/* ── Illustration Component ── */
const EmptyIllustration: React.FC<{ icon: string; gradient: string }> = ({ icon, gradient }) => (
  <div className={`w-32 h-32 mx-auto mb-6 bg-gradient-to-br ${gradient} rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/8`}>
    <span className="text-5xl">{icon}</span>
  </div>
);

/* ── Main EmptyState Component ── */
const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'noMessages',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  const v = variantMap[variant];
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <EmptyIllustration icon={v.icon} gradient={v.gradient} />
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

/* ── Pre-built Empty States ── */
export const NoMessagesEmpty = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState variant="noMessages" {...props} />
);

export const NoMatchesEmpty = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState variant="noMatches" {...props} />
);

export const NoMemoriesEmpty = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState variant="noMemories" {...props} />
);

export const NoMilestonesEmpty = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState variant="noMilestones" {...props} />
);

export const NoJourneyStepsEmpty = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState variant="noJourneySteps" {...props} />
);

export const NoAIInsightsEmpty = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState variant="noAIInsights" {...props} />
);

export const NoCoupleDataEmpty = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState variant="noCoupleData" {...props} />
);

export { EmptyState };
export default EmptyState;