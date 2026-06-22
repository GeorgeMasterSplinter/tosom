/**
 * ToSom UI5 — Sticky Header (Redesigned)
 * 
 * Logo venstre • Meny midt • CTA høgre
 * Redusert height (64px), meir luft vertically
 * Glassmorphism, sticky, premium hover-states
 * Mørk blå bakgrunn, gull-aksentar
 */

'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { color, spacing } from '@/config/design-tokens';

/* ========================
   PROPS & DATA
   ======================== */

interface HeaderProps {
  currentPath?: string;
}

const navItems = [
  { label: 'Kvifor ToSom', href: '/kvifor' },
  { label: 'Slik fungerer det', href: '/slik' },
  { label: 'Reisen', href: '/reisen' },
  { label: 'Prisar', href: '/priser' },
];

/* ========================
   COMPONENT
   ======================== */

export const Header: FC<HeaderProps> = ({ currentPath = '/' }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Is active? */
  const isActive = (href: string) => currentPath.startsWith(href);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: '64px',
        background: scrolled
          ? `rgba(11,21,32,0.95)`
          : `rgba(11,21,32,0.75)`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: scrolled
          ? `1px solid ${color.border.dark}`
          : '1px solid transparent',
        transition: 'all 0.4s ease-out',
      }}
    >
      <div
        className="mx-auto max-w-7xl px-6 h-full flex items-center justify-between"
      >
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Logo size="sm" colorVariant="gold" />
        </Link>

        {/* Navigasjon — desktop */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium transition-colors duration-200"
              style={{
                color: isActive(item.href) ? color.brand.gold : color.text.secondary,
                paddingBottom: `${spacing['sm']}px`,
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.href)) {
                  (e.target as HTMLElement).style.color = color.brand.gold;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.href)) {
                  (e.target as HTMLElement).style.color = color.text.secondary;
                }
              }}
            >
              {item.label}
              {/* Active indicator */}
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300"
                style={{
                  width: isActive(item.href) ? '100%' : '0px',
                  background: color.brand.gold,
                }}
              />
            </a>
          ))}
        </nav>

        {/* CTA + mobil-meny */}
        <div className="flex items-center gap-4">
          {/* CTA-knapp */}
          <Link
            href="/onboarding"
            className="hidden lg:inline-flex items-center px-5 py-2.5 rounded-[12px] text-xs font-medium transition-all duration-300"
            style={{
              background: color.brand.gold,
              color: '#0B1520',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = color.brand['gold-hover'];
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = color.brand.gold;
            }}
          >
            Kom i gang
          </Link>

          {/* Mobil meny-knapp */}
          <button
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-lg"
            style={{
              color: color.brand.gold,
              background: menuOpen ? 'rgba(212,175,55,0.10)' : 'transparent',
            }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Lukk meny' : 'Opne meny'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              {menuOpen ? (
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 8H20M4 16H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobil meny */}
      <div
        className="lg:hidden transition-all duration-300 ease-out overflow-hidden"
        style={{
          maxHeight: menuOpen ? `${spacing['4xl']}px` : '0px',
          background: `rgba(11,21,32,0.98)`,
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${color.border.dark}`,
        }}
      >
        <nav className="px-6 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-3 px-3 rounded-lg text-sm transition-colors duration-200"
              style={{
                color: isActive(item.href) ? color.brand.gold : color.text.secondary,
                background: isActive(item.href) ? 'rgba(212,175,55,0.08)' : 'transparent',
              }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/onboarding"
            className="block py-3 px-3 rounded-lg text-sm font-medium mt-2"
            style={{
              background: color.brand.gold,
              color: '#0B1520',
              textAlign: 'center',
            }}
            onClick={() => setMenuOpen(false)}
          >
            Kom i gang
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
