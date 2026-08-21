// components/atmosphere/GridPattern.tsx — Subtil punktmønster-overlay for teksturar
'use client';

interface GridPatternProps {
  density?: 'light' | 'medium' | 'dense';
  color?: string;
  opacity?: number;
  className?: string;
}

const DENSITY_MAP: Record<string, { size: string; pattern: string }> = {
  light: { size: '24px', pattern: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)' },
  medium: { size: '16px', pattern: 'radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)' },
  dense: { size: '8px', pattern: 'radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)' },
};

export function GridPattern({
  density = 'light',
  color,
  opacity = 0.03,
  className = '',
}: GridPatternProps) {
  const d = DENSITY_MAP[density];

  return (
    <div
      className={`ts-grid-pattern ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: color 
          ? `linear-gradient(${opacity * 1000}, ${color}), ${d.pattern}`
          : d.pattern,
        backgroundSize: d.size,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: color ? undefined : opacity,
      }}
    />
  );
}

export default GridPattern;