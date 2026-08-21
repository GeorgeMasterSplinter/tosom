'use client';

/**
 * Tosom — ResonanceField
 *
 * Signaturmotivet: to sirkler som møtes.
 * I snittflaten ligger gullet.
 *
 * Ambient lag. Skal knapt merkes — men det lever.
 */

import { CSSProperties } from 'react';

interface ResonanceFieldProps {
  /** Styrke 0–1. Standard er bevisst lav. */
  intensity?: number;
  className?: string;
  style?: CSSProperties;
}

export function ResonanceField({
  intensity = 1,
  className = '',
  style,
}: ResonanceFieldProps) {
  const blue = 0.030 * intensity;
  const gold = 0.042 * intensity;

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={style}
    >
      {/* Venstre sirkel — driver mot høyre */}
      <div
        className="absolute rounded-full"
        style={{
          width: '58vw',
          height: '58vw',
          maxWidth: '820px',
          maxHeight: '820px',
          left: '4%',
          top: '10%',
          background: `radial-gradient(circle at center, rgba(80,120,255,${blue}), transparent 66%)`,
          animation: 'ts-resonance-left var(--ts-drift) ease-in-out infinite',
        }}
      />

      {/* Høyre sirkel — driver mot venstre */}
      <div
        className="absolute rounded-full"
        style={{
          width: '58vw',
          height: '58vw',
          maxWidth: '820px',
          maxHeight: '820px',
          right: '4%',
          top: '10%',
          background: `radial-gradient(circle at center, rgba(80,120,255,${blue}), transparent 66%)`,
          animation: 'ts-resonance-right var(--ts-drift) ease-in-out infinite',
        }}
      />

      {/* Snittflaten — der de møtes ligger gullet */}
      <div
        className="absolute left-1/2 -translate-x-1/2 ts-breath"
        style={{
          width: '34vw',
          height: '44vw',
          maxWidth: '460px',
          maxHeight: '580px',
          top: '14%',
          background: `radial-gradient(ellipse at center, rgba(212,175,55,${gold}), transparent 64%)`,
          filter: 'blur(48px)',
        }}
      />
    </div>
  );
}

export default ResonanceField;