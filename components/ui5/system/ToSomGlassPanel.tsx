/**
 * ToSom ToSomGlassPanel — System component
 * 
 * Reusable glass container for onboarding, modals, info panels.
 */

'use client';

import { FC, ReactNode, CSSProperties } from 'react';
import { radius, colors, shadows, spacing } from '@/design/tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomGlassPanelProps {
  children: ReactNode;
  padding?: keyof typeof spacing;
  className?: string;
  style?: CSSProperties;
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */
const baseStyles: CSSProperties = {
  borderRadius: radius['2xl'],
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
  padding: '24px',
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomGlassPanel: FC<ToSomGlassPanelProps> = ({
  children,
  padding,
  className = '',
  style,
}) => {
  const paddingStyle = padding ? { padding: `${spacing[padding]}` } : {};

  return (
    <div
      className={`tosom-glass-panel ${className}`}
      style={{
        ...baseStyles,
        ...paddingStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default ToSomGlassPanel;