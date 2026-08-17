/**
 * Tosom ToSomTagline — System component
 * 
 * Footer tagline matching the final micro-patch exactly:
 * - text-base/md:text-lg
 * - tracking from tokens.typography.footerTagline
 * - opacity 0.85
 * - margin-bottom 30px
 */

'use client';

import { FC, ReactNode, CSSProperties } from 'react';
import { typography, colors } from '@/config/design-tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface ToSomTaglineProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/* ═══════════════════════════════════════════
   BASE STYLES
   ═══════════════════════════════════════════ */
const baseStyles: CSSProperties = {
  fontSize: 'var(--tagline-font-size, 16px)',
  fontWeight: typography.footerTagline.fontWeight,
  letterSpacing: typography.footerTagline.tracking,
  opacity: typography.footerTagline.opacity,
  lineHeight: typography.footerTagline.lineHeight,
  color: colors.textPrimary,
  textAlign: 'center',
  maxWidth: '360px',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginBottom: '30px',
  transition: `all 400ms ${typography.footerTagline.lineHeight}`,
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomTagline: FC<ToSomTaglineProps> = ({
  children,
  className = '',
  style,
}) => {
  return (
    <p
      className={`tosom-tagline ${className}`}
      style={{
        ...baseStyles,
        ...style,
      }}
    >
      {children}
    </p>
  );
};

export default ToSomTagline;