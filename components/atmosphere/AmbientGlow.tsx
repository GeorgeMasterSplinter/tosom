// components/atmosphere/AmbientGlow.tsx — Ambient glow-bakgrunnseffekt
// Large, blurred glow-cirkel med auto-scroll eller cursor-following
'use client';

import { useState, useEffect, useRef } from 'react';

interface AmbientGlowProps {
  color?: 'gold' | 'blue' | 'multi';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'follow';
  intensity?: number;
  speed?: number;
  className?: string;
}

const COLOR_MAP: Record<string, { c1: string; c2: string }> = {
  gold: { c1: 'rgba(212, 175, 55, ', c2: 'rgba(212, 175, 55, ' },
  blue: { c1: 'rgba(80, 120, 255, ', c2: 'rgba(80, 120, 255, ' },
  multi: { c1: 'rgba(212, 175, 55, ', c2: 'rgba(80, 120, 255, ' },
};

export function AmbientGlow({
  color = 'gold',
  position = 'bottom-right',
  intensity = 0.12,
  speed = 6,
  className = '',
}: AmbientGlowProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll animasjon
  useEffect(() => {
    let frameId: number;
    let t = 0;

    const animate = () => {
      t += 0.005 / speed;
      const x = Math.sin(t) * 30;
      const y = Math.cos(t * 0.7) * 20;
      setOffset({ x, y });
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [speed]);

  const posStyle: React.CSSProperties = (() => {
    switch (position) {
      case 'top-left': return { top: '-20%', left: '-10%' };
      case 'top-right': return { top: '-20%', right: '-10%' };
      case 'bottom-left': return { bottom: '-20%', left: '-10%' };
      case 'bottom-right': return { bottom: '-20%', right: '-10%' };
      case 'center': return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      default: return { top: '30%', left: '60%' };
    }
  })();

  return (
    <div ref={containerRef} className={`ts-ambient-glow ${className}`} style={{
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
    }}>
      {/* Primær glow */}
      <div style={{
        ...posStyle,
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLOR_MAP[color].c1}${intensity} 0%, transparent 70%)`,
        filter: 'blur(80px)',
        animation: `ambientFloat${color} ${speed * 2}s infinite alternate ease-in-out`,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }} />

      {/* Sekundær glow for multi */}
      {color === 'multi' && (
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '20%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLOR_MAP.multi.c2}${intensity * 0.7} 0%, transparent 70%)`,
          filter: 'blur(60px)',
          animation: `ambientFloatBlue ${speed * 2.5}s infinite alternate-reverse ease-in-out`,
        }} />
      )}
    </div>
  );
}

// Stilk-komponent for animasjonar
export const AmbientGlowStyles = () => (
  <style>{`
    @keyframes ambientFloatgold {
      0% { transform: translate(0, 0) scale(1); opacity: 0.7; }
      50% { transform: translate(20px, -15px) scale(1.1); opacity: 0.9; }
      100% { transform: translate(-10px, 10px) scale(1.05); opacity: 0.75; }
    }
    @keyframes ambientFloatblue {
      0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
      50% { transform: translate(-15px, 20px) scale(1.08); opacity: 0.85; }
      100% { transform: translate(10px, -10px) scale(1.02); opacity: 0.65; }
    }
    @keyframes ambientFloatmulti {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(-20px, 15px) scale(1.1); }
    }
  `}</style>
);

export default AmbientGlow;