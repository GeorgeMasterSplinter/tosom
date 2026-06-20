/**
 * PageShell — Full page wrapper component
 *
 * Provides the complete page chrome: navbar, optional sidebar,
 * main content area, and footer. All slots are composable via
 * React children or explicit props.
 *
 * Usage:
 *   <PageShell navbar={<AppNavbar />} sidebar={<Sidebar />}>
 *     <main>Content</main>
 *   </PageShell>
 */

import React from 'react';
import { tokens } from '@/components/ui/tokens';

export interface PageShellProps {
  /** Top navigation bar */
  navbar?: React.ReactNode;
  /** Left sidebar (collapsible on mobile) */
  sidebar?: React.ReactNode;
  /** Main content area */
  children: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Whether to show the sidebar toggle */
  sidebarOpen?: boolean;
  /** Callback for sidebar toggle */
  onSidebarToggle?: (open: boolean) => void;
  /** Custom class for the wrapper */
  className?: string;
}

/**
 * PageShell — Complete page chrome with navbar, sidebar, content, and footer
 */
const PageShell: React.FC<PageShellProps> = ({
  navbar,
  sidebar,
  children,
  footer,
  sidebarOpen,
  onSidebarToggle,
  className = '',
}) => {
  const hasNavbar = !!navbar;
  const hasSidebar = !!sidebar;
  const hasFooter = !!footer;

  return (
    <div
      className={`min-h-screen ${tokens.colors.bg.primary} ${tokens.colors.text.primary} flex flex-col ${className}`}
      role="document"
    >
      {/* ── Navbar ── */}
      {hasNavbar && (
        <header
          className={`sticky top-0 z-ts-sticky w-full border-b border-ts-glass border-b-white/10 bg-ts-glass/80 backdrop-blur-xl h-[var(--ts-navbar-height)] ${
            hasSidebar ? 'md:pl-[var(--ts-sidebar-width)]' : ''
          }`}
          role="banner"
        >
          {navbar}
        </header>
      )}

      {/* ── Layout Body ── */}
      <div className="flex flex-1">
        {/* ── Sidebar ── */}
        {hasSidebar && (
          <>
            {/* Mobile sidebar overlay */}
            <div
              className={`fixed inset-0 z-ts-drawer bg-black/50 backdrop-blur-sm transition-opacity duration-[var(--ts-motion-duration-fast)] ease-[var(--ts-motion-easing-fadeIn)] md:hidden ${
                sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => onSidebarToggle?.(false)}
              aria-hidden={!sidebarOpen}
            />

            {/* Sidebar panel */}
            <aside
              className={`fixed top-0 left-0 z-ts-drawer h-full w-[var(--ts-sidebar-width)] border-r border-ts-glass border-r-white/10 bg-ts-glass/60 backdrop-blur-xl transition-transform duration-[var(--ts-motion-duration-normal)] ease-[var(--ts-motion-easing-smooth)] md:translate-x-0 md:static md:block ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
              style={{ minHeight: hasNavbar ? 'calc(100vh - var(--ts-navbar-height))' : '100vh' }}
              role="navigation"
              aria-label="Sidestolpe"
            >
              {sidebar}
            </aside>
          </>
        )}

        {/* ── Main Content ── */}
        <main
          className="flex-1 transition-all duration-[var(--ts-motion-duration-fast)]"
          role="main"
          aria-labelledby="main-content"
        >
          {children}
        </main>
      </div>

      {/* ── Footer ── */}
      {hasFooter && (
        <footer className="border-t border-ts-glass py-[var(--ts-spacing-lg)] px-[var(--ts-spacing-xl)] text-center text-ts-text-muted text-sm">
          {footer}
        </footer>
      )}
    </div>
  );
};

PageShell.displayName = 'PageShell';

export default PageShell;