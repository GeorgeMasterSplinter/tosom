/**
 * ToSom UI 5.0 — Sticky Header (Dark Blue-Gray Edition)
 * 
 * Logo venstre • Meny midt
 * Glassmorphism, sticky, premium hover-states
 * Mørk blågrå bakgrunn, gull-aksentar
 */

'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

interface HeaderProps {
  currentPath?: string;
}

const navItems = [
  { label: 'Kvifor ToSom', href: '/kvifor' },
  { label: 'Slik fungerer det', href: '/slik' },
  { label: 'Reisen', href: '/reisen' },
  { label: 'Prisar', href: '/priser' },
];

export const Header: FC<HeaderProps> = ({ currentPath = '/' }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500 ease-out
      `}
      style={{
        height: '72px',
        background: scrolled
          ? 'rgba(26, 31, 38, 0.92)'
          : 'rgba(26, 31, 38, 0.6)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(212, 175, 55, 0.08)',
        borderBottom: scrolled
          ? '1px solid rgba(255, 255, 255, 0.06)'
          : '1px solid transparent',
        boxShadow: scrolled
          ? '0 2px 24px rgba(0, 0, 0, 0.25)'
          : 'none',
        transition: 'all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
    >
      <div
        className="mx-auto max-w-[1600px] px-6 lg:px-8 h-full flex items-center justify-between"
      >
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>

        {/* Navigasjon — desktop */}
        <nav className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => {
            const isActive = currentPath.startsWith(item.href.replace('#', ''));
            return (
              <a
                key={item.href}
                href={item.href}
                className="relative text-[15px] font-medium transition-all duration-300 ease-out"
                style={{
                  color: isActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.6)',
                  padding: '24px 0',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = '#D4AF37';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = isActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.6)';
                }}
              >
                {item.label}
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: isActive ? '100%' : '0px',
                    background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
                  }}
                />
              </a>
            );
          })}
        </nav>

        {/* Mobil meny-knapp */}
        <button
          className="lg:hidden w-10 h-10 flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: '#D4AF37' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {menuOpen ? (
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 8H20M4 16H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>

      </div>

      {/* Mobil meny */}
      <div
        className="lg:hidden transition-all duration-300 ease-out overflow-hidden"
        style={{
          maxHeight: menuOpen ? '300px' : '0px',
          background: 'rgba(26, 31, 38, 0.98)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <nav className="px-6 py-4 space-y-3">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block py-2 text-[15px] transition-colors duration-200 ease-out"
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
              }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;