/**
 * ToSom ToSomCard — System component
 * 
 * Foundation card matching "Slik fungerer det" cards exactly,
 * but fully token-driven with icon, title, and content support.
 */

'use client';

import { FC, ReactNode, CSSProperties } from 'react';
import { radius, colors, shadows, motion as motionTokens } from '@/design/tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomCardProps {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

/* ═══════════════════════════════════════════
   BASE STYLES
   ═══════════════════════════════════════════ */
const baseCardStyles: CSSProperties = {
  borderRadius: radius['2xl'],
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.10)',
  boxShadow: '0 0 40px rgba(0,0,0,0.30)',
  padding: '32px',
  transition: `all ${motionTokens.durations.normal} ${motionTokens.easings.fadeIn}`,
  cursor: 'default',
};

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
  onClick,
  className = '',
  style,
}) => {
  return (
    <div
      className={`tosom-card group ${className}`}
      style={{
        ...baseCardStyles,
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 22px rgba(0,0,0,0.144)';
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.15)';
        onClick?.();
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(0,0,0,0.30)';
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.10)';
      }}
    >
      {icon && (
        <div className="flex justify-center w-10 h-10 md:w-12 md:h-12 mx-auto rounded-xl items-center justify-center transition-all duration-300 ease-out text-gold-300" style={baseIconStyles}>
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