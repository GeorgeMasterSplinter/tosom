'use client';

import React from 'react';

interface ChatHeaderProps {
  partnerName: string;
  partnerAge?: number;
  distance?: string;
  currentDay: number;
  resonanceScore?: number;
  onBliKjentClick?: () => void;
}

export default function ChatHeader({
  partnerName,
  partnerAge,
  distance,
  currentDay,
  resonanceScore = 0,
  onBliKjentClick,
}: ChatHeaderProps) {
  const resonanceColor = resonanceScore >= 80 ? '#4DFF88' : resonanceScore >= 60 ? '#D4AF37' : '#FF82C8';

  return (
    <header
      className="flex items-start justify-between px-6 sm:px-8 py-4 border-b relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(10, 26, 58, 0.5) 0%, rgba(11, 21, 32, 0.7) 100%)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(212, 175, 55, 0.12)',
        boxShadow: '0 1px 0 rgba(212, 175, 55, 0.06), 0 -2px 16px rgba(0,0,0,0.15)',
      }}
    >
      {/* Subtil shimmer animasjon på toppkanten */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)',
          animation: 'headerShimmer 4s infinite ease-in-out',
        }}
      />

      {/* Venstre side — partner-info + Bli kjent-knapp */}
      <div className="flex-1 min-w-0 pr-4 flex flex-col gap-2">
        {/* Linje 1: Navn · Alder · Avstand */}
        <div className="flex items-center gap-2 flex-wrap">
          <h2
            className="text-lg font-bold tracking-tight"
            style={{ color: '#FFFFFF' }}
          >
            {partnerName}
          </h2>
          {partnerAge && (
            <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 400, fontSize: '14px' }}>
              · {partnerAge} år
            </span>
          )}
          {distance && (
            <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 400, fontSize: '14px' }}>
              · {distance}
            </span>
          )}
        </div>

        {/* Linje 2: Bli kjent-knapp — samme stil som mood-knapper */}
        {onBliKjentClick && (
          <button
            onClick={onBliKjentClick}
            className="flex flex-col items-center justify-center gap-1.5 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
              color: '#D4AF37',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              boxShadow: '0 2px 8px rgba(212, 175, 55, 0.1)',
            }}
          >
            <span
              className="text-3xl leading-none"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(212, 175, 55, 0.3))' }}
            >
              💎
            </span>
            <span className="text-xs font-semibold tracking-wide">Bli kjent</span>
          </button>
        )}
      </div>

      {/* Høyre side — Dag X/30 + Resonans-sirkel */}
      <div className="flex flex-col items-end gap-1.5">
        {/* Linje 1: Dag X/30 badge */}
        <div
          className="inline-flex items-center px-3 py-1 rounded-full"
          style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
          }}
        >
          <span style={{ color: '#D4AF37', fontSize: '13px', fontWeight: 600 }}>
            Dag {currentDay}/30
          </span>
        </div>

        {/* Linje 2: Resonans-sirkel */}
        {resonanceScore > 0 && (
          <div
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: '48px',
              height: '48px',
              background: `${resonanceColor}12`,
              border: `2px solid ${resonanceColor}40`,
              boxShadow: `0 0 16px ${resonanceColor}30`,
            }}
          >
            <span
              className="text-sm font-bold"
              style={{ color: resonanceColor }}
            >
              {Math.round(resonanceScore)}%
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes headerShimmer {
          0% { opacity: 0; transform: translateX(-100%); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateX(100%); }
        }
      `}</style>
    </header>
  );
}