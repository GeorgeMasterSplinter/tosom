/**
 * Tosom — PremiumCTAButton (Call-to-Action Button)
 * 
 * Stor, roleg CTA-knapp med:
 * - Gull-gradient hover-effekt
 * - 48px høg (minimum)
 * - Shadow-increment på hover
 * - "Start reisen din"-type knappar
 */

'use client';

import { useState } from 'react';

interface PremiumCTAButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  secondaryLabel?: string; // "Gå tilbake"-knapp ved sidan av
  onSecondaryClick?: () => void;
  isLoading?: boolean;
  fullWidth?: boolean;
}

/**
 * Premium CTA-knapp med gull-gradient og premium-feeling:
 * - Normal: gull-gradient (#D4AF37 → #E8C766)
 * - Hover: lysare gradient + shadow-increment
 * - Disabled: dempa farger, ingen hover-effekt
 * - Loading: spinner i staden for tekst
 */
export function PremiumCTAButton({
  onClick,
  label,
  disabled = false,
  secondaryLabel,
  onSecondaryClick,
  isLoading = false,
  fullWidth = true,
}: PremiumCTAButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`flex items-center justify-center gap-4 ${fullWidth ? 'w-full' : ''}`}>
      {/* Hovud CTA */}
      <button
        onClick={onClick}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={disabled || isLoading}
        data-testid="ob-next"
        className={`
          relative overflow-hidden rounded-2xl font-semibold text-center
          transition-all duration-400 ease-out
          ${fullWidth ? 'w-full' : ''}
        `}
        style={{
          height: '56px',
          fontSize: '18px',
          letterSpacing: '-0.01em',
          background: disabled
            ? 'rgba(255, 255, 255, 0.06)'
            : isHovered
              ? 'linear-gradient(135deg, #E8C766 0%, #F0D575 50%, #E8C766 100%)'
              : 'linear-gradient(135deg, #D4AF37 0%, #E8C766 50%, #D4AF37 100%)',
          color: disabled ? 'rgba(255, 255, 255, 0.3)' : '#0B1520',
          boxShadow: disabled
            ? 'none'
            : isHovered
              ? '0 12px 48px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 6px 24px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          transform: isHovered && !disabled ? 'translateY(-1px) scale(1.01)' : 'scale(1)',
          cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {/* Loading-state */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" style={{ color: '#0B1520' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="font-medium">Sparar...</span>
          </div>
        ) : (
          label
        )}
      </button>

      {/* Sekundær CTA (valfritt) */}
      {secondaryLabel && onSecondaryClick && !disabled && (
        <button
          onClick={onSecondaryClick}
          className="rounded-xl font-medium transition-all duration-300"
          style={{
            height: '48px',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '-0.01em',
          }}
        >
          {secondaryLabel}
        </button>
      )}
    </div>
  );
}