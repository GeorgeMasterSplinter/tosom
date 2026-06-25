/**
 * ToSom UI5 — Sticky Header (Premium Dark + Glassmorphism)
 * 
 * Logo midt · Meny venstre · Høyre side tom for premium uttrykk
 * Glassmorphism, sticky, premium hover-states
 * Ultra-premium: harmonert spotlight, vertikal rytme, typografi, radius.
 * Alle tekst er på moderne norsk bokmål.
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
  { label: 'Hvorfor ToSom', href: '/hvorfor' },
  { label: 'Slik fungerer det', href: '/slik' },
  { label: 'Reiser', href: '/reisen' },
  { label: 'Priser', href: '/priser' },
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
       className="fixed top-0 left-0 right-0 z-50 animate-fadeIn"
       style={{
         height: '64px',
         background: scrolled
           ? 'rgba(10,15,26,0.85)'
           : 'rgba(10,15,26,0.60)',
         backdropFilter: 'blur(16px) saturate(150%)',
         WebkitBackdropFilter: 'blur(16px) saturate(150%)',
         borderBottom: scrolled
           ? '1px solid rgba(255,255,255,0.06)'
           : '1px solid transparent',
         boxShadow: scrolled
           ? '0 4px 30px rgba(0,0,0,0.3), 0 0 20px rgba(212,175,55,0.04)'
           : 'none',
         transition: 'all 0.5s ease-out',
       }}
     >
       {/* Subtil top-spotlight for premium dybde — harmonert */}
       <div
         className="absolute inset-x-0 top-0 h-[160px] pointer-events-none"
         style={{
           background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
           filter: 'blur(70px)',
         }}
       />
       <div
         className="mx-auto max-w-7xl px-6 lg:px-8 h-full flex items-center justify-between relative"
       >
         {/* Meny til venstre — gull-hover med glow, økt luft og kontrast */}
         <nav className="hidden lg:flex items-center gap-10 mb-4">
           {navItems.map((item) => (
             <a
               key={item.href}
               href={item.href}
               className="relative text-base font-semibold transition-all duration-300"
               style={{
                 color: isActive(item.href) ? color.brand.gold : 'rgba(255,255,255,0.85)',
                 paddingBottom: `${spacing['sm']}px`,
               }}
               onMouseEnter={(e) => {
                 if (!isActive(item.href)) {
                   (e.target as HTMLElement).style.color = '#D4AF37';
                   (e.target as HTMLElement).style.textShadow = '0 0 12px rgba(212,175,55,0.3)';
                 }
               }}
                 onMouseLeave={(e) => {
                   if (!isActive(item.href)) {
                     (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.95)';
                   (e.target as HTMLElement).style.textShadow = 'none';
                 }
               }}
             >
              {item.label}
              {/* Active indicator */}
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300"
                style={{
                  width: isActive(item.href) ? '100%' : '0px',
                  background: `linear-gradient(90deg, transparent, ${color.brand.gold}, transparent)`,
                  boxShadow: isActive(item.href) ? `0 0 8px ${color.brand.gold}` : 'none',
                }}
              />
            </a>
          ))}
        </nav>

         {/* Logo i midten — optisk balansert størrelse */}
         <Link href="/" className="flex-shrink-0 mt-[2px]">
          <Logo size="2xl" colorVariant="gold" />
        </Link>

        {/* Høyre side — tom for premium uttrykk */}
        <div className="hidden lg:block w-40" />

        {/* Mobil meny-knapp — 3 tykke strekar med gull-farge */}
        <button
          className="lg:hidden w-12 h-12 flex items-center justify-center rounded-xl transition-colors duration-300"
          style={{
            color: '#E8C27A',
            background: menuOpen ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Lukk meny' : 'Åpne meny'}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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

         {/* Mobil meny — glassmorphism, økt kontrast, avrundede hjørner */}
         {menuOpen && (
           <div
             className="lg:hidden transition-all duration-300 ease-out overflow-hidden mt-3 rounded-xl"
             style={{
               background: 'rgba(10,15,26,0.95)',
               backdropFilter: 'blur(20px) saturate(150%)',
               borderBottom: '1px solid rgba(255,255,255,0.06)',
               borderRadius: '12px',
               boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
               padding: '12px',
             }}
           >
             <nav className="space-y-2">
               {navItems.map((item) => (
                 <Link
                   key={item.href}
                   href={item.href}
                   className="block py-3 px-4 rounded-xl text-base transition-all duration-300"
                   style={{
                     color: isActive(item.href) ? '#D4AF37' : 'rgba(255,255,255,0.95)',
                     background: isActive(item.href) ? 'rgba(212,175,55,0.10)' : 'transparent',
                     boxShadow: isActive(item.href) ? '0 0 12px rgba(212,175,55,0.08)' : 'none',
                   }}
                   onClick={() => setMenuOpen(false)}
                 >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;