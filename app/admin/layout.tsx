'use client';

/**
 * ToSom — Admin Layout (innlogga sider)
 * 
 * Sidebar med navigasjon + header med system-status og logout.
 */

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/* ─── Sidebar-nav-element ─── */

function NavItem({ href, icon, label, active }: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
        active
          ? 'text-[#D4AF37]'
          : 'text-white/50 hover:text-white/80'
      }`}
      style={active
        ? { background: 'rgba(212,175,55,0.1)' }
        : {}
      }
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </Link>
  );
}

/* ─── Admin Header ─── */

function AdminHeader() {
  const router = useRouter();

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b"
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

/* ─── Ambient Background (felles) ─── */

function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Øvre venstre glow */}
      <div
        className="absolute -top-32 -left-32"
        style={{
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
        }}
      />
      {/* Nedre høgre glow */}
      <div
        className="absolute -bottom-32 -right-32"
        style={{
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10,26,42,0.1) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}

/* ─── Main Layout ─── */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen relative flex"
      style={{ background: '#0A1A2A' }}
    >
      <AmbientBackground />

      {/* Sidebar */}
      <aside
        className="w-64 border-r flex flex-col flex-shrink-0 relative z-10"
        style={{
          borderColor: 'rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.3)',
        }}
      >
        {/* Logo */}
        <div className="px-6 pt-8 pb-4">
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ color: '#D4AF37' }}
          >
            ToSom
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Admin Panel
          </p>
        </div>

        {/* Navigasjon */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <NavItem href="/admin" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="#D4AF37"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>} label="Dashboard" active />
          <NavItem href="/admin/users" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>} label="Brukarar" />
          <NavItem href="/admin/matching" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"/></svg>} label="Matching" />
          <NavItem href="/admin/chat" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>} label="Chat" />
          <NavItem href="/admin/journey" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>} label="Reiser" />
          <NavItem href="/admin/moderation" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>} label="Moderasjon" />
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            ToSom Admin v1.0
          </p>
        </div>
      </aside>

      {/* Hovud-innhald */}
      <div className="flex-1 flex flex-col relative z-10">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto" style={{ background: 'rgba(255,255,255,0.02)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}