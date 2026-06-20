/**
 * Toggle — Gold-themed toggle switch
 *
 * Usage:
 *   <Toggle label="Notifications" checked={enabled} onChange={setEnabled} />
 */

import React, { forwardRef } from 'react';

export interface ToggleProps {
  /** Label text */
  label?: string;
  /** Helper text */
  helper?: string;
  /** Whether the toggle is on */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** Toggle size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether disabled */
  disabled?: boolean;
  /** Whether to show the label to the right */
  labelPosition?: 'left' | 'right';
  /** Custom class */
  className?: string;
}

const sizeConfig: Record<string, { track: string; thumb: string }> = {
  sm: { track: 'w-9 h-5', thumb: 'w-4 h-4' },
  md: { track: 'w-11 h-6', thumb: 'w-5 h-5' },
  lg: { track: 'w-14 h-7', thumb: 'w-6 h-6' },
};

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, helper, checked, onChange, size = 'md', disabled = false, labelPosition = 'left', className = '' }, ref) => {
    const config = sizeConfig[size];

    return (
      <div className={`flex items-center justify-between gap-3 ${className}`}>
        {label && labelPosition === 'left' && (
          <span className="text-sm text-ts-text-secondary">{label}</span>
        )}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              ref={ref}
              type="checkbox"
              className="sr-only peer"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
            />
            {/* Track */}
            <span
              className={`
                ${config.track}
                rounded-full
                border
                border-ts-glass
                bg-ts-glass/50
                peer-focus-visible:ring-2
                peer-focus-visible:ring-ts-gold/20
                transition-all
                ${checked ? 'bg-ts-gold/30 border-ts-gold/50' : ''}
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
            />
            {/* Thumb */}
            <span
              className={`
                absolute
                ${config.thumb}
                rounded-full
                bg-ts-text
                shadow-ts-sm
                transition-all
                ${
                  checked
                    ? 'left-[calc(100%-2px)] -translate-x-full bg-ts-gold'
                    : 'left-0.5'
                }
                ${disabled ? 'cursor-not-allowed' : ''}
              `}
            />
          </label>
          {label && labelPosition === 'right' && (
            <span className="text-sm text-ts-text-secondary">{label}</span>
          )}
        </div>
        {helper && (
          <p className="text-xs text-ts-text-subtle w-full text-right">{helper}</p>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';
export default Toggle;