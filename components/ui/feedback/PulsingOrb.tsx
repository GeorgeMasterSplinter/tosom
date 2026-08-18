/**
 * ToSom — PulsingOrb
 *
 * Gull, pulserende hjerte-orb med konsentriske ringer.
 * Brukes i venterommet (matching), dashboard og andre "ventefase"-kontekster.
 *
 * Design: Nordic Gold Premium + ToSom Blue
 * - Ro, ikke stressende
 * - Gullaksenter
 * - Myke, langsomme animasjoner
 */

export function PulsingOrb({ size = 'lg' }: { size?: 'md' | 'lg' }) {
  const containerSize = size === 'lg' ? 160 : 120;
  const centerSize = size === 'lg' ? 80 : 60;
  const emojiSize = size === 'lg' ? '32px' : '24px';

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
    >
      {/* Ytre ring — pulserer */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: '2px solid rgba(212, 175, 55, 0.15)',
          animation: 'pulse-ring 3s ease-in-out infinite',
        }}
      />
      {/* Midtre ring */}
      <div
        className="absolute inset-4 rounded-full"
        style={{
          border: '2px solid rgba(212, 175, 55, 0.25)',
          animation: 'pulse-ring 3s ease-in-out infinite 0.5s',
        }}
      />
      {/* Indre ring */}
      <div
        className="absolute inset-8 rounded-full"
        style={{
          border: '2px solid rgba(212, 175, 55, 0.4)',
          animation: 'pulse-ring 3s ease-in-out infinite 1s',
        }}
      />
      {/* Sentrum — gull glød */}
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: `${centerSize}px`,
          height: `${centerSize}px`,
          background: 'radial-gradient(circle, rgba(212,175,55,0.3), transparent)',
          animation: 'pulse-glow 2s ease-in-out infinite',
        }}
      >
        <span style={{ fontSize: emojiSize, lineHeight: 1 }}>💛</span>
      </div>

      {/* CSS keyframes */}
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>
    </div>
  );
}