/* ═══════════════════════════════════════════
   Tosom AdminStatsCard — Design System 1.1
   Viser systemstatistikk i admin-dashboard.
   Bruk med: <AdminStatsCard title="Brukere" value="1,234" trend={+12} />
   ═══════════════════════════════════════════ */

'use client';

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon?: React.ReactNode;
  color?: string;
}

export const AdminStatsCard = ({
  title,
  value,
  trend,
  icon,
  color = '#D4AF37',
}: AdminStatsCardProps) => {
  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300 hover:border-[rgba(255,255,255,0.16)]"
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        border: `1px solid ${color}20`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p
            className="text-xs font-medium uppercase tracking-wider mb-1"
            style={{ color: 'rgba(255, 255, 255, 0.4)' }}
          >
            {title}
          </p>
          <p
            className="text-3xl font-bold"
            style={{ color: '#FFFFFF' }}
          >
            {value}
          </p>
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
            <div style={{ color }}>{icon}</div>
          </div>
        )}
      </div>

      {/* Trend-indikator */}
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={trend >= 0 ? '#4DFF88' : '#FF4D4D'}
            strokeWidth="2"
          >
            {trend >= 0 ? (
              <polyline points="18 15 12 9 6 15" />
            ) : (
              <polyline points="6 9 12 15 18 9" />
            )}
          </svg>
          <span
            className="text-xs font-medium"
            style={{ color: trend >= 0 ? '#4DFF88' : '#FF4D4D' }}
          >
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        </div>
      )}
    </div>
  );
};

export default AdminStatsCard;