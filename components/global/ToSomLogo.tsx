/**
 * Tosom — Global Logo Component
 * 
 * Identisk logo som brukes på landing-siden (Hero-seksjonen).
 * Importer fra '@/components/global/ToSomLogo' for konsistent branding.
 */

'use client';

import { FC } from 'react';
import { Logo } from '@/components/ui/branding/Logo';
import { color } from '@/config/design-tokens';
import Link from 'next/link';

interface ToSomLogoProps {
  href?: string;
  showTagline?: boolean;
  className?: string;
}

/**
 * Stacked logo med "Made in Norway" under.
 * Identisk med LogoAnimated fra hero-seksjonen, men statisk (ingen animasjon).
 */
export const ToSomLogo: FC<ToSomLogoProps> = ({
  href = '/',
  showTagline = true,
  className = '',
}) => {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center ${className}`}
      aria-label="Tosom — rolig, privat relasjonsplattform"
    >
      <Logo size="lg" colorVariant="gold" />
      {showTagline && (
        <span
          className="mt-3 text-[11px] font-medium tracking-[0.3em] uppercase"
          style={{ color: 'rgba(212,175,55,0.55)' }}
        >
          Made in Norway
        </span>
      )}
    </Link>
  );
};

export default ToSomLogo;