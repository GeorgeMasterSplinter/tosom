/**
 * ToSom 5.0 — Relationship Health Score
 *
 * 5 dimensions: communication, emotionalSafety, curiosity, sharedGoals, connection
 * Gauge visualization + trend arrows + health summary.
 *
 * Usage:
 *   import { RelationshipHealth } from '@/components/ui'
 *   <RelationshipHealth signals={healthSignals} />
 */

import React from 'react';
import type { HealthDimension, HealthSignal } from './emotionTypes';

/* ── Props ── */
export interface RelationshipHealthProps {
  signals: HealthSignal[];
  overallScore?: number;
  showSummary?: boolean;
  className?: string;
}

/* ── Dimension Config ── */
const dimConfig: Record<HealthDimension, { label: string; emoji: string; color: string }> = {
  communication:    { label: 'Kommunikasjon', emoji: '💬', color: '#60A5FA' },
  emotionalSafety:  { label: 'Emosjonell trygghet', emoji: '🛡️', color: '#D4AF37' },
  curiosity:        { label: 'Nyskjerring', emoji: '🔍', color: '#A78BFA' },
  sharedGoals:      { label: 'Delte mål', emoji: '🎯', color: '#34D399' },
  connection:       { label: 'Forbindelse', emoji: '♡', color: '#F472B6' },
};

/* ── Trend Arrow ── */
const TrendArrow: React.FC<{ trend: HealthSignal['trend'] }> = ({ trend }) => {
  if (trend === 'up') return <span className="text-[#34D399] text-xs">↑</span>;
  if (trend === 'down') return <span className="text-[#FF6B6B] text-xs">↓</span>;
  return <span className="text-white/30 text-xs">→</span>;
};

/* ── Mini Gauge ── */
const MiniGauge: React.FC<{ value: number; color: string; size?: number }> = ({
  value, color, size = 64,
}) => {
  const r = (size / 2) - 8;
  const cx = size / 2;
  const cy = size / 2 + 4;
  const startAngle = Math.PI;
  const endAngle = Math.PI + (value / 100) * Math.PI;
  const x = cx + r * Math.cos(endAngle);
  const y = cy + r * Math.sin(endAngle);
  const large = value > 50 ? 1 : 0;
  const circumference = Math.PI * r;
  const arcLength = (value / 100) * circumference;

  return (
    <svg width={size} height={size + 8} className="transform">
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" strokeLinecap="round"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${large} 1 ${x} ${y}`}
        fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.8"
        className="transition-all duration-1000 ease-in-out"
      />
      <text
        x={cx} y={cy + 4} textAnchor="middle"
        className="fill-white font-semibold text-sm"
        style={{ fontSize: '14px' }}
      >
        {Math.round(value)}
      </text>
    </svg>
  );
};

/* ── Health Dimension Card ── */
const DimensionCard: React.FC<{ signal: HealthSignal; size?: 'sm' | 'md' }> = ({ signal, size = 'sm' }) => {
  const config = dimConfig[signal.dimension];
  const isCompact = size === 'sm';

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
      <MiniGauge value={signal.score} color={config.color} size={isCompact ? 48 : 64} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{config.emoji}</span>
          <span className="text-white text-sm font-medium truncate">{config.label}</span>
          <TrendArrow trend={signal.trend} />
        </div>
        <div className="mt-1.5 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${signal.score}%`, backgroundColor: config.color }}
          />
        </div>
      </div>
    </div>
  );
};

/* ── Health Summary ── */
const HealthSummary: React.FC<{ signals: HealthSignal[]; overall: number }> = ({ signals, overall }) => {
  const avg = signals.reduce((a, s) => a + s.score, 0) / signals.length;
  const dominant = signals.reduce((a, s) => (s.score > a.score ? s : a), signals[0]);
  const config = dimConfig[dominant.dimension];

  let summaryText = '';
  if (overall >= 80) {
    summaryText = 'Dere har en sterk og sund relasjon. Fortsett å pleie denne forbindelsen.';
  } else if (overall >= 60) {
    summaryText = 'God fremgang! Det er rom for vekst i noen områder.';
  } else if (overall >= 40) {
    summaryText = 'Det er noen områder som trenger oppmerksomhet. Ta det rolig, ett steg om gangen.';
  } else {
    summaryText = 'Dere er i en krevende periode. Husk: utfordringer bygger dypere forbindelse.';
  }

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/15">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">📊</span>
        <span className="text-white font-semibold text-sm">Relasjons-helse</span>
        <span className="text-[#D4AF37] font-bold text-sm ml-auto">{Math.round(overall)}%</span>
      </div>
      <p className="text-white/50 text-xs leading-relaxed">{summaryText}</p>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-white/40">Sterkest:</span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
          style={{ backgroundColor: `${config.color}15`, color: config.color }}>
          <span>{config.emoji}</span>
          <span>{config.label}</span>
        </span>
      </div>
    </div>
  );
};

/* ── Overall Gauge ── */
const OverallGauge: React.FC<{ score: number }> = ({ score }) => {
  const r = 56;
  const cx = 72;
  const cy = 72;
  const angle = Math.PI + (score / 100) * Math.PI;
  const x = cx + r * Math.cos(angle);
  const y = cy + r * Math.sin(angle);
  const large = score > 50 ? 1 : 0;
  const circumference = Math.PI * r;
  const arcLength = (score / 100) * circumference;

  let color = '#FF6B6B';
  if (score >= 70) color = '#34D399';
  else if (score >= 50) color = '#FBBF24';
  else if (score >= 30) color = '#FF6B6B';

  return (
    <div className="flex flex-col items-center">
      <svg width={cx * 2} height={cy * 2 + 20} className="transform -rotate-90">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${large} 1 ${x} ${y}`}
          fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.8"
          filter="url(#glow)"
          className="transition-all duration-1000 ease-in-out"
        />
        <text x={cx} y={cy + 4} textAnchor="middle" className="fill-white font-bold"
          style={{ fontSize: '24px' }}>
          {Math.round(score)}
        </text>
      </svg>
      <span className="text-white/40 text-xs mt-1">Samlet score</span>
    </div>
  );
};

/* ── Main RelationshipHealth ── */
const RelationshipHealth: React.FC<RelationshipHealthProps> = ({
  signals,
  overallScore: propScore,
  showSummary = true,
  className = '',
}) => {
  const overall = propScore ?? (signals.reduce((a, s) => a + s.score, 0) / signals.length);

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37]/20 to-transparent flex items-center justify-center">
          <span className="text-lg">💚</span>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Relasjons-helse</h3>
          <p className="text-white/30 text-xs">5 dimensjoner av forbindelse</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Overall Gauge + Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-center p-6 rounded-2xl bg-white/[0.03] border border-white/5">
            <OverallGauge score={overall} />
          </div>
          {showSummary && <HealthSummary signals={signals} overall={overall} />}
        </div>

        {/* Right: Dimension Cards */}
        <div className="space-y-2">
          {signals.map((s) => (
            <DimensionCard key={s.dimension} signal={s} />
          ))}
        </div>
      </div>
    </div>
  );
};

export { RelationshipHealth, DimensionCard, OverallGauge, HealthSummary };
export default RelationshipHealth;