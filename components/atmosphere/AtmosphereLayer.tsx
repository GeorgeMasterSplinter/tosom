/**
 * ToSom — AtmosphereLayer
 * 
 * Ambient bakgrunnslag for ChatRoom med:
 *   - Mood-basert gradient (reagerer på WarmFlow-mood)
 *   - Vignette for djupde
 *   - Ambient partiklar (bare i celebratory/deep)
 *   - Sesong-basert farge
 * 
 * Bruk:
 *   <AtmosphereLayer mood="warm" phase="DEEPER" />
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { getAtmosphereSystem, AtmospherePreset } from '@/lib/atmosphere/atmosphereEngine';
import { type MoodType } from '@/lib/warmFlow/warmFlow';

interface AtmosphereLayerProps {
  /** WarmFlow-mood */
  mood?: MoodType;
  /** Journey-fase */
  phase?: string;
  /** Conversation/resonance-nivå */
  resonanceLevel?: number;
  /** Animasjon aktiv? */
  animationEnabled?: boolean;
}

export default function AtmosphereLayer({
  mood = 'calm',
  phase = 'EARLY',
  resonanceLevel = 50,
  animationEnabled = true,
}: AtmosphereLayerProps) {
  const [preset, setPreset] = useState<AtmospherePreset>('midnight-gold');
  const [system, setSystem] = useState<ReturnType<typeof getAtmosphereSystem> | null>(null);

  // Berek preset basert på mood, fase, og resonans
  useEffect(() => {
    const newPreset = calculateAtmospherePreset(mood, phase, resonanceLevel);
    setPreset(newPreset);
    setSystem(getAtmosphereSystem(newPreset, phase, 15));
  }, [mood, phase, resonanceLevel]);

  // Particle-komponent (internal)
  const Particles = useMemo(() => {
    if (!system || !animationEnabled) return null;

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {system.particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              background: system.colors.gold,
              animationDuration: `${10 + p.speed * 20}s`,
              animationDelay: `${-Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    );
  }, [system, animationEnabled]);

  // Ingen rendering dersom ingen system-data
  if (!system) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Gradient-bakgrunn */}
      <div
        className="absolute inset-0 opacity-80 transition-all duration-1000 ease-in-out"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${system.colors.glow} 0%, ${system.colors.background} 60%)`,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 atmosphere-vignette"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.35) 100%)',
        }}
      />

      {/* Partiklar (bare i celebratory/deep) */}
      {animationEnabled && (mood === 'celebratory' || mood === 'deep') && Particles}
    </div>
  );
}

// ─── HELPERS ─────────────────

/**
 * Berek atmosphere-preset basert på mood, fase, og resonans
 */
function calculateAtmospherePreset(
  mood: MoodType,
  phase: string,
  resonanceLevel: number
): AtmospherePreset {
  // Celebratory → golden-hour
  if (mood === 'celebratory') {
    return 'golden-hour';
  }

  // Deep → deep-ocean
  if (mood === 'deep' || phase === 'DEEPER') {
    return resonanceLevel >= 70 ? 'deep-ocean' : 'twilight-purple';
  }

  // Warm → golden-hour eller dawn-blue
  if (mood === 'warm') {
    return resonanceLevel >= 75 ? 'golden-hour' : 'dawn-blue';
  }

  // Gentle → spring-bloom eller forest-green
  if (mood === 'gentle') {
    return resonanceLevel >= 60 ? 'spring-bloom' : 'forest-green';
  }

  // Calm → midnight-gold (standard)
  return 'midnight-gold';
}