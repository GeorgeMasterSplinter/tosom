/**
 * ToSom — OnboardingSlider (Premium Slider)
 * Rolig slider med gull-track og radius.full.
 * Bruker design-tokens konsekvent.
 */

'use client';

import { typography, color, radius } from '@/config/design-tokens';

interface OnboardingSliderProps {
  label: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export default function OnboardingSlider({
  label,
  name,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
}: OnboardingSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-8">
      {/* Label med verdi */}
      <div className="mb-4 flex items-center justify-between">
        <label
          htmlFor={name}
          className="text-sm font-medium"
          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          {label}
        </label>
        <span
          className="text-lg font-semibold"
          style={{ color: color.brand.gold }}
        >
          {value}{unit}
        </span>
      </div>

      {/* Slider-track */}
      <input
        id={name}
        name={name}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer appearance-none rounded-full focus:outline-none"
        style={{
          height: '8px',
          background: `linear-gradient(to right, ${color.brand.gold} 0%, ${color.brand.gold} ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%, rgba(255, 255, 255, 0.1) 100%)`,
          borderRadius: `${radius.full}px`,
        }}
      />

      {/* Thumb styling via CSS pseudo-element */}
      <style>{`
        input[type='range']#${name}::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${color.brand.gold}, ${color.brand['gold-hover']});
          cursor: pointer;
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.3);
          transition: box-shadow 0.2s ease;
        }
        input[type='range']#${name}::-webkit-slider-thumb:hover {
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
        }
        input[type='range']#${name}::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${color.brand.gold}, ${color.brand['gold-hover']});
          cursor: pointer;
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* Min/Max labels */}
      <div className="mt-2 flex justify-between text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}