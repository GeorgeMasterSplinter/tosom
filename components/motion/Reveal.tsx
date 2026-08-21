'use client';

/**
 * Tosom — Reveal
 *
 * Scroll-utløst innglidning. Følger calm-motion:
 * kort avstand, lang varighet, ease-out cubic.
 *
 * Respekterer prefers-reduced-motion via globals.css.
 */

import { ReactNode, CSSProperties } from 'react';
import { useReveal } from '@/hooks/useReveal';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: ReactNode;
  /** Retning innholdet glir fra. */
  direction?: Direction;
  /** Forsinkelse i ms — brukes til stagger. */
  delay?: number;
  /** Varighet i ms. Standard følger calm-motion. */
  duration?: number;
  /** Avstand i piksler. Hold den kort. */
  distance?: number;
  className?: string;
  style?: CSSProperties;
}

const OFFSET: Record<Direction, (d: number) => string> = {
  up: (d) => `translate3d(0, ${d}px, 0)`,
  down: (d) => `translate3d(0, -${d}px, 0)`,
  left: (d) => `translate3d(${d}px, 0, 0)`,
  right: (d) => `translate3d(-${d}px, 0, 0)`,
  none: () => 'translate3d(0, 0, 0)',
};

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 900,
  distance = 18,
  className = '',
  style,
}: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : OFFSET[direction](distance),
        transition: `opacity ${duration}ms var(--ts-ease-resonance) ${delay}ms, transform ${duration}ms var(--ts-ease-resonance) ${delay}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Stagger-hjelper: gir hvert barn økende forsinkelse. */
export function RevealGroup({
  children,
  stagger = 80,
  ...props
}: Omit<RevealProps, 'children' | 'delay'> & {
  children: ReactNode[];
  stagger?: number;
}) {
  return (
    <>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * stagger} {...props}>
          {child}
        </Reveal>
      ))}
    </>
  );
}

export default Reveal;