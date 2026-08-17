/**
 * AppNavbar — Top glassmorphism navigation bar
 *
 * Features:
 * - Glassmorphism background with backdrop blur
 * - Logo on the left
 * - Navigation links in center
 * - Action buttons / profile on right
 * - Responsive: collapses to hamburger on mobile
 *
 * Usage:
 *   <AppNavbar
 *     logo={<Logo />}
 *     links={[{ href: '/dashboard', label: 'Dashboard' }]}
 *     actions={<ProfileAvatar />}
 *   />
 */

import React, { useState } from 'react';

export interface NavLink {
  href: string;
  label: string;
  active?: boolean;
}

export interface AppNavbarProps {
  /** Logo or brand element */
  logo?: React.ReactNode;
  /** Navigation links */
  links?: NavLink[];
  /** Right-side action elements */
  actions?: React.ReactNode;
  /** Custom class */
  className?: string;
  /** Whether the navbar is transparent (for hero pages) */
  transparent?: boolean;
}

const AppNavbar: React.FC<AppNavbarProps> = ({
  logo,
  links = [],
  actions,
  className = '',
  transparent = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className={`
        relative
        h-16
        flex
        items-center
        justify-between
        px-4 md:px-8
        ${
          transparent
            ? 'bg-transparent'
            : 'bg-ts-glass/80 backdrop-blur-xl border-b border-white/8'
        }
        ${className}
      `}
    >
      {/* ── Logo ── */}
      <div className="flex items-center min-w-0 flex-shrink">
        {logo || <span className="text-ts-gold font-bold text-lg">Tosom</span>}
      </div>

      {/* ── Desktop Links ── */}
      <div className="hidden md:flex items-center gap-1">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`
              relative
              px-3 py-2
              text-sm
              font-medium
              rounded-ts-md
              transition-colors
              ${
                link.active
                  ? 'text-ts-gold'
                  : 'text-ts-text-muted hover:text-ts-text'
              }
            `}
          >
            {link.label}
            {link.active && (
              <span
                className="
                  absolute
                  bottom-0
                  left-1/2
                  -translate-x-1/2
                  w-6
                  h-[2px]
                  bg-ts-gold
                  rounded-full
                "
              />
            )}
          </a>
        ))}
      </div>

      {/* ── Desktop Actions ── */}
      <div className="hidden md:flex items-center gap-3">
        {actions}
      </div>

      {/* ── Mobile Hamburger ── */}
      <button
        type="button"
        className="md:hidden p-2 text-ts-text-muted hover:text-ts-text"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div
          className={`
            absolute
            top-16
            left-0
            right-0
            md:hidden
            border-t
            border-white/8
            bg-ts-bg/95
            backdrop-blur-xl
            shadow-xl
          `}
        >
          <div className="flex flex-col py-4 px-4 gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-3
                  text-sm
                  font-medium
                  rounded-ts-md
                  ${
                    link.active
                      ? 'text-ts-gold bg-ts-gold/10'
                      : 'text-ts-text-secondary hover:text-ts-gold hover:bg-ts-glass'
                  }
                `}
              >
                {link.label}
              </a>
            ))}
            {actions && (
              <div className="pt-3 mt-3 border-t border-white/8">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

AppNavbar.displayName = 'AppNavbar';
export default AppNavbar;