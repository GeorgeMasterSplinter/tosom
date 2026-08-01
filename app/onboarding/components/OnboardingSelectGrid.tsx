/**
 * ToSom — OnboardingSelectGrid (Premium Selection Grid)
 * 
 * Val-side med ikon/grid-layout for å velje mellom alternativ.
 * Alle val på éin side, ikkje fragmentert.
 */

'use client';

import { useState } from 'react';

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
}

/**
 * Premium select-grid med gull-aksent:
 * - Grid-layout (responsive, 2–4 kolonnar)
 * - Kvar option er ein glass-kort med hover-effekt
 * - Gull-bokmerke for vald alternativ
 * - Ikon + label + valfritt beskrivingstekst
 */
export function OnboardingSelectGrid({
  label,
  mikroguiding,
  options,
  selectedValue,
  onChange,
  columns = 2,
  maxSelected = 1,
}: OnboardingSelectGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Kolonnar basert på responsive breakpoint
  const gridCols = columns === 4
    ? 'grid-cols-2 md:grid-cols-4'
    : columns === 3
      ? 'grid-cols-2 md:grid-cols-3'
      : columns === 1
        ? 'grid-cols-1'
        : 'grid-cols-1 md:grid-cols-2';

  return (
    <div className="space-y-4">
      {/* Label */}
      <label className="block" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
        <span className="text-[16px] font-medium">{label}</span>
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

      {/* Grid med val-moglegheiter */}
      <div className={`grid ${gridCols} gap-4`}>
        {options.map((option, index) => {
          const isSelected = selectedValue === option.value;
          const isHovered = hoveredIndex === index;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative rounded-[20px] transition-all duration-300 ease-out text-left"
              suppressHydrationWarning
              style={{
                background: isSelected
                  ? 'rgba(212, 175, 55, 0.1)'
                  : isHovered
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(255, 255, 255, 0.03)',
                border: isSelected
                  ? '1px solid rgba(212, 175, 55, 0.4)'
                  : isHovered
                    ? '1px solid rgba(255, 255, 255, 0.15)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isSelected
                  ? '0 4px 20px rgba(212, 175, 55, 0.15), inset 0 0 12px rgba(212, 175, 55, 0.05)'
                  : isHovered
                    ? '0 4px 16px rgba(0, 0, 0, 0.1)'
                    : 'none',
                transform: isHovered || isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {/* Gull-bokmerke for vald */}
              {isSelected && (
                <div
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37, #E8C766)',
                    boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)',
                  }}
                  suppressHydrationWarning
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Innhald */}
              <div className="p-6 space-y-2">
                {/* Ikon/Emoji */}
                {option.icon && (
                  <span className="text-[28px]">{option.icon}</span>
                )}

                {/* Label */}
                <div
                  className="text-[16px] font-medium leading-tight"
                  style={{ color: isSelected ? '#D4AF37' : 'rgba(255, 255, 255, 0.8)' }}
                >
                  {option.label}
                </div>

                {/* Beskriving */}
                {option.description && (
                  <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
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
        <p className="text-[12px] text-center" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
          Vel opp til {maxSelected} alternativ
        </p>
      )}
    </div>
  );
}