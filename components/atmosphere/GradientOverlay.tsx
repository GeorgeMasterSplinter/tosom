// components/atmosphere/GradientOverlay.tsx — Hero-seksjon med gradient fade-bottom-effekt
'use client';

interface GradientOverlayProps {
  color?: 'gold' | 'blue' | 'hero';
  position?: 'top' | 'bottom' | 'both';
  intensity?: number;
  className?: string;
  children?: React.ReactNode;
}

const GRADIENTS = {
  gold: {
    top: `linear-gradient(to bottom, rgba(212,175,55,${0.08}) 0%, transparent 60%)`,
    bottom: `linear-gradient(to top, rgba(212,175,55,${0.08}) 0%, transparent 60%)`,
  },
  blue: {
    top: `linear-gradient(to bottom, rgba(80,120,255,${0.06}) 0%, transparent 60%)`,
    bottom: `linear-gradient(to top, rgba(80,120,255,${0.06}) 0%, transparent 60%)`,
  },
  hero: {
    top: 'linear-gradient(to bottom, rgba(11,21,32,1) 0%, rgba(22,32,50,0.6) 60%, transparent 100%)',
    bottom: 'linear-gradient(to top, rgba(11,21,32,1) 0%, rgba(22,32,50,0.6) 60%, transparent 100%)',
  },
};

export function GradientOverlay({
  color = 'hero',
  position = 'bottom',
  intensity = 0.5,
  className = '',
  children,
}: GradientOverlayProps) {
  const g = GRADIENTS[color];
  
  return (
    <div className={`ts-gradient-overlay ${className}`} style={{
      position: 'relative',
      width: '100%',
    }}>
      {/* Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: position === 'top' ? g.top : position === 'bottom' ? g.bottom : `${g.top}, ${g.bottom}`,
        pointerEvents: 'none',
        zIndex: 1,
      }} />
      {/* Children */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}

export default GradientOverlay;