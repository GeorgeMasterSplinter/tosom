// components/dashboard/PremiumResonanceMeter.tsx — Animert sirkulær resonans-indikator
'use client';

import { resonanceLabel } from "@/lib/matching/resonanceLevel";

interface ResonanceMeterProps {
  score: number;        // 0-100 (brukes kun for farge/bue, vises ALDRI for brukeren)
  level: string;        // "GENTLE" | "MODERATE" | "STRONG" | "DEEP"
}

export function PremiumResonanceMeter({ score, level }: ResonanceMeterProps) {
  const getColor = (s: number) =>
    s >= 80 ? '#D4AF37' :
    s >= 60 ? '#E8C766' :
    s >= 40 ? '#FFB86C' : '#8282FF';

  // B1.5: brukeren ser ORD, aldri tall (I-12)
  const label = resonanceLabel(level);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs font-medium tracking-widest uppercase" style={{ color: 'rgba(212, 175, 55, 0.5)' }}>
        Resonans
      </span>
      <div 
        className="relative"
        style={{ width: '140px', height: '140px' }}
      >
        {/* Bakgrunnssirkel */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="8"
          />
          {/* Fremgangssirkel */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={getColor(score)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        {/* Senter-innhold - B1.5: ORD i stedet for tall */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-bold text-center leading-tight"
            style={{ fontSize: '15px', color: getColor(score), width: '94px' }}
          >
            {label}
          </span>
        </div>
      </div>
      <span 
        className="text-sm font-medium"
        style={{ color: getColor(score) }}
      >
        {label}
      </span>
    </div>
  );
}

export default PremiumResonanceMeter;