/**
 * ToSom ToSomDivider — System component
 * 
 * Subtle line to separate sections.
 */

'use client';

import { FC } from 'react';
import { spacing } from '@/config/design-tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomDividerProps {
  spacing?: keyof typeof spacing;
  className?: string;
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomDivider: FC<ToSomDividerProps> = ({
  spacing: spacingProp = 'lg',
  className = '',
}) => (
  <div
    className={`w-full ${className}`}
    style={{
      height: '1px',
      background: 'rgba(255,255,255,0.10)',
      marginTop: `${spacing[spacingProp]}`,
      marginBottom: `${spacing[spacingProp]}`,
    }}
  />
);

export default ToSomDivider;