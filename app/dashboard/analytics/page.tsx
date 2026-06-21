/**
 * ToSom Dashboard 1.0 — Analytics Page
 * Premium analytics-side med statistikk og innsikt.
 */

'use client';

import { useDashboard } from '../context/DashboardContext';

export default function AnalyticsPage() {
  const { state } = useDashboard();

  const progressPercent = state.progress !== null && state.progress > 0
    ? (state.progress / 30) * 100
    : 0;

  return (
    <div className="space-y-10 md:space-y-14 animate-subtlePop">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-white">
          Innsikt & Analyse
        </h1>
        <p className="text-[var(--ts-text-soft)] leading-[1.7] mt-2">
          En oversikt over utviklingen i deres relasjon.
        </p>
      </div>

      {/* Fremdriftsstatistikk */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Progresjon</h2>
        <div className="
          bg-[var(--ts-bg-soft)]
          border border-[var(--ts-border)]
          rounded-xl p-6 ts-shadow-card animate-subtlePop
        ">
          {/* Progresjonsbar */}
          <div className="w-full h-3 bg-[var(--ts-bg)] rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-[var(--ts-gold)] transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[var(--ts-text)] text-lg">
            {state.progress ?? 0} av 30 steg fullført
          </p>
          <p className="text-[var(--ts-text-soft)] text-sm mt-2">
            Sist oppdatert: {state.journeyUpdatedAt ? 'Nylig' : 'Ingen data ennå'}
          </p>
        </div>
      </section>

      {/* Samtaleaktivitet */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Samtaleaktivitet</h2>
        <div className="
          bg-[var(--ts-bg-soft)]
          border border-[var(--ts-border)]
          rounded-xl p-6 ts-shadow-card animate-subtlePop
        ">
          <p className="text-[var(--ts-text)]">
            Siste melding:
          </p>
          <p className="text-[var(--ts-text-soft)] italic mt-2">
            {state.lastMessagePreview || 'Ingen meldinger ennå'}
          </p>
        </div>
      </section>

      {/* Milepæl-historikk */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Milepæler</h2>
        <div className="space-y-4">
          {state.milestoneMessage && (
            <div className="
              bg-[var(--ts-gold-soft)]
              border border-[var(--ts-gold)]
              text-[var(--ts-gold)]
              rounded-xl p-4 ts-shadow-gold animate-fadeIn
            ">
              {state.milestoneMessage}
            </div>
          )}
          {!state.milestoneMessage && (
            <p className="text-[var(--ts-text-soft)]">
              Ingen milepæler registrert ennå.
            </p>
          )}
        </div>
      </section>

      {/* Graf-placeholder */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Visualiseringer</h2>
        <div className="
          bg-[var(--ts-bg-soft)]
          border border-[var(--ts-border)]
          rounded-xl p-10 ts-shadow-card text-center text-[var(--ts-text-soft)]
        ">
          Grafer kommer snart.
        </div>
      </section>
    </div>
  );
}