/**
 * ToSom — Universal Menu Component
 * 
 * Universell hamburger-meny som rendres på ALLE sider.
 - ToSom-logo (samme som landing)
- Hamburger-ikon med mobil meny
- Global navigasjon
- Ingen side-spesifikk logikk
 */

'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/branding/Logo';
import { color } from '@/config/design-tokens';

const navItems = [
  { label: 'Hvorfor ToSom', href: '/hvorfor' },
  { label: 'Slik fungerer det', href: '/slik-fungerer-det' },
  { label: 'Reisen', href: '/reisen' },
  { label: 'Priser', href: '/priser' },
];

const isActive = (href: string, pathname: string | null) => pathname?.startsWith(href) ?? false;

export const UniversalMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* CSS-animasjonar */}
      <style>{`
        @keyframes menuSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes menuOverlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .menu-slide-in {
          animation: menuSlideIn 0.2s ease-out both;
        }
        .menu-overlay-fade {
          animation: menuOverlayFade 0.2s ease-out both;
        }
      `}</style>

      {/* Overlay for mobil meny */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 menu-overlay-fade"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 h-[64px] flex items-center justify-between">
          {/* Venstre: Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size="xl" colorVariant="gold" />
          </Link>

          {/* Midten: Meny (desktop) */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-base font-medium transition-all duration-200 ease-out"
                style={{
                  color: isActive(item.href, pathname) ? color.brand.gold : 'rgba(255,255,255,0.60)',
                  paddingBottom: '8px',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.href, pathname)) {
                    (e.target as HTMLElement).style.color = '#D4AF37';
                    (e.target as HTMLElement).style.textShadow = '0 0 12px rgba(212,175,55,0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.href, pathname)) {
                    (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.60)';
                    (e.target as HTMLElement).style.textShadow = 'none';
                  }
                }}
              >
                {item.label}
                {/* Active underline */}
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] transition-all duration-300"
                  style={{
                    width: isActive(item.href, pathname) ? '100%' : '0px',
                    background: `linear-gradient(90deg, transparent, ${color.brand.gold}, transparent)`,
                    boxShadow: isActive(item.href, pathname) ? `0 0 6px ${color.brand.gold}` : 'none',
                  }}
                />
              </Link>
            ))}
          </nav>

          {/* Høyre: CTA-knappar */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="h-[40px] px-6 flex items-center justify-center rounded-[10px] text-sm font-medium transition-all duration-200 ease-out"
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(10px)',
                color: 'rgba(255,255,255,0.90)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.25)';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.015)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.90)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              Logg inn
            </Link>
            <Link
              href="/onboarding/start"
              className="h-[40px] px-6 flex items-center justify-center rounded-[10px] text-sm font-semibold transition-all duration-200 ease-out"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.92) 0%, rgba(232,194,122,0.92) 100%)',
                color: '#0A0F1A',
                boxShadow: '0 4px 12px rgba(212,175,55,0.20), 0.5px 0.5px 0 rgba(255,255,255,0.1) inset',
                border: '0.5px solid rgba(255,255,255,0.15)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(212,175,55,0.25), 0.5px 0.5px 0 rgba(255,255,255,0.15) inset';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(212,175,55,0.20), 0.5px 0.5px 0 rgba(255,255,255,0.1) inset';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              Start reisen
            </Link>
          </div>

          {/* Mobil meny-knapp */}
          <button
            className="md:hidden w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ease-out"
            style={{
              color: '#E8C27A',
              background: menuOpen ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(8px)',
              border: menuOpen ? '1px solid rgba(212,175,55,0.2)' : '1px solid rgba(255,255,255,0.06)',
            }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Lukk meny' : 'Åpne meny'}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ transition: 'transform 200ms ease-out', transform: menuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
              {menuOpen ? (
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M4 7H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M4 12H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M4 17H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>

          {/* Mobil meny (slide-in frå høgre) */}
          {menuOpen && (
            <div className="md:hidden fixed top-[64px] right-0 z-50 menu-slide-in">
              <nav className="space-y-6" style={{ width: '280px', padding: '32px 24px' }}>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-3 px-4 text-base transition-all duration-200 ease-out rounded-xl"
                    style={{
                      color: isActive(item.href, pathname) ? '#D4AF37' : 'rgba(255,255,255,0.60)',
                      background: isActive(item.href, pathname) ? 'rgba(212,175,55,0.10)' : 'transparent',
                    }}
                    onClick={() => setMenuOpen(false)}
                    onMouseEnter={(e) => {
                      if (!isActive(item.href, pathname)) {
                        (e.target as HTMLElement).style.color = '#D4AF37';
                        (e.target as HTMLElement).style.background = 'rgba(212,175,55,0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.href, pathname)) {
                        (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.60)';
                        (e.target as HTMLElement).style.background = 'transparent';
                      }
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <Link
                    href="/login"
                    className="h-[44px] px-6 flex items-center justify-center rounded-[10px] text-sm font-medium transition-all duration-200 ease-out"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      color: 'rgba(255,255,255,0.90)',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Logg inn
                  </Link>
                  <Link
                    href="/onboarding/start"
                    className="h-[44px] px-6 flex items-center justify-center rounded-[10px] text-sm font-semibold transition-all duration-200 ease-out"
                    style={{
                      background: 'linear-gradient(135deg, rgba(212,175,55,0.92) 0%, rgba(232,194,122,0.92) 100%)',
                      color: '#0A0F1A',
                      boxShadow: '0 4px 12px rgba(212,175,55,0.20)',
                      border: '0.5px solid rgba(255,255,255,0.15)',
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Start reisen
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default UniversalMenu;