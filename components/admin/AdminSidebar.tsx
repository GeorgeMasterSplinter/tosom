'use client';

/**
 * Tosom — Admin Sidebar
 *
 * Fire grupper: Oversikt · Mennesker · System · Verktøy.
 * Alle admin-ruter er tilgjengelige herfra.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  OverviewIcon,
  UsersIcon,
  MatchIcon,
  JourneyIcon,
  ChatIcon,
  ReportIcon,
  InviteIcon,
  SystemIcon,
  AnalyticsIcon,
  LogIcon,
  ResonanceIcon,
  ToolsIcon,
  ContentIcon,
  LockIcon,
} from './icons';

interface NavItem {
  label: string;
  href: string;
  Icon: (props: { className?: string; size?: number }) => JSX.Element;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Oversikt',
    items: [
      { label: 'Kommandopanel', href: '/admin/dashboard', Icon: OverviewIcon },
      { label: 'Analyse', href: '/admin/analytics', Icon: AnalyticsIcon },
    ],
  },
  {
    title: 'Mennesker',
    items: [
      { label: 'Brukere', href: '/admin/users', Icon: UsersIcon },
      { label: 'Matcher', href: '/admin/matches', Icon: MatchIcon },
      { label: 'Reiser', href: '/admin/journeys', Icon: JourneyIcon },
      { label: 'Samtaler', href: '/admin/conversations', Icon: ChatIcon },
      { label: 'Rapporter', href: '/admin/reports', Icon: ReportIcon },
      { label: 'Invitasjoner', href: '/admin/invites', Icon: InviteIcon },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Status', href: '/admin/system/status', Icon: SystemIcon },
      { label: 'Systemlogg', href: '/admin/logs', Icon: LogIcon },
      { label: 'Resonans', href: '/admin/resonance', Icon: ResonanceIcon },
    ],
  },
  {
    title: 'Verktøy',
    items: [
      { label: 'Reiseinnhold', href: '/admin/journey-content', Icon: ContentIcon },
      { label: 'Verktøy', href: '/admin/tools', Icon: ToolsIcon },
    ],
  },
];

function isActiveHref(pathname: string, href: string): boolean {
  if (href === '/admin/dashboard') return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
}

export function AdminSidebar() {
  const pathname = usePathname() || '';

  return (
    <div
      className="fixed top-0 left-0 h-full flex flex-col border-r"
      style={{ width: '240px', background: '#0A1220', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      {/* Tittel */}
      <div
        className="flex items-center gap-2.5 px-6"
        style={{ height: '64px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <LockIcon size={16} className="text-[#D4AF37]" />
        <span className="text-sm font-semibold tracking-wide text-[#D4AF37]">
          TOSOM ADMIN
        </span>
      </div>

      {/* Navigasjon */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-5">
            <div
              className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: 'rgba(255,255,255,0.28)' }}
            >
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map(({ label, href, Icon }) => {
                const active = isActiveHref(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    style={{
                      background: active ? 'rgba(212,175,55,0.10)' : 'transparent',
                      color: active ? '#D4AF37' : 'rgba(255,255,255,0.55)',
                      borderLeft: active ? '2px solid #D4AF37' : '2px solid transparent',
                    }}
                  >
                    <Icon size={17} className="flex-shrink-0" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bunn */}
      <div
        className="py-3 px-6 text-[11px]"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)' }}
      >
        Tosom Admin v1.0
      </div>
    </div>
  );
}

export default AdminSidebar;