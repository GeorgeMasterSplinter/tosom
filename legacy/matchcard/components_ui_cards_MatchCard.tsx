/**
 * MatchCard — Match suggestion card with swipe actions
 *
 * Usage:
 *   <MatchCard
 *     name="Eva"
 *     age={26}
 *     avatar="/avatar.jpg"
 *     compatibility={92}
 *     onLike={() => handleLike()}
 *     onDislike={() => handleDislike()}
 *   />
 */

import React from 'react';

export interface MatchCardProps {
  /** User name */
  name: string;
  /** Age */
  age?: number;
  /** Avatar URL */
  avatar?: string;
  /** Compatibility score (0-100) */
  compatibility?: number;
  /** Bio text */
  bio?: string;
  /** Tags/interests */
  tags?: string[];
  /** Like handler */
  onLike?: () => void;
  /** Dislike handler */
  onDislike?: () => void;
  /** Super like handler */
  onSuperLike?: () => void;
  /** Custom class */
  className?: string;
}

const MatchCard: React.FC<MatchCardProps> = ({
  name,
  age,
  avatar,
  compatibility,
  bio,
  tags = [],
  onLike,
  onDislike,
  onSuperLike,
  className = '',
}) => {
  return (
    <div
      className={`
        relative
        rounded-2xl
        border border-white/8
        bg-white/[0.04]
        backdrop-blur-xl
        shadow-[0_4px_20px_rgba(0,0,0,0.4)]
        overflow-hidden
        ${className}
      `}
    >
      {/* Avatar/Image section */}
      <div className="relative h-56">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ts-gold/30 via-ts-gold/15 to-transparent flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-4xl font-semibold text-white/80">
                {name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-12">
          <h3 className="text-2xl font-bold text-white">
            {name}
            {age && <span className="text-lg font-normal text-white/80">, {age}</span>}
          </h3>
        </div>

        {/* Compatibility badge */}
        {compatibility !== undefined && (
          <div className="absolute top-4 right-4">
            <div className="w-14 h-14 rounded-full border-2 border-ts-gold flex items-center justify-center bg-black/40 backdrop-blur-md">
              <span className="text-sm font-bold text-ts-gold">{compatibility}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Bio */}
        {bio && (
          <p className="text-sm text-white/70 leading-relaxed mb-4">
            {bio}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-xs font-medium rounded-full bg-white/5 text-white/60 border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4 pt-2">
          {/* Dislike */}
          {onDislike && (
            <button
              onClick={onDislike}
              className="
                w-14 h-14
                flex items-center justify-center
                rounded-full
                bg-white/5
                border border-white/10
                text-ts-error
                hover:bg-ts-error/10 hover:border-ts-error/30
                transition-all
              "
              aria-label="Dislike"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Super Like */}
          {onSuperLike && (
            <button
              onClick={onSuperLike}
              className="
                w-12 h-12
                flex items-center justify-center
                rounded-full
                bg-white/5
                border border-white/10
                text-ts-gold
                hover:bg-ts-gold/10 hover:border-ts-gold/30
                transition-all
              "
              aria-label="Super Like"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          )}

          {/* Like */}
          {onLike && (
            <button
              onClick={onLike}
              className="
                w-14 h-14
                flex items-center justify-center
                rounded-full
                bg-ts-gold/20
                border border-ts-gold/30
                text-ts-gold
                hover:bg-ts-gold/30 hover:border-ts-gold/50
                transition-all
              "
              aria-label="Like"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

MatchCard.displayName = 'MatchCard';
export default MatchCard;