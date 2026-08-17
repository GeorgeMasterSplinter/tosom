/**
 * Tosom — ResonanceBar (Premium Nordic Gold 2026) 🟡⭐
 * Visualiserer resonansutvikling over dag 1–30 med fase-fargar.
 * 
 * Design:
 * - 30 små bokser for hvar dag
 * - Fase-fargar: grønn (dag 1-10), gull (dag 11-20), lila (dag 21-30)
 * - Hover → tooltip med reflection, emotionalTone, depthLevel
 * - Animert fade-in ved lasting
 * 
 * Faser:
 * - 🌱 EARLY: Dag 1–10 = grønn #34D399
 * - 🎵 BUILDING_TRUST: Dag 11–20 = gull #D4AF37
 * - 💫 DEEPER: Dag 21–30 = lila #9B59B6
 */

"use client";

import { useState } from 'react';

/* ═══════════════════════════════════════
   THEME TOKENS
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldMuted: "rgba(212,175,55,0.2)",
  glassBg: "rgba(255,255,255,0.03)",
  glassBorder: "rgba(255,255,255,0.08)",
  textPrimary: "rgba(255,255,255,0.92)",
  textSecondary: "rgba(255,255,255,0.55)",
};

/* ═══════════════════════════════════════
   TYPES
   ═══════════════════════════════════════ */

export interface ResonanceDay {
  day: number;
  emotionalTone?: string;
  depthLevel?: number;
  summary?: string;
}

export interface ResonanceBarProps {
  sessions: ResonanceDay[];
  journeyDay?: number; // Current day for progress highlight
}

/* ═══════════════════════════════════════
   PHASE CONFIG
   ═══════════════════════════════════════ */

function getPhaseInfo(day: number) {
  if (day <= 10) return { 
    phase: 'EARLY', 
    color: '#34D399', 
    icon: '🌱', 
    label: 'Bli kjent' 
  };
  if (day <= 20) return { 
    phase: 'BUILDING_TRUST', 
    color: '#D4AF37', 
    icon: '🎵', 
    label: 'Bygg tillit' 
  };
  return { 
    phase: 'DEEPER', 
    color: '#9B59B6', 
    icon: '💫', 
    label: 'Djupde' 
  };
}

function toneColor(tone: string): string {
  switch (tone) {
    case 'deep': return '#34D399';
    case 'open': return '#60A5FA';
    case 'guarded': return '#FBBF24';
    case 'surface': return '#EF4444';
    default: return 'rgba(255,255,255,0.3)';
  }
}

function toneIcon(tone: string): string {
  switch (tone) {
    case 'deep': return '🌊';
    case 'open': return '💙';
    case 'guarded': return '🛡️';
    case 'surface': return '🌫️';
    default: return '⚪';
  }
}

/* ═══════════════════════════════════════
   TOOLTIP COMPONENT
   ═══════════════════════════════════════ */

function Tooltip({ 
  day, 
  session, 
  phaseInfo,
  children 
}: { 
  day: number; 
  session?: ResonanceDay | null;
  phaseInfo: ReturnType<typeof getPhaseInfo>;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      
      {/* Tooltip popup */}
      {show && session && (
        <div
          className="absolute z-50 w-64 p-3 rounded-xl"
          style={{
            background: 'rgba(11,21,32,0.95)',
            border: `1px solid ${phaseInfo.color}40`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 16px ${phaseInfo.color}20`,
            backdropFilter: 'blur(12px)',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%) translateY(-8px)',
            marginBottom: '8px',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span style={{ color: phaseInfo.color, fontSize: '14px' }}>
              {phaseInfo.icon}
            </span>
            <span 
              className="text-xs font-bold"
              style={{ color: G.textPrimary }}
            >
              Dag {day} av 30 · {phaseInfo.label}
            </span>
          </div>

          {/* Emotional tone */}
          {session.emotionalTone && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <span style={{ fontSize: '12px' }}>{toneIcon(session.emotionalTone)}</span>
              <span 
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ 
                  color: toneColor(session.emotionalTone),
                }}
              >
                {session.emotionalTone}
              </span>
            </div>
          )}

          {/* Depth */}
          <div className="flex items-center gap-1.5 mb-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ background: '#D4AF37' }}
            />
            <span 
              className="text-[10px]"
              style={{ color: G.textSecondary }}
            >
              Djupne: {session.depthLevel ?? '?'} / 3
            </span>
          </div>

          {/* Summary */}
          {session.summary && (
            <div 
              className="text-[11px] italic leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              "{session.summary.substring(0, 120)}{session.summary.length > 120 ? '...' : ''}"
            </div>
          )}

          {/* Arrow */}
          <div 
            className="absolute left-1/2 -translate-x-1/2"
            style={{ 
              top: '100%',
              border: '6px solid transparent',
              borderTopColor: phaseInfo.color + '40',
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   SINGLE DAY BOX
   ═══════════════════════════════════════ */

function DayBox({ 
  day, 
  session, 
  journeyDay,
  isActive 
}: { 
  day: number; 
  session?: ResonanceDay | null;
  journeyDay?: number;
  isActive: boolean;
}) {
  const phaseInfo = getPhaseInfo(day);
  const hasData = !!session;
  const isCurrent = journeyDay === day;

  return (
    <Tooltip day={day} session={hasData ? session : null} phaseInfo={phaseInfo}>
      <div
        className="flex flex-col items-center gap-0.5 transition-all duration-300"
        style={{
          opacity: hasData ? 1 : 0.3,
          transform: isActive ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {/* Day box */}
        <div
          className="w-3 h-5 sm:w-3.5 sm:h-6 rounded-sm transition-all duration-300"
          style={{
            background: hasData 
              ? phaseInfo.color 
              : 'rgba(255,255,255,0.1)',
            boxShadow: isActive 
              ? `0 0 8px ${phaseInfo.color}60` 
              : hasData
                ? `0 0 4px ${phaseInfo.color}30`
                : 'none',
            border: isCurrent 
              ? `2px solid ${G.gold}` 
              : '1px solid rgba(255,255,255,0.05)',
          }}
        />
        
        {/* Day number (only visible on hover or for current day) */}
        {(isActive || isCurrent) && (
          <span 
            className="text-[8px] font-medium"
            style={{ color: G.textSecondary }}
          >
            {day}
          </span>
        )}
      </div>
    </Tooltip>
  );
}

/* ═══════════════════════════════════════
   PROGRESS BAR (mini version)
   ═══════════════════════════════════════ */

function ProgressIndicator({ currentDay, totalDays = 30 }: { 
  currentDay?: number;
  totalDays?: number;
}) {
  if (!currentDay) return null;
  const percent = Math.min((currentDay / totalDays) * 100, 100);

  return (
    <div className="w-full">
      {/* Bar */}
      <div 
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        <div 
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ 
            width: `${percent}%`,
            background: `linear-gradient(90deg, ${G.gold}, ${G.goldLight})`,
            boxShadow: `0 0 8px ${G.goldMuted}`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span 
          className="text-[10px] font-medium"
          style={{ color: G.textSecondary }}
        >
          Dag {currentDay} av {totalDays}
        </span>
        <span 
          className="text-[10px] font-medium"
          style={{ color: G.gold }}
        >
          {Math.round(percent)}%
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT — RESONANCEBAR
   ═══════════════════════════════════════ */

export function ResonanceBar({ sessions, journeyDay }: ResonanceBarProps) {
  // Create a map of day → session
  const sessionMap = new Map<number, ResonanceDay>();
  for (const s of sessions) {
    if (!sessionMap.has(s.day) || !sessionMap.get(s.day)) {
      sessionMap.set(s.day, s);
    }
  }

  // Generate days 1-30
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  // Phase distribution for legend
  const earlyCount = sessions.filter(s => s.day <= 10).length;
  const trustCount = sessions.filter(s => s.day > 10 && s.day <= 20).length;
  const deeperCount = sessions.filter(s => s.day > 20).length;

  return (
    <div
      className="w-full rounded-2xl p-5 transition-all duration-500"
      style={{
        background: G.glassBg,
        border: `1px solid ${G.glassBorder}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span style={{ color: G.gold, fontSize: '16px' }}>📊</span>
          <h3 
            className="text-sm font-semibold tracking-wide"
            style={{ color: G.textPrimary }}
          >
            Resonanseutvikling
          </h3>
        </div>

        {/* Progress */}
        <ProgressIndicator currentDay={journeyDay} />
      </div>

      {/* Phase Legend */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ background: '#34D399' }}
          />
          <span 
            className="text-[10px] font-medium"
            style={{ color: G.textSecondary }}
          >
            🌱 Bli kjent ({earlyCount})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ background: '#D4AF37' }}
          />
          <span 
            className="text-[10px] font-medium"
            style={{ color: G.textSecondary }}
          >
            🎵 Tillit ({trustCount})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ background: '#9B59B6' }}
          />
          <span 
            className="text-[10px] font-medium"
            style={{ color: G.textSecondary }}
          >
            💫 Djupde ({deeperCount})
          </span>
        </div>
      </div>

      {/* Day bars */}
      <div 
        className="flex items-end justify-between gap-[2px] sm:gap-1"
        style={{
          height: '80px',
          scrollbarWidth: 'thin',
        }}
      >
        {days.map((day) => {
          const session = sessionMap.get(day) || null;
          const phaseInfo = getPhaseInfo(day);
          const isActive = !!session;

          return (
            <Tooltip 
              key={day} 
              day={day} 
              session={isActive ? session : null} 
              phaseInfo={phaseInfo}
            >
              <div className="flex flex-col items-center justify-end flex-1 h-full">
                <DayBox
                  day={day}
                  session={session}
                  journeyDay={journeyDay}
                  isActive={isActive}
                />
              </div>
            </Tooltip>
          );
        })}
      </div>

      {/* Days labels */}
      <div 
        className="flex justify-between mt-2"
      >
        {[1, 5, 10, 15, 20, 25, 30].map((day) => (
          <span 
            key={day}
            className="text-[8px] font-medium"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            {day}
          </span>
        ))}
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default ResonanceBar;