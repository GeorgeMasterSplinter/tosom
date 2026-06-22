/**
 * ToSom UI 5.0 — CtaButton
 * 
 * Premium CTA-knapp med hover-state.
 */

'use client';

import { useState, FC } from 'react';

interface CtaButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'gold' | 'ghost';
}

export const CtaButton: FC<CtaButtonProps> = ({
  href,
  children,
  variant = 'gold',
}) => {
  const [hovered, setHovered] = useState(false);

  const goldStyles = hovered
    ? {
        background: '#E8C766',
        boxShadow: '0 0 60px rgba(212,175,55,0.75), 0 0 2px rgba(212,175,55,0.8), 0 6px 20px rgba(0,0,0,0.25)',
        transform: 'translateY(-2px)',
      }
    : {
        background: '#D4AF37',
        boxShadow: '0 0 40px rgba(212,175,55,0.45), 0 0 1px rgba(212,175,55,0.6), 0 4px 16px rgba(0,0,0,0.2)',
        transform: 'translateY(0)',
      };

  const ghostStyles = hovered
    ? {
        background: 'rgba(255, 255, 255, 0.08)',
        color: '#FFFFFF',
        transform: 'translateY(-2px)',
      }
    : {
        background: 'rgba(255, 255, 255, 0.04)',
        color: 'rgba(255, 255, 255, 0.8)',
        transform: 'translateY(0)',
      };

  const baseStyle: React.CSSProperties = {
    ...(variant === 'gold' ? goldStyles : ghostStyles),
    color: variant === 'gold' ? '#0B0E11' : (hovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)'),
    border: variant === 'gold'
      ? '1px solid rgba(212,175,55,0.3)'
      : '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: variant === 'ghost' ? 'blur(12px)' : undefined,
    transition: 'all 0.3s ease-out',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '500',
    width: '100%',
  };

  return (
    <a
      href={href}
      className={`mobile-full-cta ${variant === 'gold' ? 'cta-pulse' : ''}`}
      style={baseStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
};

export default CtaButton;