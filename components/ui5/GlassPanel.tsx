/**
 * ToSom UI 5.0 - GlassPanel
 * 
 * Glassmorphism panel med justerbar styrke, gull-aksent, og myk skugg
 */

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
  glassBlur = 14,
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

  // Shadow
  const shadowMap = {
    none: 'none',
    sm: '0 2px 8px rgba(0, 0, 0, 0.2)',
    md: '0 4px 20px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 40px rgba(0, 0, 0, 0.5)',
  };

  // Glow — forbedret
  const glowMap = {
    none: 'none',
    gold: '0 0 40px rgba(212, 175, 55, 0.08), inset 0 0 12px rgba(255,255,255,0.03)',
    blue: '0 0 40px rgba(80,120,255,0.10), inset 0 0 12px rgba(255,255,255,0.03)',
  };

  // Indre lysrefleks
  const innerReflect = strength === 'strong'
    ? 'inset 0 0 20px rgba(255,255,255,0.04)'
    : 'inset 0 0 12px rgba(255,255,255,0.06)';

  // Ytre glow per strength
  const outerGlow = {
    default: '0 0 40px rgba(80,120,255,0.10)',
    light: '0 0 30px rgba(80,120,255,0.08)',
    strong: '0 0 50px rgba(80,120,255,0.14)',
  };

  const baseStyle: React.CSSProperties = {
    background: `linear-gradient(180deg, rgba(255,255,255,0.06) 0%, ${bgMap[strength]} 100%)`,
    backdropFilter: `blur(20px)`,
    WebkitBackdropFilter: `blur(20px)`,
    border: goldBorder
      ? '1.5px solid rgba(212, 175, 55, 0.22)'
      : '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius,
    boxShadow: `${shadowMap[shadow]}, ${outerGlow[strength]}, ${innerReflect}`,
    padding: paddingMap[padding],
    transition: 'all 0.2s ease-out',
    cursor: onClick ? 'pointer' : 'default',
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (hover) {
      (e.currentTarget as HTMLElement).style.background = `linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.05) 100%)`;
      (e.currentTarget as HTMLElement).style.boxShadow = `${shadowMap[shadow]}, ${outerGlow[strength].replace('0.10', '0.16').replace('0.08', '0.12').replace('0.14', '0.20')}, ${innerReflect}`;
      (e.currentTarget as HTMLElement).style.borderColor = goldBorder
        ? 'rgba(212, 175, 55, 0.4)'
        : 'rgba(255, 255, 255, 0.14)';
    }
    onClick?.();
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.background = `linear-gradient(180deg, rgba(255,255,255,0.06) 0%, ${bgMap[strength]} 100%)`;
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