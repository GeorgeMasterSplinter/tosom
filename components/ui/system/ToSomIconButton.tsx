/**
 * ToSom ToSomIconButton — System component
 * 
 * Round icon button with glassmorphism and microBounce hover.
 */

'use client';

import { FC, ReactNode, CSSProperties } from 'react';
import { colors, motion } from '@/config/design-tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomIconButtonProps {
  icon: ReactNode;
  variant?: 'default' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

/* ═══════════════════════════════════════════
   SIZE CONFIG
   ═══════════════════════════════════════════ */
const sizes = {
  sm: { width: '36px', height: '36px', fontSize: '14px' },
  md: { width: '48px', height: '48px', fontSize: '18px' },
  lg: { width: '64px', height: '64px', fontSize: '24px' },
};

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */
const baseStyles: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '9999px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  cursor: 'pointer',
  transition: `all ${motion.durations.normal} ${motion.easings.fadeIn}`,
  outline: 'none',
};

const hoverDefaults: Record<string, Record<string, string>> = {
  default: {
    background: 'rgba(255,255,255,0.08)',
    transform: 'scale(1.04)',
  },
  gold: {
    background: 'rgba(212,175,55,0.12)',
    border: '1px solid rgba(212,175,55,0.25)',
    boxShadow: '0 0 24px rgba(212,175,55,0.25)',
    transform: 'scale(1.04)',
  },
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomIconButton: FC<ToSomIconButtonProps> = ({
  icon,
  variant = 'default',
  size = 'md',
  onClick,
  className = '',
  style,
  ariaLabel,
}) => {
  const sizeStyles = sizes[size];

  return (
    <button
      className={`tosom-icon-button ${className}`}
      aria-label={ariaLabel || 'Icon button'}
      style={{
        ...baseStyles,
        width: sizeStyles.width,
        height: sizeStyles.height,
        fontSize: sizeStyles.fontSize,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        (el as HTMLElement).style.background = (hoverDefaults[variant].background);
        (el as HTMLElement).style.transform = (hoverDefaults[variant].transform);
        if (variant === 'gold') {
          (el as HTMLElement).style.boxShadow = (hoverDefaults[variant].boxShadow);
          (el as HTMLElement).style.border = (hoverDefaults[variant].border);
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        (el as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
        (el as HTMLElement).style.transform = 'scale(1)';
        (el as HTMLElement).style.boxShadow = 'none';
        (el as HTMLElement).style.border = '1px solid rgba(255,255,255,0.08)';
      }}
    >
      {icon}
    </button>
  );
};

export default ToSomIconButton;