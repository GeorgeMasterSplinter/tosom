/**
 * ToSom — GoldPulseIcon
 *
 * Gull ikon-sirkel med rolig glød bak seg og en myk «pust»:
 * sirkelen vokser litt (scale 1 → 1.06) og tilbake til normal
 * størrelse over 4,5 sekunder. Gløden pulserer i takt.
 *
 * Design: Nordic Gold Premium — rolig, ikke stressende.
 * prefers-reduced-motion: ingen animasjon, statisk myk glød.
 *
 * Brukes overalt på landing-sidene der ikoner satt i gull-sirkler
 * (rounded-full bg-[rgba(212,175,55,0.1)]).
 */

import { ReactNode } from 'react';

interface GoldPulseIconProps {
  children: ReactNode;
  /** Pikselstørrelse (typisk 40, 44, 48 eller 56) */
  size?: number;
  className?: string;
  /** Slå av pusten (statisk glød) */
  pulse?: boolean;
}

const GOLD = '#D4AF37';

export function GoldPulseIcon({ children, size = 56, className = '', pulse = true }: GoldPulseIconProps) {
  const anim = pulse ? '4.5s ease-in-out infinite' : 'none';

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Glow-lag bak (keyframes ligger i styles/globals.css) */}
      <div
        className="tosom-icon-pulse-glow absolute rounded-full pointer-events-none"
        style={{
          inset: '-12px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.35) 0%, rgba(212,175,55,0.1) 50%, transparent 72%)',
          animation: `tosom-icon-glow ${anim}`,
        }}
      />
      {/* Ikon-sirkelen — puster mykt */}
      <div
        className="tosom-icon-pulse relative w-full h-full rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(212,175,55,0.1)',
          color: GOLD,
          animation: `tosom-icon-breathe ${anim}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default GoldPulseIcon;