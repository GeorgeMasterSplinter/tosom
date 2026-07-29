'use client';

import React from 'react';
import { color, radius, shadow, typography } from '@/config/design-tokens';

interface ChatHeaderProps {
  partnerName: string;
  partnerAge?: number;
  distance?: string;
  currentDay: number;
  daysRemaining: number;
  resonanceScore?: number;
  onBliKjentClick?: () => void;
}

export default function ChatHeader({
  partnerName,
  partnerAge,
  distance,
  currentDay,
  daysRemaining,
  resonanceScore = 0,
  onBliKjentClick,
}: ChatHeaderProps) {
  const resonanceColor = resonanceScore >= 80 ? '#4DFF88' : resonanceScore >= 60 ? '#D4AF37' : '#FF82C8';

  return (
    <header
      className="flex items-center justify-between px-6 sm:px-8 py-3 border-b relative overflow-hidden"
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

      {/* Venstre side — partner-info */}
      <div className="flex-1 min-w-0 pr-4">
        {/* Navn + alder — større og fetare */}
        <div className="flex items-center gap-2 mb-1.5">
          <h2
            className="text-xl font-bold truncate tracking-tight"
            style={{ color: '#FFFFFF' }}
          >
            {partnerName}
            {partnerAge && (
              <>
                <span style={{ color: 'rgba(255, 255, 255, 0.35)', fontWeight: 400, fontSize: '14px' }}>
                  {' · '}{partnerAge} år
                </span>
              </>
            )}
          </h2>
        </div>

        {/* Avstand — med ikon og meir luft */}
        {distance && (
          <p className="text-xs mb-2 flex items-center gap-1.5" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            <span>📍</span>
            <span>{distance}</span>
          </p>
        )}

        {/* Dag + Resonans — større badges med meir padding */}
        <div className="flex items-center gap-3">
          {/* Dag badge — gull med mørk tekst */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full"
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
            }}
          >
            <span style={{ color: '#D4AF37', fontSize: '14px', fontWeight: 600 }}>
              Dag {currentDay}/30
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '12px' }}>
              · {daysRemaining} att
            </span>
          </div>

          {/* Resonans badge — større heart-ikon */}
          {resonanceScore > 0 && (
            <div
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full"
              style={{
                background: `${resonanceColor}12`,
                border: `1px solid ${resonanceColor}30`,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={resonanceColor}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span style={{ color: resonanceColor, fontSize: '14px', fontWeight: 600 }}>
                {Math.round(resonanceScore)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Høgre side — PREMIUM Bli Kjent-knapp */}
      {onBliKjentClick && (
        <button
          onClick={onBliKjentClick}
          className="flex-shrink-0 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5 group"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #E8C766 50%, #D4AF37 100%)',
            backgroundSize: '200% 100%',
            color: '#0B1520',
            boxShadow: '0 6px 24px rgba(212, 175, 55, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
            border: 'none',
          }}
        >
          {/* Diamant-ikon med animasjon */}
          <span
            className="text-lg transition-transform duration-300 group-hover:scale-110"
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
          >
            💎
          </span>
          <span className="tracking-wide">Bli Kjent</span>
        </button>
      )}

      <style>{`
        @keyframes onlinePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        @keyframes headerShimmer {
          0% { opacity: 0; transform: translateX(-100%); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateX(100%); }
        }
      `}</style>
    </header>
  );
}
