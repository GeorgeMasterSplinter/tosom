/**
 * GlassCard — Core glassmorphism card component
 *
 * Usage:
 *   <GlassCard>
 *     <h3>Title</h3>
 *     <p>Content</p>
 *   </GlassCard>
 */

import React from 'react';

export interface GlassCardProps {
  children: React.ReactNode;
  /** Card padding */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Whether card is clickable */
  interactive?: boolean;
  /** Hover glow effect */
  glow?: boolean;
  /** Custom class */
  className?: string;
}

const paddingMap: Record<NonNullable<GlassCardProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-[var(--ts-spacing-sm)]',
  md: 'p-[var(--ts-spacing-md)]',
  lg: 'p-[var(--ts-spacing-xl)]',
};

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  padding = 'lg',
  interactive = false,
  glow = false,
  className = '',
}) => {
  return (
    <div
      className={`
        rounded-[var(--ts-radius-xl)]
        border border-[var(--ts-glass-border)]
        bg-[var(--ts-glass-bg)]
        backdrop-blur-[var(--ts-glass-blur)]
        shadow-[var(--ts-shadow-md)]
        ${paddingMap[padding]}
        ${interactive ? 'cursor-pointer hover:bg-[var(--ts-glass-bg-hover)] hover:border-[var(--ts-glass-border-hover)] transition-all duration-[var(--ts-transition-fast)]' : ''}
        ${glow ? 'hover:shadow-[var(--ts-shadow-gold)]' : ''}
        ${className}
      `}
      role="article"
      aria-label={children ? undefined : undefined}
    >
      {children}
    </div>
  );
};

GlassCard.displayName = 'GlassCard';
export default GlassCard;