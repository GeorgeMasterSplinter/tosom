/* eslint-disable jsx-a11y/role-has-required-aria-props */
/**
 * ToSom — OnboardingSelect (Premium Select)
 * Rolig select med glassmorphism og gull-pil.
 * Bruker design-tokens konsekvent.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { typography, color, radius } from '@/config/design-tokens';

interface SelectOption {
  value: string;
  label: string;
}

interface OnboardingSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export default function OnboardingSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Velg...',
}: OnboardingSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lukk ved klikk utenfor
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

  return (
    <div className="mb-6" ref={containerRef}>
      <label
        htmlFor={`select-${name}`}
        className="mb-2 block text-sm font-medium"
        style={{ color: 'rgba(255, 255, 255, 0.7)' }}
      >
        {label}
      </label>
      
      <div
        id={`select-${name}`}
        role="combobox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 cursor-pointer transition-all duration-200 focus:outline-none"
        style={{
          fontSize: `${typography.fontSize.base}px`,
          lineHeight: typography.lineHeight.normal,
          color: value ? color.text.primary : 'rgba(255, 255, 255, 0.45)',
          background: isOpen ? 'rgba(10, 26, 42, 0.95)' : 'rgba(255, 255, 255, 0.06)',
          border: `1px solid ${isOpen ? 'rgba(212, 175, 55, 0.6)' : 'rgba(255, 255, 255, 0.1)'}`,
          borderRadius: `${radius.xl}px`,
        }}
      >
        <div className="flex items-center justify-between">
          <span>{selectedLabel}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{ color: 'rgba(212, 175, 55, 0.8)' }}
          >
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div
          className="mt-1 overflow-hidden rounded-xl"
          style={{
            background: 'rgba(10, 26, 42, 0.97)',
            border: `1px solid rgba(212, 175, 55, 0.2)`,
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="px-4 py-3 cursor-pointer transition-all duration-150"
              style={{
                fontSize: `${typography.fontSize.base}px`,
                color: option.value === value ? '#D4AF37' : 'rgba(255, 255, 255, 0.85)',
                background: option.value === value
                  ? 'rgba(212, 175, 55, 0.12)'
                  : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (option.value !== value) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (option.value !== value) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}