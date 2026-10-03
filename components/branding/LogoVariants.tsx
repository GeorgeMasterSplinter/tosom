/*
 * Tosom Branding — Logo Variants
 * 
 * Ekstra logo-varianter for ulike bruksområder.
 * Importer fra '@/components/branding/LogoVariants' når du treng spesifikke varianter.
 */

'use client';

import { FC, CSSProperties, useId } from 'react';
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
        <div className="mt-3 flex flex-col items-center gap-1 animate-ts-fade-in [animation-duration:600ms] [animation-delay:350ms]">
          <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[var(--ts-gold)] opacity-35">
            Utviklet i Norge
          </span>
          <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[var(--ts-gold)] opacity-35">
            Bygget for ekte relasjoner
          </span>
        </div>
      </div>
    </div>
  );
};

/* ========================
   RESONANCE MARK (resonansmerket)
   ======================== */

export interface ResonanceMarkProps {
  /** Bredde i px — høyden følger automatisk (~10:7). */
  size?: number;
  strokeWidth?: number;
  /** Strekkfarge. Standard: ToSom-gull. */
  color?: string;
  /**
   * Gradient-fade + gullglød (som chat-knappen «Bli kjent»): streken er
   * klar der sirklene møtes, falmer mot ytre kanter, og får en myk glød.
   */
  glow?: boolean;
  /** Resonans: sirklene puster sakte mot hverandre og tilbake. */
  resonate?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Resonansmerket — signaturmotivet: to sirkler som møter hverandre.
 * Gull (#D4AF37), 1.5px linje, ingen fyll. `glow` gir gradient-fade
 * (klar i snittflaten) + myk gullglød. `resonate` lar sirklene puste
 * sakte mot hverandre og tilbake. Brukes som logo-merke, seksjonsskilje
 * og dekorativt motiv.
 */
export const ResonanceMark: FC<ResonanceMarkProps> = ({
  size = 64,
  strokeWidth = 1.5,
  color: strokeColor = color.brand.gold,
  glow = false,
  resonate = false,
  className = '',
  style,
}) => {
  const gradId = 'rm-' + useId().replace(/:/g, '');
  const glowFilter =
    'drop-shadow(0 0 5px rgba(212,175,55,0.55)) drop-shadow(0 0 16px rgba(212,175,55,0.28))';

  return (
    <svg
      width={size}
      height={Math.round(size * 0.7)}
      viewBox="2 5 20 14"
      fill="none"
      stroke={glow ? `url(#${gradId})` : strokeColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={glow ? { filter: glowFilter, ...style } : style}
      aria-hidden="true"
    >
      {glow && (
        <defs>
          <linearGradient id={gradId} x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={color.brand.gold} stopOpacity="0.28" />
            <stop offset="50%" stopColor={color.brand.gold} stopOpacity="1" />
            <stop offset="100%" stopColor={color.brand.gold} stopOpacity="0.28" />
          </linearGradient>
        </defs>
      )}
      <circle cx="9" cy="12" r="6">
        {resonate && (
          <animate
            attributeName="cx"
            values="9;9.7;9"
            dur="3.8s"
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0;0.5;1"
            keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
          />
        )}
      </circle>
      <circle cx="15" cy="12" r="6">
        {resonate && (
          <animate
            attributeName="cx"
            values="15;14.3;15"
            dur="3.8s"
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0;0.5;1"
            keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
          />
        )}
      </circle>
    </svg>
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
  ResonanceMark: ResonanceMark,
};

/* ========================
   DEFAULT EXPORT
   ======================== */

export default LogoVariants;