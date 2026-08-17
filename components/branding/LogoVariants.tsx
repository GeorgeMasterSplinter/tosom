/*
 * Tosom Branding — Logo Variants
 * 
 * Ekstra logo-varianter for ulike bruksområder.
 * Importer fra '@/components/branding/LogoVariants' når du treng spesifikke varianter.
 */

'use client';

import { FC, CSSProperties } from 'react';
import { Logo, LogoProps } from '@/components/ui/branding/Logo';
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
        ariaLabel="Tosom — rolig, privat relasjonsplattform"
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
 * "Tosom" med ekstra mellomrom mellom bokstavene.
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
      aria-label="Tosom — rolig, privat relasjonsplattform"
    >
      Tosom
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
 * Stacked logo: "Tosom" over tagline.
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
 * Animert logo med rolig fade-in (150 ms, kun opacity — ingen scale/transform).
 * Brukes kun i hero-seksjoner.
 * Logo er 3x større enn standard, med "Made in Norway" under (etterlogo, 150 ms forsinkelse).
 */
export const LogoAnimated: FC<LogoAnimatedProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Premium radial backdrop — myk gull + blå glow */}
      <div
        className="absolute inset-[-30px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 40%, rgba(212,175,55,0.06) 0%, rgba(80,120,255,0.03) 50%, transparent 75%)',
          filter: 'blur(20px)',
        }}
      />
      <div className="flex flex-col items-center animate-ts-fade-in [animation-duration:600ms] relative">
        <Logo
          size="3xl"
          colorVariant="gold"
        />
        <span
          className="mt-3 text-[10px] font-medium tracking-[0.35em] uppercase text-[var(--ts-gold)] opacity-35 animate-ts-fade-in [animation-duration:600ms] [animation-delay:350ms]"
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