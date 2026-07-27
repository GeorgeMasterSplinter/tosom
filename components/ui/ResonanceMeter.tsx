/* ═══════════════════════════════════════════
   ToSom ResonanceMeter — Design System 1.1
   Animert rund meter for resonans-prosent.
   Bruk i dashboard som hovudvisning av resonans.
   ═══════════════════════════════════════════ */

'use client';

import { useEffect, useState } from 'react';

interface ResonanceMeterProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizes = {
  sm: { diameter: 80, fontSize: 'text-lg', stroke: 6 },
  md: { diameter: 140, fontSize: 'text-3xl', stroke: 8 },
  lg: { diameter: 200, fontSize: 'text-5xl', stroke: 10 },
};

const getColor = (value: number): string => {
  if (value >= 80) return '#D4AF37';
  if (value >= 60) return '#E8C766';
  if (value >= 40) return '#FFB86C';
  return '#8282FF';
};

export const ResonanceMeter = ({ value, size = 'lg', showLabel = true }: ResonanceMeterProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const config = sizes[size];
  const radius = (config.diameter - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const strokeDashoffset = circumference * (1 - animatedValue / 100);

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{ width: config.diameter, height: size === 'sm' ? config.diameter + 40 : config.diameter + 32 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        className="-rotate-90"
        width={config.diameter}
        height={config.diameter}
        viewBox={`0 0 ${config.diameter} ${config.diameter}`}
      >
        {/* Bakgrunnssirkel */}
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth={config.stroke}
        />
        {/* Animert sirkel */}
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          fill="none"
          stroke={getColor(value)}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>

      {/* Sentrum-innhald */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-bold ${config.fontSize}`}
          style={{ color: getColor(value) }}
        >
          {animatedValue}%
        </span>
        {showLabel && (
          <span
            className="mt-1 text-xs"
            style={{ color: 'rgba(255, 255, 255, 0.4)' }}
          >
            Resonans
          </span>
        )}
      </div>

      {/* Hover-glow effekt */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: `0 0 40px ${getColor(value)}33`,
          }}
        />
      )}
    </div>
  );
};

export default ResonanceMeter;