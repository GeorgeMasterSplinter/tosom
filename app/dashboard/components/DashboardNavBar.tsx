/**
 * ToSom Dashboard 1.0 — DashboardNavBar
 * Premium sticky top-navigasjon for Dashboardet.
 * Redusert til 5 hovedlenker per redesign-spec.
 */

'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MobileNavMenu from './MobileNavMenu';
import { ToSomLogo } from '@/components/global/ToSomLogo';

const navLinks = [
  { label: 'Hjem', href: '/dashboard' },
  { label: 'Reise', href: '/dashboard/journey' },
  { label: 'Samtale', href: '/chat' },
  { label: 'Refleksjon', href: '/dashboard/reflections' },
  { label: 'Profil', href: '/profile' },
];

export const DashboardNavBar: FC = () => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="w-full sticky top-0 z-40 bg-[var(--ts-bg)]/80 backdrop-blur-xl border-b-[var(--ts-border)] px-6 py-4 flex items-center justify-between ts-glass">
        {/* Logo / Tittel */}
        <ToSomLogo href="/dashboard" showTagline={false} />

        {/* Navigasjonslenker (desktop) */}
        <ul className="hidden sm:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`
                    text-[var(--ts-text-soft)] 
                    hover:text-[var(--ts-gold)] 
                    hover:bg-white/5
                    border-b-2 
                    ${active 
                      ? 'text-[var(--ts-gold)] border-[var(--ts-gold)]' 
                      : 'border-transparent'
                    }
                    tracking-tight px-2 py-1 rounded-md
                    transition-all duration-300 ease-out
                  `}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Høyre side */}
        <div className="flex items-center gap-4">
          {/* Link til settings */}
          <Link
            href="/settings"
            className="text-[var(--ts-text-soft)] hover:text-[var(--ts-gold)] text-xl transition-colors"
            aria-label="Innstillinger"
          >
            ⚙️
          </Link>

          {/* Hamburger (mobil) */}
          <MobileNavMenu />
        </div>
      </nav>
    </>
  );
};

export default DashboardNavBar;