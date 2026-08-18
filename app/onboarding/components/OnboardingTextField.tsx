/**
 * Tosom — OnboardingTextField (Premium Text Input)
 *
 * Tekstfelt med dempet design, myk fokus-ring,
 * og mikroguiding. Ingen progress-bar eller karakterteller.
 */

'use client';

import { useState } from 'react';
import { OB } from '@/app/onboarding/theme';

interface OnboardingTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mikroguiding?: string;
  maxLength?: number;
  minChars?: number;
  rows?: number;
  multiline?: boolean;
  showCharCount?: boolean;
}

/**
 * Premium tekstfelt med rolig design:
 * - Label med nøytral farge
 * - Mikroguiding (nøytral, ikke gull)
 * - Myk fokus-ring (nøytral, ikke gull)
 * - Ingen progress-bar eller tallteller (medmindre showCharCount)
 */
export function OnboardingTextField({
  label,
  value,
  onChange,
  placeholder = '',
  mikroguiding,
  maxLength = 200,
  minChars = 10,
  rows = 3,
  multiline = false,
  showCharCount = false,
}: OnboardingTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const charCount = value.length;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const baseInputStyle: React.CSSProperties = {
    background: isFocused ? 'rgba(255,255,255,0.04)' : OB.glassBg,
    border: `1px solid ${isFocused ? 'rgba(255,255,255,0.15)' : OB.glassBorder}`,
    borderRadius: '12px',
    padding: rows > 3 ? '14px 16px' : '12px 16px',
    color: OB.textPrimary,
    fontSize: '15px',
    lineHeight: '1.6',
    width: '100%',
    minWidth: 0,
    outline: 'none',
    transition: 'all 0.2s ease-out',
    backdropFilter: 'blur(8px)',
    fontFamily: 'Inter, -apple-system, sans-serif',
    boxShadow: isFocused ? '0 0 0 3px rgba(255,255,255,0.03)' : 'none',
  };

  return (
    <div className="space-y-2 overflow-hidden">
      {/* Label */}
      <label className="block overflow-hidden" style={{ color: OB.textSecondary }}>
        <span className="text-[14px] font-medium truncate">{label}</span>
      </label>

      {/* Mikroguiding */}
      {mikroguiding && (
        <p className="text-[12px] leading-relaxed" style={{ color: OB.textMuted }}>
          {mikroguiding}
        </p>
      )}

      {/* Input-felt */}
      {multiline ? (
        <textarea
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={rows}
          style={baseInputStyle}
          suppressHydrationWarning
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength + 10}
          style={baseInputStyle}
          suppressHydrationWarning
        />
      )}

      {/* Valfri karakterteller (dempet) */}
      {showCharCount && (
        <div className="flex items-center justify-end">
          <span
            className="text-[11px] tabular-nums"
            style={{ color: OB.textSubtle }}
            suppressHydrationWarning
          >
            {charCount}/{maxLength}
          </span>
        </div>
      )}

      {/* Validering (kun når under minstekrav) */}
      {charCount > 0 && charCount < minChars && (
        <p className="text-[11px]" style={{ color: OB.textMuted }}>
          Minst {minChars} tegn
        </p>
      )}
    </div>
  );
}