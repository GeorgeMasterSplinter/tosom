/* ═══════════════════════════════════════════
   ToSom StepIndicator — Design System 1.1
   Viser progresjon i onboarding (steg 1-13).
   Bruk med: <StepIndicator current={5} total={13} />
   ═══════════════════════════════════════════ */

'use client';

interface StepIndicatorProps {
  current: number;
  total: number;
  title?: string;
  subtitle?: string;
}

export const StepIndicator = ({ current, total, title, subtitle }: StepIndicatorProps) => {
  const percent = Math.round(((current + 1) / total) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Progresjonstittel */}
      {title && subtitle && (
        <div className="text-center mb-6 animate-fadeIn" style={{ animationDuration: '500ms' }}>
          <h2
            className="text-2xl md:text-3xl font-semibold tracking-tight mb-1"
            style={{ color: '#FFFFFF' }}
          >
            {title}
          </h2>
          <p
            className="text-sm md:text-base leading-relaxed"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            {subtitle}
          </p>
        </div>
      )}

      {/* Progresjonsbake */}
      <div className="flex items-center gap-3 mb-2">
        <span
          className="text-xs font-medium whitespace-nowrap"
          style={{ color: 'rgba(212, 175, 55, 0.6)' }}
        >
          Steg {current + 1} av {total}
        </span>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percent}%`,
              background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
            }}
          />
        </div>
        <span
          className="text-xs font-medium whitespace-nowrap"
          style={{ color: 'rgba(255, 255, 255, 0.4)' }}
        >
          {percent}%
        </span>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1 mt-4">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 8 : 6,
              height: i === current ? 8 : 6,
              background: i <= current ? '#D4AF37' : 'rgba(255, 255, 255, 0.1)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;