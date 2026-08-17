/**
 * Tosom Dashboard 1.0 — DashboardTopCard
 * Hovedkort som viser relasjonsstatus, dager sammen og primære handlinger.
 * Context-drevet via useDashboard().
 */

'use client';

import { FC } from 'react';
import Link from 'next/link';
import { useDashboard } from '../context/DashboardContext';

export const DashboardTopCard: FC = () => {
  const { state } = useDashboard();

  // Loading
  if (state.loading) {
    return <div className="w-full rounded-2xl bg-[var(--ts-bg-soft)] h-32 animate-pulse mb-10" />;
  }

  // Error
  if (state.error) {
    return <p className="text-red-400 mb-10">{state.error}</p>;
  }

  // Tomtilstand: ingen match ennå
  if (state.daysTogether === null || state.daysTogether === 0) {
    return (
      <div className="w-full rounded-2xl bg-[var(--ts-bg-soft)] border-[var(--ts-border)] p-8 md:p-10 space-y-6 mb-10 hover:bg-[var(--ts-bg-hover)] hover:border-[var(--ts-border-strong)] transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--ts-gold)]/40 focus:outline-none ts-shadow-card animate-subtlePop">
        <p className="text-lg text-[var(--ts-text-soft)] leading-[1.6]">
          Dere har nettopp blitt matchet. Din reise starter snart.
        </p>
      </div>
    );
  }

  const matchStatus = state.matchStatus ?? 'Dere er matchet';
  const daysTogether = state.daysTogether;
  const nextMilestone = state.nextMilestone ?? 'Ingen milepæl definert';
  const primaryCTA = 'Gå til samtalen';
  const secondaryCTA = 'Se reisen';
  const primaryCTAHref = '/conversation';
  const secondaryCTAHref = '/journey';

  return (
    <div className="w-full rounded-2xl bg-[var(--ts-bg-soft)] border-[var(--ts-border)] p-8 md:p-10 space-y-6 mb-10 hover:bg-[var(--ts-bg-hover)] hover:border-[var(--ts-border-strong)] transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--ts-gold)]/40 focus:outline-none ts-shadow-card animate-subtlePop">
        {/* Seksjonstittel */}
        <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-white">
          Din relasjon
        </h2>

        {/* Undertekst */}
        <p className="text-[var(--ts-text-soft)] leading-[1.7] max-w-md">
          Her er oversikten over din nåværende reise og neste steg.
        </p>

      {/* Milestone-banner */}
      {state.milestoneMessage && (
        <div className="bg-[var(--ts-gold-soft)] border border-[var(--ts-gold)]/30 text-[var(--ts-gold)] text-sm px-4 py-3 rounded-xl animate-fadeIn">
          {state.milestoneMessage}
        </div>
      )}

      {/* Statuslinje */}
      <div className="flex items-center gap-2 text-sm text-gray-300 leading-[1.6]">
        <span className="w-2 h-2 rounded-full bg-[var(--ts-gold)] inline-block" />
        {matchStatus}
      </div>

      {/* Dager sammen */}
      <div>
        <p className="text-[var(--ts-text-soft)] leading-[1.6] text-sm mb-1">Dager sammen</p>
        <p className="text-4xl md:text-5xl font-semibold tracking-tight text-[var(--ts-text)]">
          {daysTogether}
        </p>
      </div>

      {/* Neste milepæl */}
        <p className="text-[var(--ts-text-soft)] leading-[1.6] text-sm">
        {nextMilestone}
      </p>

      {/* CTA-container */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link
          href={primaryCTAHref}
          className="btn-cta-primary inline-block"
        >
          {primaryCTA}
        </Link>
          <Link
            href={secondaryCTAHref}
            className="btn-cta-secondary inline-block"
          >
          {secondaryCTA}
        </Link>
      </div>
    </div>
  );
};

export default DashboardTopCard;