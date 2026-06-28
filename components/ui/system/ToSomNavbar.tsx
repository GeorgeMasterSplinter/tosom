/**
 * ToSom ToSomNavbar — System component
 * 
 * Sticky top navbar with glassmorphism, scroll-aware opacity, mobile menu.
 */

'use client';

import { FC, useState, useEffect } from 'react';
import { spacing, colors, motion } from '@/config/design-tokens';
import { ToSomButton } from './ToSomButton';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface NavItem {
  label: string;
  href: string;
}

interface ToSomNavbarProps {
  links: NavItem[];
  cta?: { label: string; href: string };
  logo?: React.ReactNode;
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomNavbar: FC<ToSomNavbarProps> = ({ links, cta, logo }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: '64px',
        background: scrolled
          ? `rgba(10,15,26,0.85)`
          : `rgba(10,15,26,0.60)`,
        backdropFilter: 'blur(16px) saturate(150%)',
        WebkitBackdropFilter: 'blur(16px) saturate(150%)',
        borderBottom: scrolled
          ? `1px solid rgba(255,255,255,0.06)`
          : '1px solid transparent',
        transition: `all ${motion.durations.slow} ${motion.easings.fadeIn}`,
      }}
    >
      {/* Spotlight overlay */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: '120px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
          filter: `blur(${blur('md')})`,
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-full flex items-center justify-between relative z-10">
        {/* Logo */}
        <div className="flex-shrink-0">
          {logo || (
            <span style={{ color: colors.gold, fontSize: '20px', fontWeight: '600', letterSpacing: '0.05em' }}>
              ToSom
            </span>
          )}
        </div>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-200"
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '15px',
                fontWeight: '500',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = colors.gold;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA + Mobile toggle */}
        <div className="hidden lg:flex items-center gap-4">
          {cta && <ToSomButton href={cta.href} variant="gold">{cta.label}</ToSomButton>}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {mobileOpen ? (
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="lg:hidden absolute top-full left-0 right-0 overflow-hidden"
            style={{
              background: 'rgba(10,15,26,0.95)',
              backdropFilter: 'blur(20px)',
              borderTop: `1px solid rgba(255,255,255,0.06)`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
              transition: `max-height ${motion.durations.normal} ${motion.easings.smooth}`,
            }}
          >
            <div className="px-6 py-4 space-y-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-base"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {cta && (
                <div className="pt-2">
                  <ToSomButton href={cta.href} variant="gold">{cta.label}</ToSomButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Helper for blur values
function blur(key: string): string {
  const map: Record<string, string> = { md: '12px', lg: '24px', xl: '60px' };
  return map[key] || '12px';
}

export default ToSomNavbar;