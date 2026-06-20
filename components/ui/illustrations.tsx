/**
 * ToSom 4.0 — Illustration Layer
 *
 * 12 CSS+SVG illustrations built with abstract shapes, soft gradients, and glassmorphism.
 * No images required.
 *
 * Usage:
 *   import { Illustration, type IllustrationType } from '@/components/ui/illustrations'
 */

import React from 'react';

/* ── Illustration Types ── */
export type IllustrationType =
  | 'journey'
  | 'connection'
  | 'heartbeat'
  | 'stars'
  | 'flowers'
  | 'waves'
  | 'moon'
  | 'sunrise'
  | 'butterfly'
  | 'tree'
  | 'home'
  | 'hands';

export interface IllustrationProps {
  type?: IllustrationType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/* ── Size Map ── */
const sizeMap: Record<string, string> = {
  sm: 'w-24 h-24',
  md: 'w-40 h-40',
  lg: 'w-56 h-56',
  xl: 'w-72 h-72',
  undefined: 'w-40 h-40',
};

/* ── 12 Illustrations ── */
const illustrations: Record<IllustrationType, React.FC<{ size: string }>> = {
  /* 1. Journey — winding path */
  journey: ({ size }) => (
    <div className={`${size} relative`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="journeyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path d="M30,170 Q60,140 80,120 T120,80 T160,50" fill="none" stroke="url(#journeyGrad)" strokeWidth="3" strokeLinecap="round" strokeDasharray="8,4" className="animate-[pulse_3s_ease-in-out_infinite]" />
        <circle cx="30" cy="170" r="6" fill="#D4AF37" opacity="0.8" />
        <circle cx="160" cy="50" r="8" fill="#60A5FA" opacity="0.6" />
        <circle cx="80" cy="120" r="3" fill="#D4AF37" opacity="0.4" />
        <circle cx="120" cy="80" r="3" fill="#60A5FA" opacity="0.3" />
      </svg>
    </div>
  ),

  /* 2. Connection — two orbits */
  connection: ({ size }) => (
    <div className={`${size} relative`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <ellipse cx="100" cy="100" rx="70" ry="35" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.3" transform="rotate(-20, 100, 100)" className="animate-[spin_20s_linear_infinite]" />
        <ellipse cx="100" cy="100" rx="50" ry="25" fill="none" stroke="#60A5FA" strokeWidth="1.5" opacity="0.3" transform="rotate(30, 100, 100)" className="animate-[spin_15s_linear_infinite_reverse]" />
        <circle cx="100" cy="65" r="5" fill="#D4AF37" opacity="0.6" />
        <circle cx="100" cy="135" r="5" fill="#60A5FA" opacity="0.6" />
        <circle cx="100" cy="100" r="10" fill="#D4AF37" opacity="0.15" stroke="#D4AF37" strokeWidth="1" />
      </svg>
    </div>
  ),

  /* 3. Heartbeat */
  heartbeat: ({ size }) => (
    <div className={`${size} relative`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M30,100 L60,100 L75,60 L100,140 L125,60 L140,100 L170,100" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" className="animate-[pulse_2s_ease-in-out_infinite]" />
        <circle cx="100" cy="100" r="40" fill="#D4AF37" opacity="0.04" />
      </svg>
    </div>
  ),

  /* 4. Stars */
  stars: ({ size }) => (
    <div className={`${size} relative`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {[...Array(12)].map((_, i) => {
          const x = 30 + (i % 4) * 50;
          const y = 30 + Math.floor(i / 4) * 50;
          const r = 2 + (i % 3);
          return (
            <circle key={i} cx={x} cy={y} r={r} fill="#D4AF37" opacity={0.2 + (i % 5) * 0.15} className="animate-[pulse_3s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s` } as React.CSSProperties} />
          );
        })}
        <path d="M70,80 Q100,30 130,80 Q100,130 70,80" fill="#D4AF37" opacity="0.05" />
      </svg>
    </div>
  ),

  /* 5. Flowers */
  flowers: ({ size }) => (
    <div className={`${size} relative`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 100 + 30 * Math.cos(rad);
          const cy = 100 + 30 * Math.sin(rad);
          return (
            <circle key={i} cx={cx} cy={cy} r="10" fill="#F472B6" opacity={0.15 + i * 0.03} />
          );
        })}
        <circle cx="100" cy="100" r="8" fill="#D4AF37" opacity="0.3" />
        <path d="M100,110 Q95,150 100,180" fill="none" stroke="#34D399" strokeWidth="2" opacity="0.3" />
      </svg>
    </div>
  ),

  /* 6. Waves */
  waves: ({ size }) => (
    <div className={`${size} relative`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M10,${80 + i * 25} Q50,${60 + i * 25} 100,${80 + i * 25} T190,${80 + i * 25}`}
            fill="none"
            stroke={i % 2 === 0 ? '#D4AF37' : '#60A5FA'}
            strokeWidth="1.5"
            opacity={0.2 - i * 0.04}
            className="animate-[pulse_4s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.5}s` } as React.CSSProperties}
          />
        ))}
      </svg>
    </div>
  ),

  /* 7. Moon */
  moon: ({ size }) => (
    <div className={`${size} relative`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="90" cy="90" r="40" fill="#D4AF37" opacity="0.12" />
        <circle cx="100" cy="80" r="40" fill="#0B0E11" />
        <circle cx="100" cy="80" r="38" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.2" />
        {[0, 90, 180, 270].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return <circle key={i} cx={100 + 55 * Math.cos(rad)} cy={85 + 55 * Math.sin(rad)} r="1.5" fill="#D4AF37" opacity="0.3" />;
        })}
      </svg>
    </div>
  ),

  /* 8. Sunrise */
  sunrise: ({ size }) => (
    <div className={`${size} relative`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="sunriseGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path d="M40,140 Q100,80 160,140" fill="url(#sunriseGrad)" />
        <circle cx="100" cy="120" r="25" fill="#D4AF37" opacity="0.15" />
        <circle cx="100" cy="120" r="15" fill="#D4AF37" opacity="0.25" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const r = 35;
          return <line key={i} x1={100 + r * Math.cos(rad)} y1={120 + r * Math.sin(rad)} x2={100 + (r + 12) * Math.cos(rad)} y2={120 + (r + 12) * Math.sin(rad)} stroke="#D4AF37" strokeWidth="1" opacity="0.15" />;
        })}
      </svg>
    </div>
  ),

  /* 9. Butterfly */
  butterfly: ({ size }) => (
    <div className={`${size} relative`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M100,100 Q70,60 50,80 Q40,100 70,110 Q90,115 100,100" fill="#D4AF37" opacity="0.12" />
        <path d="M100,100 Q130,60 150,80 Q160,100 130,110 Q110,115 100,100" fill="#60A5FA" opacity="0.12" />
        <path d="M100,100 Q80,120 70,140 Q65,150 80,145 Q90,140 100,100" fill="#F472B6" opacity="0.1" />
        <path d="M100,100 Q120,120 130,140 Q135,150 120,145 Q110,140 100,100" fill="#C084FC" opacity="0.1" />
        <line x1="100" y1="80" x2="100" y2="120" stroke="#D4AF37" strokeWidth="1.5" opacity="0.3" />
      </svg>
    </div>
  ),

  /* 10. Tree */
  tree: ({ size }) => (
    <div className={`${size} relative`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M100,180 L100,100" stroke="#8B6914" strokeWidth="3" opacity="0.3" />
        <circle cx="100" cy="80" r="35" fill="#34D399" opacity="0.1" />
        <circle cx="80" cy="90" r="20" fill="#34D399" opacity="0.08" />
        <circle cx="120" cy="90" r="20" fill="#D4AF37" opacity="0.08" />
        <circle cx="100" cy="60" r="18" fill="#34D399" opacity="0.1" />
      </svg>
    </div>
  ),

  /* 11. Home */
  home: ({ size }) => (
    <div className={`${size} relative`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M40,100 L100,50 L160,100" fill="none" stroke="#D4AF37" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
        <rect x="60" y="100" width="80" height="60" rx="4" fill="#D4AF37" fillOpacity="0.08" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.3" />
        <rect x="85" y="125" width="30" height="35" rx="2" fill="#D4AF37" opacity="0.06" />
        <circle cx="130" cy="115" r="6" fill="#D4AF37" opacity="0.15" />
      </svg>
    </div>
  ),

  /* 12. Hands */
  hands: ({ size }) => (
    <div className={`${size} relative`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M50,130 Q60,100 80,95 Q90,93 85,100 Q80,105 70,110" fill="none" stroke="#D4AF37" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
        <path d="M150,130 Q140,100 120,95 Q110,93 115,100 Q120,105 130,110" fill="none" stroke="#D4AF37" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
        <circle cx="100" cy="120" r="15" fill="#D4AF37" opacity="0.1" />
        <path d="M90,120 L100,110 L110,120" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.2" />
      </svg>
    </div>
  ),
};

/* ── Main Illustration Component ── */
const Illustration: React.FC<IllustrationProps> = ({
  type = 'journey',
  size = 'md',
  className = '',
}) => {
  const SizeClass = sizeMap[size] || sizeMap.md;
  const IllustrationComponent = illustrations[type];
  return (
    <div className={`${SizeClass} ${className}`}>
      <IllustrationComponent size="100%" />
    </div>
  );
};

/* ── Pre-built Illustrations ── */
export const JourneyIllustration = (props: Omit<IllustrationProps, 'type'>) => (
  <Illustration type="journey" {...props} />
);

export const ConnectionIllustration = (props: Omit<IllustrationProps, 'type'>) => (
  <Illustration type="connection" {...props} />
);

export const HeartbeatIllustration = (props: Omit<IllustrationProps, 'type'>) => (
  <Illustration type="heartbeat" {...props} />
);

export const StarsIllustration = (props: Omit<IllustrationProps, 'type'>) => (
  <Illustration type="stars" {...props} />
);

export const FlowersIllustration = (props: Omit<IllustrationProps, 'type'>) => (
  <Illustration type="flowers" {...props} />
);

export const WavesIllustration = (props: Omit<IllustrationProps, 'type'>) => (
  <Illustration type="waves" {...props} />
);

export const MoonIllustration = (props: Omit<IllustrationProps, 'type'>) => (
  <Illustration type="moon" {...props} />
);

export const SunriseIllustration = (props: Omit<IllustrationProps, 'type'>) => (
  <Illustration type="sunrise" {...props} />
);

export const ButterflyIllustration = (props: Omit<IllustrationProps, 'type'>) => (
  <Illustration type="butterfly" {...props} />
);

export const TreeIllustration = (props: Omit<IllustrationProps, 'type'>) => (
  <Illustration type="tree" {...props} />
);

export const HomeIllustration = (props: Omit<IllustrationProps, 'type'>) => (
  <Illustration type="home" {...props} />
);

export const HandsIllustration = (props: Omit<IllustrationProps, 'type'>) => (
  <Illustration type="hands" {...props} />
);

export { Illustration };
export default Illustration;