'use client';

import GlassCard from '@/components/ui/cards/GlassCard';

/* ====== Mock data for now (replace with real API calls) ====== */

const mockStats = {
  users: { total: 1247, today: 23, week: 156, month: 634 },
  matches: { active: 89, today: 12, completed: 342 },
  journeys: { active: 67, completed: 234, avgProgress: 0.64 },
  chat: { messages24h: 1456, avgPerMatch: 21.7 },
  system: { apiErrorRate: 0.02, dbLatency: 45, cronJobs: 8 },
};

/* ====== Dashboard ====== */

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white/90">Dashboard</h1>
          <p className="text-sm text-white/40 mt-1">Systemoversikt for ToSom</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(77,255,136,0.08)', border: '1px solid rgba(77,255,136,0.2)' }}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400">All systems operational</span>
          </div>
        </div>
      </div>

      {/* User stats - 4 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total brukarar" value={mockStats.users.total.toLocaleString()} sub={`+${mockStats.users.today} i dag`} icon="👥" href="/admin/users" />
        <MetricCard label="Aktive matcher" value={mockStats.matches.active.toString()} sub={`+${mockStats.matches.today} i dag`} icon="💫" href="/admin/matching" />
        <MetricCard label="Aktive reiser" value={mockStats.journeys.active.toString()} sub={`${mockStats.journeys.completed} fullført`} icon="🗺️" href="/admin/journey" />
        <MetricCard label="Meldingar (24h)" value={mockStats.chat.messages24h.toLocaleString()} sub={`~${mockStats.chat.avgPerMatch}/match`} icon="💬" href="/admin/chat" />
      </div>

      {/* Progress & System */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Journey progress */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white/70">Reise-progress (snitt)</h3>
            <span className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{Math.round(mockStats.journeys.avgProgress * 100)}%</span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-2 rounded-full transition-all" style={{ width: `${mockStats.journeys.avgProgress * 100}%`, background: 'linear-gradient(90deg, #D4AF37, #E8C766)' }} />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <StatMini label="Dag 1-10" value="34%" />
            <StatMini label="Dag 11-20" value="38%" />
            <StatMini label="Dag 21-30" value="28%" />
          </div>
        </GlassCard>

        {/* System health */}
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">System helse</h3>
          <div className="space-y-3">
            <SystemHealthRow label="API feil-rate" value={`${(mockStats.system.apiErrorRate * 100).toFixed(1)}%`} status="good" />
             <SystemHealthRow label="DB latency" value={`${mockStats.system.dbLatency}ms`} status="good" />
            <SystemHealthRow label="Cron-jobbar" value={`${mockStats.system.cronJobs}/8`} status="good" />
            <SystemHealthRow label="AI-quota bruks" value="67%" status="warning" />
            <SystemHealthRow label="Vercel deploy" value="v3.2.1" status="good" />
          </div>
        </GlassCard>
      </div>

      {/* Recent activity */}
      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-4">Siste aktivitet</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Nye brukarar (24h)', value: mockStats.users.today, color: '#D4AF37' },
            { label: 'Nye matcher (24h)', value: mockStats.matches.today, color: '#4DFF88' },
            { label: 'Fullførte reiser', value: 12, color: '#60A5FA' },
            { label: 'Rapporter idag', value: 3, color: '#FF6B6B' },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="text-xs text-white/40">{item.label}</div>
              <div className="text-xl font-bold mt-1" style={{ color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Quick links */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Alle brukarar →', href: '/admin/users' },
          { label: 'Aktive matcher →', href: '/admin/matching' },
          { label: 'Journey analytics →', href: '/admin/journey' },
          { label: 'Chat oversikt →', href: '/admin/chat' },
          { label: 'Moderation →', href: '/admin/moderation' },
          { label: 'System status →', href: '/admin/system' },
          { label: 'Test tools →', href: '/admin/tools' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)', color: 'rgba(212,175,55,0.8)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.15)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.08)';
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ====== Sub-components ====== */

function MetricCard({ label, value, sub, icon, href }: { label: string; value: string; sub: string; icon: string; href: string }) {
  return (
    <a href={href} className="block p-5 rounded-xl transition-all duration-200 hover:scale-[1.02]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-white/40">{label}</div>
          <div className="text-3xl font-bold mt-1 text-white/90">{value}</div>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-xs text-white/30 mt-2">{sub}</div>
    </a>
  );
}

function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-xs text-white/35">{label}</div>
      <div className="text-lg font-bold" style={{ color: '#D4AF37' }}>{value}</div>
    </div>
  );
}

function SystemHealthRow({ label, value, status }: { label: string; value: string; status: 'good' | 'warning' | 'error' }) {
  const colors = { good: '#4DFF88', warning: '#FFD437', error: '#FF4D4D' };
  const bgColors = { good: 'rgba(77,255,136,0.08)', warning: 'rgba(255,212,55,0.08)', error: 'rgba(255,77,77,0.08)' };
  return (
    <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: bgColors[status] }}>
      <span className="text-xs text-white/60">{label}</span>
      <span className="text-xs font-semibold" style={{ color: colors[status] }}>{value}</span>
    </div>
  );
}