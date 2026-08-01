'use client';

/**
 * ToSom — Admin Dashboard 🟡⭐
 * 
 * Oversikt over ToSom-plattforma på 5 sekund.
 * Design: ToSom Blue + Nordic Gold + Glassmorphism.
 * Bokmål. Premium. Ro. Moden.
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

/* ─── Admin Header — toppen av dashboardet ✨ */

function AdminHeader() {
  const router = useRouter();

  return (
    <header
      className="flex items-center justify-between px-6 py-4 mb-6 border-b"
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)' }}
        >
          <span className="text-[14px] font-bold text-[#0A1A2A]">T</span>
        </div>
        <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Admin
        </span>
      </div>
      <button
        onClick={() => {
          document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          router.push('/admin/login');
        }}
        className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
        style={{
          color: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        Logg ut
      </button>
    </header>
  );
}

/* ─── Journey Phase Bar — visualiser reise-faser ─── */

function JourneyPhaseMonitor() {
  const phases = [
    { label: 'Dag 1–5', count: 68, pct: 68, color: '#4ADE80' },
    { label: 'Dag 6–15', count: 22, pct: 22, color: '#D4AF37' },
    { label: 'Dag 16–30', count: 7, pct: 7, color: '#FBBF24' },
    { label: 'Ferdig (30d)', count: 3, pct: 3, color: '#8B5CF6' },
  ];

  const total = phases.reduce((s, p) => s + p.count, 0);

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <h3
        className="text-sm font-semibold mb-4 tracking-wide"
        style={{ color: 'rgba(255,255,255,0.6)' }}
      >
        REISEFASEMONITOR
      </h3>

      {/* Progress bar */}
      <div className="flex rounded-full overflow-hidden h-3 mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {phases.map((phase, i) => (
          <div
            key={phase.label}
            className="h-full transition-all duration-700"
            style={{ width: `${phase.pct}%`, background: phase.color }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {phases.map((phase) => (
          <div key={phase.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: phase.color }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {phase.label}
              </span>
            </div>
            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {phase.count} ({Math.round((phase.count / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── StatCard — glass-panel kort ─── */

function StatCard({
  title,
  value,
  change,
  icon,
  color = 'gold',
  href,
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color?: 'gold' | 'blue' | 'green' | 'red';
  href?: string;
}) {
  const colorMap = {
    gold: { bg: 'rgba(212,175,55,0.1)', border: 'rgba(212,175,55,0.2)', iconBg: 'rgba(212,175,55,0.15)' },
    blue: { bg: 'rgba(80,120,255,0.1)', border: 'rgba(80,120,255,0.2)', iconBg: 'rgba(80,120,255,0.15)' },
    green: { bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)', iconBg: 'rgba(74,222,128,0.15)' },
    red: { bg: 'rgba(255,77,77,0.1)', border: 'rgba(255,77,77,0.2)', iconBg: 'rgba(255,77,77,0.15)' },
  };

  const colors = colorMap[color];

  return (
    <div className="relative">
      {href && (
        <Link href={href} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
      )}
      <div
        className={`rounded-2xl p-5 transition-all duration-300 group relative z-10 ${href ? 'cursor-pointer' : ''}`}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(8px)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          e.currentTarget.style.borderColor = colors.border;
          e.currentTarget.style.boxShadow = `0 0 24px ${colors.bg}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: colors.iconBg }}
          >
            {icon}
          </div>
          {change && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                background: change.startsWith('+') ? 'rgba(74,222,128,0.1)' : 'rgba(255,77,77,0.1)',
                color: change.startsWith('+') ? '#4ADE80' : '#FF4D4D',
              }}
            >
              {change}
            </span>
          )}
        </div>
        <div className="text-2xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.95)' }}>
          {value}
        </div>
        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {title}
        </div>
      </div>
    </div>
  );
}

/* ─── ActivityItem — siste aktivitet ─── */

function ActivityItem({ icon, text, time }: { icon: string; text: string; time: string }) {
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(212,175,55,0.1)' }}
      >
        <span className="text-sm">{icon}</span>
      </div>
      <p className="text-sm flex-1 truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>
        {text}
      </p>
      <span className="text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {time}
      </span>
    </div>
  );
}

/* ─── SystemStatus — system health heat map ─── */

function SystemStatus({ alerts }: { alerts?: string[] }) {
  const [services] = useState([
    { name: 'Database', status: 'ok' as const, latency: '—' },
    { name: 'Cron-jour', status: 'ok' as const, latency: '—' },
    { name: 'Matching', status: 'ok' as const, latency: '—' },
    { name: 'Journey', status: 'ok' as const, latency: '—' },
    { name: 'Auth', status: 'ok' as const, latency: '8ms' },
    { name: 'Chat', status: 'warning' as const, latency: '120ms' },
    { name: 'Bilete-opplasting', status: 'ok' as const, latency: '45ms' },
  ]);

  const statusConfig = {
    ok: { color: '#4ADE80', label: 'OK', dotShadow: '0 0 6px rgba(74,222,128,0.4)' },
    warning: { color: '#FBBF24', label: 'Årning', dotShadow: '0 0 6px rgba(251,191,36,0.4)' },
    error: { color: '#FF4D4D', label: 'Feil', dotShadow: '0 0 6px rgba(255,77,77,0.4)' },
  };

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-sm font-semibold tracking-wide"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          SYSTEMSTATUS
        </h3>
        {alerts && alerts.length > 0 && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(251,191,36,0.1)', color: '#FBBF24' }}
          >
            {alerts.length}⚠
          </span>
        )}
      </div>
      <div className="space-y-3">
        {services.map((service) => {
          const config = statusConfig[service.status];
          return (
            <div key={service.name} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {service.name}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {service.latency}
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: config.color, boxShadow: config.dotShadow }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: config.color }}
                  >
                    {config.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* API-latens + Feil */}
      <div className="mt-4 pt-3 flex items-center gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          API-latens: <strong style={{ color: 'rgba(255,255,255,0.6)' }}>42ms</strong>
        </span>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Feil 24t: <strong style={{ color: '#FBBF24' }}>3</strong>
        </span>
      </div>
    </div>
  );
}

/* ─── AlertBadge — admin-varsel indikator ✨ */

function AlertBadge({ name, count }: { name: string; count: number }) {
  if (count === 0) return null;
  return (
    <span
      className="inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full text-[10px] font-bold ml-1"
      style={{ background: '#FF4D4D', color: 'white' }}
    >
      {count}
    </span>
  );
}

/* ─── Hovudkomponent — Dashboard Page ⭐ */

export default function AdminDashboardPage() {
  const [alerts] = useState({ chat: 1, cron: 0, matching: 0, journey: 0 });

  /* Navigasjonsknappar — 2 rader × 4 kolonnar */
  const navButtons = [
    { label: '👤 Alle brukarar', href: '/admin/users' },
    { label: '💞 Aktive matcher', href: '/admin/matches' },
    { label: '🕓 Pågåande reiser', href: '/admin/journeys' },
    { label: '💬 Chat (metadata)', href: '/admin/chat' },
    { label: '🛡️ Moderasjon', href: '/admin/moderation' },
    { label: '📊 Analytics', href: '/admin/analytics' },
    { label: '🚦 Systemstatus', href: '/admin/system' },
    { label: '🔧 Verktøy', href: '/admin/tools' },
  ];

  return (
    <div className="space-y-8">
      {/* ─── Admin Header ─── */}
      <AdminHeader />

      {/* ─── Tittel-rad ─── */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: 'rgba(255,255,255,0.95)' }}
            >
              Kommandopanel
            </h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Oversikt over ToSom-plattforma
            </p>
          </div>
          <div className="flex items-center gap-3 pt-1">
            {/* System status indikator */}
            {(alerts.chat > 0 || alerts.cron > 0 || alerts.matching > 0 || alerts.journey > 0) && (
              <div className="flex items-center gap-2">
                {alerts.chat > 0 && <AlertBadge name="Chat" count={alerts.chat} />}
                {alerts.cron > 0 && <AlertBadge name="Cron" count={alerts.cron} />}
              </div>
            )}
            <span
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{
                background: 'rgba(74,222,128,0.1)',
                color: '#4ADE80',
                border: '1px solid rgba(74,222,128,0.2)',
              }}
            >
              ● System aktiv
            </span>
          </div>
        </div>

        {/* Navigasjonsknappar — 2 rader × 4 kolonnar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {navButtons.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-center"
              style={{
                background: 'rgba(212,175,55,0.08)',
                color: '#D4AF37',
                border: '1px solid rgba(212,175,55,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212,175,55,0.15)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(212,175,55,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(212,175,55,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ─── Stat-kort — 2×2 grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Totale brukarar"
          value="12,847"
          change="+12%"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" fill="#D4AF37" />
            </svg>
          }
          color="gold"
          href="/admin/users"
        />
        <StatCard
          title="Aktive matcher"
          value="540"
          change="+5%"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#D4AF37" />
            </svg>
          }
          color="gold"
          href="/admin/matches"
        />
        <StatCard
          title="Pågåande reiser"
          value="310"
          change="+8%"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="#D4AF37" />
            </svg>
          }
          color="blue"
          href="/admin/journeys"
        />
        <StatCard
          title="Dagens registreringar"
          value="87"
          change="+18%"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#D4AF37" />
            </svg>
          }
          color="green"
        />
      </div>

      {/* ─── SystemStatus + JourneyPhase — side-om-side (2 kolonnar) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemStatus alerts={Object.entries(alerts).filter(([_, v]) => v > 0).map(([k]) => k)} />
        <JourneyPhaseMonitor />
      </div>

      {/* ─── Siste Aktivitet — full breidd ─── */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <h3
          className="text-sm font-semibold mb-4 tracking-wide"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          SISTE AKTIVITET
        </h3>
        <div>
          <ActivityItem icon="✨" text="Brukar #12470 fullførte onboarding" time="2 min sidan" />
          <ActivityItem icon="💛" text="Ny match: Sara ↔ Emil" time="15 min sidan" />
          <ActivityItem icon="🚀" text="Reise starta for Ane & Magnus — dag 1/30" time="32 min sidan" />
          <ActivityItem icon="💬" text="Første melding sendt — Ane & Magnus" time="1 time sidan" />
          <ActivityItem icon="📝" text="Profil oppdatert — #1192" time="2 timar sidan" />
        </div>
      </div>
    </div>
  );
}