/**
 * Stack — Vertical or horizontal spaced container (box-model stacking)
 *
 * Usage:
 *   <Stack direction="vertical" spacing="md">
 *     <div>Item 1</div>
 *     <div>Item 2</div>
 *   </Stack>
 */

import React from 'react';

export interface StackProps {
  children: React.ReactNode;
  /** Stack direction */
  direction?: 'vertical' | 'horizontal';
  /** Spacing between items */
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to align items to start */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Wrap items to new line */
  wrap?: boolean;
  /** Custom class */
  className?: string;
}

const spacingMap: Record<NonNullable<StackProps['spacing']>, string> = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const alignMap: Record<NonNullable<StackProps['align']>, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const Stack: React.FC<StackProps> = ({
  children,
  direction = 'vertical',
  spacing = 'md',
  align = 'start',
  wrap = false,
  className = '',
}) => {
  const isVertical = direction === 'vertical';

  return (
    <div
      className={`
        flex
        ${isVertical ? 'flex-col' : `flex-row ${wrap ? 'flex-wrap' : ''}`}
        ${spacingMap[spacing]}
        ${alignMap[align]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

Stack.displayName = 'Stack';
export default Stack;