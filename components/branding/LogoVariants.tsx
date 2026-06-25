/*
 * ToSom Branding — Logo Variants
 * 
 * Ekstra logo-varianter for ulike bruksområder.
 * Importer fra '@/components/branding/LogoVariants' når du treng spesifikke varianter.
 */

'use client';

import { FC, CSSProperties } from 'react';
import { Logo, LogoProps } from '@/components/ui5/Logo';
import { color, shadow } from '@/config/design-tokens';
import Link from 'next/link';

/* ========================
   HORIZONTAL LOGO (with tagline)
   ======================== */

export interface LogoHorizontalProps {
  href?: string;
  showTagline?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Horisontal logo med tagline.
 * Brukes i hero-seksjoner og onboarding.
 */
export const LogoHorizontal: FC<LogoHorizontalProps> = ({
  href = '/',
  showTagline = true,
  className = '',
  style,
}) => {
  return (
    <div
      className={`inline-flex flex-col items-start ${className}`}
      style={style}
    >
      <Logo
        size="lg"
        colorVariant="gold"
        href={href}
        ariaLabel="ToSom — rolig, privat relasjonsplattform"
      />
      {showTagline && (
        <span
          className="mt-1 text-[11px] font-medium tracking-[0.2em] uppercase"
          style={{ color: 'rgba(255,255,255,0.40)' }}
        >
          Ro · Trygghet · Dybde
        </span>
      )}
    </div>
  );
};

/* ========================
   LOGO MARK (icon-only)
   ======================== */

export interface LogoMarkProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: CSSProperties;
}

/**
 * Kun initial "T" — for favicon, avatar-placeholder, etc.
 */
export const LogoMark: FC<LogoMarkProps> = ({
  size = 'md',
  className = '',
  style,
}) => {
  const sizeMap = {
    sm: { fontSize: '18px', width: '36px', height: '36px' },
    md: { fontSize: '24px', width: '48px', height: '48px' },
    lg: { fontSize: '32px', width: '64px', height: '64px' },
  };

  const s = sizeMap[size];

  return (
    <div
      className={`flex items-center justify-center rounded-full ${className}`}
      style={{
        width: s.width,
        height: s.height,
        background: `rgba(212,175,55,0.12)`,
        border: `1px solid rgba(212,175,55,0.20)`,
        ...style,
      }}
    >
      <span
        className="font-semibold"
        style={{
          fontSize: s.fontSize,
          color: color.brand.gold,
        }}
      >
        T
      </span>
    </div>
  );
};

/* ========================
   LOGO WORDMARK (full width)
   ======================== */

export interface LogoWordmarkProps {
  href?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * "ToSom" med ekstra mellomrom mellom bokstavene.
 * Brukes i foten, modaler, og headere.
 */
export const LogoWordmark: FC<LogoWordmarkProps> = ({
  href = '/',
  className = '',
  style,
}) => {
  return (
    <Link
      href={href}
      className={`font-semibold tracking-[0.15em] uppercase ${className}`}
      style={{
        fontSize: '18px',
        color: color.brand.gold,
        ...style,
      }}
      aria-label="ToSom — rolig, privat relasjonsplattform"
    >
      ToSom
    </Link>
  );
};

/* ========================
   LOGO STACKED (vertical)
   ======================== */

export interface LogoStackedProps {
  href?: string;
  showTagline?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Stacked logo: "ToSom" over tagline.
 * Brukes i footer og onboarding.
 */
export const LogoStacked: FC<LogoStackedProps> = ({
  href = '/',
  showTagline = true,
  className = '',
  style,
}) => {
  return (
    <div
      className={`flex flex-col items-start ${className}`}
      style={style}
    >
      <Logo
        size="md"
        colorVariant="gold"
        href={href}
      />
      {showTagline && (
        <span
          className="mt-2 text-xs"
          style={{ color: 'rgba(255,255,255,0.50)' }}
        >
          Ro · Trygghet · Dybde
        </span>
      )}
    </div>
  );
};

/* ========================
   LOGO ANIMATED (hero)
   ======================== */

export interface LogoAnimatedProps {
  className?: string;
}

/**
 * Animert logo med fade-in + scale-effekt.
 * Brukes kun i hero-seksjoner.
 * Logo er 3x større enn standard, med "Made in Norway" under.
 */
export const LogoAnimated: FC<LogoAnimatedProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <style>{`
        @keyframes logoFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .logo-animated {
          animation: logoFadeIn 1s ease-out 0.3s both;
        }
      `}</style>
      <div className="logo-animated flex flex-col items-center">
        <Logo
          size="4xl"
          colorVariant="gold"
        />
        <span
          className="mt-3 text-[11px] font-medium tracking-[0.3em] uppercase"
          style={{ color: 'rgba(212,175,55,0.55)' }}
        >
          Made in Norway
        </span>
      </div>
    </div>
  );
};

/* ========================
   CONVENIENCE GROUP
   ======================== */

export const LogoVariants = {
  Horizontal: LogoHorizontal,
  Mark: LogoMark,
  Wordmark: LogoWordmark,
  Stacked: LogoStacked,
  Animated: LogoAnimated,
};

/* ========================
   DEFAULT EXPORT
   ======================== */

export default LogoVariants;