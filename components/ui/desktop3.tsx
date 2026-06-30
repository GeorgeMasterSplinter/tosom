/**
 * ToSom UI 3.0 — Desktop Enhancements 3.0
 *
 * Desktop-specific components:
 * - Resizable sidebar
 * - Keyboard shortcuts
 * - Desktop notifications
 *
 * Usage:
 *   import { DesktopSidebarResizable, useKeyboardShortcuts, DesktopNotifications } from '@/components/ui/desktop3'
 */

import React from 'react';

/* ── Resizable Sidebar ── */
export const DesktopSidebarResizable: React.FC<{
  items: Array<{ id: string; label: string; icon: string; route: string }>;
  active: string;
  onNavigate: (route: string) => void;
  onResize?: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
}> = ({ items, active, onNavigate, onResize, minWidth = 200, maxWidth = 400 }) => {
  const [width, setWidth] = React.useState(280);
  const [resizing, setResizing] = React.useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setResizing(true);
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (ev: MouseEvent) => {
      const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth + (ev.clientX - startX)));
      setWidth(newWidth);
      onResize?.(newWidth);
    };

    const handleMouseUp = () => {
      setResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className="h-screen sticky top-0 bg-white/[0.02] border-r border-white/6 backdrop-blur-xl flex flex-col transition-none"
      style={{ width }}
    >
      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[#D4AF37]/20 transition-colors"
      />
      <div className="p-4 border-b border-white/6">
        <span className="text-[#D4AF37] text-lg font-semibold">◆ ToSom</span>
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
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

/* ── Keyboard Shortcuts Hook ── */
export function useKeyboardShortcuts(handlers: Record<string, () => void>) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = [
        e.ctrlKey || e.metaKey ? 'ctrl' : null,
        e.shiftKey ? 'shift' : null,
        e.altKey ? 'alt' : null,
        e.key.toLowerCase(),
      ].filter(Boolean).join('+');

      if (handlers[key]) {
        e.preventDefault();
        handlers[key]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}

/* ── Desktop Notifications ── */
export const DesktopNotifications: React.FC<{
  notifications: Array<{ id: string; title: string; body: string; icon?: string; timestamp: string }>;
  onDismiss?: (id: string) => void;
}> = ({ notifications, onDismiss }) => (
  <div className="fixed top-4 right-4 z-[10001] space-y-2 max-w-sm">
    {notifications.map(notif => (
      <div
        key={notif.id}
        className="bg-white/[0.06] border border-white/10 rounded-xl p-4 backdrop-blur-xl shadow-lg animate-slide-in"
      >
        <div className="flex items-start gap-3">
          {notif.icon && <span className="text-xl">{notif.icon}</span>}
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{notif.title}</p>
            <p className="text-white/50 text-xs mt-0.5">{notif.body}</p>
            <p className="text-white/30 text-[10px] mt-1">{notif.timestamp}</p>
          </div>
          {onDismiss && (
            <button onClick={() => onDismiss(notif.id)} className="text-white/30 hover:text-white/60 text-sm">✕</button>
          )}
        </div>
      </div>
    ))}
  </div>
);

/* ── Desktop Command Palette ── */
export const DesktopCommandPalette: React.FC<{
  open: boolean;
  onClose: () => void;
  queries: Array<{ label: string; action: () => void }>;
}> = ({ open, onClose, queries }) => {
  const [search, setSearch] = React.useState('');
  const filtered = queries.filter(q => q.label.toLowerCase().includes(search.toLowerCase()));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white/[0.04] border border-white/8 rounded-2xl backdrop-blur-xl shadow-xl overflow-hidden">
        <input
          placeholder="Søk eller kjør kommando..."
          className="w-full bg-transparent px-6 py-4 text-white text-lg outline-none placeholder:text-white/40"
          autoFocus
          onChange={e => setSearch(e.target.value)}
        />
        <div className="border-t border-white/6 max-h-64 overflow-y-auto">
          {filtered.map((q, i) => (
            <button
              key={i}
              onClick={() => { q.action(); onClose(); }}
              className="w-full text-left px-6 py-3 text-sm text-white/70 hover:bg-white/[0.04] hover:text-white transition-colors"
            >
              {q.label}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-6 py-8 text-center">
              <p className="text-white/30 text-sm">Ingen resultater</p>
            </div>
          )}
        </div>
        <div className="border-t border-white/6 px-6 py-2.5 flex items-center gap-3">
          <span className="text-[10px] text-white/30 bg-white/[0.04] px-1.5 py-0.5 rounded">⌘K</span>
          <span className="text-[10px] text-white/30 bg-white/[0.04] px-1.5 py-0.5 rounded">ESC</span>
          <span className="text-[10px] text-white/30">åpne · lukke</span>
        </div>
      </div>
    </div>
  );
};

/* ── Desktop Window (full chrome) ── */
export const DesktopWindow: React.FC<{
  title?: string;
  children: React.ReactNode;
  sidebarItems?: Array<{ id: string; label: string; icon: string; route: string }>;
  sidebarActive?: string;
  onNavigate?: (route: string) => void;
  commandOpen?: boolean;
  onCommandClose?: () => void;
}> = ({
  title = 'ToSom',
  children,
  sidebarItems,
  sidebarActive,
  onNavigate,
  commandOpen,
  onCommandClose,
}) => (
  <div className="h-screen flex bg-[#0A0F1F]">
    {sidebarItems && sidebarActive && onNavigate && (
      <DesktopSidebarResizable
        items={sidebarItems}
        active={sidebarActive}
        onNavigate={onNavigate}
      />
    )}
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Title bar */}
      <div className="h-10 bg-white/[0.02] border-b border-white/6 flex items-center px-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
        </div>
        <span className="text-white/40 text-xs mx-auto">{title}</span>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
    {commandOpen && onCommandClose && (
      <DesktopCommandPalette open={commandOpen} onClose={onCommandClose} queries={[]} />
    )}
  </div>
);

const DesktopComponents = { DesktopSidebarResizable, useKeyboardShortcuts, DesktopNotifications, DesktopCommandPalette, DesktopWindow };
export default DesktopComponents;
