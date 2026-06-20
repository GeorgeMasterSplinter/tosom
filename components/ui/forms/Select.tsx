/**
 * Select — Glassmorphism dropdown select
 *
 * Usage:
 *   <Select label="Country" value={country} onChange={setCountry}>
 *     <option value="no">Norway</option>
 *     <option value="se">Sweden</option>
 *   </Select>
 */

import React, { forwardRef } from 'react';

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Label text */
  label?: string;
  /** Helper text */
  helper?: string;
  /** Error message */
  error?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap: Record<string, string> = {
  sm: 'text-sm py-2 px-3',
  md: 'text-base py-3 px-4',
  lg: 'text-lg py-4 px-5',
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helper, error, placeholder, size = 'md', className = '', children, ...props }, ref) => {
    const hasError = !!error;

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label className="text-xs font-medium text-ts-text-secondary">
            {label}
          </label>
        )}
        <div className={`
          relative
          rounded-ts-md
          border
          bg-ts-glass/50
          ${hasError ? 'border-ts-error' : 'border-ts-glass'}
          focus-within:border-ts-gold
          focus-within:ring-2
          focus-within:ring-ts-gold/20
          transition-all
        `}>
          <select
            ref={ref}
            className={`
              w-full
              appearance-none
              bg-transparent
              border-none
              text-ts-text
              ${sizeMap[size]}
              pr-10
              cursor-pointer
              focus:outline-none focus:ring-0
              ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>{placeholder}</option>
            )}
            {children}
          </select>
          {/* Chevron icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ts-text-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
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

Select.displayName = 'Select';
export default Select;