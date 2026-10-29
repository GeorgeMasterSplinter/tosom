/**
 * Tosom — Valgvikt (LIVSSTIL-2026, D-4)
 *
 * Tretrinns viktighetsvalg for de nye hverdagsvalgene:
 * «Er ikke så viktig» / «Bør stemme» / «Må stemme».
 *
 * - `ikke-viktig` → feltet utelates fra scoringen, blokkerer aldri
 * - `bor-stemme`  → feltet inngår i livssituasjon-scoringen
 * - `ma-stemme`   → konflikt blir en hard dealbreaker i motoren
 *
 * Rolig, kompakt chip-stil — følger onboardingens glass-design (OB-token).
 */

'use client';

import { OB } from '@/app/onboarding/theme';

interface ValgviktProps {
  value: string; // '' | 'ikke-viktig' | 'bor-stemme' | 'ma-stemme'
  onChange: (value: string) => void;
  accentColor?: string;
  /** Valfri data-testid for e2e-tester (settes på containeren). */
  testId?: string;
}

const TRENNING: Array<{ value: string; label: string }> = [
  { value: 'ikke-viktig', label: 'Er ikke så viktig' },
  { value: 'bor-stemme', label: 'Bør stemme' },
  { value: 'ma-stemme', label: 'Må stemme' },
];

export function Valgvikt({ value, onChange, accentColor = OB.section.identity, testId }: ValgviktProps) {
  return (
    <div className="space-y-1.5">
    <div
      className="flex items-center gap-2 flex-wrap"
      style={{ marginTop: '10px' }}
      data-testid={testId}
      role="radiogroup"
      aria-label="Hvor viktig er dette for deg i en match?"
    >
      <span className="text-[12px]" style={{ color: OB.textSubtle }}>
        For deg i en match:
      </span>
      {TRENNING.map((t) => {
        const isSelected = value === t.value;
        return (
          <button
            key={t.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(isSelected ? '' : t.value)}
            className="rounded-full text-[12px] font-medium transition-all duration-200 ease-out"
            suppressHydrationWarning
            style={{
              padding: '5px 12px',
              background: isSelected ? accentColor : OB.glassBg,
              color: isSelected ? '#0A1A2A' : OB.textSecondary,
              border: isSelected
                ? `1px solid ${accentColor}`
                : `1px solid ${OB.glassBorder}`,
            }}
          >
            {t.label}
          </button>
        );
      })}
      </div>
      {/* D-4: konsekvensen av «Må stemme» vises når den faktisk velges —
          ikke gjemt i en generell fotnot, men der handlingen skjer. */}
      {value === 'ma-stemme' && (
        <p
          className="text-[12px] leading-relaxed"
          style={{ color: OB.textSecondary }}
          data-testid="ob-ma-stemme-note"
        >
          Dette er en hard grense: hvis dere ikke passer sammen her, blir dere ikke koblet.
        </p>
      )}
    </div>
  );
}