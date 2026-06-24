/**
 * ToSom – EmptyJourneyState
 * Varmt, inviterende tomt state for journey.
 */

'use client';

import { FC } from 'react';

interface EmptyJourneyStateProps {
  onStarted: () => void;
}

export const EmptyJourneyState: FC<EmptyJourneyStateProps> = ({ onStarted }) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-32 text-center fade-in"
      style={{ animation: 'fadeInUp 0.4s ease-out both' }}
    >
      {/* Gull-ikon */}
      <div
        className="w-20 h-20 mb-6 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(212, 175, 55, 0.08)',
          border: '1px solid rgba(212, 175, 55, 0.18)',
          boxShadow: '0 0 24px rgba(212,175,55,0.2), 0 0 48px rgba(212,175,55,0.1)',
          animation: 'pulseGlow 2.5s infinite ease-in-out',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z"
            stroke="#D4AF37"
            strokeWidth="1.5"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Tekst */}
      <p
        className="text-lg font-medium mb-2"
        style={{ color: 'rgba(255, 255, 255, 0.7)' }}
      >
        Reisen deres er snart klar.
      </p>
      <p
        className="text-sm mb-8"
        style={{ color: 'rgba(255, 255, 255, 0.5)' }}
      >
        Vi bygger stegene basert på svarene deres.
      </p>

      {/* CTA */}
      <button
        onClick={onStarted}
        className="px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.015] active:scale-[0.98]"
        style={{
          background: '#D4AF37',
          color: '#0B0E11',
          boxShadow: '0 0 25px rgba(212,175,55,0.3), 0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        Fullfør profilen din
      </button>
    </div>
  );
};