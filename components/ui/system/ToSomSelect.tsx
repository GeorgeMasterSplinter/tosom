/**
 * ToSom ToSomSelect — System component
 * 
 * Custom select/dropdown with glass panel, gold hover highlight.
 */

'use client';

import { forwardRef, useState, useRef, useEffect } from 'react';
import { radius, colors, motion } from '@/config/design-tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface SelectOption {
  label: string;
  value: string;
}

interface ToSomSelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */
const baseContainerStyles: React.CSSProperties = {
  position: 'relative',
  width: '100%',
};

const baseSelectStyles: React.CSSProperties = {
  borderRadius: radius.lg,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.10)',
  color: colors.textPrimary,
  padding: '12px 40px 12px 16px',
  fontSize: '16px',
  transition: `all ${motion.durations.fast} ${motion.easings.fadeIn}`,
  width: '100%',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none' as const,
};

const dropdownStyles: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 0,
  right: 0,
  borderRadius: radius.lg,
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  padding: '6px',
  zIndex: 100,
  maxHeight: '240px',
  overflowY: 'auto',
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomSelect = forwardRef<HTMLButtonElement, ToSomSelectProps>(({
  label,
  options,
  value,
  onChange,
  error,
  placeholder,
  className = '',
}, ref) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  const selectedOption = options.find(o => o.value === value);
  const isError = !!error;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`w-full ${className}`} ref={containerRef} style={baseContainerStyles}>
      {label && (
        <label
          className="block text-sm font-medium mb-2 transition-colors duration-200"
          style={{
            color: isError ? colors.error : focused ? colors.gold : 'rgba(255,255,255,0.7)',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <button
          ref={ref}
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full text-left"
          style={{
            ...baseSelectStyles,
            ...(focused ? {
              borderColor: colors.gold,
              boxShadow: '0 0 20px rgba(212,175,55,0.35)',
            } : {}),
            ...(isError ? {
              borderColor: colors.error,
              boxShadow: '0 0 12px rgba(255,77,77,0.25)',
            } : {}),
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          <span className="flex items-center justify-between">
            <span style={{ color: selectedOption ? colors.textPrimary : 'rgba(255,255,255,0.45)' }}>
              {selectedOption?.label || placeholder || ''}
            </span>
            <svg
              className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>

        {open && (
          <div style={dropdownStyles}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md transition-colors duration-150"
                style={{
                  color: option.value === value ? colors.gold : 'rgba(255,255,255,0.75)',
                  background: option.value === value ? 'rgba(212,175,55,0.12)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (option.value !== value) {
                    (e.target as HTMLElement).style.background = 'rgba(212,175,55,0.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (option.value !== value) {
                    (e.target as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {isError && (
        <p className="text-xs mt-1.5" style={{ color: colors.error }}>
          {error}
        </p>
      )}
    </div>
  );
});

ToSomSelect.displayName = 'ToSomSelect';
export default ToSomSelect;