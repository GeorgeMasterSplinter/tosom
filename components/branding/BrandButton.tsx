/** Tosom-knappkomponentar
 *  BR8 — Knappestil
 *
 *  Primær: blå
 *  Sekundær: grå
 *  Tertiær: tekstlink
 *  Myk hover + active-scale */

'use client';

import React from 'react';
import { useBrandColors } from './BrandProvider';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'success';

interface BrandButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<ButtonVariant, (c: typeof import('@/lib/branding/colors').brandColors) => string> = {
  primary: (c) =>
    `bg-[${c.primary.value}] text-[${c.primary.text}] hover:bg-[${c.primary.hover}] active:scale-[0.97] shadow-sm hover:shadow-md`,
  secondary: (c) =>
    `bg-[${c.subtle}] text-[${c.text}] hover:bg-[${c.subtle}] hover:bg-opacity-80 active:scale-[0.97] border border-[${c.subtle}]`,
  tertiary: (c) =>
    `bg-transparent text-[${c.primary.value}] hover:text-[${c.primary.hover}] underline underline-offset-2 active:scale-[0.97]`,
  ghost: (c) =>
    `bg-transparent text-[${c.secondary || c.textSecondary}] hover:bg-[${c.accent}] active:scale-[0.97]`,
  success: (c) =>
    `bg-[${c.secondary.value}] text-white hover:bg-[${c.secondary.hover}] active:scale-[0.97] shadow-sm`,
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-[8px]',
  md: 'px-5 py-2.5 text-sm font-medium rounded-[12px]',
  lg: 'px-8 py-3.5 text-base font-medium rounded-[12px]',
};

export function BrandButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
}: BrandButtonProps) {
  const c = useBrandColors();
  const base = 'transition-all duration-150 ease-out inline-flex items-center justify-center gap-2 cursor-pointer';
  const style = variantStyles[variant](c);
  const sz = sizeStyles[size];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${style} ${sz} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}
