/* ═══════════════════════════════════════════
   Tosom Premium Button — Design System 1.1
   Primary · Secondary · Danger
   Bruk tokens frå components/ui/Tokens.ts
   ═══════════════════════════════════════════ */

import { ButtonHTMLAttributes, forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';

export interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const baseClasses =
  'inline-flex items-center justify-center ' +
  'font-medium tracking-[-0.01em] rounded-[var(--ts-radius-6xl)] ' +
  'border-none cursor-pointer ' +
  'transition-all duration-[var(--ts-transition-normal)] ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-3 ' +
  'active:scale-[0.98]';

const sizeClasses: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
  sm: 'px-6 py-3 text-sm',
  md: 'px-8 py-4 text-base',
  lg: 'px-12 py-5 text-lg',
  xl: 'px-16 py-6 text-xl',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[#D4AF37] to-[#E8C766] ' +
    'text-[#0B1520] font-semibold ' +
    'shadow-[0_0_20px_rgba(212,175,55,0.15)] ' +
    'hover:shadow-[0_0_35px_rgba(212,175,55,0.25)] ' +
    'active:opacity-90',
  secondary:
    'bg-[rgba(255,255,255,0.06)] ' +
    'text-white border border-[rgba(255,255,255,0.12)] ' +
    'hover:bg-[rgba(255,255,255,0.10)] hover:border-[rgba(255,255,255,0.18)] ' +
    'active:opacity-80',
  tertiary:
    'bg-[rgba(212,175,55,0.12)] ' +
    'text-[#D4AF37] border border-[rgba(212,175,55,0.35)] ' +
    'hover:bg-[rgba(212,175,55,0.20)] hover:border-[rgba(212,175,55,0.50)] ' +
    'active:opacity-80',
  danger:
    'bg-gradient-to-r from-[#FF4D4D] to-[#FF6B6B] ' +
    'text-white font-semibold ' +
    'shadow-[0_0_16px_rgba(255,77,77,0.3)] ' +
    'hover:shadow-[0_0_28px_rgba(255,77,77,0.4)] ' +
    'active:opacity-90',
};

export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim();
    return <button className={classes} ref={ref} {...props}>{children}</button>;
  }
);

PremiumButton.displayName = 'PremiumButton';

export default PremiumButton;