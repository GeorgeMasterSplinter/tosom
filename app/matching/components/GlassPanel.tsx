/**
 * ToSom UI 5.0 — GlassPanel (Match-detalj variant)
 * 
 * Premium glass-panel med gull-aksentar, soft glow og glassmorphism.
 */

'use client';

import { FC, ReactNode } from 'react';

interface GlassPanelProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  goldBorder?: boolean;
  glow?: boolean;
  className?: string;
}

export const GlassPanel: FC<GlassPanelProps> = ({
  title,
  subtitle,
  children,
  goldBorder = true,
  glow = true,
  className = '',
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(16px)',
        border: goldBorder
          ? '1.5px solid rgba(212, 175, 55, 0.2)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: glow
          ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 12px rgba(255, 255, 255, 0.04)'
          : '0 4px 16px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Indre glow-refleks */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, transparent 40%)',
        }}
      />

      {/* Ytre glow */}
      {glow && (
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-2xl"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(212, 175, 55, 0.08), transparent 60%)',
          }}
        />
      )}

      {/* Innhold */}
      <div className="relative z-10 p-8">
        {title && (
          <div className="mb-5">
            <h3
              className="text-lg font-semibold mb-1"
              style={{ color: '#FFFFFF' }}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                className="text-sm"
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                {subtitle}
              </p>
            )}
            {/* Gull linje under tittel */}
            <div
              className="h-[1.5px] mt-3"
              style={{
                background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.5), transparent)',
                boxShadow: '0 0 8px rgba(212, 175, 55, 0.3)',
              }}
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default GlassPanel;