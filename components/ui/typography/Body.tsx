/**
 * Body — Body text paragraph with consistent line-height and color
 *
 * Usage:
 *   <Body>This is the main body text for content sections.</Body>
 */

import React from 'react';

export interface BodyProps {
  children: React.ReactNode;
  /** Color variant */
  color?: 'primary' | 'gold' | 'muted' | 'secondary';
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Whether text is bold */
  bold?: boolean;
  /** Custom class */
  className?: string;
}

const colorMap: Record<NonNullable<BodyProps['color']>, string> = {
  primary: 'text-ts-primary',
  gold: 'text-ts-gold',
  muted: 'text-ts-text-muted',
  secondary: 'text-ts-text-secondary',
};

const sizeMap: Record<NonNullable<BodyProps['size']>, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const Body: React.FC<BodyProps> = ({
  children,
  color = 'primary',
  size = 'md',
  bold = false,
  className = '',
}) => {
  return (
    <p
      className={`
        ${colorMap[color]}
        ${sizeMap[size]}
        font-normal
        leading-relaxed
        ${bold ? 'font-medium' : ''}
        ${className}
      `}
    >
      {children}
    </p>
  );
};

Body.displayName = 'Body';
export default Body;