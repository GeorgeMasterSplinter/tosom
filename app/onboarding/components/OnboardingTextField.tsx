/**
 * ToSom — OnboardingTextField (Premium Text Input)
 * 
 * Tekstfelt med:
 * - Mikroguiding (hva er forventet svar?)
 * - Progresjons-indikasjon (teknteljar under feltet)
 * - 130% zoom spacing og stor typografi
 */

'use client';

import { useState, useRef } from 'react';

interface OnboardingTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mikroguiding?: string; // "Skriv f.eks. Kalla du meg Sofia, Jonas eller Lia"
  maxLength?: number;
  minChars?: number;
  rows?: number;
  multiline?: boolean;
}

/**
 * Premium tekstfelt med mikroguiding og progresjon:
 * - Label med gull-aksent
 * - Mikroguiding under label (hva er forventet svar?)
 * - Tekst-input med gull-focus ring
 * - Progresjons-indikasjon under ("3/50 teikn")
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
}: OnboardingTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  const charCount = value.length;
  const progressPercent = Math.min((charCount / maxLength) * 100, 100);
  const meetsMin = charCount >= minChars;
  const isComplete = charCount >= minChars && charCount <= maxLength;

  // Farge-status for progresjons-indikator
  const progressColor = isComplete
    ? 'linear-gradient(90deg, #4DFF88, #6AFFA8)'
    : charCount > 0
      ? 'linear-gradient(90deg, #D4AF37, #E8C766)'
      : 'rgba(255, 255, 255, 0.12)';

  const textColor = isComplete
    ? '#FFFFFF'
    : charCount > 0
      ? 'rgba(255, 255, 255, 0.8)'
      : 'rgba(255, 255, 255, 0.5)';

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange(e.target.value);
  };

   const baseInputStyle: React.CSSProperties = {
     background: isFocused ? 'rgba(212, 175, 55, 0.06)' : 'rgba(255, 255, 255, 0.03)',
     border: `1px solid ${isFocused ? 'rgba(212, 175, 55, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
     borderRadius: '16px',
     padding: rows > 3 ? '16px 20px' : '14px 20px',
     color: textColor,
     fontSize: '16px',
     lineHeight: '1.6',
     width: '100%',
     minWidth: 0,
     outline: 'none',
     transition: 'all 0.3s ease-out',
     backdropFilter: 'blur(8px)',
     fontFamily: 'Inter, -apple-system, sans-serif',
     overflow: 'hidden',
   };

  return (
    <div className="space-y-3 overflow-hidden">
      {/* Label med gull-aksent */}
      <label className="block overflow-hidden" style={{ color: isFocused ? '#D4AF37' : 'rgba(255, 255, 255, 0.7)' }}>
        <span className="text-[14px] font-medium tracking-wide truncate">{label}</span>
      </label>

      {/* Mikroguiding */}
      {mikroguiding && (
        <p
          className="text-[13px] leading-relaxed"
          style={{ color: 'rgba(212, 175, 55, 0.5)', fontStyle: 'italic' }}
        >
          {mikroguiding}
        </p>
      )}

      {/* Input-felt */}
      {multiline ? (
        <textarea
          ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
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
          ref={textareaRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength + 10} // litt over for safety
          style={baseInputStyle}
          suppressHydrationWarning
        />
      )}

       {/* Progresjons-indikasjon */}
      <div className="flex items-center gap-3">
        {/* Progresjons-linje */}
        <div
          className="h-1 flex-1 rounded-full"
          style={{ background: 'rgba(255, 255, 255, 0.06)' }}
          suppressHydrationWarning
        >
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%`, background: progressColor }}
            suppressHydrationWarning
          />
        </div>

        {/* Teknteljar */}
        <span
          className="text-[12px] font-medium min-w-[60px] text-right tabular-nums"
          style={{ color: isComplete ? '#4DFF88' : 'rgba(255, 255, 255, 0.35)' }}
          suppressHydrationWarning
        >
          {charCount}/{maxLength}
        </span>
      </div>

      {/* Validering-status */}
      {!isComplete && charCount >= minChars && (
        <p className="text-[12px]" style={{ color: '#4DFF88' }}>
          ✓ Minst {minChars} teikn oppnådd
        </p>
      )}
      {!meetsMin && charCount > 0 && (
        <p className="text-[12px]" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
          {minChars - charCount} teikn att til minstekravet
        </p>
      )}
    </div>
  );
}