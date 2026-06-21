/**
 * ToSom UI 5.0 — ProfileSummary
 * 
 * Viser kort profil-sammendrag for éin bruker.
 * Namn, alder, livsstil, verdiar, kommunikasjon, kjærlighetsspråk, nøkkelord.
 */

'use client';

import { FC } from 'react';

interface ProfileSummaryProps {
  user: {
    id: string;
    name: string | null;
    age: number | null;
    lifestyle: Record<string, unknown>;
    values: {
      futureVision: Record<string, unknown>;
      emotionalNeeds: Record<string, unknown>;
    };
    communication: Record<string, unknown>;
    intimacy: Record<string, unknown>;
    keywords: string[];
  };
  isYou?: boolean;
}

export const ProfileSummary: FC<ProfileSummaryProps> = ({ user, isYou = false }) => {
  // Trekk ut lesbare verdiar
  const lifestyleKeys = Object.keys(user.lifestyle || {});
  const futureVisionKeys = Object.keys(user.values.futureVision || {});
  const communicationKeys = Object.keys(user.communication || {});
  const intimacyKeys = Object.keys(user.intimacy || {});

  // Kjærlighetsspråk fra intimacy
  const loveLanguages: string[] = [];
  if (intimacyKeys.includes('words')) loveLanguages.push('ord');
  if (intimacyKeys.includes('time')) loveLanguages.push('tid');
  if (intimacyKeys.includes('touch')) loveLanguages.push('kontakt');
  if (intimacyKeys.includes('service')) loveLanguages.push('gjerning');
  if (intimacyKeys.includes('gift')) loveLanguages.push('gave');
  const loveLangText = loveLanguages.length > 0 ? loveLanguages.join(', ') : 'ukjent';

  return (
    <div
      className="space-y-4"
      style={{
        background: isYou ? 'rgba(212, 175, 55, 0.06)' : 'rgba(255, 255, 255, 0.02)',
        border: isYou
          ? '1px solid rgba(212, 175, 55, 0.2)'
          : '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '12px',
        padding: '16px',
      }}
    >
      {/* Namn + alder */}
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar sirkel */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: isYou
              ? 'rgba(212, 175, 55, 0.15)'
              : 'rgba(255, 255, 255, 0.06)',
            border: isYou
              ? '1.5px solid rgba(212, 175, 55, 0.3)'
              : '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke={isYou ? '#D4AF37' : 'rgba(255,255,255,0.4)'} strokeWidth="1.5" />
            <path d="M4 20c0-4 4-7 8-7s8 3 8 7" stroke={isYou ? '#D4AF37' : 'rgba(255,255,255,0.4)'} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p
            className="font-semibold"
            style={{ color: '#FFFFFF' }}
          >
            {isYou ? `${user.name || 'Deg'} (deg)` : user.name || 'Ukjend'}
            {isYou && ' (deg)'}
          </p>
          {user.age && (
            <p
              className="text-xs"
              style={{ color: 'rgba(255, 255, 255, 0.45)' }}
            >
              {user.age} år
            </p>
          )}
        </div>
      </div>

      {/* Livsstil */}
      {lifestyleKeys.length > 0 && (
        <div className="space-y-1">
          <p
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: 'rgba(255, 255, 255, 0.35)' }}
          >
            Livsstil
          </p>
          <p
            className="text-sm"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            {lifestyleKeys.slice(0, 3).join(' · ')}
          </p>
        </div>
      )}

      {/* Verdier */}
      {futureVisionKeys.length > 0 && (
        <div className="space-y-1">
          <p
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: 'rgba(255, 255, 255, 0.35)' }}
          >
            Verdier
          </p>
          <p
            className="text-sm"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            {futureVisionKeys.slice(0, 2).join(' · ')}
          </p>
        </div>
      )}

      {/* Kommunikasjon */}
      {communicationKeys.length > 0 && (
        <div className="space-y-1">
          <p
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: 'rgba(255, 255, 255, 0.35)' }}
          >
            Kommunikasjon
          </p>
          <p
            className="text-sm"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            {communicationKeys.slice(0, 2).join(' · ')}
          </p>
        </div>
      )}

      {/* Kjærlighetsspråk */}
      <div className="space-y-1">
        <p
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: 'rgba(255, 255, 255, 0.35)' }}
        >
          Kjærlighetsspråk
        </p>
        <p
          className="text-sm"
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          {loveLangText}
        </p>
      </div>

      {/* Nøkkelord */}
      {user.keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {user.keywords.map((kw) => (
            <span
              key={kw}
              className="px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                background: isYou
                  ? 'rgba(212, 175, 55, 0.15)'
                  : 'rgba(255, 255, 255, 0.06)',
                color: isYou ? '#D4AF37' : 'rgba(255, 255, 255, 0.55)',
                border: isYou
                  ? '1px solid rgba(212, 175, 55, 0.25)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileSummary;