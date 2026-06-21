/**
 * ToSom UI 5.0 — Footer 2.0 (Round 3 Premium Visual Polish)
 * 
 * Forbedringar:
 * - Gull-logo i footer
 * - Mørkare bakgrunn med ambient glow
 * - Større spacing mellom kolonnar
 * - Hover på lenker: gull-glow + scale-[1.02]
 * - Breiare copyright-separator med gull-skugg
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
    { label: 'Kvifor ToSom', href: '/#why' },
    { label: 'Slik fungerer det', href: '/#how' },
    { label: 'Reisen', href: '/#journey' },
    { label: 'Prisar', href: '/#pricing' },
  ];

  const selskapLinks = [
    { label: 'Om oss', href: '/about' },
    { label: 'Karriere', href: '/careers' },
    { label: 'Presse', href: '/press' },
    { label: 'Blogg', href: '/blog' },
  ];

  const sosialeLinks = [
    { label: 'Instagram', href: 'https://instagram.com/tosom' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/tosom' },
    { label: 'TikTok', href: 'https://tiktok.com/@tosom' },
  ];

  return (
    <footer
      className="py-36 md:py-48 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0B0F14 0%, #07090C 100%)' }}
    >
      {/* Ambient glow bak footer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15) 30%, rgba(212,175,55,0.15) 70%, transparent)',
          boxShadow: '0 0 40px rgba(212,175,55,0.1)',
        }}
      />
      
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        {/* 4-kolonne grid — meir spacing */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-28 md:gap-y-28 gap-x-16 md:gap-x-20">
          {/* Kolonne 1: Logo + beskrivelse */}
          <div>
            {/* Gull-logo */}
            <div
              className="mb-4 pulse-icon"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.25))',
              }}
            >
              <svg width="44" height="44" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="20" r="12" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                <circle cx="25" cy="20" r="12" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                <circle cx="20" cy="20" r="6" fill="none" stroke="#D4AF37" strokeWidth="1" />
              </svg>
            </div>
            <p
              className="text-sm leading-[1.7]"
              style={{ color: 'rgba(255, 255, 255, 0.45)' }}
            >
              Ein roleg, privat plattform for ekte relasjonar.
            </p>
          </div>

          {/* Kolonne 2: Produkt */}
          <div>
            <h4 className="text-white font-semibold text-base tracking-[-0.005em] leading-[1.1] mb-5">
              Produkt
            </h4>
            <ul className="space-y-3.5">
              {produktLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-[#D4AF37] transition-all duration-300 leading-[1.6] hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.4)] inline-block hover:scale-[1.02]"
                    style={{ transformOrigin: 'left center' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolonne 3: Selskap */}
          <div>
            <h4 className="text-white font-semibold text-base tracking-[-0.005em] leading-[1.1] mb-5">
              Selskap
            </h4>
            <ul className="space-y-3.5">
              {selskapLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-[#D4AF37] transition-all duration-300 leading-[1.6] hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.4)] inline-block hover:scale-[1.02]"
                    style={{ transformOrigin: 'left center' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolonne 4: Følg oss */}
          <div>
            <h4 className="text-white font-semibold text-base tracking-[-0.005em] leading-[1.1] mb-5">
              Følg oss
            </h4>
            <ul className="space-y-3.5">
              {sosialeLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 text-sm hover:text-[#D4AF37] transition-all duration-300 leading-[1.6] hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.4)] inline-block hover:scale-[1.02]"
                    style={{ transformOrigin: 'left center' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright-linje — meir luft */}
        <div
          className="mt-20 pt-10 text-center"
          style={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 1px 0 rgba(212,175,55,0.06)',
          }}
        >
          <p
            className="text-xs"
            style={{ color: 'rgba(255, 255, 255, 0.3)' }}
          >
            © {year} {companyName}. Alle rettar reserverte.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;