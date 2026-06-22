/*
 * ToSom UI5 — Glass Panel Component
 * 
 * Reusable glassmorphism-komponent som bruker design-tokens.
 * Støtter default, gold og blue varianter.
 */

'use client';

import { FC, ReactNode, CSSProperties } from 'react';
import { color, shadow, radius, blur as blurTokens } from '@/config/design-tokens';

/* ========================
   PROPS INTERFACES
   ======================== */

export interface GlassProps {
  children: ReactNode;
  variant?: 'default' | 'gold' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  hover?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  role?: string;
  'aria-label'?: string;
}

/* ========================
   INTERNAL HELPERS
   ======================== */

/**
 * Få bakgrrunnsfarge basert på variant.
 */
function getBackground(variant: 'default' | 'gold' | 'blue'): string {
  switch (variant) {
    case 'gold':
      return 'rgba(212,175,55,0.06)';
    case 'blue':
      return 'rgba(80,120,255,0.06)';
    default:
      return 'rgba(255,255,255,0.04)';
  }
}

/**
 * Få border-farge basert på variant.
 */
function getBorder(variant: 'default' | 'gold' | 'blue'): string {
  switch (variant) {
    case 'gold':
      return 'rgba(212,175,55,0.20)';
    case 'blue':
      return 'rgba(80,120,255,0.20)';
    default:
      return 'rgba(255,255,255,0.08)';
  }
}

/**
 * Få shadow basert på variant + glow-flag.
 */
function getShadow(variant: 'default' | 'gold' | 'blue', glow?: boolean): string {
  if (glow) {
    switch (variant) {
      case 'gold':
        return '0 0 40px rgba(212,175,55,0.25), 0 4px 20px rgba(0,0,0,0.3)';
      case 'blue':
        return '0 0 32px rgba(80,120,255,0.20), 0 4px 20px rgba(0,0,0,0.3)';
      default:
        return '0 0 32px rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.3)';
    }
  }
  return shadow.lg;
}

/* ========================
   COMPONENT
   ======================== */

export const Glass: FC<GlassProps> = ({
  children,
  variant = 'default',
  size = 'md',
  padding = 'md',
  glow = false,
  hover = false,
  className = '',
  style,
  onClick,
  role,
  'aria-label': ariaLabel,
}) => {
  const bg = getBackground(variant);
  const border = getBorder(variant);
  const shadowVal = getShadow(variant, glow);
  
  /* Size determines max-width */
  const maxW: Record<string, string> = {
    sm: '480px',
    md: '640px',
    lg: '960px',
  };

  /* Padding mapping */
  const pMap: Record<string, string> = {
    sm: '16px',
    md: '24px',
    lg: '32px',
  };

  return (
    <div
      className={`
        relative
        transition-all
        duration-300
        ease-out
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        background: bg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${border}`,
        borderRadius: `${radius.xl}px`,
        boxShadow: shadowVal,
        maxWidth: maxW[size],
        padding: pMap[padding],
        width: '100%',
        ...style,
      }}
      onClick={hover ? onClick : undefined}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

/* ========================
   CONVENIENCE COMPONENTS
   ======================== */

/** Gold-bordered glass panel */
export const GoldGlassPanel: FC<Omit<GlassProps, 'variant'>> = (props) => (
  <Glass {...props} variant="gold" />
);

/** Blue-bordered glass panel */
export const BlueGlassPanel: FC<Omit<GlassProps, 'variant'>> = (props) => (
  <Glass {...props} variant="blue" />
);

/** Shorthand for default glass panel */
export const GlassPanel: FC<Omit<GlassProps, 'variant'>> = (props) => (
  <Glass {...props} variant="default" />
);

/* ========================
   DEFAULT EXPORT
   ======================== */

export default Glass;