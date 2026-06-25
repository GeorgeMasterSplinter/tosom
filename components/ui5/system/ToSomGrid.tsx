/**
 * ToSom ToSomGrid — System component
 * 
 * Grid layout primitive with spacing tokens.
 */

'use client';

import { FC, ReactNode, CSSProperties } from 'react';
import { spacing } from '@/design/tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomGridProps {
  children: ReactNode;
  cols?: number;
  gap?: keyof typeof spacing;
  className?: string;
  style?: CSSProperties;
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomGrid: FC<ToSomGridProps> = ({
  children,
  cols = 3,
  gap = 'md',
  className = '',
  style,
}) => {
  const gridStyles: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: `${spacing[gap]}`,
    ...style,
  };

  return (
    <div className={`tosom-grid ${className}`} style={gridStyles}>
      {children}
    </div>
  );
};

export default ToSomGrid;