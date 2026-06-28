/**
 * ToSom UI 5.0 - GlassPanel (Round 3 Premium Visual Polish)
 * 
 * Forbedringar:
 * - Sterkare ytre glow: 0 0 50px rgba(80,120,255,0.15)
 * - Double shadow: 0 8px 40px rgba(0,0,0,0.45) + inset
 * - Gull-border: 1.5px opacity 0.22
 * - Sterkare indre refleks: inset 0 0 20px rgba(255,255,255,0.04)
 * - Reflekslag over heile panelet
 * Bokmål
 */

'use client';

import { FC, ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  strength?: 'default' | 'light' | 'strong';
  glassBlur?: number;
  goldBorder?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: number;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  hover?: boolean;
  glow?: 'none' | 'gold' | 'blue';
}

const paddingMap = {
  none: '0',
  sm: '12px 16px',
  md: '16px 20px',
  lg: '20px 24px',
  xl: '24px 32px',
};

export const GlassPanel: FC<GlassPanelProps> = ({
  children,
  className = '',
  strength = 'default',
  glassBlur = 20,
  goldBorder = false,
  padding = 'lg',
  borderRadius = 20,
  shadow = 'md',
  onClick,
  hover = true,
  glow = 'none',
}) => {
  // Background strength
  const bgMap = {
    default: 'rgba(255, 255, 255, 0.03)',
    light: 'rgba(255, 255, 255, 0.02)',
    strong: 'rgba(255, 255, 255, 0.05)',
  };

  // Double shadow
  const shadowMap = {
    none: 'none',
    sm: '0 4px 20px rgba(0, 0, 0, 0.35)',
    md: '0 8px 40px rgba(0, 0, 0, 0.45)',
    lg: '0 12px 60px rgba(0, 0, 0, 0.55)',
  };

  // Ytre glow — Round 3: sterkare
  const outerGlow = {
    default: '0 0 50px rgba(80,120,255,0.15)',
    light: '0 0 40px rgba(80,120,255,0.12)',
    strong: '0 0 60px rgba(80,120,255,0.18)',
  };

  // Indre lysrefleks — Round 3: sterkare
  const innerReflect = 'inset 0 0 20px rgba(255,255,255,0.04)';

  const baseStyle: React.CSSProperties = {
    background: `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, ${bgMap[strength]} 100%)`,
    backdropFilter: `blur(${glassBlur}px)`,
    WebkitBackdropFilter: `blur(${glassBlur}px)`,
    border: goldBorder
      ? '1.5px solid rgba(212, 175, 55, 0.22)'
      : '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius,
    boxShadow: `${shadowMap[shadow]}, ${outerGlow[strength]}, ${innerReflect}`,
    padding: paddingMap[padding],
    transition: 'all 0.25s ease-out',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (hover) {
      (e.currentTarget as HTMLElement).style.background = `linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)`;
      (e.currentTarget as HTMLElement).style.boxShadow = `${shadowMap[shadow]}, ${outerGlow[strength].replace('0.15', '0.22').replace('0.12', '0.18').replace('0.18', '0.26')}, ${innerReflect}`;
      (e.currentTarget as HTMLElement).style.borderColor = goldBorder
        ? 'rgba(212, 175, 55, 0.45)'
        : 'rgba(255, 255, 255, 0.14)';
    }
    onClick?.();
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.background = `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, ${bgMap[strength]} 100%)`;
    (e.currentTarget as HTMLElement).style.borderColor = goldBorder
      ? 'rgba(212, 175, 55, 0.22)'
      : 'rgba(255, 255, 255, 0.08)';
  };

  return (
    <div
      className={className}
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default GlassPanel;