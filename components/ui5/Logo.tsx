/**
 * ToSom UI5 — Logo Component
 * 
 * Ren tekstlogo ("ToSom") i gull (#D4AF37).
 * Støtter size-variants: xs, sm, md, lg, xl
 * Ingen ikoner eller symboler.
 */

'use client';

import { FC, HTMLAttributes } from 'react';
import Link from 'next/link';
import { color, typographyToStyle } from '@/config/design-tokens';

/* ========================
   PROPS INTERFACE
   ======================== */

export interface LogoProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /** Hvilken størrelse? */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Fargevariant */
  colorVariant?: 'gold' | 'white' | 'muted';
  /** Vis tekst? */
  showText?: boolean;
  /** Ekstra class names */
  className?: string;
  /** Lenke-mål */
  href?: string;
  /** ARIA-label */
  ariaLabel?: string;
}

/* ========================
   SIZE MAPPING
   ======================== */

const sizeMap: Record<string, { fontSize: string; letterSpacing: string }> = {
  xs:  { fontSize: '16px', letterSpacing: '-0.03em' },
  sm:  { fontSize: '20px', letterSpacing: '-0.025em' },
  md:  { fontSize: '24px', letterSpacing: '-0.02em' },
  lg:  { fontSize: '30px', letterSpacing: '-0.02em' },
  xl:  { fontSize: '42px', letterSpacing: '-0.02em' },
  '2xl': { fontSize: '56px', letterSpacing: '-0.03em' },
};

const colorMap: Record<string, string> = {
  gold:   color.brand.gold,
  white:  color.text.primary,
  muted:  color.text.secondary,
};

/* ========================
   COMPONENT
   ======================== */

export const Logo: FC<LogoProps> = ({
  size = 'md',
  colorVariant = 'gold',
  showText = true,
  className = '',
  href,
  ariaLabel = 'ToSom — rolig, privat relasjonsplattform',
  style,
  ...rest
}) => {
  const fontSize = sizeMap[size].fontSize;
  const letterSpacing = sizeMap[size].letterSpacing;
  const textColor = colorMap[colorVariant];

  const logoContent = (
    <span
      className={`font-semibold tracking-tight ${className}`}
      style={{
        fontSize,
        letterSpacing,
        color: textColor,
        ...typographyToStyle('heading-sm'),
        ...style,
      }}
    >
      {showText ? 'ToSom' : 'T'}
    </span>
  );

  /* Render as link if href provided */
  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center"
        aria-label={ariaLabel}
        {...rest}
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

/* ========================
   CONVENIENCE EXPORTS
   ======================== */

/** Small logo (navbar) */
export const LogoSmall: FC<Omit<LogoProps, 'size'>> = (props) => (
  <Logo {...props} size="sm" />
);

/** Medium logo (default) */
export const LogoMedium: FC<Omit<LogoProps, 'size'>> = (props) => (
  <Logo {...props} size="md" />
);

/** Large logo (hero) */
export const LogoLarge: FC<Omit<LogoProps, 'size'>> = (props) => (
  <Logo {...props} size="lg" />
);

/** XL logo (hero expanded) */
export const LogoXL: FC<Omit<LogoProps, 'size'>> = (props) => (
  <Logo {...props} size="xl" />
);

/** 2XL logo (hero enlarged) */
export const Logo2XL: FC<Omit<LogoProps, 'size'>> = (props) => (
  <Logo {...props} size="2xl" />
);

/* ========================
   DEFAULT EXPORT
   ======================== */

export default Logo;
