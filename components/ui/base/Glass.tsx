/*
 * ToSom UI5 — Glass Panel Component
 * 
 * Reusable glassmorphism-komponent som bruker design-tokens.
 * Støtter default, gold og blue varianter.
 */

'use client';

import { FC, ReactNode, CSSProperties, useState } from 'react';
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
    * Få bakgrunn basert på variant (UI 6.0 dyp glass).
    */
   function getBackground(variant: 'default' | 'gold' | 'blue'): string {
     switch (variant) {
       case 'gold':
         return 'rgba(212,175,55,0.08)';
       case 'blue':
         return 'rgba(80,120,255,0.08)';
       default:
         return 'rgba(255,255,255,0.06)';
     }
   }

   /**
    * Få border basert på variant (UI 6.0 premium).
    */
   function getBorder(variant: 'default' | 'gold' | 'blue'): string {
     switch (variant) {
       case 'gold':
         return 'rgba(212,175,55,0.25)';
       case 'blue':
         return 'rgba(80,120,255,0.25)';
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
  const [isHovered, setIsHovered] = useState(false);

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

  const bg = getBackground(variant);
  const border = getBorder(variant);
  const shadowVal = getShadow(variant, glow);

  /* Hover border */
  const hoveredBorder = variant === 'gold'
    ? 'rgba(212,175,55,0.35)'
    : variant === 'blue'
      ? 'rgba(80,120,255,0.35)'
      : 'rgba(255,255,255,0.12)';

  /* Hover shadow */
  const hoveredShadow = variant === 'gold'
    ? 'var(--ts-shadow-glow)'
    : variant === 'blue'
      ? '0 0 40px rgba(80,120,255,0.15), var(--ts-shadow-card)'
      : 'var(--ts-shadow-glow)';

  /* Base style */
  const baseStyle: CSSProperties = {
    background: bg,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: `1px solid ${isHovered && hover ? hoveredBorder : border}`,
    borderRadius: '26px',
    boxShadow: isHovered && hover ? hoveredShadow : shadowVal,
    maxWidth: maxW[size],
    padding: pMap[padding],
    width: '100%',
    transition: 'all 200ms ease-out',
    ...style,
  };

  /* Hover style — UI 6.0 micro-interactions */
  const hoverStyle: CSSProperties = hover
    ? {
        transform: isHovered ? 'translateY(-4px) scale(1.005)' : 'scale(1)',
        transition: 'all 300ms ease-out',
      }
    : {};

  /* Typography styles for content inside */
  const typographyStyle: CSSProperties = {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  };

    return (
      <div
        className={`
          relative
          overflow-hidden
          ${hover ? 'cursor-pointer' : ''}
          animate-fadeInUp
          ${className}
        `}
        style={{
          ...baseStyle,
          ...(hover ? hoverStyle : {}),
          animationDelay: '0.1s',
        }}
        onMouseEnter={hover ? () => setIsHovered(true) : undefined}
        onMouseLeave={hover ? () => setIsHovered(false) : undefined}
        onClick={hover ? onClick : undefined}
        role={role}
        aria-label={ariaLabel}
      >
        {/* Subtil inner-glow lag (UI 6.0) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[26px]"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 50%)',
          }}
        />
        {/* Subtil hover-float (UI 6.0) */}
        {hover && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[26px]"
            style={{
              animation: 'subtleFloat 4s ease-in-out infinite',
              opacity: isHovered ? 0.04 : 0,
              transition: 'opacity 300ms ease',
              background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08), transparent 70%)',
            }}
          />
        )}
        {/* Typegrafikk-wrapper */}
        <div style={{ ...typographyStyle, transition: 'all 200ms ease-out' }}>
          {children}
        </div>
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