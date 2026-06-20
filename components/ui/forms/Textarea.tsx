/**
 * Textarea — Glassmorphism textarea with gold focus state
 *
 * Usage:
 *   <Textarea label="Message" placeholder="Write something..." rows={4} />
 */

import React, { forwardRef } from 'react';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Label text */
  label?: string;
  /** Helper text */
  helper?: string;
  /** Error message */
  error?: string;
  /** Number of rows */
  rows?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether resizable */
  resizable?: boolean;
}

const sizeMap: Record<string, string> = {
  sm: 'text-sm py-2 px-3',
  md: 'text-base py-3 px-4',
  lg: 'text-lg py-4 px-5',
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helper, error, rows = 4, size = 'md', resizable = true, className = '', ...props }, ref) => {
    const hasError = !!error;

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label className="text-xs font-medium text-ts-text-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`
            w-full
            rounded-ts-md
            border
            bg-ts-glass/50
            border-ts-glass
            text-ts-text
            placeholder-ts-text-subtle
            ${sizeMap[size]}
            ${resizable ? 'resize-y' : ''}
            ${hasError ? 'border-ts-error' : ''}
            focus-within:border-ts-gold
            focus-within:ring-2
            focus-within:ring-ts-gold/20
            transition-all
            ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            focus:outline-none focus:ring-0
          `}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
export default Textarea;