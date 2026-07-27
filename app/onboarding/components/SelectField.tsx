/**
 * ToSom – SelectField (Premium Oppgradert)
 * Custom premium dropdown med mørk bakgrunn, gull-aksentar og glass-djupde.
 */

'use client';

import { FC, useState, useRef, useEffect } from 'react';

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[] | Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
}

export const SelectField: FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lukk ved klikk utanfor
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark mount for konsistent rendering mellom server og klient
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Stabil displayLabel: alltid vis placeholder eller tom streng på begge sider
  const displayLabel = value
    ? (() => {
        const found = options.find((opt) => {
          const optVal = typeof opt === 'string' ? opt : opt.value;
          return optVal === value;
        });
        if (!found) return placeholder || '';
        return typeof found === 'string' ? found : found.label;
      })()
    : (placeholder || '');

  // Første render (før mount): vis alltid placeholder/tom → eliminerer server/client mismatch
  const initialDisplay = hasMounted ? displayLabel : (placeholder || '');

  const getOptionValue = (opt: string | { value: string; label: string }) =>
    typeof opt === 'string' ? opt : opt.value;
  const getOptionLabel = (opt: string | { value: string; label: string }) =>
    typeof opt === 'string' ? opt : opt.label;

  // Hitta om noko option er vald
  const hasValue = !!value;

  // Lukk dropdown automatisk etter valg (forsøke å unngå flash på mobill)
  const handleOptionSelect = (optVal: string) => {
    onChange(optVal);
    // Sett isOpen til false i neste runde for å sikre at onChange blir utført først
    requestAnimationFrame(() => setIsOpen(false));
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      {/* Label med gull underline */}
      <label
        htmlFor={`select-${name}`}
        className="block text-sm font-medium relative pb-1"
        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
      >
        {label}
        <span className="absolute bottom-0 left-0 w-full h-px" style={{
          background: (hasMounted && value)
            ? 'linear-gradient(90deg, rgba(212,175,55,0.6), rgba(212,175,55,0.1))'
            : 'rgba(255, 255, 255, 0.08)',
          transition: 'background 0.3s ease',
        }} />
        {required && (
          <span style={{ color: '#D4AF37', marginLeft: '4px' }}> *</span>
        )}
      </label>

      {/* Dropdown trigger — oppgradert premium glass */}
      <div
        id={`select-${name}-dropdown`}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${name}-listbox`}
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setIsOpen(!isOpen);
          if (e.key === 'Escape') setIsOpen(false);
        }}
        className={`
          w-full px-4 py-3.5 rounded-xl text-sm cursor-pointer
          transition-all duration-200 ease-out
          focus:outline-none select-none
          border-l-[3px]
          ${isHovered && !isOpen ? 'translate-y-[-1px]' : ''}
        `}
        style={{
          backgroundColor: isOpen
            ? 'rgba(10, 26, 42, 0.95)'
            : isHovered
              ? 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(10,26,42,0.85) 100%)'
              : 'rgba(10, 26, 42, 0.85)',
          borderColor: isOpen
            ? 'rgba(212, 175, 55, 0.4)'
            : (hasMounted && value)
              ? 'rgba(212, 175, 55, 0.35)'
              : 'rgba(255, 255, 255, 0.1)',
          color: (hasMounted && value) ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(12px)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23D4AF37' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          boxShadow: isOpen
            ? 'inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(212,175,55,0.15)'
            : isHovered
              ? 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.2), 0 0 0 1px rgba(212,175,55,0.1)'
              : 'inset 0 1px 3px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '14px',
        }}
      >
        {initialDisplay}
      </div>

      {/* Custom dropdown panel — must match aria-controls */}
      {isOpen && hasMounted && (
        <div
          id={`${name}-listbox`}
          role="listbox"
          className="
            w-full rounded-xl overflow-hidden z-50
            border shadow-2xl
          "
          style={{
            backgroundColor: 'rgba(10, 26, 42, 0.97)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
            borderRadius: '14px',
          }}
        >
          {options.map((opt, i) => {
            const optVal = getOptionValue(opt);
            const optLbl = getOptionLabel(opt);
            const isSelected = optVal === value;
            return (
              <div
                key={i}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => handleOptionSelect(optVal)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { handleOptionSelect(optVal); }
                }}
                className="
                  px-4 py-3 text-sm cursor-pointer
                  transition-all duration-150
                  border-b border-white/5 last:border-b-0
                  flex items-center gap-3
                "
                style={{
                  color: isSelected ? '#D4AF37' : 'rgba(255, 255, 255, 0.85)',
                  background: isSelected
                    ? 'linear-gradient(90deg, rgba(212,175,55,0.12) 0%, transparent 100%)'
                    : isHovered && optVal === value + i // hover på option med same verdi som trigger → uakseptabelt
                    ? 'rgba(255,255,255,0.04)'
                    : 'transparent',
                  borderRadius: i === 0 ? '14px 14px 0 0' : i === options.length - 1 ? '0 0 14px 14px' : '0',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.background = 'linear-gradient(90deg, rgba(212,175,55,0.08) 0%, transparent 100%)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                {/* Checkmark for vald option */}
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {/* Spacer når ingen checkmark */}
                {!isSelected && <span className="w-[14px]" />}
                {optLbl}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};