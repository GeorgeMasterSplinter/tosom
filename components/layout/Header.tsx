/**
 * ToSom — Smart Header (Premium Final)
 * To modes: Normal (dashboard/matcher/profil) og Focus (onboarding/redigering/skriving).
 * Adaptive Presence, Soft Shadow Fade, Dynamic Blur Strength.
 */

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NotificationCenter from "@/components/NotificationCenter";

export default function Header() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Mode-detektering
  const isFocusMode =
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/profile/edit') ||
    pathname.startsWith('/messages/write');

  // Check login-status
  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/me');
        const data = await res.json();
        if (data?.id) setLoggedIn(true);
      } catch {
        setLoggedIn(false);
      }
    }
    check();
  }, []);

  // Scroll-basert adaptive presence
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamisk classar med adaptive presence, shadow fade, og blur strength
  const headerClass = `
    fixed top-0 left-0 w-full z-50 transition-all duration-500
    ${isFocusMode
      ? 'bg-black/40 backdrop-blur-xl border-b border-white/10 h-14 shadow-none'
      : 'bg-black/80 backdrop-blur-lg border-b border-white/20 h-20 shadow-[0_4px_20px_rgba(0,0,0,0.25)]'
    }
    ${scrolled ? 'opacity-25 backdrop-blur-xl' : 'opacity-40 backdrop-blur-lg'}
    hover:opacity-100
  `.trim();

  const logoClass = `
    transition-all duration-500 text-[#CBAA7A] hover:text-[#CBAA7A]
    ${isFocusMode ? 'text-lg' : 'text-2xl'} font-light tracking-wide
  `.trim();

  return (
    <header className={headerClass}>
      <div className={`
        flex justify-between items-center px-6
        transition-all duration-500
        ${isFocusMode ? 'py-2' : 'py-5'}
      `}>
        {/* Logo */}
        <a href="/" className={logoClass}>
          ToSom
        </a>

        {/* Navigasjon */}
        <nav className="flex items-center gap-6 text-sm text-[#EDEDED]/80">
          <a href="/hvordan-det-fungerer" className="hover:text-[#CBAA7A] transition-colors duration-300 ease-out">
            Hvordan det fungerer
          </a>
          <a href="/om" className="hover:text-[#CBAA7A] transition-colors duration-300 ease-out">
            Om ToSom
          </a>

          {/* Hvis bruker er innlogget → vis NotificationCenter + Dashboard */}
          {loggedIn ? (
            <>
              <a href="/dashboard" className="hover:text-[#CBAA7A] transition-colors duration-300 ease-out text-[#CBAA7A]">
                Dashboard
              </a>
              <NotificationCenter />
              <a
                href="/logout"
                className="bg-[#CBAA7A]/20 border border-[#CBAA7A]/30 px-4 py-2 rounded-lg hover:text-[#CBAA7A] transition-colors duration-300 ease-out"
              >
                Logg ut
              </a>
            </>
          ) : (
            <>
              <a href="/login" className="hover:text-[#CBAA7A] transition-colors duration-300 ease-out">
                Logg inn
              </a>
              <a
                href="/signup"
                className="bg-[#CBAA7A] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#CBAA7A]/30 hover:text-[#CBAA7A] transition-colors duration-300 ease-out"
              >
                Start reisen
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}