/**
 * DatePicker — Gold-themed date picker input
 *
 * Usage:
 *   <DatePicker label="Birthdate" value={date} onChange={setDate} />
 */

import React, { forwardRef, useState } from 'react';

export interface DatePickerProps {
  /** Label text */
  label?: string;
  /** Helper text */
  helper?: string;
  /** Error message */
  error?: string;
  /** Selected date */
  value?: Date | string;
  /** Change handler */
  onChange?: (date: Date) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Minimum date */
  min?: Date | string;
  /** Maximum date */
  max?: Date | string;
  /** Whether disabled */
  disabled?: boolean;
  /** Custom class */
  className?: string;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, helper, error, value, onChange, placeholder, min, max, disabled = false, className = '' }, ref) => {
    const [focused, setFocused] = useState(false);
    const formattedValue = value
      ? new Date(value).toLocaleDateString('no-NO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label className="text-xs font-medium text-ts-text-secondary">
            {label}
          </label>
        )}
        <div
          className={`
            relative
            rounded-ts-md
            border
            bg-ts-glass/50
            ${error ? 'border-ts-error' : focused ? 'border-ts-gold' : 'border-ts-glass'}
            focus-within:ring-2
            focus-within:ring-ts-gold/20
            transition-all
          `}
        >
          <input
            ref={ref}
            type="date"
            min={min ? new Date(min).toISOString().split('T')[0] : undefined}
            max={max ? new Date(max).toISOString().split('T')[0] : undefined}
            value={value ? new Date(value).toISOString().split('T')[0] : ''}
            placeholder={placeholder}
            onChange={(e) => onChange?.(new Date(e.target.value))}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`
              w-full
              bg-transparent
              border-none
              text-ts-text
              py-3 px-4
              text-base
              cursor-pointer
              focus:outline-none focus:ring-0
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:opacity-50
            `}
          />
        </div>
        {error && (
          <p className="text-xs text-ts-error font-medium">{error}</p>
        )}
        {helper && !error && (
          <p className="text-xs text-ts-text-subtle">{helper}</p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
export default DatePicker;