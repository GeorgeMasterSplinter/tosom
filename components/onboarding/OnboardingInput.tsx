/**
 * ToSom — OnboardingInput (Premium Input)
 * Rolig input med glassmorphism og gull-focus.
 * Bruker design-tokens konsekvent.
 */

'use client';

import { typography, color, radius } from '@/config/design-tokens';

interface OnboardingInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  exampleText?: string;
}

export default function OnboardingInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  exampleText,
}: OnboardingInputProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium"
        style={{ color: 'rgba(255, 255, 255, 0.7)' }}
      >
        {label}
      </label>
      
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 transition-all duration-200 focus:outline-none"
        style={{
          fontSize: `${typography.fontSize.base}px`,
          lineHeight: typography.lineHeight.normal,
          color: color.text.primary,
          background: 'rgba(255, 255, 255, 0.06)',
          border: `1px solid rgba(255, 255, 255, 0.1)`,
          borderRadius: `${radius.xl}px`,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(212, 175, 55, 0.6)';
          e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.target.style.boxShadow = 'none';
        }}
      />
      
      {exampleText && (
        <p
          className="mt-1 text-xs"
          style={{ color: 'rgba(212, 175, 55, 0.45)' }}
        >
          Eksempel: {exampleText}
        </p>
      )}
    </div>
  );
}