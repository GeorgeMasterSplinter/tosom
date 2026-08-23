'use client';

/**
 * ToSom — ScaleQuestion (FORSKNINGSMOTOR F-4)
 *
 * Fempunktsskala i ToSom-stil: rolig, glass, gull på valgt.
 * Ingen tall vises — kun ordene fra §5.
 *
 * Tilgjengelighet: role="radiogroup", piltaster, synlig fokusmarkering.
 *
 * BETA-DESIGN: accentColor gir kortet en subtil fargeidentitet som
 * speiler seksjonsfargen i OnboardingSlide — lysere, mer synlig.
 */

import { useState, useRef, useCallback } from 'react';

/** Standard aksentfarge (myk blå) hvis ingen sendes inn. */
const DEFAULT_ACCENT = '#5B9BD5';

/** Konverter hex til rgba med gitt alpha (0–1). */
function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

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
  /** Seksjonsfarge (hex) — gir kortet en subtil fargeidentitet. */
  accentColor?: string;
}

export function ScaleQuestion({ text, value, onChange, hint, accentColor = DEFAULT_ACCENT }: ScaleQuestionProps) {
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
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: `linear-gradient(135deg, ${rgba(accentColor, 0.06)} 0%, rgba(255,255,255,0.05) 100%)`,
        border: `1px solid ${rgba(accentColor, 0.18)}`,
        boxShadow: `0 2px 12px rgba(0,0,0,0.15), inset 0 1px 0 ${rgba(accentColor, 0.08)}`,
      }}
    >
      {/* Spørsmål */}
      <div>
        <p className="text-base font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.92)' }}>
          {text}
        </p>
        {hint && (
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{hint}</p>
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
                background: selected
                  ? 'rgba(212,175,55,0.25)'
                  : `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)`,
                border: selected
                  ? '1px solid rgba(212,175,55,0.5)'
                  : isFocused
                    ? `1px solid ${rgba(accentColor, 0.5)}`
                    : `1px solid rgba(255,255,255,0.12)`,
                color: selected ? '#D4AF37' : 'rgba(255,255,255,0.7)',
                boxShadow: selected
                  ? '0 2px 8px rgba(212,175,55,0.15)'
                  : '0 1px 3px rgba(0,0,0,0.1)',
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