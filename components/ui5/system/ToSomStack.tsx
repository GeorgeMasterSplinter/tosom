/**
 * ToSom ToSomStack — System component
 * 
 * Vertical layout primitive with spacing tokens.
 */

'use client';

import { FC, ReactNode, CSSProperties } from 'react';
import { spacing } from '@/design/tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomStackProps {
  children: ReactNode;
  gap?: keyof typeof spacing;
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end';
  className?: string;
  style?: CSSProperties;
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomStack: FC<ToSomStackProps> = ({
  children,
  gap = 'md',
  align = 'start',
  justify = 'start',
  className = '',
  style,
}) => {
  const justifyContentMap: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
  };

  const alignItemsMap: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
  };

  const containerStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${spacing[gap]}`,
    justifyContent: justifyContentMap[justify],
    alignItems: alignItemsMap[align],
    ...style,
  };

  return (
    <div className={`tosom-stack ${className}`} style={containerStyles}>
      {children}
    </div>
  );
};

export default ToSomStack;