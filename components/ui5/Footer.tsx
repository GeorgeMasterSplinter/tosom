/**
 * ToSom UI5 — Footer (Premium Dark + Glassmorphism)
 * 
 * Premium footer med design-tokens, strukturert layout.
 * 3 kolonner: Produkt, Regler, Personvern.
 * Mørk navy bakgrunn, gull-aksenter, glassmorphism.
 * Moderne norsk bokmål.
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
  { label: 'Hvorfor ToSom', href: '/hvorfor' },
  { label: 'Slik fungerer det', href: '/slik-fungerer-det' },
  { label: 'Reisen', href: '/reisen' },
  { label: 'Priser', href: '/priser' },
];

const reglerLinks = [
  { label: 'Personvern', href: '/personvern' },
  { label: 'Vilkår', href: '/vilkar' },
  { label: 'Cookies', href: '/cookies' },
];

const omLinks = [
  { label: 'Om oss', href: '/om-oss' },
  { label: 'Kontakt', href: '/kontakt' },
  { label: 'Blogg', href: '/blogg' },
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
        background: `linear-gradient(180deg, #0A0F1A 0%, rgba(15,25,35,0.65) 50%, ${color.bg.primary} 100%)`,
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Glassmorphism-overlay — ytterlegare redusert 10% */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'rgba(255,255,255,0.014)',
          backdropFilter: 'blur(5px)',
        }}
      />

      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        {/* Hovud-innhald — 3 kolonner på desktop, vertikal på mobil */}
        {/* Top-divider */}
        <div
          className="mx-auto"
          style={{
            height: '1px',
            background: 'rgba(255,255,255,0.05)',
            maxWidth: '1200px',
          }}
        />

        {/* Hovud-innhald — 3 kolonner på desktop, vertikal på mobil */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-[48px]"
          style={{
            paddingTop: '80px',
            paddingBottom: '64px',
          }}
        >
          {/* Kolonne 1: Produkt */}
          <div>
            <h4
              className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-5"
              style={{ color: 'rgba(212,175,55,0.55)' }}
            >
              Produkt
            </h4>
            <ul className="space-y-[7px]">
              {produktLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-all duration-300 ease-out"
                    style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '1.75' }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = '#D4AF37';
                      (e.target as HTMLElement).style.textDecoration = 'underline';
                      (e.target as HTMLElement).style.textDecorationColor = 'rgba(212,175,55,0.5)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
                      (e.target as HTMLElement).style.textDecoration = 'none';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolonne 2: Regler */}
          <div>
            <h4
              className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-5"
              style={{ color: 'rgba(212,175,55,0.55)' }}
            >
              Regler
            </h4>
            <ul className="space-y-[7px]">
              {reglerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-all duration-300 ease-out"
                    style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '1.75' }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = '#D4AF37';
                      (e.target as HTMLElement).style.textDecoration = 'underline';
                      (e.target as HTMLElement).style.textDecorationColor = 'rgba(212,175,55,0.5)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
                      (e.target as HTMLElement).style.textDecoration = 'none';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolonne 3: Om ToSom */}
          <div>
            <h4
              className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-5"
              style={{ color: 'rgba(212,175,55,0.55)' }}
            >
              Om ToSom
            </h4>
            <ul className="space-y-[7px]">
              {omLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-all duration-300 ease-out"
                    style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '1.75' }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = '#D4AF37';
                      (e.target as HTMLElement).style.textDecoration = 'underline';
                      (e.target as HTMLElement).style.textDecorationColor = 'rgba(212,175,55,0.5)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
                      (e.target as HTMLElement).style.textDecoration = 'none';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Botntekst */}
        <div className="text-center pt-8 pb-6">
          <p
            className="text-sm"
            style={{ 
              color: 'rgba(255,255,255,0.85)',
              lineHeight: '1.7',
              maxWidth: '520px',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: '24px',
            }}
          >
            ToSom — en rolig, moden måte å møtes på. To mennesker. Én reise. Ekte kontakt.
          </p>
        </div>

        {/* Botnlinje */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between pt-6"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p
            className="text-xs"
            style={{ color: 'rgba(255,255,255,0.50)', lineHeight: '1.75' }}
          >
            &copy; {year} {companyName}. Alle retter reservert.
          </p>
          <p
            className="text-xs mt-2 sm:mt-0"
            style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.75' }}
          >
            Ro &middot; Trygghet &middot; Dybde
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;