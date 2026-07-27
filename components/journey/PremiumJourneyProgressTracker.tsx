// components/journey/PremiumJourneyProgressTracker.tsx — Viser 30 dagar som grid med gull-farge for utfylte dagar
'use client';

interface ProgressTrackerProps {
  completedDays: number[];
  currentDay: number;
}

export function PremiumJourneyProgressTracker({ completedDays, currentDay }: ProgressTrackerProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '8px',
      maxWidth: '360px',
      margin: '24px auto',
    }}>
      {Array.from({ length: 35 }, (_, i) => i + 1).map(day => {
        const isCompleted = completedDays.includes(day);
        const isCurrent = day === currentDay;
        const isLocked = day > currentDay;

        return (
          <div
            key={day}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: isCompleted ? '#D4AF37' :
                          isCurrent ? 'transparent' :
                          isLocked ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)',
              border: isCurrent ? '2px solid #D4AF37' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isCompleted ? '#0A1A2A' :
                     isLocked ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              fontWeight: '500',
              boxSizing: 'border-box',
              transition: 'all 200ms ease-out',
            }}
          >
            {isCompleted ? '✓' : day}
          </div>
        );
      })}
    </div>
  );
}