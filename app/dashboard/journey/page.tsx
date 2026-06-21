/**
 * ToSom Dashboard 1.0 — Journey Page
 * Full side for hele relasjonsreisen med premium UI.
 */

'use client';

import { FC } from 'react';
import { useDashboard } from '../context/DashboardContext';

export default function JourneyPage() {
  const { state } = useDashboard();

  const progressPercent = state.progress !== null && state.progress > 0
    ? (state.progress / 30) * 100
    : 0;

  return (
    <div className="space-y-10 md:space-y-14 animate-subtlePop">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-white">
          Deres reise
        </h1>
        <p className="text-[var(--ts-text-soft)] leading-[1.7] mt-2">
          En oversikt over hvor dere er, og hvor dere skal videre.
        </p>
      </div>

      {/* Stor fremgangsbar */}
      <div>
        <div className="w-full h-4 bg-[var(--ts-bg-soft)] rounded-xl overflow-hidden border border-[var(--ts-border)] ts-shadow-card">
          <div
            className="h-full bg-[var(--ts-gold)] transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[var(--ts-text-soft)] text-sm mt-2">
          {state.progress ?? 0} av 30 steg fullført
        </p>
      </div>

      {/* Kommende steg */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Kommende steg</h2>
        <ul className="space-y-4">
          {state.upcomingSteps?.map((step: { label: string }, i: number) => (
            <li
              key={i}
              className="
                bg-[var(--ts-bg-soft)]
                border border-[var(--ts-border)]
                rounded-xl p-4 ts-shadow-card animate-fadeIn
              "
            >
              <p className="text-[var(--ts-text)]">{step.label}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Fullførte steg (placeholder) */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Fullførte steg</h2>
        <div className="
          bg-[var(--ts-bg-soft)]
          border border-[var(--ts-border)]
          rounded-xl p-6 ts-shadow-card text-[var(--ts-text-soft)]
        ">
          Historikk kommer snart.
        </div>
      </section>

      {/* Milepæler (live) */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Milepæler</h2>
        <div className="space-y-4">
          {state.milestoneMessage && (
            <div className="
              bg-[var(--ts-gold-soft)]
              border border-[var(--ts-gold)]
              text-[var(--ts-gold)]
              rounded-xl p-4 animate-fadeIn ts-shadow-gold
            ">
              {state.milestoneMessage}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

