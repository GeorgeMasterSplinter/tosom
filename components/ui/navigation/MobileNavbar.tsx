/**
 * MobileNavbar — Slide-out mobile navigation drawer
 *
 * Usage:
 *   <MobileNavbar
 *     open={menuOpen}
 *     onClose={() => setMenuOpen(false)}
 *     links={[...]}
 *     profile={<ProfileAvatar />}
 *   />
 */

import React from 'react';

export interface MobileNavLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  danger?: boolean;
}

export interface MobileNavbarProps {
  /** Whether the drawer is open */
  open: boolean;
  /** Close callback */
  onClose: () => void;
  /** Navigation links */
  links: MobileNavLink[];
  /** Profile section at bottom */
  profile?: React.ReactNode;
  /** Header content */
  header?: React.ReactNode;
  /** Custom class */
  className?: string;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({
  open,
  onClose,
  links = [],
  profile,
  header,
  className = '',
}) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-ts-overlay bg-black/50 backdrop-blur-sm transition-opacity duration-200 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`
          fixed top-0 left-0 z-ts-drawer
          h-full w-[280px]
          flex flex-col
          bg-ts-bg-secondary/95
          backdrop-blur-xl
          border-r border-white/8
          transition-transform duration-250 ease-out
          md:hidden
          ${open ? 'translate-x-0' : '-translate-x-full'}
          ${className}
        `}
      >
        {/* Close button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          {header || <span />}
          <button
            onClick={onClose}
            className="p-2 text-ts-text-muted hover:text-ts-text transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="flex flex-col gap-0.5">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3
                  px-4 py-3
                  text-sm
                  font-medium
                  rounded-ts-lg
                  transition-all
                  ${
                    link.active
                      ? 'bg-ts-gold/10 text-ts-gold'
                      : link.danger
                      ? 'text-ts-error hover:bg-ts-error/10'
                      : 'text-ts-text-secondary hover:text-ts-text hover:bg-ts-glass'
                  }
                `}
              >
                {link.icon && <span className="w-5 h-5 flex-shrink-0">{link.icon}</span>}
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* Profile */}
        {profile && (
          <div className="px-4 py-4 border-t border-white/5">
            {profile}
          </div>
        )}
      </div>
    </>
  );
};

MobileNavbar.displayName = 'MobileNavbar';
export default MobileNavbar;