/**
 * Tosom Dashboard 1.0 — DashboardDailyStep
 * Viser dagens steg i 30-dagersreisen med fremdriftsindikator.
 * Context-drevet via useDashboard().
 */

'use client';

import { FC } from 'react';
import Link from 'next/link';
import { useDashboard } from '../context/DashboardContext';

export const DashboardDailyStep: FC = () => {
  const { state } = useDashboard();

  const progressPercent = state.progress !== null && state.progress > 0
    ? (state.progress / 30) * 100
    : 0;

  // Loading
  if (state.loading) {
    return <div className="w-full rounded-2xl bg-[var(--ts-bg-soft)] h-32 animate-pulse mb-10" />;
  }

  // Error
  if (state.error) {
    return <p className="text-red-400 mb-10">{state.error}</p>;
  }

  // Tomtilstand: ingen steg ennå
  if (state.progress === null || state.progress === 0) {
    return (
      <div className="w-full rounded-2xl bg-[var(--ts-bg-soft)] border-[var(--ts-border)] p-8 md:p-10 space-y-6 mb-10 hover:bg-[var(--ts-bg-hover)] hover:border-[var(--ts-border-strong)] transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--ts-gold)]/40 focus:outline-none ts-shadow-card animate-subtlePop">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-white">
          Dagens steg
        </h2>
        <p className="text-lg text-[var(--ts-text-soft)] leading-[1.7]">
          Reisen starter i dag. Din første oppgave vil dukke opp her.
        </p>
      </div>
    );
  }

  const todayStep = state.todayStep ?? 'Dag 5 – Verdier og forventninger';
  const stepDescription = state.stepDescription ?? 'Utforsk hva som betyr mest for dere.';
  const progress = state.progress;
  const primaryCTA = 'Start steget';
  const primaryCTAHref = '/journey';

  return (
    <div className="w-full rounded-2xl bg-[var(--ts-bg-soft)] border-[var(--ts-border)] p-8 md:p-10 space-y-6 mb-10 hover:bg-[var(--ts-bg-hover)] hover:border-[var(--ts-border-strong)] transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--ts-gold)]/40 focus:outline-none ts-shadow-card animate-subtlePop">
      {/* Seksjonstittel */}
      <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-white">
        Dagens steg
      </h2>

      {/* Undertekst */}
      <p className="text-[var(--ts-text-soft)] leading-[1.7] max-w-md">
        Dit daglige fokus i reisen.
      </p>

      {/* Steg-tittel */}
      <div>
        <p className="text-xl md:text-2xl font-medium tracking-tight text-[var(--ts-text)] mb-2">
          {todayStep}
        </p>
        <p className="text-[var(--ts-text-soft)] leading-[1.7] max-w-md text-sm">
          {stepDescription}
        </p>
      </div>

      {/* Fremdriftsindikator */}
      <div>
        <p className="text-xs text-[var(--ts-text-soft)] leading-[1.6] mb-2">
          {progress} av 30 dager
        </p>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4AF37] transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* CTA */}
      <div className="pt-2">
        <Link
          href={primaryCTAHref}
            className="btn-cta-primary inline-block"
        >
          {primaryCTA}
        </Link>
      </div>
    </div>
  );
};

export default DashboardDailyStep;