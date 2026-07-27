/* ═══════════════════════════════════════════
   ToSom Admin Dashboard — Design System 1.1
   Hovudside for systemoversikt.
   Visar statistikk, systemtilstand og rasktillgang.
   ═══════════════════════════════════════════ */

'use client';

import { AdminStatsCard } from '@/components/admin/AdminStatsCard';
import { SystemHealth } from '@/components/admin/SystemHealth';
import Link from 'next/link';

/* ====== Komponentar for rasktillgang ====== */

interface QuickAction {
  label: string;
  href: string;
  icon: string;
}

const quickActions: QuickAction[] = [
  { label: 'Brukarar', href: '/admin/users', icon: '👥' },
  { label: 'Matcher', href: '/admin/matches', icon: '💫' },
  { label: 'Reiser', href: '/admin/journey', icon: '🗺️' },
  { label: 'Chat-meldingar', href: '/admin/chat', icon: '💬' },
  { label: 'Innstillingar', href: '/admin/settings', icon: '⚙️' },
  { label: 'Verktøy', href: '/admin/tools', icon: '🔧' },
];

/* ====== Hovudkomponent ====== */

export default function AdminDashboard() {
  return (
    <div className="min-h-screen" style={{ background: '#0A1A2A' }}>
      <div className="mx-auto px-4 py-8 max-w-6xl">
        
        {/* Hovudtittel — typografi: text-2xl */}
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
            Oversikt over ToSom-maskinen
          </p>
        </div>

        {/* Systemtilstand — radius: rounded-xl, padding: p-4 */}
        <div className="mb-6">
          <SystemHealth
            status="healthy"
            message="Alle system fungerer som de skal"
            uptime="99.98%"
            dbLatency={12}
            apiLatency={45}
          />
        </div>

        {/* Statistikk-grid — spacing: mb-6 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <AdminStatsCard
            title="Brukarar"
            value="1,234"
            trend={12}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <AdminStatsCard
            title="Aktive matcher"
            value="567"
            trend={8}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            }
          />
          <AdminStatsCard
            title="Reiser pågående"
            value="234"
            trend={-3}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            }
          />
          <AdminStatsCard
            title="Match-rate"
            value="94%"
            trend={2}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
          />
        </div>

        {/* Rasktillgang — radius: rounded-xl, padding: p-4 */}
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
                  <span className="text-2xl mb-2 block">{action.icon}</span>
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