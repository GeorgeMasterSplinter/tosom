/**
 * ToSom ToSomSection — System component
 * 
 * Foundation section with global vertical rhythm,
 * spotlight layer support, and centered max-width layout.
 */

'use client';

import { FC, ReactNode } from 'react';
import { spacing, blur, colors } from '@/design/tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomSectionProps {
  children: ReactNode;
  spotlight?: 'hero' | 'cta' | 'footer' | 'none';
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

/* ═══════════════════════════════════════════
   SPOTLIGHT CONFIG
   ═══════════════════════════════════════════ */
const spotlightConfig = {
  hero: {
    height: '200px',
    blur: blur['2xl'],
    opacity: 0.04,
    gradient: 'from-white',
  },
  cta: {
    height: '160px',
    blur: blur['3xl'],
    opacity: 0.05,
    gradient: 'from-white',
  },
  footer: {
    height: '200px',
    blur: blur['2xl'],
    opacity: 0.04,
    gradient: 'from-white',
  },
  none: null,
} as const;

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomSection: FC<ToSomSectionProps> = ({
  children,
  spotlight = 'none',
  className = '',
  style,
  id,
}) => {
  const config = spotlightConfig[spotlight];

  const spotlightEl = config ? (
    <div
      className="absolute inset-x-0 top-0 pointer-events-none"
      style={{
        height: config.height,
        background: `linear-gradient(180deg, rgba(255,255,255,${config.opacity}) 0%, transparent 100%)`,
        filter: `blur(${config.blur})`,
      }}
    />
  ) : null;

  return (
    <section
      id={id}
      className={`relative ${className}`}
      style={{
        paddingTop: spacing['6xl'],
        paddingBottom: spacing['6xl'],
        ...style,
      }}
    >
      {spotlightEl}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {children}
      </div>
    </section>
  );
};

export default ToSomSection;