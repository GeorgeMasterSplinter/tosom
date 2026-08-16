/**
 * GlassCard — delt glassmorphism-kort for hele plattformen.
 *
 * Brukes av alle offentlige sider. Alt er Tailwind-klasser med CSS-variabler,
 * ingen inline-stil, så hover, focus og responsivitet styres sentralt.
 *
 * Usage:
 *   <GlassCard>            // hvitkant, statisk
 *     <h3>Tittel</h3>
 *   </GlassCard>
 *   <GlassCard gold interactive>   // gullkant + hover-løft
 *   </GlassCard>
 */

import React from 'react';

export interface GlassCardProps {
  children: React.ReactNode;
  /**
   * Kort-padding. Verdien er i piksler, ikke i token-nøkkel:
   *   sm=8px, md=16px, lg=32px (standard), xl=48px.
   */
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  /** Gullkant (møte-gull) i stedet for standard hvitkant. */
  gold?: boolean;
  /** Rød kant for destruktive handlinger (f.eks. slette konto). */
  danger?: boolean;
  /**
   * Interaktivt kort: hover-løft (translateY) med gullskygge, lysere
   * bakgrunn og lysere kant. Svarer til det lokale kortenes onMouseEnter.
   */
  interactive?: boolean;
  /** Gullglød i ro (stasjonær skygge), uavhengig av hover. */
  glow?: boolean;
  /** Ytterligere klasser fra kalleren. */
  className?: string;
}

/** paddingMap i piksler — speiler design-tokens.ts spacing (sm 8 / md 16 / lg 24→32 / xl 48). */
const paddingMap: Record<NonNullable<GlassCardProps['padding']>, string> = {
  sm: 'p-[var(--ts-spacing-sm)]',
  md: 'p-[var(--ts-spacing-md)]',
  lg: 'p-[var(--ts-spacing-xl)]',
  xl: 'p-[var(--ts-spacing-2xl)]',
};

const BASE = 'rounded-[var(--ts-radius-xl)] bg-[var(--ts-glass-bg)] backdrop-blur-[var(--ts-glass-blur)]';

const BORDER_GOLD = 'border border-[var(--ts-glass-border-gold)]';
const BORDER_WHITE = 'border border-[var(--ts-glass-border)]';
const BORDER_DANGER = 'border border-[var(--ts-glass-border-danger)]';

const SHADOW_GLOW = 'shadow-[var(--ts-shadow-gold)]';
const SHADOW_REST = 'shadow-[var(--ts-glass-shadow)]';

const HOVER_GOLD =
  'transition-all duration-[var(--ts-transition-normal)] hover:bg-[var(--ts-glass-bg-hover)] hover:border-[var(--ts-glass-border-gold-hover)] hover:shadow-[var(--ts-glass-shadow-hover)] hover:-translate-y-1';
const HOVER_WHITE =
  'transition-all duration-[var(--ts-transition-normal)] hover:bg-[var(--ts-glass-bg-hover)] hover:border-[var(--ts-glass-border-hover)] hover:shadow-[var(--ts-glass-shadow-hover)] hover:-translate-y-1';

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  padding = 'lg',
  gold = false,
  danger = false,
  interactive = false,
  glow = false,
  className = '',
}) => {
  const border = danger ? BORDER_DANGER : gold ? BORDER_GOLD : BORDER_WHITE;
  const shadow = glow ? SHADOW_GLOW : SHADOW_REST;
  const hover = interactive ? (gold ? HOVER_GOLD : HOVER_WHITE) : '';

  return (
    <div
      className={`${BASE} ${border} ${shadow} ${paddingMap[padding]} ${hover} ${className}`}
    >
      {children}
    </div>
  );
};

GlassCard.displayName = 'GlassCard';
export default GlassCard;