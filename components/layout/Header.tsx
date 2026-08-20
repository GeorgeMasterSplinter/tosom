/**
 * Tosom — Smart Header (Premium Final)
 * Two modes: Normal (dashboard/matcher/profil) and Focus (onboarding/redigering/skriving).
 * Adaptive Presence, Soft Shadow Fade, Dynamic Blur Strength.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import NotificationCenter from "@/components/NotificationCenter";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // Hent session på mount — bestem om brukeren er innlogget
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (!res.ok) return;
        const session = await res.json();
        if (!cancelled && session?.user) setLoggedIn(true);
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // Mode-detektering (med null-safety)
  const isFocusMode =
    pathname &&
    (pathname.startsWith('/onboarding') ||
      pathname.startsWith('/profile/edit') ||
      pathname.startsWith('/messages/write'));

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
    transition-all duration-500 text-[#D4AF37] hover:text-[#E8C766]
    ${isFocusMode ? 'text-lg' : 'text-2xl'} font-light tracking-wide
  `.trim();

  return (
    <header className={headerClass}>
      <div className={`
        flex justify-between items-center px-6
        transition-all duration-500
        ${isFocusMode ? 'py-2' : 'py-5'}
      `}>
        {/* Logo — erstattet rå <a href> med next/link (STEG 4.2) */}
        <Link href="/" className={logoClass}>
          Tosom
        </Link>

        {/* Navigasjon */}
        <nav className="flex items-center gap-6 text-sm text-[#EDEDED]/80">
          <Link href="/hvordan-det-fungerer" className="hover:text-[#D4AF37] transition-colors duration-300 ease-out">
            Hvordan det fungerer
          </Link>
          <Link href="/om" className="hover:text-[#D4AF37] transition-colors duration-300 ease-out">
            Om Tosom
          </Link>

          {/* Hvis bruker er innlogget → vis NotificationCenter + Dashboard */}
          {loggedIn ? (
            <>
              <Link href="/dashboard" className="hover:text-[#D4AF37] transition-colors duration-300 ease-out text-[#D4AF37]">
                Dashboard
              </Link>
              <NotificationCenter />
              <button
                onClick={handleSignOut}
                className="bg-[#D4AF37]/20 border border-[#D4AF37]/30 px-4 py-2 rounded-lg hover:text-[#D4AF37] transition-colors duration-300 ease-out cursor-pointer"
              >
                Logg ut
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-[#D4AF37] transition-colors duration-300 ease-out">
                Logg inn
              </Link>
              <Link
                href="/signup"
                className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#E8C766]/30 hover:text-[#D4AF37] transition-colors duration-300 ease-out"
              >
                Start reisen
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}