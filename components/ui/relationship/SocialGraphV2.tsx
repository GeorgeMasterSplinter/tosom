/**
 * SocialGraphV2 — Social connections graph visualization
 *
 * Usage:
 *   <SocialGraphV2
 *     connections={[
 *       { name: "Besteven", avatars: [...], type: "friend" },
 *     ]}
 *   />
 */

import Image from 'next/image';
import React from 'react';

export interface SocialConnection {
  name: string;
  avatars?: string[];
  type: 'friend' | 'family' | 'couple' | 'group';
  /** Mutual connections count */
  mutual?: number;
}

export interface SocialGraphV2Props {
  connections: SocialConnection[];
  /** Show mutual count */
  showMutual?: boolean;
  /** Custom class */
  className?: string;
}

const typeColorMap: Record<SocialConnection['type'], { bg: string; border: string; text: string; label: string }> = {
  friend: { bg: 'bg-ts-teal/10', border: 'border-ts-teal/20', text: 'text-ts-teal', label: 'Venner' },
  family: { bg: 'bg-ts-pink/10', border: 'border-ts-pink/20', text: 'text-ts-pink', label: 'Familie' },
  couple: { bg: 'bg-ts-gold/10', border: 'border-ts-gold/20', text: 'text-ts-gold', label: 'Par' },
  group: { bg: 'bg-ts-purple/10', border: 'border-ts-purple/20', text: 'text-ts-purple', label: 'Gruppe' },
};

const SocialGraphV2: React.FC<SocialGraphV2Props> = ({ connections, showMutual = true, className = '' }) => {
  if (connections.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-ts-text-subtle">
        <p>Inga sosiale koplingar ennå</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {connections.map((conn, i) => {
        const colors = typeColorMap[conn.type];
        return (
          <div
            key={i}
            className={`
              rounded-2xl
              border ${colors.border}
              ${colors.bg}
              backdrop-blur-xl
              shadow-[0_4px_20px_rgba(0,0,0,0.4)]
              p-5
              transition-all
              hover:bg-opacity-60
            `}
          >
            {/* Type badge */}
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold ${colors.text}`}>{colors.label}</span>
              {showMutual && conn.mutual && conn.mutual > 0 && (
                <span className="text-xs text-ts-text-subtle">{conn.mutual} felles</span>
              )}
            </div>

            {/* Name */}
            <h4 className="text-sm font-semibold text-ts-primary mb-3">{conn.name}</h4>

            {/* Avatars */}
            {conn.avatars && conn.avatars.length > 0 && (
              <div className="flex -space-x-2">
                {conn.avatars.slice(0, 4).map((avatar, j) => (
                  <div key={j} className="w-8 h-8 relative">
                    <Image
                      src={avatar}
                      alt=""
                      fill
                      className="rounded-full border-2 border-ts-bg object-cover"
                    />
                  </div>
                ))}
                {conn.avatars.length > 4 && (
                  <div className="w-8 h-8 rounded-full border-2 border-ts-bg bg-ts-glass flex items-center justify-center">
                    <span className="text-[10px] font-medium text-ts-text-subtle">+{conn.avatars.length - 4}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

SocialGraphV2.displayName = 'SocialGraphV2';
export default SocialGraphV2;