/**
 * ToSom — AdminCard
 * 
 * Glassmorphism-kort med warmFlow-glow for admin-ui
 * 
 * Bruk:
 *   <AdminCard title="API Latency" value="45ms" description="Under 50ms er optimalt" />
 */

'use client';

import { useState, useEffect } from 'react';

interface AdminCardProps {
  /** Kort-tittel */
  title: string;
  /** Verd (hovudvising) */
  value: string | number;
  /** Under/skildring */
  description?: string;
  /** Ikon (emoji) */
  icon?: string;
  /** Status (good/warning/error) */
  status?: 'good' | 'warning' | 'error' | 'neutral';
  /** WarmFlow-glow farge */
  glowColor?: string;
  /** Klikk-handling */
  onClick?: () => void;
  /** Ekstra className */
  className?: string;
}

export default function AdminCard({
  title,
  value,
  description,
  icon,
  status = 'neutral',
  glowColor,
  onClick,
  className = '',
}: AdminCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [glow, setGlow] = useState('');

  // Glow-farge basert på status eller eksplisitt farge
  useEffect(() => {
    if (glowColor) {
      setGlow(glowColor);
    } else {
      const defaults: Record<string, string> = {
        good: 'rgba(77, 255, 136, 0.15)',
        warning: 'rgba(255, 212, 55, 0.15)',
        error: 'rgba(255, 77, 77, 0.15)',
        neutral: 'rgba(212, 175, 55, 0.1)',
      };
      setGlow(defaults[status] || defaults.neutral);
    }
  }, [status, glowColor]);

  // Status-farge
  const statusColor = {
    good: '#4DFF88',
    warning: '#FFD437',
    error: '#FF4D4D',
    neutral: '#D4AF37',
  }[status] || '#D4AF37';

  const statusBgColor = {
    good: 'rgba(77, 255, 136, 0.08)',
    warning: 'rgba(255, 212, 55, 0.08)',
    error: 'rgba(255, 77, 77, 0.08)',
    neutral: 'rgba(212, 175, 55, 0.05)',
  }[status] || 'rgba(212, 175, 55, 0.05)';

  return (
    <div
      className={`transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${isHovered ? statusColor : 'rgba(255, 255, 255, 0.06)'}`,
        boxShadow: isHovered ? `0 8px 32px ${glow}` : '0 4px 20px rgba(0,0,0,0.2)',
        transform: isHovered ? 'translateY(-2px) scale(1.01)' : 'translateY(0) scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-xs text-white/40">{title}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: statusColor }}>
              {value}
            </div>
          </div>
          {icon && (
            <span className="text-2xl opacity-60">{icon}</span>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="px-5 pb-4">
          <div className="text-xs text-white/30">{description}</div>
        </div>
      )}

      {/* Status-indikator */}
      {status !== 'neutral' && (
        <div className="px-5 pb-4">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
            style={{ background: statusBgColor, color: statusColor }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: statusColor }}
            />
            {status === 'good' && 'Operational'}
            {status === 'warning' && 'Warning'}
            {status === 'error' && 'Error'}
          </div>
        </div>
      )}
    </div>
  );
}

