'use client';

/**
 * ToSom — Admin Dashboard (Kommandopanel) 🟡⭐
 * 
 * Stat-kort med glass-panel, system health-check, og siste aktivitet.
 * Design: ToSom Blue + Nordic Gold + Glassmorphism.
 */

import Link from 'next/link';

/* ─── StatCard — glass-panel kort ─── */

function StatCard({
  title,
  value,
  change,
  icon,
  color = 'gold',
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color?: 'gold' | 'blue' | 'green' | 'red';
}) {
  const colorMap = {
    gold: { bg: 'rgba(212,175,55,0.1)', border: 'rgba(212,175,55,0.2)', iconBg: 'rgba(212,175,55,0.15)' },
    blue: { bg: 'rgba(80,120,255,0.1)', border: 'rgba(80,120,255,0.2)', iconBg: 'rgba(80,120,255,0.15)' },
    green: { bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)', iconBg: 'rgba(74,222,128,0.15)' },
    red: { bg: 'rgba(255,77,77,0.1)', border: 'rgba(255,77,77,0.2)', iconBg: 'rgba(255,77,77,0.15)' },
  };

  const colors = colorMap[color];

  return (
    <Link href="#" className="block">
      <div
        className="rounded-2xl p-5 transition-all duration-300 group"
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
            className="w-10 h-10 rounded-xl flex items-center justify-center"
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
    </Link>
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
      <p className="text-sm flex-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
        {text}
      </p>
      <span className="text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {time}
      </span>
    </div>
  );
}

/* ─── SystemStatus — system health ─── */

function SystemStatus() {
  const services = [
    { name: 'Database', status: 'ok' as const },
    { name: 'Matching-cron', status: 'ok' as const },
    { name: 'Auth', status: 'ok' as const },
    { name: 'Chat', status: 'warning' as const },
    { name: 'Bilete-opplasting', status: 'ok' as const },
  ];

  const statusConfig = {
    ok: { color: '#4ADE80', label: 'OK', dotShadow: '0 0 6px rgba(74,222,128,0.4)' },
    warning: { color: '#FBBF24', label: 'Warning', dotShadow: '0 0 6px rgba(251,191,36,0.4)' },
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
      <h3
        className="text-sm font-semibold mb-4 tracking-wide"
        style={{ color: 'rgba(255,255,255,0.6)' }}
      >
        SYSTEMSTATUS
      </h3>
      <div className="space-y-3">
        {services.map((service) => {
          const config = statusConfig[service.status];
          return (
            <div key={service.name} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {service.name}
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
          );
        })}
      </div>
    </div>
  );
}

/* ─── Hovud-komponent — Dashboard Page ─── */

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
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

      {/* Stat-kort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Totalt brukarar"
          value="1,247"
          change="+12%"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" fill="#D4AF37" />
            </svg>
          }
          color="gold"
        />
        <StatCard
          title="Aktive matcher"
          value="89"
          change="+5%"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#D4AF37" />
            </svg>
          }
          color="gold"
        />
        <StatCard
          title="Pågåande reiser"
          value="156"
          change="+8%"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="#D4AF37" />
            </svg>
          }
          color="blue"
        />
        <StatCard
          title="Daglege signup"
          value="23"
          change="+18%"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#D4AF37" />
            </svg>
          }
          color="green"
        />
      </div>

      {/* Nedre seksjon */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System health */}
        <SystemStatus />

        {/* Siste aktivitet */}
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
            <ActivityItem
              icon="✨"
              text="Brukar #1247 fullførte onboarding"
              time="2 min sidan"
            />
            <ActivityItem
              icon="💛"
              text="Ny match: Ane ↔ Magnus"
              time="15 min sidan"
            />
            <ActivityItem
              icon="📝"
              text="Brukar #1246 oppdaterte profil"
              time="32 min sidan"
            />
            <ActivityItem
              icon="🚀"
              text="Reise starta for Ane & Magnus (dag 1/30)"
              time="45 min sidan"
            />
            <ActivityItem
              icon="💬"
              text="Første melding sendt mellom Ane & Magnus"
              time="1 time sidan"
            />
          </div>
        </div>
      </div>

      {/* Snarvnavigasjon */}
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
          SNARVNAVGIGASJON
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Alle brukarar', href: '/admin/users' },
            { label: 'Aktive matcher', href: '/admin/matching' },
            { label: 'Match-historikk', href: '/admin/matches' },
            { label: 'Profiler', href: '/admin/profiles' },
            { label: 'System status', href: '/admin/system' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300"
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
    </div>
  );
}