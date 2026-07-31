'use client';

/**
 * ToSom — Admin Layout (Premium Nordic Gold 2026) 🟡⭐
 * 
 * Forenkla admin-layout med sidebar og header.
 * Seksjonar: Oversikt, Brukar, Matching, System.
 * Design: ToSom Blue + Nordic Gold + Glassmorphism.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

/* ─── Navigasjon — forenkla til MVP ─── */

const navSections = [
  {
    title: 'OVERSIKT',
    items: [
      { label: 'Dashboard', href: '/admin' },
    ],
  },
  {
    title: 'BRUKARAR',
    items: [
      { label: 'Alle brukarar', href: '/admin/users' },
      { label: 'Profiler', href: '/admin/profiles' },
    ],
  },
  {
    title: 'MATCHING',
    items: [
      { label: 'Aktive matcher', href: '/admin/matching' },
      { label: 'Match-historikk', href: '/admin/matches' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'System status', href: '/admin/system' },
      { label: 'Innstillinger', href: '/admin/settings' },
    ],
  },
];

/* ─── AdminHeader — øvste bånd ─── */

function AdminHeader() {
  return (
    <header
      className="h-14 border-b flex items-center px-6 flex-shrink-0"
      style={{
        background: 'rgba(255,255,255,0.02)',
        borderColor: 'rgba(212,175,55,0.1)',
      }}
    >
      <div className="flex items-center gap-2 ml-auto">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: '#4ADE80', boxShadow: '0 0 8px rgba(74,222,128,0.4)' }}
        />
        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
          System aktiv
        </span>
      </div>
    </header>
  );
}

/* ─── AdminLogoutButton ─── */

function AdminLogoutButton() {
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      window.location.href = '/admin/login';
    } catch {
      window.location.href = '/admin/login';
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loggingOut}
      className="w-full px-3 py-2.5 rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-1.5"
      style={{
        background: loggingOut ? 'rgba(255,77,77,0.08)' : 'transparent',
        color: loggingOut ? 'rgba(255,77,77,0.6)' : 'rgba(255,77,77,0.35)',
        border: `1px solid ${loggingOut ? 'rgba(255,77,77,0.15)' : 'rgba(255,255,255,0.06)'}`,
        cursor: loggingOut ? 'not-allowed' : 'pointer',
      }}
    >
      <span>→</span> {loggingOut ? 'Loggar ut...' : 'Logg ut'}
    </button>
  );
}

/* ─── Hovud-layout ─── */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0B1520, #121E2E, #0B1520)' }}
    >
      {/* Ambient glow — heile sida */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse_80%_60%_at_50%_30%, rgba(80,120,255,0.03), transparent 70%)',
        }}
      />

      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col flex-shrink-0 relative z-10"
        style={{
          background: 'rgba(10,15,24,0.95)',
          borderRight: '1px solid rgba(212,175,55,0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo */}
        <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <Link href="/admin" className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))',
                border: '1px solid rgba(212,175,55,0.25)',
                boxShadow: '0 0 24px rgba(212,175,55,0.1)',
              }}
            >
              <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>T</span>
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>ToSom</div>
              <div className="text-[9px] tracking-widest uppercase" style={{ color: 'rgba(212,175,55,0.5)' }}>
                Admin
              </div>
            </div>
          </Link>
        </div>

        {/* Navigasjon */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <div
                className="text-[9px] font-semibold tracking-[0.2em] uppercase px-3 mb-2"
                style={{ color: 'rgba(255,255,255,0.2)' }}
              >
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-3 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                        isActive
                          ? 'gold-highlight'
                          : ''
                      }`}
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))'
                          : 'transparent',
                        color: isActive ? '#D4AF37' : 'rgba(255,255,255,0.5)',
                        border: isActive
                          ? '1px solid rgba(212,175,55,0.2)'
                          : '1px solid transparent',
                        boxShadow: isActive
                          ? '0 0 16px rgba(212,175,55,0.06)'
                          : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                          e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Link
            href="/"
            className="block px-3 py-2.5 rounded-xl text-xs transition-all duration-200 text-center"
            style={{
              color: 'rgba(255,255,255,0.3)',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.3)';
            }}
          >
            ← Tilbake til ToSom
          </Link>

          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* CSS for active navigation highlight */}
      <style>{`
        .gold-highlight {
          animation: goldGlow 0.3s ease-out;
        }
        @keyframes goldGlow {
          0% { box-shadow: 0 0 0px rgba(212,175,55,0); }
          100% { box-shadow: 0 0 16px rgba(212,175,55,0.06); }
        }
      `}</style>
    </div>
  );
}