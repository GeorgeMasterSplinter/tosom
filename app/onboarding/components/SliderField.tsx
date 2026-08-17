/**
 * Tosom – SliderField
 * Premium slider med label, min, max, verdi.
 */

'use client';

import { FC } from 'react';

interface SliderFieldProps {
  label: string;
  name: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  labelLeft?: string;
  labelRight?: string;
  exampleText?: string;
}

export const SliderField: FC<SliderFieldProps> = ({
  label,
  name,
  value,
  onChange,
  min,
  max,
  step = 1,
  labelLeft,
  labelRight,
  exampleText,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="text-sm font-medium"
          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          {label}
        </label>
        <span
          className="text-sm font-light"
          style={{ color: '#D4AF37' }}
        >
          {value}
        </span>
      </div>
      <input
        id={name}
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%, rgba(255, 255, 255, 0.1) 100%)`,
          outline: 'none',
        }}
      />
      <div className="flex justify-between text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
        <span>{labelLeft || min}</span>
        <span>{labelRight || max}</span>
      </div>
      {exampleText && (
        <p className="text-xs" style={{ color: 'rgba(212, 175, 55, 0.45)' }}>
          Eksempel: {exampleText}
        </p>
      )}
    </div>
  );
};