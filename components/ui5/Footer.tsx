/**
 * ToSom UI5 — Footer (Redesigned)
 * 
 * Premium footer med design-tokens, strukturert layout.
 * 4 kolonner: Logo + beskrivelse, Produkt, Selskap, juridisk.
 * Mørk blå bakgrunn, gull-aksentar, glassmorphism.
 */

'use client';

import { FC } from 'react';
import Link from 'next/link';
import { LogoWordmark } from '@/components/branding/LogoVariants';
import { color, spacing } from '@/config/design-tokens';

/* ========================
   PROPS
   ======================== */

export interface FooterProps {
  companyName?: string;
  year?: number;
}

/* ========================
   DATA
   ======================== */

const produktLinks = [
  { label: 'Kvifor ToSom', href: '/kvifor' },
  { label: 'Slik fungerer det', href: '/slik' },
  { label: 'Reisen', href: '/reisen' },
  { label: 'Prisar', href: '/priser' },
];

const selskapLinks = [
  { label: 'Om oss', href: '/om-oss' },
  { label: 'Kontakt', href: '/kontakt' },
  { label: 'Blogg', href: '/blogg' },
];

const juridiskLinks = [
  { label: 'Personvern', href: '/personvern' },
  { label: 'Vilkår', href: '/vilkår' },
  { label: 'Cookies', href: '/cookies' },
];

/* ========================
   COMPONENT
   ======================== */

export const Footer: FC<FooterProps> = ({
  companyName = 'ToSom',
  year = new Date().getFullYear(),
}) => {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #0B1520 0%, ${color.bg.primary} 100%)`,
        borderTop: `1px solid ${color.border.dark}`,
      }}
    >
      {/* Glassmorphism-overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'rgba(255,255,255,0.01)',
          backdropFilter: 'blur(8px)',
        }}
      />

      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        {/* Hovud-innhold */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          style={{
            paddingTop: `${spacing['3xl']}px`,
            paddingBottom: `${spacing['3xl']}px`,
          }}
        >
          {/* Kolonne 1: Logo + beskrivelse */}
          <div className="md:col-span-2 lg:col-span-1">
            <LogoWordmark />
            <p
              className="mt-3"
              style={{ 
                color: color.text.muted,
                lineHeight: '1.65',
                fontSize: '13px',
              }}
            >
              Ein roleg, privat plattform for ekte relasjonar.
              <br />
              Éin match · 24 timer · Guidet reise
            </p>
          </div>

          {/* Kolonne 2: Produkt */}
          <div>
            <h4
              className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4"
              style={{ color: color.text.secondary }}
            >
              Produkt
            </h4>
            <ul className="space-y-2.5">
              {produktLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: color.text.muted }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = color.brand.gold;
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = color.text.muted;
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolonne 3: Selskap */}
          <div>
            <h4
              className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4"
              style={{ color: color.text.secondary }}
            >
              Selskap
            </h4>
            <ul className="space-y-2.5">
              {selskapLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: color.text.muted }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = color.brand.gold;
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = color.text.muted;
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolonne 4: Juridisk */}
          <div>
            <h4
              className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4"
              style={{ color: color.text.secondary }}
            >
              Juridisk
            </h4>
            <ul className="space-y-2.5">
              {juridiskLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: color.text.muted }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = color.brand.gold;
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = color.text.muted;
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Botnlinje */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between pt-6"
          style={{
            borderTop: `1px solid rgba(255,255,255,0.06)`,
          }}
        >
          <p
            className="text-xs"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            © {year} {companyName}. Alle rettar reservert.
          </p>
          <p
            className="text-xs mt-2 sm:mt-0"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            Ro · Trygghet · Dybde
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
