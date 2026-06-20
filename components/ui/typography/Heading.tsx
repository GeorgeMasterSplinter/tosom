/**
 * Heading — H1-H6 heading component with consistent styling
 *
 * Usage:
 *   <Heading level={2}>Section Title</Heading>
 */

import React from 'react';

export interface HeadingProps {
  children: React.ReactNode;
  /** Heading level */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Color variant */
  color?: 'primary' | 'gold' | 'muted' | 'secondary';
  /** Size override */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  /** Whether to apply gold bottom border */
  bordered?: boolean;
  /** Custom class */
  className?: string;
}

const sizeMap: Record<NonNullable<HeadingProps['size']>, string> = {
  xs: 'heading-xs',
  sm: 'heading-m',
  md: 'heading-l',
  lg: 'heading-xl',
  xl: 'display',
  auto: '',
};

const colorMap: Record<NonNullable<HeadingProps['color']>, string> = {
  primary: 'text-ts-primary',
  gold: 'text-ts-gold',
  muted: 'text-ts-text-muted',
  secondary: 'text-ts-text-secondary',
};

const Heading: React.FC<HeadingProps> = ({
  children,
  level = 2,
  color = 'primary',
  size = 'auto',
  bordered = false,
  className = '',
}) => {
  const Component = `h${level}` as const;
  const sizeClass = sizeMap[size];
  const baseClasses = `${colorMap[color]} tracking-tight font-semibold ${sizeClass}`;

  return (
    <Component
      className={`
        ${baseClasses}
        ${bordered ? 'pb-2 border-b border-ts-gold/20' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

Heading.displayName = 'Heading';
export default Heading;