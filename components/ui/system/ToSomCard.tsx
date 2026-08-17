/**
 * Tosom ToSomCard — System component
 * 
 * Foundation card matching "Slik fungerer det" cards exactly,
 * but fully token-driven with icon, title, and content support.
 */

'use client';

import { FC, ReactNode, CSSProperties } from 'react';
import { radius, colors, shadows, motion as motionTokens } from '@/config/design-tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomCardProps {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
  variant?: 'default' | 'elevated';
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  iconWrapperClassName?: string;
}

/* ═══════════════════════════════════════════
   BASE STYLES
   ═══════════════════════════════════════════ */
const cardVariants = {
  default: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
    hoverBg: 'rgba(255,255,255,0.07)',
    hoverBorder: 'rgba(255,255,255,0.14)',
    shadow: '0 0 40px rgba(0,0,0,0.30)',
    glowShadow: null as string | null,
  },
  elevated: {
    background: 'rgba(212,175,55,0.04)',
    border: '1px solid rgba(212,175,55,0.20)',
    hoverBg: 'rgba(212,175,55,0.07)',
    hoverBorder: 'rgba(212,175,55,0.35)',
    shadow: '0 4px 30px rgba(212,175,55,0.15)',
    glowShadow: '0 0 60px rgba(212,175,55,0.08)',
  },
};

const baseCardStyles = (v: keyof typeof cardVariants): CSSProperties => ({
  borderRadius: radius['2xl'],
  background: cardVariants[v].background,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `1px solid ${cardVariants[v].border}`,
  boxShadow: cardVariants[v].shadow,
  padding: '32px',
  transition: `all ${motionTokens.durations.normal} ${motionTokens.easings.fadeIn}`,
  cursor: 'default',
  position: 'relative' as const,
});

const baseIconStyles: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  borderRadius: radius['xl'],
  background: 'rgba(212,175,55,0.10)',
  border: '1px solid rgba(212,175,55,0.20)',
  color: colors.gold,
  marginBottom: '24px',
  transition: `all ${motionTokens.durations.normal} ${motionTokens.easings.fadeIn}`,
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomCard: FC<ToSomCardProps> = ({
  icon,
  title,
  children,
  variant = 'default',
  onClick,
  className = '',
  style,
  iconWrapperClassName = '',
}) => {
  const vStyles = baseCardStyles(variant);
  const vColors = cardVariants[variant];

  return (
    <div
      className={`tosom-card group tosoms-card__${variant} ${className}`}
      style={{
        ...vStyles,
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = vColors.hoverBg;
        (e.currentTarget as HTMLElement).style.boxShadow = vColors.glowShadow 
          ? `0 4px 22px rgba(0,0,0,0.144), ${vColors.glowShadow}` 
          : '0 4px 22px rgba(0,0,0,0.144)';
        (e.currentTarget as HTMLElement).style.border = `1px solid ${vColors.hoverBorder}`;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        onClick?.();
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = vColors.background;
        (e.currentTarget as HTMLElement).style.boxShadow = vColors.shadow;
        (e.currentTarget as HTMLElement).style.border = `1px solid ${vColors.border}`;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {icon && (
        <div
          className={`flex justify-center w-10 h-10 md:w-12 md:h-12 mx-auto rounded-xl items-center justify-center transition-all duration-300 ease-out text-gold-300 ${iconWrapperClassName}`}
          style={baseIconStyles}
        >
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-[22px]" style={{ color: colors.textPrimary }}>
        {title}
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.7', maxWidth: '95%' }}>
        {children}
      </p>
    </div>
  );
};

export default ToSomCard;
