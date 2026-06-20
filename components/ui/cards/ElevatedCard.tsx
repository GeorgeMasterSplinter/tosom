/**
 * ElevatedCard — Subtle elevation card (no glass, just shadow)
 *
 * Usage:
 *   <ElevatedCard>
 *     <h3>Elevated Content</h3>
 *   </ElevatedCard>
 */

import React from 'react';

export interface ElevatedCardProps {
  children: React.ReactNode;
  /** Card padding */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Whether card is clickable */
  interactive?: boolean;
  /** Elevation level */
  elevation?: 'sm' | 'md' | 'lg';
  /** Custom class */
  className?: string;
}

const paddingMap: Record<NonNullable<ElevatedCardProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const elevationMap: Record<NonNullable<ElevatedCardProps['elevation']>, string> = {
  sm: 'shadow-[0_2px_8px_rgba(0,0,0,0.3)]',
  md: 'shadow-[0_4px_20px_rgba(0,0,0,0.4)]',
  lg: 'shadow-[0_8px_40px_rgba(0,0,0,0.5)]',
};

const ElevatedCard: React.FC<ElevatedCardProps> = ({
  children,
  padding = 'lg',
  interactive = false,
  elevation = 'md',
  className = '',
}) => {
  return (
    <div
      className={`
        rounded-2xl
        border border-white/[0.06]
        bg-ts-bg-secondary
        ${elevationMap[elevation]}
        ${paddingMap[padding]}
        ${interactive ? 'cursor-pointer hover:translate-y-[-2px] hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-all' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

ElevatedCard.displayName = 'ElevatedCard';
export default ElevatedCard;