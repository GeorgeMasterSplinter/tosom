/**
 * Tosom UI5 — Footer (Premium Dark + Glassmorphism)
 * 
 * Premium footer med design-tokens, strukturert layout.
 * Migrated to Tosom Design System.
 * Moderne norsk bokmål.
 */

'use client';

import { FC } from 'react';
import Link from 'next/link';
import { LogoWordmark } from '@/components/branding/LogoVariants';
import { ToSomTagline } from '@/components/ui/system';
import { color } from '@/config/design-tokens';

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
  { label: 'Hvorfor Tosom', href: '/hvorfor' },
  { label: 'Slik fungerer det', href: '/slik-fungerer-det' },
  { label: 'Metoder vi bruker', href: '/metoder' },
  { label: 'Reisen', href: '/reisen' },
  { label: 'Priser', href: '/priser' },
];

const reglerLinks = [
  { label: 'Personvern', href: '/personvern' },
  { label: 'Vilkår', href: '/vilkar' },
  { label: 'Trygghet', href: '/trygghet' },
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
  companyName = 'Tosom',
  year = new Date().getFullYear(),
}) => {
  return (
    <footer
      className="relative overflow-hidden animate-fadeIn"
      style={{
        background: `linear-gradient(180deg, #0A0F1A 0%, rgba(15,25,35,0.65) 50%, ${color.bg.surface} 100%)`,
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Subtil top-spotlight for premium dybde — harmonert 80px */}
      <div
        className="absolute inset-x-0 top-0 h-[200px] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Glassmorphism-overlay — ytterlegare redusert 10% */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'rgba(255,255,255,0.014)',
          backdropFilter: 'blur(5px)',
        }}
      />

      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        {/* Hovud-innhold — 3 kolonner på desktop, vertikal på mobil */}
        {/* Top-divider */}
        <div
          className="mx-auto"
          style={{
            height: '1px',
            background: 'rgba(255,255,255,0.05)',
            maxWidth: '1200px',
          }}
        />

        {/* Hovud-innhold — 3 kolonner på desktop, vertikal på mobil, økt kolonne-avstand */}
        <div
          className="grid grid-cols-1 gap-14 ph:grid-cols-2 ph:gap-10 md:grid-cols-3 md:gap-20"
          style={{
            paddingTop: '72px',
            paddingBottom: '72px',
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
                     className="text-base transition-all duration-300 ease-out"
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
                     className="text-base transition-all duration-300 ease-out"
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

           {/* Kolonne 3: Om Tosom */}
           <div>
             <h4
               className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-5"
               style={{ color: 'rgba(212,175,55,0.55)' }}
             >
               Om Tosom
             </h4>
             <ul className="space-y-[7px]">
               {omLinks.map((link) => (
                 <li key={link.href}>
                   <Link
                     href={link.href}
                     className="text-base transition-all duration-300 ease-out"
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
        <div className="text-center pt-20 ph:pt-24 md:pt-28">
          <ToSomTagline>
            Tosom — en rolig, moden måte å møtes på. To mennesker. Én reise. Ekte kontakt.
          </ToSomTagline>

          {/* Made in Norway */}
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl"
            style={{
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.15)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span
              className="text-sm md:text-base font-medium"
              style={{ color: 'rgba(212,175,55,0.75)', letterSpacing: '0.15em' }}
            >
              Tosom er utviklet og driftet fra Norge
            </span>
          </div>
        </div>

        {/* Botnlinje */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between pt-10 ph:pt-12 md:pt-14"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p
            className="text-xs md:text-sm"
            style={{ color: 'rgba(255,255,255,0.50)', lineHeight: '1.75' }}
          >
            &copy; {year} {companyName}. Alle retter reservert.
          </p>
          <p
            className="text-xs md:text-sm mt-2 sm:mt-0"
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