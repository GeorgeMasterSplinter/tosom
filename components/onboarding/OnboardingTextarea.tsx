/**
 * ToSom — OnboardingTextarea (Premium Textarea)
 * Rolig textarea med maks 4000 tegn og glassmorphism.
 * Bruker design-tokens konsekvent.
 */

'use client';

import { typography, color, radius } from '@/config/design-tokens';

interface OnboardingTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export default function OnboardingTextarea({
  label,
  name,
  value,
  onChange,
  placeholder = 'Skriv her...',
  maxLength = 4000,
}: OnboardingTextareaProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="mb-2 flex items-center justify-between text-sm font-medium"
        style={{ color: 'rgba(255, 255, 255, 0.7)' }}
      >
        <span>{label}</span>
        <span className="text-xs" style={{ color: 'rgba(212, 175, 55, 0.45)' }}>
          {value.length}/{maxLength} tegn
        </span>
      </label>
      
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={5}
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
    </div>
  );
}