/**
 * Tosom ToSomButton — System component
 * 
 * Foundation button matching existing CTA buttons exactly,
 * but fully token-driven.
 */

'use client';

import { FC, CSSProperties } from 'react';
import { radius } from '@/config/design-tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'gold' | 'secondary' | 'ghost' | 'destructive' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
}

/* ═══════════════════════════════════════════
   VARIANTS
   ═══════════════════════════════════════════ */
const sizeMap = {
  sm: { padding: '12px 20px', fontSize: '14px' },
  md: { padding: '16px 28px', fontSize: '16px' },
  lg: { padding: '22px 36px', fontSize: '20px' },
  xl: { padding: '32px 0', fontSize: '24px' },
} as const;

const baseStyles: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  fontWeight: 600,
  borderRadius: radius['3xl'],
  border: 'none',
  cursor: 'pointer',
  transition: 'transform 400ms var(--ts-ease-resonance), box-shadow 400ms var(--ts-ease-resonance), background 400ms var(--ts-ease-resonance)',
  textDecoration: 'none',
  gap: '8px',
};

const variants = {
  gold: {
    ...baseStyles,
    background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
    color: '#0B1520',
    letterSpacing: '0.02em',
    animation: 'ts-cta-breath var(--ts-breath) ease-in-out infinite',
  },
  secondary: {
    ...baseStyles,
    background: 'rgba(212,175,55,0.06)',
    border: '1px solid rgba(212,175,55,0.25)',
    color: '#D4AF37',
  },
   ghost: {
     ...baseStyles,
     background: 'transparent',
     color: 'rgba(255,255,255,0.7)',
     border: '1px solid transparent',
   },
    dark: {
      ...baseStyles,
      background: 'rgba(5, 10, 15, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(212,175,55,0.2)',
      color: 'rgba(255,255,255,0.9)',
    },
  destructive: {
    ...baseStyles,
    background: 'rgba(255,77,77,0.12)',
    color: '#FF4D4D',
    border: '1px solid rgba(255,77,77,0.3)',
  },
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomButton: FC<ToSomButtonProps> = ({
  children,
  href,
  variant = 'gold',
  size = 'xl',
  onClick,
  className = '',
  style,
  disabled = false,
}) => {
  const sizeStyles = sizeMap[size];
  const variantStyles = { ...variants[variant], ...sizeStyles };

  const baseClass = 'tosom-button';

  const contentEl = (
    <span className={`${baseClass}__content`}>
      {children}
    </span>
  );

  const wrapper = href ? (
    <a
      href={href}
      className={`${baseClass} __${variant} ${disabled ? '__disabled' : ''} ${className}`}
      style={{ ...variantStyles, ...style }}
    >
      {contentEl}
    </a>
  ) : (
    <button
      className={`${baseClass} __${variant} ${disabled ? '__disabled' : ''} ${className}`}
      style={{ ...variantStyles, ...style }}
      onClick={onClick}
      disabled={disabled || false}
    >
      {contentEl}
    </button>
  );

  return wrapper;
};

export default ToSomButton;