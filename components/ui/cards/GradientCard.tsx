/**
 * GradientCard — Card with gradient border and background
 *
 * Usage:
 *   <GradientCard gradient="gold">
 *     <h3>Premium Content</h3>
 *   </GradientCard>
 */

import React from 'react';

export interface GradientCardProps {
  children: React.ReactNode;
  /** Gradient type */
  gradient?: 'gold' | 'sunset' | 'aurora' | 'midnight';
  /** Card padding */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Whether card is clickable */
  interactive?: boolean;
  /** Custom class */
  className?: string;
}

const gradientMap: Record<NonNullable<GradientCardProps['gradient']>, string> = {
  gold: 'from-ts-gold/20 via-ts-gold/10 to-transparent',
  sunset: 'from-ts-orange/20 via-ts-pink/10 to-transparent',
  aurora: 'from-ts-teal/20 via-ts-purple/10 to-transparent',
  midnight: 'from-ts-blue/20 via-ts-indigo/10 to-transparent',
};

const GradientCard: React.FC<GradientCardProps> = ({
  children,
  gradient = 'gold',
  padding = 'lg',
  interactive = false,
  className = '',
}) => {
  const paddingClass: Record<NonNullable<GradientCardProps['padding']>, string> = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        relative
        rounded-2xl
        overflow-hidden
        ${interactive ? 'cursor-pointer hover:scale-[1.01] transition-all duration-300' : ''}
        ${className}
      `}
    >
      {/* Gradient overlay */}
      <div
        className={`
          absolute
          inset-0
          rounded-2xl
          bg-gradient-to-br
          ${gradientMap[gradient]}
        `}
      />
      {/* Glass content layer */}
      <div
        className={`
          relative
          rounded-2xl
          border border-white/8
          bg-white/[0.04]
          backdrop-blur-xl
          shadow-[0_4px_20px_rgba(0,0,0,0.4)]
          ${paddingClass[padding]}
        `}
      >
        {children}
      </div>
    </div>
  );
};

GradientCard.displayName = 'GradientCard';
export default GradientCard;