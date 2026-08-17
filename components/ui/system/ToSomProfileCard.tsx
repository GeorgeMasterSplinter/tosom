/**
 * Tosom ToSomProfileCard — System component
 * 
 * Profile card with avatar, badges, and info sections.
 */

'use client';

import { FC } from 'react';
import Image from 'next/image';
import { radius, spacing, colors } from '@/config/design-tokens';
import { ToSomGlassPanel } from './ToSomGlassPanel';
import { ToSomBadge } from './ToSomBadge';

interface BadgeItem {
  label: string;
  variant?: 'gold' | 'success' | 'error' | 'neutral';
}

interface ToSomProfileCardProps {
  avatarUrl: string;
  name: string;
  age: number;
  location: string;
  badges?: BadgeItem[];
  about?: string;
}

export const ToSomProfileCard: FC<ToSomProfileCardProps> = ({
  avatarUrl,
  name,
  age,
  location,
  badges,
  about,
}) => {
  return (
    <ToSomGlassPanel padding="xl">
      <div className="text-center">
        {/* Avatar */}
        <div
          className="mx-auto mb-4 rounded-full overflow-hidden"
          style={{
            width: '80px',
            height: '80px',
            border: `2px solid ${colors.gold}`,
            boxShadow: `0 0 24px rgba(212,175,55,0.2)`,
          }}
        >
          <Image
            src={avatarUrl}
            alt={name}
            width={80}
            height={80}
            className="object-cover"
            style={{ borderRadius: '9999px' }}
          />
        </div>

        {/* Name + Age */}
        <h3 className="text-xl font-semibold mb-1" style={{ color: colors.textPrimary }}>
          {name}, {age}
        </h3>
        <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {location}
        </p>

        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {badges.map((badge, index) => (
              <ToSomBadge key={index} variant={badge.variant || 'neutral'}>
                {badge.label}
              </ToSomBadge>
            ))}
          </div>
        )}

        {/* About */}
        {about && (
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {about}
          </p>
        )}
      </div>
    </ToSomGlassPanel>
  );
};

export default ToSomProfileCard;