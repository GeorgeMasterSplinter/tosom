// components/ui/PulseGlow.tsx — Ambient glow-effekt for resonanse, matcher-status
'use client';

interface PulseGlowProps {
  color?: 'gold' | 'blue' | 'green' | 'pink';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  intensity?: number;
  pulseSpeed?: number;
  className?: string;
}

const COLORS: Record<string, { glow: string; blur: string }> = {
  gold: { glow: 'rgba(212, 175, 55, ', blur: 'rgba(212, 175, 55, ' },
  blue: { glow: 'rgba(80, 120, 255, ', blur: 'rgba(80, 120, 255, ' },
  green: { glow: 'rgba(77, 255, 136, ', blur: 'rgba(77, 255, 136, ' },
  pink: { glow: 'rgba(255, 130, 200, ', blur: 'rgba(255, 130, 200, ' },
};

const SIZES: Record<string, { width: string; height: string; blurAmount: string }> = {
  sm: { width: '60px', height: '60px', blurAmount: '20px' },
  md: { width: '100px', height: '100px', blurAmount: '35px' },
  lg: { width: '160px', height: '160px', blurAmount: '50px' },
  xl: { width: '240px', height: '240px', blurAmount: '70px' },
};

export function PulseGlow({
  color = 'gold',
  size = 'md',
  intensity = 0.15,
  pulseSpeed = 3,
  className = '',
}: PulseGlowProps) {
  const c = COLORS[color] || COLORS.gold;
  const s = SIZES[size] || SIZES.md;

  return (
    <div
      className={`ts-pulse-glow ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Glow-sirkel med pulse */}
      <div
        style={{
          width: s.width,
          height: s.height,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${c.glow}${intensity} 0%, transparent 70%)`,
          filter: `blur(${s.blurAmount})`,
          animation: `pulseGlow${color} ${pulseSpeed}s infinite alternate ease-in-out`,
          pointerEvents: 'none',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
}

// Stilk med animasjonar
export const PulseGlowStyles = () => (
  <style>{`
    @keyframes pulseGlowgold {
      0% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.9); }
      50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.1); }
      100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.0); }
    }
    @keyframes pulseGlowblue {
      0% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.85); }
      50% { opacity: 0.85; transform: translate(-50%, -50%) scale(1.15); }
      100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.0); }
    }
    @keyframes pulseGlowgreen {
      0% { opacity: 0.7; transform: translate(-50%, -50%) scale(0.95); }
      50% { opacity: 1.0; transform: translate(-50%, -50%) scale(1.05); }
      100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.0); }
    }
    @keyframes pulseGlowpink {
      0% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.9); }
      50% { opacity: 0.95; transform: translate(-50%, -50%) scale(1.1); }
      100% { opacity: 0.65; transform: translate(-50%, -50%) scale(1.02); }
    }
  `}</style>
);

export default PulseGlow;