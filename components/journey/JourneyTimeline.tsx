/* ═══════════════════════════════════════════
   ToSom JourneyTimeline — Design System 1.1
   Viser 30-dagers reise med fase-indikatorar.
   Bruk i dashboard og journey-sider.
   ═══════════════════════════════════════════ */

'use client';

interface JourneyTimelineProps {
  currentDay: number;
  completedDays: number[];
  phases?: Array<{ name: string; start: number; end: number }>;
}

const defaultPhases = [
  { name: 'Introduksjon', start: 1, end: 5 },
  { name: 'Trygghet', start: 6, end: 10 },
  { name: 'Opne deg', start: 11, end: 15 },
  { name: 'Dypare samtalar', start: 16, end: 20 },
  { name: 'Sårbarhet', start: 21, end: 25 },
  { name: 'Felles reise', start: 26, end: 30 },
];

export const JourneyTimeline = ({ currentDay, completedDays, phases = defaultPhases }: JourneyTimelineProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Tittel */}
      <h3
        className="text-xl md:text-2xl font-semibold text-center mb-6"
        style={{ color: '#FFFFFF' }}
      >
        Din reise — dag {currentDay} av 30
      </h3>

      {/* Progresjonsbake */}
      <div className="relative mb-8">
        {/* Bakgrunnslinje */}
        <div
          className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full"
          style={{ background: 'rgba(255, 255, 255, 0.06)' }}
        />
        {/* Progresjonslinje */}
        <div
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full transition-all duration-500"
          style={{
            width: `${(currentDay / 30) * 100}%`,
            background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
            boxShadow: '0 0 12px rgba(212, 175, 55, 0.3)',
          }}
        />

        {/* Dots */}
        <div className="relative flex justify-between">
          {Array.from({ length: 31 }).map((_, i) => {
            const day = i;
            const isCompleted = completedDays.includes(day);
            const isCurrent = day === currentDay;
            const isFuture = day > currentDay;

            return (
              <div key={day} className="flex flex-col items-center">
                {/* Dag-dot */}
                <div
                  className={`rounded-full transition-all duration-300 ${
                    isCurrent ? 'scale-125' : 'hover:scale-110'
                  }`}
                  style={{
                    width: isCurrent ? 24 : 12,
                    height: isCurrent ? 24 : 12,
                    marginTop: isCurrent ? -6 : 0,
                    background: isCompleted ? '#D4AF37' :
                                isCurrent ? 'rgba(212, 175, 55, 0.3)' :
                                isFuture ? 'rgba(255, 255, 255, 0.1)' :
                                'rgba(212, 175, 55, 0.6)',
                    border: isCurrent ? '2px solid #D4AF37' : 'none',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Fase-beskriving */}
      <div className="text-center mt-6">
        {phases.map((phase) => {
          const isActive = currentDay >= phase.start && currentDay <= phase.end;
          if (!isActive) return null;

          return (
            <div key={phase.name}>
              <span
                className="text-lg font-medium"
                style={{ color: '#D4AF37' }}
              >
                {phase.name}
              </span>
              <p
                className="text-sm mt-1"
                style={{ color: 'rgba(255, 255, 255, 0.4)' }}
              >
                Dag {phase.start}–{phase.end} · {phase.name.toLowerCase()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JourneyTimeline;