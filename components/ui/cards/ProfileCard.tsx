/**
 * ProfileCard — User profile card with avatar, name, and stats
 *
 * Usage:
 *   <ProfileCard
 *     name="Alexander"
 *     age={28}
 *     avatar="/avatar.jpg"
 *     location="Oslo, Norge"
 *     online={true}
 *   />
 */

import React from 'react';

export interface ProfileCardProps {
  /** User name */
  name: string;
  /** Age */
  age?: number;
  /** Avatar URL */
  avatar?: string;
  /** Location */
  location?: string;
  /** Bio text */
  bio?: string;
  /** Whether user is online */
  online?: boolean;
  /** Premium badge */
  premium?: boolean;
  /** Compatibility score (0-100) */
  compatibility?: number;
  /** Tags/interests */
  tags?: string[];
  /** Custom class */
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  age,
  avatar,
  location,
  bio,
  online = false,
  premium = false,
  compatibility,
  tags = [],
  className = '',
}) => {
  return (
    <div
      className={`
        rounded-2xl
        border border-white/8
        bg-white/[0.04]
        backdrop-blur-xl
        shadow-[0_4px_20px_rgba(0,0,0,0.4)]
        overflow-hidden
        ${className}
      `}
    >
      {/* Avatar section */}
      <div className="relative h-48">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ts-gold/20 via-ts-gold/10 to-transparent">
            <div className="w-20 h-20 rounded-full bg-ts-gold/20 flex items-center justify-center border border-ts-gold/20">
              <span className="text-3xl font-semibold text-ts-gold">
                {name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Online indicator */}
        {online && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ts-success/20 text-ts-success text-xs font-medium backdrop-blur-sm border border-ts-success/20">
              <span className="w-2 h-2 rounded-full bg-ts-success animate-pulse" />
              Online
            </span>
          </div>
        )}

        {/* Premium badge */}
        {premium && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ts-gold/20 text-ts-gold text-xs font-medium backdrop-blur-sm border border-ts-gold/20">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Premium
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-semibold text-ts-primary">
              {name}
              {age && <span className="text-base font-normal text-ts-text-secondary">, {age}</span>}
            </h3>
            {location && (
              <p className="text-sm text-ts-text-subtle flex items-center gap-1 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {location}
              </p>
            )}
          </div>

          {/* Compatibility */}
          {compatibility !== undefined && (
            <div className="flex flex-col items-center ml-3">
              <div className="w-12 h-12 rounded-full border-2 border-ts-gold flex items-center justify-center bg-ts-gold/10">
                <span className="text-sm font-bold text-ts-gold">{compatibility}%</span>
              </div>
              <span className="text-[10px] text-ts-text-subtle mt-0.5">Match</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-sm text-ts-text-secondary leading-relaxed mb-3">
            {bio}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 5).map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-xs font-medium rounded-full bg-white/[0.04] text-ts-text-secondary border border-white/8"
              >
                {tag}
              </span>
            ))}
            {tags.length > 5 && (
              <span className="px-2.5 py-1 text-xs font-medium text-ts-text-subtle">
                +{tags.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ProfileCard.displayName = 'ProfileCard';
export default ProfileCard;