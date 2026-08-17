/**
 * Tosom ToSomPage — System component
 * 
 * Standard page wrapper with max-width, vertical rhythm, spotlight support.
 */

'use client';

import { FC, ReactNode } from 'react';
import { spacing, colors, blur } from '@/config/design-tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
type SpotlightKey = 'hero' | 'cta' | 'footer' | 'none';

interface SpotlightConfig {
  height: string;
  blur: string;
  opacity: number;
}

const spotlightMap: Record<SpotlightKey, SpotlightConfig | null> = {
  hero:  { height: '200px', blur: 'blur(80px)', opacity: 0.04 },
  cta:   { height: '160px', blur: 'blur(100px)', opacity: 0.05 },
  footer: { height: '200px', blur: 'blur(80px)', opacity: 0.04 },
  none:   null,
};

interface ToSomPageProps {
  children: ReactNode;
  spotlight?: SpotlightKey;
  className?: string;
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomPage: FC<ToSomPageProps> = ({ children, spotlight = 'none', className = '' }) => {
  const config = spotlightMap[spotlight];

  return (
    <div className={`tosom-page ${className}`}>
      {/* Spotlight overlay */}
      {config && (
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: config.height,
            background: `linear-gradient(180deg, rgba(255,255,255,${config.opacity}) 0%, transparent 100%)`,
            filter: config.blur,
          }}
        />
      )}

      {/* Content */}
      <div
        className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10"
        style={{
          paddingTop: spacing['6xl'],
          paddingBottom: spacing['6xl'],
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ToSomPage;