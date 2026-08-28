'use client';

/**
 * PartnerPresenceBar — Varm, roleg presence-indikator
 * 
 * Viser:
 *   - Online/offline status
 *   - Hva part gjer no
 *   - Same position i reisa
 *   - Resonans-nivå
 */

import { useState, useEffect } from 'react';

interface PartnerPresenceBarProps {
  partnerId: string;
  partnerName: string;
  isOnline: boolean;
  lastSeenAt: Date | null;
  activity: string;
  sharedPositionMessage: string;
  resonanceLevel: string;
}

export default function PartnerPresenceBar({
  partnerName,
  isOnline,
  lastSeenAt,
  activity,
  sharedPositionMessage,
  resonanceLevel,
}: PartnerPresenceBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Formater tid siden
  const formatLastSeen = (date: Date | null): string => {
    if (!date) return 'Aldri sett';
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Nettopp';
    if (diffMins < 60) return `${diffMins} min sidan`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} t sidan`;
    return `${Math.floor(diffHours / 24)} d sidan`;
  };

  // Aktivitetsemoji
  const getActivityEmoji = (activity: string): string => {
    const map: Record<string, string> = {
      idle: '😌',
      reading: '📖',
      writing: '✍️',
      reflecting: '🧘',
      'viewing-match': '✨',
      'in-journey': '🌿',
      paused: '⏸️',
    };
    return map[activity] || '👤';
  };

  // Resonans-farge
  const getResonanceColor = (level: string): string => {
    const map: Record<string, string> = {
      gentle: 'text-green-400',
      moderate: 'text-yellow-400',
      strong: 'text-[#D4AF37]',
      deep: 'text-[#E8C766]',
    };
    return map[level] || 'text-white/50';
  };

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2
        glassmorphism rounded-2xl px-6 py-4
        backdrop-blur-xl border border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
      }}
    >
      <div className="flex items-center gap-4">
        {/* Part-status */}
        <div className="flex items-center gap-3">
          {/* Status-indikator */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/10 flex items-center justify-center">
              <span className="text-xl">{getActivityEmoji(activity)}</span>
            </div>
            {/* Online-ring */}
            <div
              className={`
                absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0B1520]
                ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-white/30'}
              `}
            />
          </div>

          {/* Namn og aktivitet */}
          <div>
            <div className="text-white text-sm font-medium">
              {partnerName}
            </div>
            <div className="text-white/50 text-xs">
              {isOnline ? 'Aktiv no' : `Sist sett ${formatLastSeen(lastSeenAt)}`}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10" />

        {/* Resonans */}
        <div className="flex items-center gap-2">
          <div className={`text-sm ${getResonanceColor(resonanceLevel)}`}>
            {resonanceLevel === 'deep' && '💫'}
            {resonanceLevel === 'strong' && '✨'}
            {resonanceLevel === 'moderate' && '💛'}
            {resonanceLevel === 'gentle' && '🌱'}
          </div>
          <div className="text-white/60 text-xs">
            Resonans: {resonanceLevel}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10" />

        {/* Shared position */}
        <div className="text-white/50 text-xs max-w-xs">
          {sharedPositionMessage}
        </div>
      </div>
    </div>
  );
}