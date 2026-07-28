/**
 * MemoryCard — Photo/memory card with overlay details
 *
 * Usage:
 *   <MemoryCard
 *     photo="/memory.jpg"
 *     title="Summer 2024"
     date={new Date('2024-07-20')}
     favorites={12}
   />
 */

import Image from 'next/image';
import React from 'react';

export interface MemoryCardProps {
  /** Photo URL */
  photo?: string;
  /** Title */
  title?: string;
  /** Date */
  date?: Date | string;
  /** Description */
  description?: string;
  /** Number of favorites */
  favorites?: number;
  /** Whether user favorited it */
  favorited?: boolean;
  /** On favorite toggle */
  onFavorite?: () => void;
  /** Custom class */
  className?: string;
}

const MemoryCard: React.FC<MemoryCardProps> = ({
  photo,
  title,
  date,
  description,
  favorites = 0,
  favorited = false,
  onFavorite,
  className = '',
}) => {
  const formattedDate = date
    ? new Date(date).toLocaleDateString('no-NO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div
      className={`
        rounded-2xl
        border border-white/8
        bg-white/[0.04]
        backdrop-blur-xl
        shadow-[0_4px_20px_rgba(0,0,0,0.4)]
        overflow-hidden
        transition-all
        hover:bg-white/[0.06]
        ${className}
      `}
    >
      {/* Photo */}
      <div className="relative h-48">
        {photo ? (
          <div className="relative w-full h-48">
            <Image src={photo} alt={title || 'Memory'} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ts-gold/15 via-ts-purple/10 to-transparent flex items-center justify-center">
            <svg className="w-12 h-12 text-ts-text-subtle/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Favorite button */}
        {onFavorite && (
          <button
            onClick={onFavorite}
            className={`
              absolute top-3 right-3
              w-8 h-8
              flex items-center justify-center
              rounded-full
              ${favorited ? 'bg-ts-gold/30 text-ts-gold' : 'bg-black/30 text-white/70 hover:bg-black/50'}
              backdrop-blur-sm
              border border-white/10
              transition-all
            `}
            aria-label={favorited ? 'Remove favorite' : 'Add favorite'}
          >
            <svg className="w-4 h-4" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {title && (
          <h3 className="text-base font-semibold text-ts-primary mb-1">{title}</h3>
        )}

        {formattedDate && (
          <p className="text-xs text-ts-text-subtle mb-2">{formattedDate}</p>
        )}

        {description && (
          <p className="text-sm text-ts-text-secondary leading-relaxed mb-3">{description}</p>
        )}

        {/* Favorites count */}
        {favorites > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-ts-text-subtle">
            <svg className="w-3.5 h-3.5 text-ts-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {favorites}
          </div>
        )}
      </div>
    </div>
  );
};

MemoryCard.displayName = 'MemoryCard';
export default MemoryCard;