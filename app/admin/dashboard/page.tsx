/* ═══════════════════════════════════════════
   ToSom Admin Dashboard — Design System 1.1
   Hovudside for systemoversikt.
   Visar sanntidsstatistikk, systemtilstand og rasktillgang.
   ═══════════════════════════════════════════ */

'use client';

import { useEffect, useState } from 'react';
import { AdminStatsCard } from '@/components/admin/AdminStatsCard';
import { SystemHealth } from '@/components/admin/SystemHealth';
import Link from 'next/link';

/* ====== Type-definisionar ====== */

interface DashboardStats {
  totalUsers: number;
  activeMatches: number;
  ongoingJourneys: number;
  matchRate: number;
  recentRegistrations7d: number;
  activeConversations: number;
  errorsLast24h: number;
}

interface AdminDashboardData {
  stats: DashboardStats;
  journeyPhases: Array<{ phase: string; _count: number }>;
  recentUsers: Array<{ id: string; email: string; createdAt: Date }>;
  latestSystemLog: { level: string; message: string; module: string } | null;
}

/* ====== SVG-ikon for rasktillgang ====== */

interface QuickAction {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MatchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const JourneyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const ToolsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const quickActions: QuickAction[] = [
  { label: 'Brukarar', href: '/admin/users', icon: <UserIcon /> },
  { label: 'Matcher', href: '/admin/matches', icon: <MatchIcon /> },
  { label: 'Reiser', href: '/admin/journey', icon: <JourneyIcon /> },
  { label: 'Chat-meldingar', href: '/admin/chat', icon: <ChatIcon /> },
  { label: 'Innstillingar', href: '/admin/settings', icon: <SettingsIcon /> },
  { label: 'Verktøy', href: '/admin/tools', icon: <ToolsIcon /> },
];

/* ====== Loading Skeleton ====== */

function DashboardSkeleton() {
  return (
    <div className="min-h-screen" style={{ background: '#0A1A2A' }}>
      <div className="mx-auto px-4 py-8 max-w-6xl space-y-6">
        {/* Tittel-skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg bg-white/5 animate-pulse" />
          <div className="h-4 w-72 rounded bg-white/3 animate-pulse" />
        </div>

        {/* SystemHealth-skeleton */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="h-6 w-64 rounded bg-white/5 animate-pulse" />
        </div>

        {/* Stats-grid-skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="h-4 w-20 rounded bg-white/5 animate-pulse" />
              <div className="h-8 w-16 rounded bg-white/10 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Quick Actions-skeleton */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="h-6 w-32 rounded bg-white/5 animate-pulse mb-3" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="h-6 w-6 rounded bg-white/5 animate-pulse mx-auto" />
                <div className="h-4 w-16 rounded bg-white/5 animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====== Hovudkomponent ====== */

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats', { 
          cache: 'no-store' 
        });
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const json = await res.json();
        
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Kunne ikkje hente statistikk');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchStats();

    // Refetch kvart 30. sekund
    const interval = setInterval(fetchStats, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A1A2A' }}>
        <div className="text-center space-y-4">
          <p style={{ color: 'rgba(255,77,77,0.8)' }}>Feil ved lasting av dashboard</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>{error}</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="min-h-screen" style={{ background: '#0A1A2A' }}>
      <div className="mx-auto px-4 py-8 max-w-6xl">
        
        {/* Hovudtittel */}
        <div className="mb-6">
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: '#FFFFFF' }}
          >
            Admin Dashboard
          </h1>
          <p
            className="text-base"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            Sanntidsoversikt over ToSom-maskinen
          </p>
        </div>

        {/* Systemtilstand */}
        <div className="mb-6">
          <SystemHealth
            status={(stats?.errorsLast24h ?? 0) === 0 ? 'healthy' : (stats?.errorsLast24h ?? 0) < 10 ? 'warning' : 'error'}
            message={
              (stats?.errorsLast24h ?? 0) === 0 
                ? 'Alle system fungerer som dei skal' 
                : `${stats?.errorsLast24h ?? 0} feil siste 24 timane`
            }
            uptime="99.98%"
            dbLatency={12}
            apiLatency={45}
          />
        </div>

        {/* Statistikk-grid — sanntidsdata frå DB */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <AdminStatsCard
            title="Brukarar"
            value={stats?.totalUsers.toLocaleString() || '0'}
            trend={stats?.recentRegistrations7d}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <AdminStatsCard
            title="Aktive matcher"
            value={stats?.activeMatches.toLocaleString() || '0'}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            }
          />
          <AdminStatsCard
            title="Reiser pågående"
            value={stats?.ongoingJourneys.toLocaleString() || '0'}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            }
          />
          <AdminStatsCard
            title="Match-rate"
            value={`${stats?.matchRate || 0}%`}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div
            className="rounded-xl p-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '4px' }}>Samtalar</div>
            <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>
              {stats?.activeConversations.toLocaleString() || '0'}
            </div>
          </div>
          <div
            className="rounded-xl p-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '4px' }}>Nye (7d)</div>
            <div className="text-2xl font-bold" style={{ color: stats?.recentRegistrations7d === 0 ? 'rgba(255,184,108,0.8)' : '#4DFF88' }}>
              +{stats?.recentRegistrations7d.toLocaleString() || '0'}
            </div>
          </div>
          <div
            className="rounded-xl p-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '4px' }}>Feil (24t)</div>
            <div className="text-2xl font-bold" style={{ color: (stats?.errorsLast24h ?? 0) === 0 ? '#4DFF88' : (stats?.errorsLast24h ?? 0) < 10 ? '#FFB86C' : 'rgba(255,77,77,0.8)' }}>
              {(stats?.errorsLast24h ?? 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Rasktillgang — med SVG-ikon */}
        <div
          className="rounded-xl p-4"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h3
            className="text-lg font-semibold mb-3"
            style={{ color: '#FFFFFF' }}
          >
            Rasktillgang
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href} className="block w-full">
                <div
                  className="rounded-xl p-4 transition-all duration-300 hover:border-[rgba(212,175,55,0.3)] active:scale-95"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div className="mb-2 flex justify-center">{action.icon}</div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {action.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
