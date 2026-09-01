// components/journey/PremiumJourneyProgressTracker.tsx — Viser 30 dager som grid med gull-farge for utfylte dager
'use client';

import { useState } from 'react';

interface ProgressTrackerProps {
  completedDays: number[];
  currentDay: number;
  onDaySelect?: (day: number) => void;
}

export function PremiumJourneyProgressTracker({ completedDays, currentDay, onDaySelect }: ProgressTrackerProps) {
  const [selectedDay, setSelectedDay] = useState<number>(currentDay);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    onDaySelect?.(day);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '8px',
      maxWidth: '360px',
      margin: '24px auto',
    }}>
      {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
        const isCompleted = completedDays.includes(day);
        const isCurrent = day === currentDay;
        const isSelected = day === selectedDay;

        return (
          <div
            key={day}
            onClick={() => handleDayClick(day)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: isCompleted ? '#D4AF37' :
                          isSelected ? 'rgba(212, 175, 55, 0.2)' :
                          isCurrent && !isSelected ? 'transparent' :
                          'rgba(255, 255, 255, 0.04)',
              border: isSelected || isCurrent ? '2px solid #D4AF37' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isCompleted ? '#0A1A2A' :
                     isSelected ? '#D4AF37' : 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              fontWeight: '500',
              boxSizing: 'border-box',
              transition: 'all 200ms ease-out',
              cursor: 'pointer',
              boxShadow: isSelected ? '0 0 16px rgba(212, 175, 55, 0.4)' : 'none',
            }}
          >
            {isCompleted ? '✓' : day}
          </div>
        );
      })}
    </div>
  );
}
