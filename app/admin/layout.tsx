'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navSections = [
  {
    title: 'OVERSIKT',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard' },
    ],
  },
  {
    title: 'BRUKARAR',
    items: [
      { label: 'Alle brukarar', href: '/admin/users' },
      { label: 'Profiler', href: '/admin/profiles' },
      { label: 'Moderation', href: '/admin/moderation' },
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
    title: 'REISE & SAMTALE',
    items: [
      { label: 'Journey analytics', href: '/admin/journey' },
      { label: 'Chat oversikt', href: '/admin/chat' },
      { label: 'Samtaler', href: '/admin/conversations' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'System status', href: '/admin/system' },
      { label: 'Innsikt', href: '/admin/insights' },
      { label: 'Observability', href: '/admin/observability' },
      { label: 'Innstillinger', href: '/admin/settings' },
    ],
  },
  {
    title: 'VERKTY',
    items: [
      { label: 'Test tools', href: '/admin/tools' },
      { label: 'Eksperiment', href: '/admin/experiments' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#080B10] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0F18] border-r border-white/5 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.25)' }}>
              <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>T</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white/90">ToSom Admin</div>
              <div className="text-[10px] text-white/40 tracking-wider">MOTHERBOARD</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25 px-3 mb-2">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
                        isActive
                          ? 'bg-[rgba(212,175,55,0.12)] text-[#D4AF37]'
                          : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                      }`}
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
        <div className="p-3 border-t border-white/5">
          <Link
            href="/"
            className="block px-3 py-2 rounded-lg text-xs text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all duration-200"
          >
            ← Tilbake til ToSom
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}