/**
 * Sidebar — Desktop collapsible sidebar navigation
 *
 * Features:
 * - Glassmorphism panel
 * - Collapsible sections
 * - Active state with gold indicator
 * - Responsive: hidden on mobile (use MobileNavbar instead)
 *
 * Usage:
 *   <Sidebar
 *     sections={[
 *       {
 *         label: 'Main',
 *         items: [
 *           { href: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
 *         ]
 *       }
 *     ]}
 *   />
 */

import React from 'react';

export interface SidebarItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  badge?: number | string;
}

export interface SidebarSection {
  label?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  /** Navigation sections */
  sections: SidebarSection[];
  /** Whether the sidebar is collapsed (icons only) */
  collapsed?: boolean;
  /** Logo at top */
  logo?: React.ReactNode;
  /** User profile at bottom */
  user?: {
    name: string;
    avatar?: React.ReactNode;
    email?: string;
  };
  /** Custom class */
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  sections,
  collapsed = false,
  logo,
  user,
  className = '',
}) => {
  return (
    <aside
      className={`
        flex h-full flex-col
        bg-ts-glass/60 backdrop-blur-xl
        border-r border-white/8
        ${collapsed ? 'w-16' : 'w-64'}
        ${className}
      `}
    >
      {/* ── Logo ── */}
      {logo && (
        <div className={`flex items-center h-16 px-4 border-b border-white/5 ${collapsed ? 'justify-center' : ''}`}>
          {logo}
        </div>
      )}

      {/* ── Navigation Sections ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {sections.map((section, si) => (
          <div key={si} className="mb-6">
            {/* Section label */}
            {section.label && !collapsed && (
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-ts-text-subtle">
                {section.label}
              </p>
            )}

            {/* Items */}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item, ii) => (
                <a
                  key={ii}
                  href={item.href}
                  className={`
                    group
                    flex items-center
                    ${collapsed ? 'justify-center' : 'gap-3'}
                    px-3 py-2.5
                    text-sm
                    font-medium
                    rounded-ts-md
                    transition-all
                    ${
                      item.active
                        ? 'text-ts-gold bg-ts-gold/10'
                        : 'text-ts-text-secondary hover:text-ts-text hover:bg-ts-glass'
                    }
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  {/* Active indicator (desktop) */}
                  {item.active && !collapsed && (
                    <span className="absolute left-0 w-[3px] h-5 bg-ts-gold rounded-r-full" />
                  )}

                  {/* Icon */}
                  {item.icon && (
                    <span
                      className={`
                        w-5 h-5 flex-shrink-0
                        text-ts-text-muted
                        group-hover:text-ts-gold
                        transition-colors
                        ${item.active ? 'text-ts-gold' : ''}
                      `}
                    >
                      {item.icon}
                    </span>
                  )}

                  {/* Label */}
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}

                  {/* Badge */}
                  {!collapsed && item.badge && (
                    <span className="px-1.5 py-0.5 text-[11px] font-semibold rounded-full bg-ts-gold/20 text-ts-gold">
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── User Profile ── */}
      {user && (
        <div className="px-3 py-4 border-t border-white/5">
          <div
            className={`
              flex items-center
              ${collapsed ? 'justify-center' : 'gap-3'}
              p-2 rounded-ts-lg
              hover:bg-ts-glass
              transition-colors
            `}
          >
            {user.avatar || (
              <div className="w-8 h-8 rounded-full bg-ts-gold/20 flex items-center justify-center text-ts-gold text-sm font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ts-text truncate">{user.name}</p>
                {user.email && (
                  <p className="text-xs text-ts-text-subtle truncate">{user.email}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

Sidebar.displayName = 'Sidebar';
export default Sidebar;