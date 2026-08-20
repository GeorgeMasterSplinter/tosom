/**
 * Tosom — OnboardingSelectGrid (Premium Selection Grid)
 *
 * Val-side med ikon/grid-layout for å velge mellom alternativ.
 * Alle val på éin side, ikke fragmentert.
 *
 * Design: dempet fargeidentitet pr. seksjon, subtil valgt-state.
 */

'use client';

import { useState } from 'react';
import { OB, sectionColor } from '@/app/onboarding/theme';

interface SelectOption {
  value: string;
  label: string;
  icon?: string; // Emoji eller ikon (f.eks. '🏠', '💼')
  description?: string;
}

interface OnboardingSelectGridProps {
  label: string;
  mikroguiding?: string;
  options: SelectOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  columns?: 1 | 2 | 3 | 4;
  maxSelected?: number; // For multi-select (default: 1)
  multiHint?: string; // Egendefinert hint for multi-select (default: "Vel opp til N alternativ")
  accentColor?: string; // Seksjonsfarge (default: OB.section.identity)
}

/**
 * Premium select-grid med subtil fargeidentitet:
 * - Grid-layout (responsive, 2–4 kolonnar)
 * - Kvar option er ein glass-kort med hover-effekt
 * - Ikon i dempet fargetone
 * - Vald-state: subtil farge-border + flat checkmark
 */
export function OnboardingSelectGrid({
  label,
  mikroguiding,
  options,
  selectedValue,
  onChange,
  columns = 2,
  maxSelected = 1,
  multiHint,
  accentColor = OB.section.identity,
}: OnboardingSelectGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const gridCols = columns === 4
    ? 'grid-cols-2 md:grid-cols-4'
    : columns === 3
      ? 'grid-cols-2 md:grid-cols-3'
      : columns === 1
        ? 'grid-cols-1'
        : 'grid-cols-1 md:grid-cols-2';

  // Multi-select helper: parse/toggle kommaseparert verdi
  const selectedValues = selectedValue ? selectedValue.split(',').map(s => s.trim()).filter(Boolean) : [];
  const isMulti = maxSelected > 1;

  const toggleValue = (value: string) => {
    if (!isMulti) {
      onChange(value);
      return;
    }
    const current = new Set(selectedValues);
    if (current.has(value)) {
      current.delete(value);
    } else {
      if (current.size >= maxSelected) return; // maks nådd
      current.add(value);
    }
    onChange([...current].join(','));
  };

  return (
    <div className="space-y-4">
      {/* Label */}
      <label className="block" style={{ color: OB.textSecondary }}>
        <span className="text-[15px] font-medium">{label}</span>
      </label>

      {/* Mikroguiding */}
      {mikroguiding && (
        <p className="text-[13px] leading-relaxed" style={{ color: OB.textMuted }}>
          {mikroguiding}
        </p>
      )}

      {/* Grid med val-moglegheiter */}
      <div className={`grid ${gridCols} gap-3`}>
        {options.map((option, index) => {
          const isSelected = isMulti ? selectedValues.includes(option.value) : selectedValue === option.value;
          const isHovered = hoveredIndex === index;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleValue(option.value)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative rounded-[14px] transition-all duration-200 ease-out text-left"
              suppressHydrationWarning
              style={{
                background: isSelected
                  ? sectionColor(accentColor, 10)
                  : isHovered
                    ? OB.glassBgHover
                    : OB.glassBg,
                border: isSelected
                  ? `1px solid ${sectionColor(accentColor, 50)}`
                  : isHovered
                    ? `1px solid ${OB.glassBorderHover}`
                    : `1px solid ${OB.glassBorder}`,
                boxShadow: isSelected
                  ? `0 2px 8px rgba(0,0,0,0.1)`
                  : 'none',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              {/* Subtil checkmark for vald */}
              {isSelected && (
                <div
                  className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: accentColor }}
                  suppressHydrationWarning
                >
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Innhald */}
              <div className="p-4 space-y-1.5">
                {/* Ikon med subtil fargetone */}
                {option.icon && (
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-1"
                    style={{
                      background: sectionColor(accentColor, 8),
                      border: `1px solid ${sectionColor(accentColor, 15)}`,
                    }}
                  >
                    <span className="text-[20px] leading-none">{option.icon}</span>
                  </div>
                )}

                {/* Label */}
                <div
                  className="text-[14px] font-medium leading-tight"
                  style={{ color: isSelected ? accentColor : OB.textPrimary }}
                >
                  {option.label}
                </div>

                {/* Beskriving */}
                {option.description && (
                  <p className="text-[12px] leading-relaxed" style={{ color: OB.textMuted }}>
                    {option.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Multi-select hint */}
      {maxSelected > 1 && (
        <p className="text-[12px] text-center" style={{ color: OB.textSubtle }}>
          {multiHint ?? `Vel opp til ${maxSelected} alternativ`}
        </p>
      )}
    </div>
  );
}