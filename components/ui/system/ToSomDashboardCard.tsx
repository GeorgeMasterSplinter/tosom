/**
 * Tosom ToSomDashboardCard — System component
 * 
 * Dashboard stats card with icon, value, label, and trend.
 */

'use client';

import { FC } from 'react';
import { colors, shadows, motion, spacing } from '@/config/design-tokens';
import { ToSomGlassPanel } from './ToSomGlassPanel';

type TrendValue = 'up' | 'down' | 'neutral';

interface TrendConfig {
  color: string;
  icon: string;
}

const trendConfig: Record<TrendValue, TrendConfig> = {
  up: { color: '#4DFF88', icon: '↗' },
  down: { color: '#FF4D4D', icon: '↘' },
  neutral: { color: 'rgba(255,255,255,0.45)', icon: '→' },
};

interface ToSomDashboardCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: TrendValue;
  trendValue?: string;
}

export const ToSomDashboardCard: FC<ToSomDashboardCardProps> = ({
  icon,
  value,
  label,
  trend,
  trendValue,
}) => {
  const trendStyle = trend ? trendConfig[trend] : trendConfig.neutral;

  return (
    <ToSomGlassPanel padding="lg">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-xl"
          style={{
            background: 'rgba(212,175,55,0.10)',
            border: '1px solid rgba(212,175,55,0.20)',
            color: colors.gold,
          }}
        >
          {icon}
        </div>
        {trend && trendValue && (
          <span className="flex items-center gap-1 text-xs font-medium" style={{ color: trendStyle.color }}>
            {trendStyle.icon}
            {trendValue}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>{value}</p>
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{label}</p>
    </ToSomGlassPanel>
  );
};

export default ToSomDashboardCard;