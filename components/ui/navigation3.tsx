/**
 * ToSom UI 3.0 — Navigation System 3.0
 *
 * Multi-platform navigation with:
 * - Web: AppNavbar + Sidebar + CommandPalette
 * - Mobile: BottomNav + MobileNavbar
 * - Desktop: Sidebar + CommandPalette + DesktopNav
 *
 * Usage:
 *   import { NavSystem3 } from '@/components/ui/navigation3'
 */

import React from 'react';
import { platform } from '@/components/ui/tokens';

/* ── Navigation Item Types ── */
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
  children?: NavItem[];
}

/* ── Web AppNavbar (top glass bar) ── */
export const AppNavbar: React.FC<{ items: NavItem[]; active: string; onNavigate: (r: string) => void }> = ({ items, active, onNavigate }) => (
  <nav className="sticky top-0 z-50 bg-white/[0.04] border-b border-white/8 backdrop-blur-xl">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-[#D4AF37] text-lg font-semibold">◆ ToSom</span>
      </div>
      <div className="flex items-center gap-1">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.route)}
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              active === item.route
                ? 'text-[#D4AF37] bg-[#D4AF37]/10'
                : 'text-white/65 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {item.label}
            {item.badge ? (
              <span className="absolute -top-1 -right-1 bg-[#FF4D4D] text-white text-[10px] font-semibold rounded-full px-1.5 min-w-[18px] text-center">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  </nav>
);

/* ── Sidebar (collapsible left panel) ── */
export const Sidebar: React.FC<{ items: NavItem[]; active: string; onNavigate: (r: string) => void; collapsed?: boolean }> = ({
  items, active, onNavigate, collapsed = false,
}) => (
  <aside className={`${collapsed ? 'w-16' : 'w-64'} h-screen sticky top-0 bg-white/[0.02] border-r border-white/6 backdrop-blur-xl flex flex-col transition-all duration-300`}>
    <div className="p-4 border-b border-white/6">
      {!collapsed && <span className="text-[#D4AF37] text-lg font-semibold">◆ ToSom</span>}
      {collapsed && <span className="text-[#D4AF37] text-center block">◆</span>}
    </div>
    <nav className="flex-1 p-2 space-y-1">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.route)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            active === item.route
              ? 'text-[#D4AF37] bg-[#D4AF37]/10'
              : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <span className="text-base">{item.icon}</span>
          {!collapsed && <span>{item.label}</span>}
        </button>
      ))}
    </nav>
  </aside>
);

/* ── Command Palette (desktop/web search) ── */
export const CommandPalette: React.FC<{ open: boolean; onClose: () => void; onSearch?: (q: string) => void }> = ({ open, onClose, onSearch }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white/[0.04] border border-white/8 rounded-2xl backdrop-blur-xl shadow-xl overflow-hidden">
        <input
          placeholder="Søk i ToSom..."
          className="w-full bg-transparent px-6 py-4 text-white text-lg outline-none placeholder:text-white/40"
          autoFocus
          onChange={e => onSearch?.(e.target.value)}
        />
        <div className="border-t border-white/6 px-6 py-3">
          <span className="text-xs text-white/40">⌘K for å åpne · ESC for å lukke</span>
        </div>
      </div>
    </div>
  );
};

/* ── Mobile BottomNav ── */
export const MobileBottomNav: React.FC<{ items: NavItem[]; active: string; onNavigate: (r: string) => void }> = ({ items, active, onNavigate }) => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0F1F]/95 border-t border-white/8 backdrop-blur-xl">
    <div className="flex items-center justify-around h-16">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.route)}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
            active === item.route ? 'text-[#D4AF37]' : 'text-white/50 hover:text-white/70'
          }`}
        >
          <span className="text-xl mb-0.5">{item.icon}</span>
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  </nav>
);

/* ── Mobile Navbar (top bar for mobile) ── */
export const MobileNavbar: React.FC<{ title?: string; onMenu?: () => void; onBack?: () => void }> = ({ title = 'ToSom', onMenu, onBack }) => (
  <nav className="sticky top-0 z-50 bg-[#0A0F1F]/95 border-b border-white/8 backdrop-blur-xl px-4 h-14 flex items-center justify-between">
    {onBack ? (
      <button onClick={onBack} className="text-white/65 hover:text-white transition-colors">←</button>
    ) : (
      <div className="w-8" />
    )}
    <span className="text-base font-semibold text-[#D4AF37]">{title}</span>
    {onMenu ? (
      <button onClick={onMenu} className="text-white/65 hover:text-white transition-colors w-8 text-center">☰</button>
    ) : (
      <div className="w-8" />
    )}
  </nav>
);

/* ── Navigation System 3.0 — auto-selects correct nav ── */
export const NavSystem3: React.FC<{
  items: NavItem[];
  active: string;
  onNavigate: (r: string) => void;
  commandOpen?: boolean;
  onCommandClose?: () => void;
  sidebarCollapsed?: boolean;
}> = ({ items, active, onNavigate, commandOpen = false, onCommandClose, sidebarCollapsed = false }) => {
  const isMobile = platform.isTouch;
  const isNative = platform.isNative;

  if (isNative) {
    return <MobileBottomNav items={items} active={active} onNavigate={onNavigate} />;
  }

  return (
    <>
      {isMobile ? (
        <>
          <MobileNavbar title="ToSom" />
          <MobileBottomNav items={items} active={active} onNavigate={onNavigate} />
        </>
      ) : (
        <>
          <Sidebar items={items} active={active} onNavigate={onNavigate} collapsed={sidebarCollapsed} />
          <AppNavbar items={items} active={active} onNavigate={onNavigate} />
        </>
      )}
      <CommandPalette open={commandOpen} onClose={onCommandClose || (() => {})} />
    </>
  );
};

export default NavSystem3;