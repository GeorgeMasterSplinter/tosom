'use client';

/**
 * ToSom — Admin Sidebar 📋
 * Felles navigasjon for alle admin-sider.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Oversikt', href: '/admin/dashboard', icon: '📊' },
  { label: 'Brukere', href: '/admin/users', icon: '👥' },
  { label: 'Matcher', href: '/admin/matches', icon: '💝' },
  { label: 'Reiser', href: '/admin/journeys', icon: '🕓' },
  { label: 'Chat', href: '/admin/conversations', icon: '🗣️' },
  { label: 'System', href: '/admin/system/status', icon: '⚙️' },
  { label: 'Analyse', href: '/admin/analytics', icon: '📈' },
  { label: 'Verktøy', href: '/admin/tools', icon: '🔧' },
];

/* ═══════════════════════════════════════
   SIDEBAR-KOMPONENT
   ═══════════════════════════════════════ */

export function AdminSidebar() {
  const pathname = usePathname() || '';

  return (
    <div
      className="fixed top-0 left-0 h-full flex flex-col border-r"
      style={{
        width: '240px',
        background: '#0A1220',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      {/* HEADER */}
      <div
        className="flex items-center gap-3 px-6"
        style={{ height: '64px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-sm font-bold tracking-wide" style={{ color: '#D4AF37' }}>
          🔒 TOSOM ADMIN
        </span>
      </div>

      {/* NAV-LINKS */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: isActive ? 'rgba(212,175,55,0.1)' : 'transparent',
                color: isActive ? '#D4AF37' : 'rgba(255,255,255,0.5)',
                borderLeft: isActive ? '2px solid #D4AF37' : '2px solid transparent',
              }}
            >
              <span className="text-base flex-shrink-0 w-6 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div
        className="py-4 px-6 text-xs"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)' }}
      >
        ToSom Admin v1.0
      </div>
    </div>
  );
}

export default AdminSidebar;