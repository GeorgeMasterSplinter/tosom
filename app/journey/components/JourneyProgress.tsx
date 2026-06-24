/**
 * ToSom – JourneyProgress
 * Gull progress-bar for 30-dagers reise.
 * Premium styling med glassmorphism.
 */

'use client';

import { FC } from 'react';

interface JourneyProgressProps {
  percent: number;
  completedDays: number;
  totalDays: number;
  phaseLabel: string;
  day: number;
}

export const JourneyProgress: FC<JourneyProgressProps> = ({
  percent,
  completedDays,
  totalDays,
  phaseLabel,
  day,
}) => {
  return (
    <div
      className="rounded-2xl px-6 py-5 fade-in"
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Phase banner */}
      <div className="text-center mb-4">
        <span
          className="text-sm font-medium"
          style={{ color: '#D4AF37' }}
        >
          {phaseLabel} · Reisepunkt {day} av {totalDays}
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-medium"
          style={{ color: 'rgba(255, 255, 255, 0.45)' }}
        >
          Ferdig: {completedDays} av {totalDays}
        </span>
        <span
          className="text-sm font-semibold"
          style={{ color: '#D4AF37' }}
        >
          {percent}%
        </span>
      </div>
      <div
        className="h-[6px] rounded-full overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
        }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${percent}%`,
            background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
            boxShadow: '0 0 12px rgba(212,175,55,0.25)',
            transition: 'width 0.35s ease-out',
          }}
        />
      </div>
    </div>
  );
};