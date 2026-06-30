/**
 * ToSom — ChatHeader (Produktnivå med Micro-interactions + Emosjonelle States)
 * 
 * Viser partner-info, match-fase og trygghetsindikator.
 * Premium glassmorphism + gull UI med mikroanimasjonar.
 */

import React from 'react';

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
  // Fase-info basert på journey-fase
  const getPhaseInfo = () => {
    const phases = [
      { label: 'Introduksjon', bg: 'rgba(212, 175, 55, 0.1)', border: 'rgba(212, 175, 55, 0.25)', text: '#D4AF37', warmth: 'roleg' },
      { label: 'Trygghet', bg: 'rgba(77, 255, 136, 0.1)', border: 'rgba(77, 255, 136, 0.2)', text: '#4DFF88', warmth: 'trygg' },
      { label: 'Sårbarhet', bg: 'rgba(180, 140, 255, 0.1)', border: 'rgba(180, 140, 255, 0.2)', text: '#B48CFF', warmth: 'varm' },
      { label: 'Fremtid', bg: 'rgba(255, 130, 200, 0.1)', border: 'rgba(255, 130, 200, 0.2)', text: '#FF82C8', warmth: 'meir varm' },
    ];
    const idx = Math.min(phaseOrder - 1, phases.length - 1);
    return phases[idx];
  };

  const phaseInfo = getPhaseInfo();

  // Resonans-farge
  const getResonanceColor = (score: number) => {
    if (score >= 80) return '#4DFF88';
    if (score >= 60) return '#D4AF37';
    if (score >= 40) return '#FFB86C';
    return '#FF82C8';
  };

  // Trygg-badge
  const renderSafeBadge = () => {
    if (!isSafe) return null;
    return (
      <div
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
        style={{
          background: 'rgba(77, 255, 136, 0.1)',
          border: '1px solid rgba(77, 255, 136, 0.2)',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="M9 12l2 2 4-4" stroke="#4DFF88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 3L3 9l9 6 9-6-9-6z" stroke="#4DFF88" strokeWidth="1.5"/>
        </svg>
        <span style={{ color: '#4DFF88', fontSize: '11px', fontWeight: 500 }}>
          Trygg
        </span>
      </div>
    );
  };

  // Resonans-badge
  const renderResonanceBadge = () => {
    if (resonanceScore <= 0) return null;
    const color = getResonanceColor(resonanceScore);
    return (
      <div
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
        style={{
          background: `${color}15`,
          border: `1px solid ${color}30`,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill={color}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span style={{ color, fontSize: '11px', fontWeight: 600 }}>
          {Math.round(resonanceScore)}%
        </span>
      </div>
    );
  };

  // Fase badge med warm-farge
  const renderPhaseBadge = () => (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{
        background: phaseInfo.bg,
        border: `1px solid ${phaseInfo.border}`,
      }}
    >
      <span style={{ color: phaseInfo.text, fontSize: '12px', fontWeight: 600 }}>
        {phaseInfo.label}
      </span>
      {/* Varm-indikator */}
      <div className="flex gap-0.5">
        {Array.from({ length: Math.min(phaseOrder, 5) }).map((_, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: '3px',
              height: '3px',
              background: i < 2 ? '#D4AF37' : `${phaseInfo.text}60`,
            }}
          />
        ))}
      </div>
    </div>
  );

  // Reisestatus med val-indikator
  const renderJourneyStatus = () => (
    <div className="flex items-center gap-2">
      {/* Progress */}
      <div className="h-1 rounded-full overflow-hidden" style={{ width: '48px', background: 'rgba(255, 255, 255, 0.06)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${(currentDay / 30) * 100}%`,
            background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
            transition: 'width 0.6s ease-out',
          }}
        />
      </div>
      {/* Valg-indikator for fase 4+ */}
      {phaseOrder >= 4 && (
        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{
          background: 'rgba(255, 130, 200, 0.1)',
          border: '1px solid rgba(255, 130, 200, 0.2)',
        }}>
          <span style={{ color: '#FF82C8', fontSize: '10px' }}>💭</span>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="flex items-center gap-4 px-6 py-4 border-b relative overflow-hidden"
      style={{
        background: 'rgba(11, 14, 17, 0.95)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.06)',
        borderBottom: phaseOrder >= 2 ? '1px solid rgba(212, 175, 55, 0.12)' : '1px solid rgba(212, 175, 55, 0.06)',
      }}
    >
      {/* Puls-animasjon når partner er aktiv */}
      {online && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, ${phaseInfo.text}08 0%, transparent 60%)`,
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
              border: '2px solid rgba(212, 175, 55, 0.3)',
              transition: 'border-color 0.3s ease-out',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.borderColor = `${phaseInfo.text}80`;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.3)';
            }}
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              color: phaseInfo.text,
              fontSize: '16px',
              fontWeight: 500,
              transition: 'border-color 0.3s ease-out, color 0.3s ease-out',
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
          {renderPhaseBadge()}
          {renderSafeBadge()}
        </div>

        <div className="flex items-center gap-3">
          <p style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: '12px' }}>
            Dag {currentDay}/30 · {daysRemaining} att
          </p>
          {renderResonanceBadge()}
        </div>
      </div>

      {/* Resonans-indikator (høgre side) */}
      <div className="flex flex-col items-center gap-1">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center relative"
          style={{
            background: getResonanceColor(resonanceScore) + '20',
            border: `1px solid ${getResonanceColor(resonanceScore)}40`,
          }}
        >
          {/* Puls-ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: `1px solid ${getResonanceColor(resonanceScore)}30`,
              animation: resonanceScore > 0 ? 'resonancePulse 3s infinite ease-in-out' : 'none',
            }}
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: getResonanceColor(resonanceScore), position: 'relative', zIndex: 1 }}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <span style={{ color: getResonanceColor(resonanceScore), fontSize: '10px', fontWeight: 600 }}>
          {Math.round(resonanceScore)}%
        </span>
      </div>

      {/* More button */}
      <button
        className="p-2 rounded-lg transition-all duration-300 relative"
        style={{ color: 'rgba(255, 255, 255, 0.5)' }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.color = '#D4AF37';
          (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.05)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.5)';
          (e.target as HTMLElement).style.background = 'transparent';
        }}
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
        @keyframes resonancePulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}