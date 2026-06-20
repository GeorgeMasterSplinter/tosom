/**
 * Subheading — Supporting text under main headings
 *
 * Usage:
 *   <Subheading>A companion app for deeper connections</Subheading>
 */

import React from 'react';

export interface SubheadingProps {
  children: React.ReactNode;
  /** Color variant */
  color?: 'primary' | 'gold' | 'muted' | 'secondary';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom class */
  className?: string;
}

const colorMap: Record<NonNullable<SubheadingProps['color']>, string> = {
  primary: 'text-ts-primary',
  gold: 'text-ts-gold',
  muted: 'text-ts-text-muted',
  secondary: 'text-ts-text-secondary',
};

const sizeMap: Record<NonNullable<SubheadingProps['size']>, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const Subheading: React.FC<SubheadingProps> = ({
  children,
  color = 'muted',
  size = 'md',
  className = '',
}) => {
  return (
    <h2
      className={`
        ${colorMap[color]}
        ${sizeMap[size]}
        font-normal
        leading-relaxed
        ${className}
      `}
    >
      {children}
    </h2>
  );
};

Subheading.displayName = 'Subheading';
export default Subheading;