/**
 * ToSom Dashboard — Journey Page (B2.4)
 * Reise-kalender med dag N av 30, fase, milepæler og hva fasen betyr.
 * 
 * B2.4: Reise ikke startet → «Reisen deres begynner når dere begge har vært innom»
 * Milepæler: dag 15 bilder, dag 30 avslutning.
 */

'use client';

import { FC } from 'react';
import { useDashboard } from '../context/DashboardContext';

const TOTAL_DAYS = 30;

// Faser: EARLY 1–14, BUILDING_TRUST 15–21, DEEPER 22–25, CHECKIN 26–30
const PHASES = [
  { key: 'EARLY', name: 'Bryt isen', start: 1, end: 14, description: 'De første dagene handler om å bli kjent — rolig og uten press. Del små historier, still spørsmål, og la samtalen vokse naturlig.' },
  { key: 'BUILDING_TRUST', name: 'Bygg tillit', start: 15, end: 21, description: 'Nå som dere har blitt litt kjent, kan dere dele mer. Fra dag 15 kan dere også dele bilder med hverandre.' },
  { key: 'DEEPER', name: 'Dypere samtaler', start: 22, end: 25, description: 'De siste dagene før avslutning er for de viktige samtalene — verdier, drømmer, og hva dere har lært om hverandre.' },
  { key: 'CHECKIN', name: 'Sjekk inn', start: 26, end: 30, description: 'Reisen nærmer seg slutten. Snakk om hva dere tar med dere videre, og forbered dere på dag 30.' },
];

function getPhaseForDay(day: number) {
  return PHASES.find(p => day >= p.start && day <= p.end) || PHASES[0];
}

// Milepæler
const MILESTONES = [
  { day: 1, label: 'Reisen starter', description: 'Dag 1 begynner når dere begge har vært innom.' },
  { day: 15, label: 'Bilder åpnes', description: 'Fra dag 15 kan dere dele bilder med hverandre.' },
  { day: 30, label: 'Avslutning', description: 'Dag 30: Velg hvordan reisen skal ende.' },
];

export default function JourneyPage() {
  const { state } = useDashboard();

  const currentDay = state.progress ?? 0;
  const bothSeenAt = (state as any).journey?.bothSeenAt ?? null;
  const journeyStarted = currentDay > 0 || bothSeenAt !== null;
  const currentPhase = getPhaseForDay(Math.max(currentDay, 1));
  const progressPercent = (currentDay / TOTAL_DAYS) * 100;

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

      {/* B2.4: Reise ikke startet → venter-tilstand */}
      {!journeyStarted ? (
        <div className="
          bg-[var(--ts-gold-soft)]
          border border-[var(--ts-gold)]
          rounded-xl p-6 ts-shadow-gold text-center
        ">
          <p className="text-lg font-medium text-[var(--ts-gold)]">
            Reisen deres begynner når dere begge har vært innom.
          </p>
          <p className="text-[var(--ts-text-soft)] text-sm mt-2">
            Dag 1 starter når begge har sett matchen.
          </p>
        </div>
      ) : (
        <>
          {/* Dag N av 30 */}
          <div className="text-center">
            <p className="text-5xl font-bold text-[var(--ts-gold)]">
              Dag {currentDay}
            </p>
            <p className="text-[var(--ts-text-soft)] mt-1">av {TOTAL_DAYS}</p>
          </div>

          {/* Fremgangsbar */}
          <div>
            <div className="w-full h-4 bg-[var(--ts-bg-soft)] rounded-xl overflow-hidden border border-[var(--ts-border)] ts-shadow-card">
              <div
                className="h-full bg-[var(--ts-gold)] transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Nåværende fase */}
          <section className="
            bg-[var(--ts-bg-soft)]
            border border-[var(--ts-gold)]
            rounded-xl p-6 ts-shadow-gold
          ">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🌟</span>
              <h2 className="text-xl font-semibold text-[var(--ts-gold)]">
                {currentPhase.name}
              </h2>
              <span className="text-sm text-[var(--ts-text-soft)]">
                (dag {currentPhase.start}–{currentPhase.end})
              </span>
            </div>
            <p className="text-[var(--ts-text)] leading-relaxed">
              {currentPhase.description}
            </p>
          </section>
        </>
      )}

      {/* Fase-oversikt */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Fasene</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {PHASES.map((phase) => {
            const isActive = journeyStarted && currentPhase.key === phase.key;
            const isPast = journeyStarted && currentDay > phase.end;
            return (
              <div
                key={phase.key}
                className={`
                  rounded-xl p-4 border transition-all duration-300
                  ${isActive
                    ? 'bg-[var(--ts-gold-soft)] border-[var(--ts-gold)] ts-shadow-gold'
                    : isPast
                      ? 'bg-[var(--ts-bg-soft)] border-[var(--ts-border)] opacity-60'
                      : 'bg-[var(--ts-bg-soft)] border-[var(--ts-border)]'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-medium ${isActive ? 'text-[var(--ts-gold)]' : 'text-white'}`}>
                    {phase.name}
                  </h3>
                  <span className="text-xs text-[var(--ts-text-soft)]">
                    Dag {phase.start}–{phase.end}
                  </span>
                </div>
                <p className="text-sm text-[var(--ts-text-soft)] leading-relaxed">
                  {phase.description}
                </p>
                {isPast && <span className="text-xs text-[var(--ts-gold)] mt-2 inline-block">✓ Fullført</span>}
                {isActive && <span className="text-xs text-[var(--ts-gold)] mt-2 inline-block">● Nåværende</span>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Milepæler */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Milepæler</h2>
        <div className="space-y-4">
          {MILESTONES.map((milestone) => {
            const isReached = journeyStarted && currentDay >= milestone.day;
            const isToday = journeyStarted && currentDay === milestone.day;
            return (
              <div
                key={milestone.day}
                className={`
                  flex items-start gap-4 rounded-xl p-4 border transition-all duration-300
                  ${isToday
                    ? 'bg-[var(--ts-gold-soft)] border-[var(--ts-gold)] ts-shadow-gold animate-fadeIn'
                    : isReached
                      ? 'bg-[var(--ts-bg-soft)] border-[var(--ts-gold)]'
                      : 'bg-[var(--ts-bg-soft)] border-[var(--ts-border)]'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold
                  ${isReached ? 'bg-[var(--ts-gold)] text-[var(--ts-bg)]' : 'bg-[var(--ts-bg-soft)] text-[var(--ts-text-soft)] border border-[var(--ts-border)]'}
                `}>
                  {isReached ? '✓' : milestone.day}
                </div>
                <div>
                  <p className={`font-medium ${isReached ? 'text-[var(--ts-gold)]' : 'text-white'}`}>
                    {milestone.label}
                  </p>
                  <p className="text-sm text-[var(--ts-text-soft)] mt-0.5">
                    {milestone.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Kommende steg (fra context) */}
      {state.upcomingSteps && state.upcomingSteps.length > 0 && (
        <section>
          <h2 className="text-xl font-medium text-white mb-4">Kommende steg</h2>
          <ul className="space-y-4">
            {state.upcomingSteps.map((step: { label: string }, i: number) => (
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
      )}

      {/* Milestone-melding fra context */}
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
  );
}