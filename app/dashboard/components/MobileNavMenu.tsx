/**
 * ToSom Dashboard 1.0 — MobileNavMenu
 * Hamburger-knapp + slide-in panel for mobil-navigasjon.
 */

'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Hjem', href: '/dashboard' },
  { label: 'Reise', href: '/dashboard/journey' },
  { label: 'Samtale', href: '/dashboard/conversation' },
  { label: 'Spørsmål', href: '/questions' },
  { label: 'Refleksjoner', href: '/dashboard/reflections' },
  { label: 'Innsikt', href: '/dashboard/insights' },
  { label: 'Varmekart', href: '/dashboard/heatmap' },
  { label: 'Trygghet', href: '/dashboard/safety' },
  { label: 'Innstillinger', href: '/settings' },
  { label: 'Uke', href: '/dashboard/summary' },
  { label: 'Analyse', href: '/dashboard/analytics' },
  { label: 'Profil', href: '/dashboard/profile' },
];

export const MobileNavMenu: FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Hamburger-knapp */}
      <button
        onClick={toggleMenu}
        className="sm:hidden text-[var(--ts-text-soft)] hover:text-[var(--ts-text)] text-2xl transition-colors"
        aria-label="Meny"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Mobile panel */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleMenu}
          />

          {/* Slide-in panel */}
          <div className="fixed top-0 left-0 h-full w-[260px] bg-[var(--ts-bg)] border-[var(--ts-border)] z-50 animate-fadeIn ts-shadow-card">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b-[var(--ts-border)]">
              <span className="text-lg font-medium text-[var(--ts-text)]">Meny</span>
              <button
                onClick={toggleMenu}
                className="text-[var(--ts-text-soft)] hover:text-[var(--ts-text)] transition-colors"
                aria-label="Lukk"
              >
                ✕
              </button>
            </div>

            {/* Lenker */}
            <ul className="px-6 py-6 space-y-4">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={toggleMenu}
                      className={`
                        block text-base transition
                        ${active
                          ? 'text-[var(--ts-gold)] font-medium'
                          : 'text-[var(--ts-text-soft)] hover:text-[var(--ts-text)]'
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default MobileNavMenu;