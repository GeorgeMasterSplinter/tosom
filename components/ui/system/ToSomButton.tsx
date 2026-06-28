/**
 * ToSom ToSomButton — System component
 * 
 * Foundation button matching existing CTA buttons exactly,
 * but fully token-driven.
 */

'use client';

import { FC, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { radius, motion as motionTokens, colors } from '@/config/design-tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'gold' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
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
  transition: 'all 250ms ease-out',
  textDecoration: 'none',
};

const variants = {
  gold: {
    ...baseStyles,
    background: '#D4AF37',
    color: '#0B0E11',
    boxShadow: '0 0 40px rgba(212,175,55,0.30)',
    letterSpacing: '0.02em',
  },
  dark: {
    ...baseStyles,
    background: 'rgba(0,0,0,0.70)',
    color: '#FFFFFF',
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
}) => {
  const sizeStyles = sizeMap[size];
  const variantStyles = { ...variants[variant], ...sizeStyles };
  
  const baseClass = 'tosom-button';
  const hoverClass = variant === 'gold' 
    ? 'hover:bg-[#C49F2F] hover:shadow-[0_0_65px_rgba(212,175,55,0.45)] hover:scale-[1.015]' 
    : 'hover:bg-black/80 hover:scale-[1.015]';
  
  const content = (
    <span className={baseClass}>
      {children}
    </span>
  );

  const wrapper = href ? (
    <a
      href={href}
      className={`${baseClass} ${hoverClass} ${className}`}
      style={{ ...variantStyles, ...style }}
    >
      {content}
    </a>
  ) : (
    <button
      className={`${baseClass} ${hoverClass} ${className}`}
      style={{ ...variantStyles, ...style }}
      onClick={onClick}
    >
      {content}
    </button>
  );

  return wrapper;
};

export default ToSomButton;