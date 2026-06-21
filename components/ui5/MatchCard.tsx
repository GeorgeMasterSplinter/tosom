/**
 * ToSom UI 5.0 — MatchCard
 * 
 * Premium matchkort med:
 * - GlassPanel
 * - Matchscore (stor)
 * - Matchtype med farge
 * - Kort forklaring
 * - CTA: "Se match"
 * - Gull-aksentar, glow, soft shadow
 * - Hover scale-[1.02]
 */

'use client';

import { FC, useState } from 'react';
import GlassPanel from './GlassPanel';
import { getMatchType, getMatchTypeColor, getMatchTypeLabel } from '@/app/matching/MatchType';

interface MatchCardProps {
  score: number;
  otherUser?: {
    name?: string | null;
    age?: number | null;
    photoUrl?: string | null;
  };
  type?: string;
  explanation?: Record<string, unknown> | null;
  onSeeMatch?: () => void;
  onAccept?: () => void;
  highlight?: boolean;
}

export const MatchCard: FC<MatchCardProps> = ({
  score,
  otherUser,
  type = 'pending',
  explanation,
  onSeeMatch,
  onAccept,
  highlight = false,
}) => {
  const [hovered, setHovered] = useState(false);
  
  const matchTypeInfo = getMatchType(score);
  const matchTypeColor = getMatchTypeColor(score);
  const matchTypeLabel = getMatchTypeLabel(score);
  
  // Hent why-forklaring frå explanation
  const whyTexts = (explanation as any)?.why as string[] | undefined;
  const primaryWhy = whyTexts?.[0] || 'Vi deler grunnleggjande verdier om menneskelege relasjonar.';
  
  // Format alder
  const ageText = otherUser?.age ? `${otherUser.age} år` : '';
  const displayName = otherUser?.name || 'Ukjend';
  
  return (
    <div
      className={`relative group ${highlight ? 'scale-[1.03]' : ''}`}
      style={{
        transition: 'all 0.4s ease-out',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        setHovered(true);
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        (e.currentTarget as HTMLElement).style.transform = highlight ? 'scale(1.03)' : 'scale(1)';
      }}
    >
      {/* Glow bakgrunn */}
      <div
        className="absolute inset-0 rounded-3xl transition-all duration-500 pointer-events-none"
        style={{
          background: hovered
            ? `radial-gradient(circle at 50% 50%, ${matchTypeColor}15, transparent 70%)`
            : 'transparent',
          filter: 'blur(20px)',
          opacity: hovered ? 0.6 : 0,
          transition: 'all 0.4s ease-out',
        }}
      />
      
      <GlassPanel
        goldBorder
        padding="xl"
        shadow="lg"
        className="relative overflow-hidden"
        hover={false}
      >
        {/* Indre glow ved hover */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${matchTypeColor}10, transparent 60%)`,
            opacity: hovered ? 1 : 0,
          }}
        />
        
        <div className="relative z-10 flex flex-col items-center text-center gap-5">
          {/* Score sirkel */}
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center pulse-icon"
            style={{
              background: `linear-gradient(135deg, ${matchTypeColor}20, ${matchTypeColor}08)`,
              border: `2px solid ${matchTypeColor}40`,
              boxShadow: `0 0 30px ${matchTypeColor}25, inset 0 0 12px ${matchTypeColor}10`,
              color: matchTypeColor,
            }}
          >
            <span
              className="font-bold tracking-tight"
              style={{
                fontSize: '28px',
                color: matchTypeColor,
              }}
            >
              {score}
            </span>
          </div>
          
          {/* Brukar info */}
          {(displayName !== 'Ukjend' || ageText) && (
            <div className="flex flex-col gap-0.5">
              {displayName !== 'Ukjend' && (
                <h3
                  className="text-lg font-semibold"
                  style={{ color: '#FFFFFF' }}
                >
                  {displayName}
                </h3>
              )}
              {ageText && (
                <p
                  className="text-sm"
                  style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                >
                  {ageText}
                </p>
              )}
            </div>
          )}
          
          {/* Matchtype med farge */}
          <div
            className="px-4 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: `${matchTypeColor}15`,
              color: matchTypeColor,
              border: `1px solid ${matchTypeColor}30`,
            }}
          >
            {matchTypeLabel}
          </div>
          
          {/* Forklaring */}
          <p
            className="text-sm leading-relaxed max-w-xs"
            style={{ color: 'rgba(255, 255, 255, 0.55)' }}
          >
            {primaryWhy}
          </p>
          
          {/* CTA */}
          {onSeeMatch && (
            <button
              onClick={onSeeMatch}
              className="w-full px-8 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 relative"
              style={{
                background: `linear-gradient(135deg, ${matchTypeColor}, ${matchTypeColor}CC)`,
                color: '#0B0E11',
                boxShadow: `0 0 25px ${matchTypeColor}30, 0 4px 12px rgba(0,0,0,0.2)`,
                border: `1px solid ${matchTypeColor}50`,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = matchTypeColor;
                (e.target as HTMLElement).style.boxShadow = `0 0 40px ${matchTypeColor}45, 0 6px 16px rgba(0,0,0,0.25)`;
                (e.target as HTMLElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = `linear-gradient(135deg, ${matchTypeColor}, ${matchTypeColor}CC)`;
                (e.target as HTMLElement).style.boxShadow = `0 0 25px ${matchTypeColor}30, 0 4px 12px rgba(0,0,0,0.2)`;
                (e.target as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              Se match
            </button>
          )}
          
          {onAccept && !onSeeMatch && (
            <div className="flex gap-3 w-full">
              <button
                className="flex-1 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                Avslå
              </button>
              <button
                onClick={onAccept}
                className="flex-1 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative"
                style={{
                  background: '#D4AF37',
                  color: '#0B0E11',
                  boxShadow: '0 0 25px rgba(212,175,55,0.3), 0 4px 12px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(212,175,55,0.5)',
                }}
              >
                Aksepter
              </button>
            </div>
          )}
        </div>
      </GlassPanel>
    </div>
  );
};

export default MatchCard;