/**
 * Tosom ToSomGlassPanel — System component
 * 
 * Reusable glass container for onboarding, modals, info panels.
 */

'use client';

import { FC, ReactNode, CSSProperties } from 'react';
import { radius, colors, shadows, spacing } from '@/config/design-tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomGlassPanelProps {
  children: ReactNode;
  padding?: keyof typeof spacing;
  variant?: 'default' | 'gold' | 'blue';
  glow?: boolean;
  className?: string;
  style?: CSSProperties;
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */
const variants = {
  default: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    glowBorder: 'rgba(255,255,255,0.12)',
    glowColor: 'transparent',
  },
  gold: {
    background: 'rgba(212,175,55,0.04)',
    border: '1px solid rgba(212,175,55,0.20)',
    glowBorder: 'rgba(212,175,55,0.35)',
    glowColor: 'rgba(212,175,55,0.08)',
  },
  blue: {
    background: 'rgba(80,120,255,0.04)',
    border: '1px solid rgba(80,120,255,0.20)',
    glowBorder: 'rgba(80,120,255,0.35)',
    glowColor: 'rgba(80,120,255,0.08)',
  },
};

const baseStyles = (v: keyof typeof variants): CSSProperties => ({
  borderRadius: radius['2xl'],
  background: v === 'gold' ? variants.gold.background : v === 'blue' ? variants.blue.background : variants.default.background,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${v === 'gold' ? variants.gold.border : v === 'blue' ? variants.blue.border : variants.default.border}`,
  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
  padding: '24px',
  position: 'relative' as const,
  overflow: 'hidden' as const,
});

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomGlassPanel: FC<ToSomGlassPanelProps> = ({
  children,
  padding,
  variant = 'default',
  glow = false,
  className = '',
  style,
}) => {
  const paddingStyle = padding ? { padding: `${spacing[padding]}` } : {};
  const vStyles = baseStyles(variant);
  const vColors = variants[variant];

  return (
    <div
      className={`tosom-glass-panel ${className} tosom-glass-panel__${variant}`}
      style={{
        ...vStyles,
        ...paddingStyle,
        ...style,
        ...(glow ? {
          boxShadow: `0 8px 32px rgba(0,0,0,0.25), inset 0 0 60px ${vColors.glowColor}`,
        } : {}),
      }}
    >
      {/* Ambient glow overlay */}
      {glow && (
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-30%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${vColors.glowBorder} 0%, transparent 70%)`,
          pointerEvents: 'none',
          filter: 'blur(40px)',
          animation: 'ambientGlow 8s infinite alternate ease-in-out',
        }} />
      )}
      <div style={paddingStyle ? {} : {}}>
        {children}
      </div>
    </div>
  );
};

// Inline CSS for ambient animation
export const GlassPanelStyles = () => (
  <style>{`
    @keyframes ambientGlow {
      0% { transform: translate(0, 0); opacity: 0.6; }
      50% { transform: translate(-15px, 10px); opacity: 0.9; }
      100% { transform: translate(10px, -5px); opacity: 0.6; }
    }
    .tosom-glass-panel:hover {
      border-color: rgba(255,255,255,0.14) !important;
      transition: border-color 300ms ease-out, background 300ms ease-out;
    }
    .tosom-glass-panel__gold:hover {
      border-color: rgba(212,175,55,0.35) !important;
      background: rgba(212,175,55,0.06) !important;
    }
    .tosom-glass-panel__blue:hover {
      border-color: rgba(80,120,255,0.35) !important;
      background: rgba(80,120,255,0.06) !important;
    }
  `}</style>
);


export default ToSomGlassPanel;