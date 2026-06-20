/**
 * Slider — Gold-themed range slider
 *
 * Usage:
 *   <Slider label="Volume" value={50} onChange={setValue} min={0} max={100} />
 */

import React, { forwardRef } from 'react';

export interface SliderProps {
  /** Label text */
  label?: string;
  /** Helper text */
  helper?: string;
  /** Current value */
  value: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether disabled */
  disabled?: boolean;
  /** Display current value as number */
  showValue?: boolean;
  /** Custom class */
  className?: string;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({
    label,
    helper,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    size = 'md',
    disabled = false,
    showValue = false,
    className = '',
  }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100;

    const thumbSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    const trackHeight = size === 'sm' ? 'h-1' : size === 'lg' ? 'h-2.5' : 'h-1.5';

    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="flex items-center justify-between">
          {label && <span className="text-sm text-ts-text-secondary">{label}</span>}
          {showValue && (
            <span className="text-sm font-semibold text-ts-gold">{value}</span>
          )}
        </div>
        <div className="relative">
          {/* Track background */}
          <div
            className={`
              w-full
              rounded-full
              bg-ts-glass
              ${trackHeight}
            `}
          >
            {/* Track fill */}
            <div
              className={`
                h-full
                rounded-full
                bg-ts-gold
                transition-all
              `}
              style={{ width: `${percentage}%` }}
            />
          </div>
          {/* Hidden native input */}
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={disabled}
            className={`
              absolute
              inset-0
              w-full
              h-full
              opacity-0
              cursor-pointer
              ${disabled ? 'cursor-not-allowed' : ''}
            `}
          />
          {/* Thumb (visual) */}
          <div
            className={`
              absolute
              ${thumbSize}
              rounded-full
              bg-ts-gold
              shadow-ts-gold
              border-2 border-ts-gold-light
              top-1/2 -translate-y-1/2
              pointer-events-none
              transition-all
            `}
            style={{ left: `calc(${percentage}% - 4px)` }}
          />
        </div>
        {helper && !disabled && (
          <p className="text-xs text-ts-text-subtle">{helper}</p>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';
export default Slider;