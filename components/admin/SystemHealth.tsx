/* ═══════════════════════════════════════════
   Tosom SystemHealth — Design System 1.1
   Visar systemtilstand i admin-dashboard.
   Bruk med: <SystemHealth status="healthy" message="Alt fungerer" />
   ═══════════════════════════════════════════ */

'use client';

import { useState, useEffect } from 'react';

type HealthStatus = 'healthy' | 'warning' | 'error';

interface SystemHealthProps {
  status?: HealthStatus;
  message?: string;
  uptime?: string;
  dbLatency?: number;
  apiLatency?: number;
}

const statusConfig: Record<HealthStatus, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  healthy: {
    color: '#4DFF88',
    bg: 'rgba(77, 255, 136, 0.08)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    label: 'Operativ',
  },
  warning: {
    color: '#FFB84D',
    bg: 'rgba(255, 184, 77, 0.08)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    label: 'Åtferd krevj',
  },
  error: {
    color: '#FF4D4D',
    bg: 'rgba(255, 77, 77, 0.08)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    label: 'Feil',
  },
};

export const SystemHealth = ({
  status = 'healthy',
  message = 'Systemet fungerer som det skal',
  uptime = '99.98%',
  dbLatency = 12,
  apiLatency = 45,
}: SystemHealthProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const config = statusConfig[status];

  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300"
      style={{
        background: config.bg,
        border: `1px solid ${config.color}30`,
        boxShadow: isHovered ? `0 0 30px ${config.color}15` : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hovudseksjon */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p
            className="text-xs font-medium uppercase tracking-wider mb-1"
            style={{ color: 'rgba(255, 255, 255, 0.4)' }}
          >
            Systemtilstand
          </p>
          <div className="flex items-center gap-2">
            <div style={{ color: config.color }}>
              {config.icon}
            </div>
            <p
              className="text-lg font-semibold"
              style={{ color: '#FFFFFF' }}
            >
              {config.label}
            </p>
          </div>
        </div>

        {/* Puls-indikator */}
        <div
          className="w-3 h-3 rounded-full animate-pulse"
          style={{ background: config.color }}
        />
      </div>

      {/* Statistikk */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p
            className="text-xs mb-1"
            style={{ color: 'rgba(255, 255, 255, 0.4)' }}
          >
            Oppetid
          </p>
          <p
            className="text-xl font-bold"
            style={{ color: config.color }}
          >
            {uptime}
          </p>
        </div>
        <div className="text-center">
          <p
            className="text-xs mb-1"
            style={{ color: 'rgba(255, 255, 255, 0.4)' }}
          >
            DB-latens
          </p>
          <p
            className="text-xl font-bold"
            style={{ color: '#FFFFFF' }}
          >
            {dbLatency}ms
          </p>
        </div>
        <div className="text-center">
          <p
            className="text-xs mb-1"
            style={{ color: 'rgba(255, 255, 255, 0.4)' }}
          >
            API-latens
          </p>
          <p
            className="text-xl font-bold"
            style={{ color: '#FFFFFF' }}
          >
            {apiLatency}ms
          </p>
        </div>
      </div>

      {/* Melding */}
      <p
        className="mt-4 text-sm text-center"
        style={{ color: 'rgba(255, 255, 255, 0.5)' }}
      >
        {message}
      </p>
    </div>
  );
};

export default SystemHealth;