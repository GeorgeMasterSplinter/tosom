/**
 * Grid — Responsive CSS Grid container with configurable columns and gaps
 *
 * Usage:
 *   <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="md">
 *     {items.map(item => <GridItem key={item.id}>{item}</GridItem>)}
 *   </Grid>
 */

import React from 'react';

export interface GridProps {
  children: React.ReactNode;
  /** Column configuration per breakpoint */
  cols?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6;
    md?: 1 | 2 | 3 | 4 | 5 | 6;
    lg?: 1 | 2 | 3 | 4 | 5 | 6;
    xl?: 1 | 2 | 3 | 4 | 5 | 6;
  };
  /** Gap size */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Align items within grid cells */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Justify content */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Custom class */
  className?: string;
}

const gapMap: Record<NonNullable<GridProps['gap']>, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const alignMap: Record<NonNullable<GridProps['align']>, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyMap: Record<NonNullable<GridProps['justify']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const Grid: React.FC<GridProps> = ({
  children,
  cols,
  gap = 'md',
  align = 'stretch',
  justify,
  className = '',
}) => {
  /* Build col classes */
  const colClasses: string[] = [];
  if (cols?.sm) colClasses.push(`sm:grid-cols-${cols.sm}`);
  if (cols?.md) colClasses.push(`md:grid-cols-${cols.md}`);
  if (cols?.lg) colClasses.push(`lg:grid-cols-${cols.lg}`);
  if (cols?.xl) colClasses.push(`xl:grid-cols-${cols.xl}`);

  return (
    <div
      className={`grid ${colClasses.join(' ')} ${gapMap[gap]} ${alignMap[align]} ${
        justify ? justifyMap[justify] : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

Grid.displayName = 'Grid';
export default Grid;