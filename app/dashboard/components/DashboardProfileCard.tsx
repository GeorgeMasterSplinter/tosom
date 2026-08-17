/**
 * Tosom Dashboard 1.0 — DashboardProfileCard
 * Lite, rolig, premium profilkort øverst i Dashboardet.
 */

'use client';

import { FC } from 'react';
import { useDashboard } from '../context/DashboardContext';

export const DashboardProfileCard: FC = () => {
  const { state } = useDashboard();

  const profile = state.profile;

  // Loading eller ingen profil
  if (!profile) return null;

  const yourName = profile.yourName ?? 'Deg';
  const partnerName = profile.partnerName ?? 'Partneren din';
  const matchDate = profile.matchDate ?? 'Ukjent';
  const relationshipStyle = profile.relationshipStyle ?? 'Åpen';
  const sharedValues = profile.sharedValues ?? [];

  return (
    <div className="w-full rounded-2xl bg-[var(--ts-bg-soft)] border-[var(--ts-border)] p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 hover:bg-[var(--ts-bg-hover)] hover:border-[var(--ts-border-strong)] transition-all duration-300 animate-subtlePop ts-shadow-card">
      {/* Profil-ikon */}
      <div className="text-5xl md:text-6xl text-[var(--ts-gold)] flex-shrink-0">
        👥
      </div>

      {/* Tekstseksjon */}
      <div className="flex-1 text-center sm:text-left">
        {/* Navn */}
        <p className="text-xl md:text-2xl font-medium tracking-[-0.01em] text-[var(--ts-text)] mb-2">
          {yourName} & {partnerName}
        </p>

        {/* Undertekst */}
        <p className="text-[var(--ts-text-soft)] text-sm leading-[1.6] mb-4">
          Matchet {matchDate} · {relationshipStyle}
        </p>

        {/* Verdier */}
        {sharedValues.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {sharedValues.map((value, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-[var(--ts-gold-soft)] text-[var(--ts-gold)] text-xs"
              >
                {value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardProfileCard;