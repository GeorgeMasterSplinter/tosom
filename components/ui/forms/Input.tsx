/**
 * Input — Glassmorphism text input with gold focus state
 *
 * Usage:
 *   <Input label="Name" placeholder="Enter your name" />
 *   <Input label="Email" type="email" error="Invalid email" />
 */

import React, { forwardRef } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'> {
  /** Input label */
  label?: string;
  /** Helper text below input */
  helper?: string;
  /** Error message */
  error?: string;
  /** Left prefix icon */
  prefix?: React.ReactNode;
  /** Right suffix icon */
  suffix?: React.ReactNode;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
  /** Input variant */
  variant?: 'default' | 'filled' | 'outline';
}

const sizeMap: Record<string, string> = {
  sm: 'text-sm py-2 px-3',
  md: 'text-base py-3 px-4',
  lg: 'text-lg py-4 px-5',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helper, error, prefix, suffix, size = 'md', variant = 'default', className = '', ...props }, ref) => {
    const hasError = !!error;
    const stateClass = hasError
      ? 'border-ts-error focus:border-ts-error focus:ring-ts-error/20'
      : 'focus:border-ts-gold focus:ring-ts-gold/20';

    const variantClass = variant === 'filled'
      ? 'bg-ts-glass/50'
      : variant === 'outline'
      ? 'bg-transparent'
      : 'bg-ts-glass/50';

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label className="text-xs font-medium text-ts-text-secondary">
            {label}
          </label>
        )}
        <div className={`
          relative flex items-center
          rounded-ts-md
          border
          ${variantClass}
          border-ts-glass
          focus-within:border-ts-gold
          focus-within:ring-2
          focus-within:ring-ts-gold/20
          transition-all
          ${hasError ? 'border-ts-error' : ''}
          ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}>
          {prefix && (
            <span className="pl-3 text-ts-text-muted flex-shrink-0">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full
              bg-transparent
              border-none
              text-ts-text
              placeholder-ts-text-subtle
              ${sizeMap[size]}
              ${prefix ? 'pl-1' : 'pl-4'}
              ${suffix ? 'pr-4' : 'pr-3'}
              ${props.disabled ? 'cursor-not-allowed' : ''}
              focus:outline-none focus:ring-0
            `}
            {...props}
          />
          {suffix && (
            <span className="pr-3 text-ts-text-muted flex-shrink-0">
              {suffix}
            </span>
          )}
        </div>
        {hasError && (
          <p className="text-xs text-ts-error font-medium">{error}</p>
        )}
        {helper && !hasError && (
          <p className="text-xs text-ts-text-subtle">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;