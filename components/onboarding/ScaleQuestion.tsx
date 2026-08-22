'use client';

/**
 * ToSom — ScaleQuestion (FORSKNINGSMOTOR F-4)
 *
 * Fempunktsskala i ToSom-stil: rolig, glass, gull på valgt.
 * Ingen tall vises — kun ordene fra §5.
 *
 * Tilgjengelighet: role="radiogroup", piltaster, synlig fokusmarkering.
 */

import { useState, useRef, useCallback } from 'react';

/** De fem skala-merkene (§5 FORSKNINGSMOTOR). */
const SCALE_LABELS = [
  'Passer ikke',
  'Passer dårlig',
  'Både og',
  'Passer ganske godt',
  'Passer helt',
] as const;

interface ScaleQuestionProps {
  /** Spørsmålstekst (norsk). */
  text: string;
  /** Nåværende svar (1–5) eller null. */
  value: number | null;
  /** Kallet når brukeren velger (1–5). */
  onChange: (value: number) => void;
  /** Valgfritt innleidende/underfelt. */
  hint?: string;
}

export function ScaleQuestion({ text, value, onChange, hint }: ScaleQuestionProps) {
  const [focused, setFocused] = useState(false);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        const next = Math.min(4, index + 1);
        buttonsRef.current[next]?.focus();
        onChange(next + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        const prev = Math.max(0, index - 1);
        buttonsRef.current[prev]?.focus();
        onChange(prev + 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        buttonsRef.current[0]?.focus();
        onChange(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        buttonsRef.current[4]?.focus();
        onChange(5);
      }
    },
    [onChange],
  );

  return (
    <div className="rounded-2xl p-5 space-y-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Spørsmål */}
      <div>
        <p className="text-base font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>
          {text}
        </p>
        {hint && (
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{hint}</p>
        )}
      </div>

      {/* Skala */}
      <div
        role="radiogroup"
        aria-label={text}
        className="flex items-stretch gap-1.5"
      >
        {SCALE_LABELS.map((label, i) => {
          const val = i + 1;
          const selected = value === val;
          const isFocused = focused;
          return (
            <button
              key={val}
              ref={(el) => { buttonsRef.current[i] = el; }}
              role="radio"
              aria-checked={selected}
              aria-label={`${label} (${val} av 5)`}
              onClick={() => onChange(val)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="flex-1 rounded-xl px-2 py-3 text-xs font-medium transition-all duration-200 text-center leading-tight"
              style={{
                background: selected ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.03)',
                border: selected
                  ? '1px solid rgba(212,175,55,0.4)'
                  : isFocused
                    ? '1px solid rgba(255,255,255,0.25)'
                    : '1px solid rgba(255,255,255,0.06)',
                color: selected ? '#D4AF37' : 'rgba(255,255,255,0.5)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ScaleQuestion;