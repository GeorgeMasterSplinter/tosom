/**
 * ToSom — Admin Dashboard
 * 
 * Server Component med sanne tal frå databasen.
 */

import { getAdminStats } from '@/lib/admin/data';
import GlassPanel from '@/components/ui/GlassPanel';
import GlassCard from '@/components/ui/GlassCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

/* ====== Hovudkomponent ====== */

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto">
      {/* Header */}
      <GlassPanel className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight" style={{ color: '#D4AF37' }}>
          Admin Dashboard
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Oversikt over system, brukarar og matcher.
        </p>
      </GlassPanel>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Brukarar */}
        <AdminStatCard
          label="Brukarar"
          value={stats.users.total}
          sub={`${stats.users.last7d} denne veka`}
          href="/admin/users"
          color="text-[#D4AF37]"
        />

        {/* Aktive matcher */}
        <AdminStatCard
          label="Aktive matcher"
          value={stats.matches.active}
          sub={`${stats.matches.total} totalt`}
          href="/admin/matches"
          color="text-green-400"
        />

        {/* Samtaler */}
        <AdminStatCard
          label="Samtaler"
          value={stats.conversations}
          sub={`${stats.messages} meldingar`}
          href="/admin/conversations"
          color="text-blue-400"
        />

        {/* Innsikter */}
        <AdminStatCard
          label="AI-innsikter"
          value={stats.insights}
          sub="MatchInsight"
          href="/admin/insights"
          color="text-purple-400"
        />
      </div>

      {/* Nye brukarar */}
      <GlassPanel className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Nye brukarar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatBox
            label="Siste 7 dagane"
            value={stats.users.last7d}
          />
          <StatBox
            label="Siste 30 dagane"
            value={stats.users.last30d}
          />
          <StatBox
            label="Nye matcher (7d)"
            value={stats.matches.last7d}
          />
        </div>
      </GlassPanel>

      {/* Hurtigaksjonar */}
      <GlassPanel className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Hurtigaksjonar
        </h2>
        <div className="flex flex-wrap gap-3">
          <QuickLink href="/admin/users" label="Alle brukarar →" />
          <QuickLink href="/admin/matches" label="Alle matcher →" />
          <QuickLink href="/admin/conversations" label="Alle samtalar →" />
          <QuickLink href="/admin/insights" label="AI-innsikter →" />
        </div>
      </GlassPanel>
    </div>
  );
}

/* ====== Underkomponentar ====== */

function AdminStatCard({
  label,
  value,
  sub,
  href,
  color,
}: {
  label: string;
  value: number;
  sub: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="block transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
      }}
    >
      <GlassCard className="flex flex-col gap-2 p-5">
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
        <span className={`text-3xl font-bold ${color}`}>{value}</span>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{sub}</span>
      </GlassCard>
    </Link>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
      <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{value}</div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
      style={{
        background: 'rgba(212,175,55,0.1)',
        border: '1px solid rgba(212,175,55,0.2)',
        color: '#D4AF37',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.18)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.1)';
      }}
    >
      {label}
    </Link>
  );
}