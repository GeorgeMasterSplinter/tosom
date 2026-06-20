/**
 * Section — Spaced content section with fade-in animation
 *
 * Usage:
 *   <Section>
 *     <h2>Heading</h2>
 *     <p>Content</p>
 *   </Section>
 */

import React from 'react';
import { tokens } from '@/components/ui/tokens';

export interface SectionProps {
  children: React.ReactNode;
  /** Section padding size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to apply fade-in animation */
  animated?: boolean;
  /** Alignment */
  align?: 'left' | 'center' | 'right';
  /** Custom class */
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  children,
  size = 'lg',
  animated = false,
  align = 'left',
  className = '',
}) => {
  const paddingMap: Record<string, string> = {
    sm: `py-[var(--ts-spacing-3xl)] px-[var(--ts-spacing-xl)]`,
    md: `py-[var(--ts-spacing-4xl)] px-[var(--ts-spacing-4xl)]`,
    lg: `py-[var(--ts-spacing-4xl)] px-[var(--ts-spacing-4xl)]`,
    xl: `py-[var(--ts-spacing-5xl)] px-[var(--ts-spacing-4xl)]`,
  };

  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <section
      className={`
        ${paddingMap[size]}
        ${alignMap[align]}
        ${animated ? 'animate-fadeInUp' : ''}
        max-w-[var(--ts-container-max)] mx-auto w-full
        ${className}
      `}
      role="region"
      aria-labelledby={`section-${size}`}
    >
      {children}
    </section>
  );
};

Section.displayName = 'Section';
export default Section;