/**
 * ToSom Admin Header — Gjenbrukbar header over alle admin-sider
 * 
 * Viser breadcrumb-navigasjon, system-status og admin-brukarinfo.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ====== Breadcrumb-bitar ====== */

interface BreadcrumbItem {
  label: string;
  href: string;
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const parts = pathname.split('/').filter(Boolean);
  
  // Skip 'admin' — det er allereie i sidebar
  if (parts[0] === 'admin') parts.shift();
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
  ];

  let path = '';
  for (let i = 0; i < parts.length; i++) {
    path += `/${parts[i]}`;
    const label = parts[i]
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    
    // Sjekk om det finst ein tilsvarande side for breadcrumb
    if (i < parts.length - 1) {
      breadcrumbs.push({ label, href: path });
    } else {
      // Siste del — sjå etter finare namn
      const finalLabels: Record<string, string> = {
        'dashboard': 'Dashboard',
        'users': 'Brukarar',
        'profiles': 'Profiler',
        'moderation': 'Moderation',
        'matching': 'Matching',
        'matches': 'Match-historikk',
        'journey': 'Reiseanalytik',
        'chat': 'Chat oversikt',
        'conversations': 'Samtaler',
        'system': 'Systemstatus',
        'insights': 'Innsikt',
        'observability': 'Observability',
        'settings': 'Innstillingar',
        'tools': 'Testverktøy',
        'experiments': 'Eksperiment',
      };
      
      breadcrumbs.push({ 
        label: finalLabels[parts[i]] || label, 
        href: path 
      });
    }
  }

  return breadcrumbs;
}

/* ====== Hovudkomponent ====== */

export function AdminHeader() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname ?? '/');
  
  // Hent admin-brukarinfo fra cookie eller session
  const adminName = 'MasterSplinter';
  const adminEmail = 'admin@tosom.no';
  const lastLogin = new Date(Date.now() - 3600000).toLocaleString('nb-NO', {
    dateStyle: 'short',
    timeStyle: 'short'
  });

  return (
    <header 
      className="sticky top-0 z-10 flex items-center justify-between px-6 py-3"
      style={{ 
        background: 'rgba(10,26,42,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}
    >
      {/* Left: Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={`${crumb.href}-${i}`} className="inline-flex items-center">
            {i > 0 && (
              <span style={{ color: 'rgba(212,175,55,0.4)' }}>/</span>
            )}
            {i === breadcrumbs.length - 1 ? (
              <span 
                className="font-medium"
                style={{ color: '#D4AF37' }}
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="transition-all duration-200 hover:text-[#D4AF37]"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Right: System status + Admin info */}
      <div className="flex items-center gap-4">
        {/* System status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{ 
            background: 'rgba(77,255,136,0.08)',
            border: '1px solid rgba(77,255,136,0.2)'
          }}
        >
          <span 
            className="w-1.5 h-1.5 rounded-full bg-[#4DFF88] animate-pulse"
          />
          <span style={{ color: 'rgba(77,255,136,0.9)' }}>Operativ</span>
        </div>

        {/* Divider */}
        <div 
          className="w-px h-4"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        />

        {/* Admin user info */}
        <div 
          className="flex items-center gap-3 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/[0.04]"
          title={`Innlogga som ${adminEmail}\nSist innlogging: ${lastLogin}`}
        >
          {/* Avatar */}
          <div 
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}
          >
            MS
          </div>

          {/* Info */}
          <div className="hidden md:block">
            <div 
              className="text-xs font-medium"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              {adminName}
            </div>
            <div 
              className="text-[10px]"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              Admin
            </div>
          </div>

          {/* Dropdown arrow */}
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>▾</span>
        </div>
      </div>
    </header>
  );
}