/**
 * Display — Extra large heading for hero sections and feature calls
 *
 * Usage:
 *   <Display>The Future of Connection</Display>
 */

import React from 'react';

export interface DisplayProps {
  children: React.ReactNode;
  /** Color variant */
  color?: 'primary' | 'gold' | 'muted' | 'secondary';
  /** Whether to apply gold underline accent */
  accent?: boolean;
  /** Custom class */
  className?: string;
}

const colorMap: Record<NonNullable<DisplayProps['color']>, string> = {
  primary: 'text-ts-primary',
  gold: 'text-ts-gold',
  muted: 'text-ts-text-muted',
  secondary: 'text-ts-text-secondary',
};

const Display: React.FC<DisplayProps> = ({
  children,
  color = 'primary',
  accent = false,
  className = '',
}) => {
  return (
    <h1
      className={`
        display
        ${colorMap[color]}
        tracking-tight
        leading-tight
        font-semibold
        ${accent ? 'relative inline-block after:absolute after:bottom-[-8px] after:left-0 after:h-[3px] after:w-16 after:bg-ts-gold after:rounded-full' : ''}
        ${className}
      `}
    >
      {children}
    </h1>
  );
};

Display.displayName = 'Display';
export default Display;