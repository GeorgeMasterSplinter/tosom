/**
 * ToSom ToSomSidebar — System component
 * 
 * Collapsible sidebar for dashboard/admin with icons, labels, active state.
 */

'use client';

import { FC, useState } from 'react';
import { spacing, colors, shadows, motion } from '@/config/design-tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface ToSomSidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  logo?: React.ReactNode;
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */
const sidebarWidth = { expanded: '256px', collapsed: '72px' };

const baseStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  width: sidebarWidth.expanded,
  background: 'rgba(13,17,23,0.95)',
  backdropFilter: 'blur(20px)',
  borderRight: '1px solid rgba(255,255,255,0.06)',
  padding: `${spacing['lg']} ${spacing['sm']}`,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing['sm'],
  transition: `width ${motion.durations.normal} ${motion.easings.smooth}`,
  zIndex: 40,
  overflow: 'hidden',
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomSidebar: FC<ToSomSidebarProps> = ({ items, collapsed = false, logo }) => {
  const [active, setActive] = useState(items[0]?.href || '');

  const width = collapsed ? sidebarWidth.collapsed : sidebarWidth.expanded;

  return (
    <aside
      className="tosom-sidebar hidden md:flex"
      style={{ ...baseStyles, width }}
    >
      {/* Logo */}
      {logo && (
        <div className="mb-4 px-2" style={{
          opacity: collapsed ? 0 : 1,
          height: collapsed ? '0' : undefined,
          overflow: 'hidden',
          transition: `all ${motion.durations.fast} ${motion.easings.smooth}`,
        }}>
          {logo}
        </div>
      )}

      {/* Toggle */}
      <button
        className="w-10 h-10 flex items-center justify-center rounded-lg mx-auto mb-2"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onClick={() => {}}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {collapsed ? (
            <path d="M13 5L18 12L13 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          ) : (
            <path d="M11 5L6 12L11 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          )}
        </svg>
      </button>

      {/* Items */}
      <nav className="flex-1 space-y-1">
        {items.map((item, index) => {
          const isActive = active === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg transition-all duration-200"
              style={{
                padding: `${spacing['sm']} ${spacing['md']}`,
                color: isActive ? colors.gold : 'rgba(255,255,255,0.7)',
                background: isActive ? 'rgba(212,175,55,0.12)' : 'transparent',
                borderLeft: isActive ? `2px solid ${colors.gold}` : '2px solid transparent',
                opacity: collapsed ? 0 : 1,
                width: collapsed ? '0' : undefined,
                overflow: 'hidden',
                transition: `all ${motion.durations.fast} ${motion.easings.smooth}`,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }
              }}
              onClick={() => setActive(item.href)}
            >
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
};

export default ToSomSidebar;