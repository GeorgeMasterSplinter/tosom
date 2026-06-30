/**
 * ToSom — PremiumTypingIndicator
 * 
 * Pulsande typing-indikator med 3 partiklar
 * Bruk:
 *   <PremiumTypingIndicator />
 */

'use client';

import { useState, useEffect } from 'react';
import { generateTypingParticles } from '@/lib/chatAnimations/chatAnimations';

interface PremiumTypingIndicatorProps {
  /** Aktiv? */
  active?: boolean;
  /** Puls-varighet (ms) */
  pulseDuration?: number;
  /** Partikkel-antal */
  particleCount?: number;
  /** Farge */
  color?: string;
}

export default function PremiumTypingIndicator({
  active = false,
  pulseDuration = 1200,
  particleCount = 3,
  color = '#D4AF37',
}: PremiumTypingIndicatorProps) {
  const [particles] = useState(() => generateTypingParticles(particleCount));
  const [pulsePhase, setPulsePhase] = useState(0);

  // Puls-animasjon
  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 100);
    }, pulseDuration / 100);

    return () => clearInterval(interval);
  }, [active, pulseDuration]);

  if (!active) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {/* Pulsande partiklar */}
      <div className="flex items-center gap-1.5">
        {particles.map((p, i) => {
          // Fase-forskyving for kvart partikkel
          const phaseOffset = (pulsePhase + (i * 33)) % 100;
          const opacity = 0.3 + (phaseOffset / 100) * 0.5;
          const scale = 0.8 + (phaseOffset / 100) * 0.4;

          return (
            <div
              key={p.id}
              className="rounded-full"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: color,
                opacity,
                transform: `scale(${scale})`,
                transition: 'all 0.1s ease-in-out',
              }}
            />
          );
        })}
      </div>

      {/* Tekst */}
      <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '13px' }}>
        skriv...
      </span>
    </div>
  );
}