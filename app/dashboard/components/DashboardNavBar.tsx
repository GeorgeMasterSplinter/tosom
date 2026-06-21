/**
 * ToSom Dashboard 1.0 — DashboardNavBar
 * Premium sticky top-navigasjon for Dashboardet.
 */

'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSettings } from '../context/SettingsContext';
import MobileNavMenu from './MobileNavMenu';

const navLinks = [
  { label: 'Hjem', href: '/dashboard' },
  { label: 'Reise', href: '/dashboard/journey' },
  { label: 'Samtale', href: '/dashboard/conversation' },
  { label: 'Spørsmål', href: '/questions' },
  { label: 'Refleksjoner', href: '/dashboard/reflections' },
  { label: 'Innsikt', href: '/dashboard/insights' },
  { label: 'Varmekart', href: '/dashboard/heatmap' },
  { label: 'Trygghet', href: '/dashboard/safety' },
  { label: 'Innstillinger', href: '/dashboard/settings' },
  { label: 'Uke', href: '/dashboard/summary' },
  { label: 'Analyse', href: '/dashboard/analytics' },
  { label: 'Profil', href: '/dashboard/profile' },
];

export const DashboardNavBar: FC = () => {
  const pathname = usePathname();
  const { openSettings } = useSettings();

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="w-full sticky top-0 z-40 bg-[var(--ts-bg)]/80 backdrop-blur-xl border-b-[var(--ts-border)] px-6 py-4 flex items-center justify-between ts-glass">
        {/* Logo / Tittel */}
        <Link href="/dashboard" className="text-lg font-medium text-[var(--ts-text)] tracking-tight">
          ToSom
        </Link>

        {/* Navigasjonslenker (desktop) */}
        <ul className="hidden sm:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`
                    text-[var(--ts-text-soft)] hover:text-[var(--ts-text)] transition
                    ${active ? 'text-[var(--ts-gold)] border-b-2 border-[var(--ts-gold)]' : ''}
                    tracking-tight
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
          {/* Settings-knapp */}
          <button
            onClick={openSettings}
            className="text-[var(--ts-text-soft)] hover:text-[var(--ts-text)] text-xl transition-colors"
            aria-label="Innstillinger"
          >
            ⚙️
          </button>

          {/* Hamburger (mobil) */}
          <MobileNavMenu />
        </div>
      </nav>
    </>
  );
};

export default DashboardNavBar;