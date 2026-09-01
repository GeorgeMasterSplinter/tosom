/** Tosom-tekstkomponentar
 *  BR7 — Tekstkomponentar med brand-typografi */

'use client';

import React from 'react';
import { useBrandTypography } from './BrandProvider';

interface BrandTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'title' | 'subtitle' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'caption' | 'overline';
}

/** Hoved-tekstkomponent — varm, rolig, moden tone */
export function BrandText({ children, className = '', variant = 'default' }: BrandTextProps) {
  const typography = useBrandTypography();
  const variantMap: Record<string, string> = {
    default: typography.body,
    title: typography.title,
    subtitle: typography.subtitle,
    heading1: typography.heading1,
    heading2: typography.heading2,
    heading3: typography.heading3,
    heading4: typography.heading4,
    bodyLarge: typography.bodyLarge,
    bodyMedium: typography.bodyMedium,
    bodySmall: typography.bodySmall,
    caption: typography.caption,
    overline: typography.overline,
  };
  return (
    <span
      className={`${variantMap[variant] || typography.body} ${className}`}
      style={{ fontFamily: typography.fontFamily }}
    >
      {children}
    </span>
  );
}

/** Titel-komponent */
export function BrandTitle({ children, className = '', variant = 'heading2' }: BrandTextProps) {
  return <BrandText className={className} variant={variant}>{children}</BrandText>;
}

/** Undertittel-komponent */
export function BrandSubtitle({ children, className = '' }: BrandTextProps) {
  return <BrandText className={className} variant="subtitle">{children}</BrandText>;
}
