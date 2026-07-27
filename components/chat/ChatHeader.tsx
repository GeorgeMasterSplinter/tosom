'use client';

import React from 'react';
import { color, radius, shadow, typography } from '@/config/design-tokens';

interface ChatHeaderProps {
  partnerName: string;
  partnerAge?: number;
  partnerImage: string | null;
  phaseLabel: string;
  phaseOrder?: number;
  currentDay: number;
  daysRemaining: number;
  online?: boolean;
  resonanceScore?: number;
  isSafe?: boolean;
}

export default function ChatHeader({
  partnerName,
  partnerAge,
  partnerImage,
  phaseLabel,
  phaseOrder = 1,
  currentDay,
  daysRemaining,
  online = false,
  resonanceScore = 0,
  isSafe = false,
}: ChatHeaderProps) {
  const getPhaseInfo = () => {
    const phases = [
      { label: 'Introduksjon', color: '#D4AF37' },
      { label: 'Trygghet', color: '#4DFF88' },
      { label: 'Sårbarhet', color: '#B48CFF' },
      { label: 'Fremtid', color: '#FF82C8' },
    ];
    const idx = Math.min(phaseOrder - 1, phases.length - 1);
    return phases[idx];
  };

  const phaseInfo = getPhaseInfo();
  const resonanceColor = resonanceScore >= 80 ? '#4DFF88' : resonanceScore >= 60 ? '#D4AF37' : '#FF82C8';

  return (
    <header
      className="flex items-center gap-4 px-6 py-4 border-b relative overflow-hidden"
      style={{
        background: 'rgba(11, 14, 17, 0.95)',
        backdropFilter: 'blur(20px)',
        borderColor: phaseOrder >= 2 ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Online pulse */}
      {online && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, ${phaseInfo.color}08 0%, transparent 60%)`,
            animation: 'headerPulse 4s infinite ease-in-out',
          }}
        />
      )}

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {partnerImage ? (
          <img
            src={partnerImage}
            alt={partnerName}
            className="w-10 h-10 rounded-full object-cover"
            style={{
              border: `2px solid rgba(212, 175, 55, 0.3)`,
              transition: 'border-color 0.3s ease-out',
            }}
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              color: phaseInfo.color,
              fontSize: '16px',
              fontWeight: 500,
            }}
          >
            {partnerName.charAt(0).toUpperCase()}
          </div>
        )}
        {/* Online indicator */}
        {online && (
          <div
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border"
            style={{
              background: '#4DFF88',
              borderColor: '#0B0E11',
              boxShadow: '0 0 8px rgba(77, 255, 136, 0.5)',
              animation: 'onlinePulse 2s infinite ease-in-out',
            }}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <h2
            className="text-base font-semibold truncate"
            style={{ color: '#FFFFFF' }}
          >
            {partnerName}
            {partnerAge && (
              <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 400 }}>
                , {partnerAge}
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-2 mb-1">
          {/* Phase badge */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1"
            style={{
              background: `${phaseInfo.color}15`,
              border: `1px solid ${phaseInfo.color}40`,
              borderRadius: `${radius.full}px`,
            }}
          >
            <span style={{ color: phaseInfo.color, fontSize: `${typography.fontSize.xs}px`, fontWeight: typography.fontWeight.semibold }}>
              {phaseInfo.label}
            </span>
          </div>

          {/* Safe badge */}
          {isSafe && (
            <div
              className="inline-flex items-center gap-1 px-2 py-0.5"
              style={{
                background: 'rgba(77, 255, 136, 0.1)',
                border: '1px solid rgba(77, 255, 136, 0.2)',
                borderRadius: `${radius.full}px`,
              }}
            >
              <span style={{ color: '#4DFF88', fontSize: `${typography.fontSize.xs}px` }}>Trygg ✓</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <p style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: '12px' }}>
            Dag {currentDay}/30 · {daysRemaining} att
          </p>

          {/* Resonance badge */}
          {resonanceScore > 0 && (
            <div
              className="inline-flex items-center gap-1 px-2 py-0.5"
              style={{
                background: `${resonanceColor}20`,
                border: `1px solid ${resonanceColor}40`,
                borderRadius: `${radius.full}px`,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill={resonanceColor}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span style={{ color: resonanceColor, fontSize: `${typography.fontSize.xs}px`, fontWeight: 600 }}>
                {Math.round(resonanceScore)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* More button */}
      <button
        className="p-2 rounded-lg transition-all duration-300"
        style={{ color: 'rgba(255, 255, 255, 0.5)' }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      <style>{`
        @keyframes headerPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes onlinePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
      `}</style>
    </header>
  );
}