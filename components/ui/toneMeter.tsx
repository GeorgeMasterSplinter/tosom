/**
 * ToSom 5.0 — Tone Meter
 *
 * Visualise emotional tone across 5 dimensions:
 *   warmth, clarity, empathy, tension, vulnerability
 *
 * Usage:
 *   import { ToneMeter } from '@/components/ui'
 *   <ToneMeter tone={toneSignal} size="lg" showLabels />
 */

import React from 'react';
import type { ToneSignal } from './emotionTypes';

/* ── Props ── */
export interface ToneMeterProps {
  tone: ToneSignal;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  showValues?: boolean;
  className?: string;
}

/* ── Dimension Config ── */
const dimensions = [
  { key: 'warmth' as const, label: 'Varme', color: '#D4AF37', negative: false },
  { key: 'clarity' as const, label: 'Klarhet', color: '#60A5FA', negative: false },
  { key: 'empathy' as const, label: 'Empati', color: '#F472B6', negative: false },
  { key: 'tension' as const, label: 'Spenning', color: '#FF6B6B', negative: true },
  { key: 'vulnerability' as const, label: 'Sårbarhet', color: '#A78BFA', negative: false },
];

/* ── Size Config ── */
const sizeMap = {
  sm: { arc: 96, gauge: 8, label: 'text-xs', value: 'text-sm' },
  md: { arc: 128, gauge: 10, label: 'text-sm', value: 'text-base' },
  lg: { arc: 160, gauge: 12, label: 'text-base', value: 'text-lg' },
};

/* ── Arc Path Generator ── */
function arcPath(cx: number, cy: number, r: number, progress: number) {
  const angle = Math.PI * (1 + progress);
  const x = cx + r * Math.cos(angle);
  const y = cy + r * Math.sin(angle);
  const large = progress > 0.5 ? 1 : 0;
  return `M ${cx - r} ${cy} A ${r} ${r} 0 ${large} 0 ${x} ${y}`;
}

/* ── Ring Value ── */
const RingValue: React.FC<{ value: number; color: string; size: number; label: string }> = ({
  value, color, size, label,
}) => {
  const dim = sizeMap.md;
  const r = (dim.arc / 2) - dim.gauge;
  const cx = dim.arc / 2;
  const cy = dim.arc / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - value / 100);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={dim.arc} height={dim.arc} className="transform -rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={dim.gauge} />
        <circle
          cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={dim.gauge}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" opacity="0.8"
          className="transition-all duration-700 ease-in-out"
        />
      </svg>
      <span className={`text-white font-medium ${dim.value}`}>{Math.round(value)}%</span>
      <span className={`text-white/40 ${dim.label}`}>{label}</span>
    </div>
  );
};

/* ── Bar Value ── */
const BarValue: React.FC<{ value: number; color: string; label: string }> = ({
  value, color, label,
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <span className="text-white/60 text-xs">{label}</span>
      <span className="text-white font-medium text-xs">{Math.round(value)}%</span>
    </div>
    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 ease-in-out"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}60, ${color})`,
          boxShadow: `0 0 12px ${color}30`,
        }}
      />
    </div>
  </div>
);

/* ── Main ToneMeter ── */
const ToneMeter: React.FC<ToneMeterProps> = ({
  tone, size = 'md', showLabels = true, showValues = true, className = '',
}) => {
  const config = sizeMap[size];
  const isRing = size === 'lg';

  return (
    <div className={`w-full ${className}`}>
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37]/20 to-transparent flex items-center justify-center">
          <span className="text-lg">🎯</span>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Emosjonell Tone</h3>
          <p className="text-white/30 text-xs">Analyse av kommunikasjon</p>
        </div>
      </div>

      {/* Visualization */}
      {isRing ? (
        <div className="grid grid-cols-3 gap-4">
          {dimensions.map((d) => (
            <RingValue
              key={d.key}
              value={tone[d.key]}
              color={d.color}
              size={config.arc}
              label={d.label}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {dimensions.map((d) => (
            <BarValue key={d.key} value={tone[d.key]} color={d.color} label={d.label} />
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
        <p className="text-white/40 text-xs leading-relaxed">
          {tone.warmth > 70 && tone.empathy > 70
            ? 'Dere kommuniserer med varme og forståelse. Dette er en sterk grunnlag.'
            : tone.tension > 60
            ? 'Det er litt spenning her. Ta et djupt pust og fokuser på forståelse.'
            : tone.vulnerability > 60
            ? 'Sårbarhet er et tegn på styrke. Dere bygger dypere forbindelse.'
            : 'Kommunikasjonen er i rolig flyt. Fortsett å lytte med åpent hjerte.'}
        </p>
      </div>
    </div>
  );
};

/* ── Pre-built Variants ── */
export const ToneMeterRing = (props: Omit<ToneMeterProps, 'size'>) => (
  <ToneMeter {...props} size="lg" />
);

export const ToneMeterBar = (props: Omit<ToneMeterProps, 'size'>) => (
  <ToneMeter {...props} size="md" />
);

export { ToneMeter };
export default ToneMeter;