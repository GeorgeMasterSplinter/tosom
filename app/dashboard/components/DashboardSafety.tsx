/**
 * ToSom Dashboard 1.0 — DashboardSafety
 * Viser trygghetspunkter som gir brukeren kontroll og ro.
 * Context-drevet via useDashboard().
 */

'use client';

import { FC } from 'react';
import { useDashboard } from '../context/DashboardContext';

export const DashboardSafety: FC = () => {
  const { state } = useDashboard();

  // Loading
  if (state.loading) {
    return <div className="w-full rounded-2xl bg-[var(--ts-bg-soft)] h-32 animate-pulse mb-10" />;
  }

  // Error
  if (state.error) {
    return <p className="text-red-400 mb-10">{state.error}</p>;
  }

  const safetyPoints = state.safetyPoints;

  if (!safetyPoints || safetyPoints.length === 0) {
    return null;
  }

  return (
    <div className="w-full rounded-2xl bg-[var(--ts-bg-soft)] border-[var(--ts-border)] p-8 md:p-10 space-y-6 mb-10 hover:bg-[var(--ts-bg-hover)] hover:border-[var(--ts-border-strong)] transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--ts-gold)]/40 focus:outline-none ts-shadow-card animate-subtlePop">
      {/* Seksjonstittel */}
      <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-white">
        Din trygghet
      </h2>

      {/* Undertekst */}
      <p className="text-[var(--ts-text-soft)] leading-[1.7] max-w-md">
        ToSom er bygget for å gi deg kontroll og ro.
      </p>

      {/* Trygghetspunkter */}
      <div className="space-y-6">
        {safetyPoints.map((point, i) => (
          <div key={i} className="flex items-start gap-4 group">
            {/* Ikon */}
            <div className="flex-shrink-0 text-3xl md:text-4xl text-[var(--ts-gold)] transition-transform duration-300 group-hover:scale-110">
              🔒
            </div>

            {/* Tekst */}
            <div>
              <h3 className="text-lg md:text-xl font-medium tracking-tight text-[var(--ts-text)] mb-1">
                {point.title}
              </h3>
              <p className="text-[var(--ts-text-soft)] leading-[1.7] text-sm max-w-md">
                {point.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSafety;