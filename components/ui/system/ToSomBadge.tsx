/**
 * Tosom ToSomBadge — System component
 * 
 * Small label component with variants.
 */

'use client';

import { FC, ReactNode, CSSProperties } from 'react';
import { radius, colors, motion } from '@/config/design-tokens';

/* ═══════════════════════════════════════════
   VARIANTS
   ═══════════════════════════════════════════ */
type BadgeVariant = 'gold' | 'success' | 'error' | 'neutral';

interface VariantStyles {
  bg: string;
  border: string;
  text: string;
}

const variantStyles: Record<BadgeVariant, VariantStyles> = {
  gold: {
    bg: 'rgba(212,175,55,0.15)',
    border: 'rgba(212,175,55,0.25)',
    text: '#D4AF37',
  },
  success: {
    bg: 'rgba(77,255,136,0.12)',
    border: 'rgba(77,255,136,0.25)',
    text: '#4DFF88',
  },
  error: {
    bg: 'rgba(255,77,77,0.12)',
    border: 'rgba(255,77,77,0.25)',
    text: '#FF4D4D',
  },
  neutral: {
    bg: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.10)',
    text: 'rgba(255,255,255,0.75)',
  },
};

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomBadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  style?: CSSProperties;
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomBadge: FC<ToSomBadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  style,
}) => {
  const vs = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ease-out ${className}`}
      style={{
        background: vs.bg,
        border: `1px solid ${vs.border}`,
        color: vs.text,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export default ToSomBadge;