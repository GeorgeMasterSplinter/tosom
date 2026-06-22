/**
 * ToSom UI 5.0 — Footer (Clean Version)
 * 
 * Minimal footer med 3 kolonner: beskrivelse, Produkt, Selskap.
 * Bokmål
 */

'use client';

import { FC } from 'react';
import Link from 'next/link';

interface FooterProps {
  companyName?: string;
  year?: number;
}

export const Footer: FC<FooterProps> = ({
  companyName = 'ToSom',
  year = new Date().getFullYear(),
}) => {
   const produktLinks = [
     { label: 'Hva er ToSom', href: '/kvifor' },
     { label: 'Match', href: '/match' },
     { label: 'Reise', href: '/reisen' },
     { label: 'Priser', href: '/priser' },
   ];

   const selskapLinks = [
     { label: 'Om oss', href: '/about' },
     { label: 'Kontakt', href: '/kontakt' },
     { label: 'Personvern', href: '/personvern' },
     { label: 'Blogg', href: '/blogg' },
   ];

  return (
    <footer
      className="py-10 relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #0B0F14 0%, #07090C 100%)',
        borderTop: '1px solid rgba(212,175,55,0.06)',
      }}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Kolonne 1: Logo + beskrivelse */}
          <div>
            <span
              className="text-lg font-semibold tracking-[-0.02em] block mb-3"
              style={{ color: '#D4AF37' }}
            >
              ToSom
            </span>
            <p className="text-sm leading-[1.7]" style={{ color: 'rgba(255,255,255,0.70)' }}>
              Ein rolig, privat plattform for ekte relasjonar.
            </p>
          </div>

          {/* Kolonne 2: Produkt */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
              Produkt
            </h4>
            <ul className="space-y-3">
              {produktLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[rgba(255,255,255,0.70)] text-sm hover:text-[#D4AF37] transition-colors duration-200 leading-[1.6] inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolonne 3: Selskap */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
              Selskap
            </h4>
            <ul className="space-y-3">
              {selskapLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[rgba(255,255,255,0.70)] text-sm hover:text-[#D4AF37] transition-colors duration-200 leading-[1.6] inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;