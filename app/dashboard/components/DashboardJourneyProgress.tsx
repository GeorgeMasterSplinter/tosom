/**
 * Tosom Dashboard 1.0 — DashboardJourneyProgress
 * Viser total fremdrift i 30-dagersreisen og kommende steg.
 * Context-drevet via useDashboard().
 */

'use client';

import { FC } from 'react';
import { useDashboard } from '../context/DashboardContext';

export const DashboardJourneyProgress: FC = () => {
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

  // Tomtilstand: ingen fremdrift ennå
  if (state.progress === null || state.progress === 0) {
    return (
      <div className="w-full rounded-2xl bg-[var(--ts-bg-soft)] border-[var(--ts-border)] p-8 md:p-10 space-y-6 mb-10 hover:bg-[var(--ts-bg-hover)] hover:border-[var(--ts-border-strong)] transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--ts-gold)]/40 focus:outline-none ts-shadow-card animate-subtlePop">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-white">
          Din reise
        </h2>
        <p className="text-lg text-[var(--ts-text-soft)] leading-[1.7]">
          Reisen starter i dag. Fremdriften vil vises her når dere begynner.
        </p>
      </div>
    );
  }

  const progress = state.progress;
  const upcomingSteps = state.upcomingSteps ?? [];

  return (
    <div className="w-full rounded-2xl bg-[var(--ts-bg-soft)] border-[var(--ts-border)] p-8 md:p-10 space-y-6 mb-10 hover:bg-[var(--ts-bg-hover)] hover:border-[var(--ts-border-strong)] transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--ts-gold)]/40 focus:outline-none ts-shadow-card animate-subtlePop">
      {/* Seksjonstittel */}
      <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-white">
        Din reise
      </h2>

      {/* Undertekst */}
      <p className="text-[var(--ts-text-soft)] leading-[1.7] max-w-md">
        Slik ser fremgangen din ut akkurat nå.
      </p>

      {/* Milestone-banner */}
      {state.milestoneMessage && (
        <p className="text-[var(--ts-gold)] text-sm animate-pulse">
          {state.milestoneMessage}
        </p>
      )}

      {/* Fremdriftsbar */}
      <div>
        <p className="text-xs text-[var(--ts-text-soft)] leading-[1.6] mb-2">
          {progress} av 30 dager fullført
        </p>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--ts-gold)] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Oppdaterings-indikator */}
      {state.journeyUpdatedAt && (
        <p className="text-xs text-[var(--ts-text-soft)] animate-pulse">
          Fremdrift oppdatert
        </p>
      )}

      {/* Liste over kommende steg */}
      {upcomingSteps.length > 0 && (
        <div>
          <p className="text-xs text-[var(--ts-text-soft)] leading-[1.6] mb-3">Kommende steg</p>
          <ul className="space-y-3">
            {upcomingSteps.map((step, i) => (
              <li key={i} className="text-[var(--ts-text-soft)] leading-[1.7] text-sm animate-fadeIn">
                {step.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DashboardJourneyProgress;