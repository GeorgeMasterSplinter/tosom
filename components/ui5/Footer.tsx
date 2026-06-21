/**
 * ToSom UI 5.0 - Footer (Dark Blue-Gray Edition)
 * 
 * Mørk gradient bakgrunn, gull-gradient-linje overst
 * 4 kolonner: Produkt, Selskap, Støtte, Sosiale ikoner
 * © ToSom. Alle rettar reserverte.
 * Mørk blågrå bakgrunn, responsiv
 * Bokmål
 */

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
  const navLinks = {
    produkt: [
      { label: 'Hvorfor ToSom', href: '/#why' },
      { label: 'Slik fungerer det', href: '/#how' },
      { label: 'Reisen', href: '/#journey' },
      { label: 'Priser', href: '/#pricing' },
    ],
    selskap: [
      { label: 'Om oss', href: '/about' },
      { label: 'Karriere', href: '/careers' },
      { label: 'Presse', href: '/press' },
      { label: 'Blogger', href: '/blog' },
    ],
    støtte: [
      { label: 'Hjelpesenter', href: '/help' },
      { label: 'Personvern', href: '/privacy' },
      { label: 'Vilkår', href: '/terms' },
      { label: 'Trygghet', href: '/safety' },
    ],
  };

  return (
    <footer
      className="relative pt-32 pb-8 lg:pt-40 lg:pb-16 overflow-hidden"
      style={{
        background: `
          linear-gradient(180deg, #0C0F14 0%, #10141A 30%, #14181E 50%, #10141A 70%, #0C0F14 100%)
        `,
        boxShadow: '0 -24px 80px rgba(0,0,0,0.35)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 50% 80%, rgba(80,120,255,0.06), transparent 70%),
            radial-gradient(circle at center, transparent 55%, rgba(0,0,0,0.27) 100%)
          `,
        }}
      />
      {/* Round 6: Gull line +5% glow */}
      <div
        className="h-[2px] w-full relative"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.63), transparent)',
          boxShadow: '0 0 32px rgba(212,175,55,0.42)',
        }}
      />
      <div
        className="h-[6px] w-full relative -translate-y-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.21), transparent)',
          filter: 'blur(4px)',
        }}
      />

      <div className="mx-auto max-w-[1600px] px-6 lg:px-8">
        {/* Round 6: mb +12px */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-20 mb-20 lg:mb-24">
          {/* Round 6: Logo +10%, stronger gold glow */}
          <div className="md:col-span-1">
            <div className="mb-6 relative">
              <div
                className="absolute -inset-5 -z-10"
                style={{
                  background: 'radial-gradient(circle at center, rgba(212,175,55,0.17), transparent 70%)',
                  filter: 'blur(14px)',
                }}
              />
              <svg width="62" height="62" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{
                  filter: 'drop-shadow(0 0 24px rgba(212,175,55,0.28))',
                }}>
                <circle cx="15" cy="20" r="12" fill="rgba(212, 175, 55, 0.40)" stroke="#D4AF37" strokeWidth="1.5" />
                <circle cx="25" cy="20" r="12" fill="rgba(212, 175, 55, 0.25)" stroke="#D4AF37" strokeWidth="1.5" />
                <circle cx="20" cy="20" r="6" fill="rgba(212, 175, 55, 0.20)" />
              </svg>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'rgba(255, 255, 255, 0.35)' }}
            >
              En rolig, privat plattform for ekte relasjoner.
            </p>
          </div>

          {/* Produkt */}
          <div>
            <h4
              className="text-sm font-semibold mb-5"
              style={{ color: '#D4AF37' }}
            >
              Produkt
            </h4>
            <ul className="space-y-3">
              {navLinks.produkt.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-all duration-300 ease-out inline-block"
                    style={{ color: 'rgba(255, 255, 255, 0.38)' }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = '#D4AF37';
                      (e.target as HTMLElement).style.textShadow = '0 0 14px rgba(212,175,55,0.45)';
                      (e.target as HTMLElement).style.transform = 'translateX(3px) scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.38)';
                      (e.target as HTMLElement).style.textShadow = 'none';
                      (e.target as HTMLElement).style.transform = 'translateX(0) scale(1)';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Selskap */}
          <div>
            <h4
              className="text-sm font-semibold mb-5"
              style={{ color: '#D4AF37' }}
            >
              Selskap
            </h4>
            <ul className="space-y-3">
              {navLinks.selskap.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-all duration-300 ease-out inline-block"
                    style={{ color: 'rgba(255, 255, 255, 0.38)' }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = '#D4AF37';
                      (e.target as HTMLElement).style.textShadow = '0 0 14px rgba(212,175,55,0.45)';
                      (e.target as HTMLElement).style.transform = 'translateX(3px) scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.38)';
                      (e.target as HTMLElement).style.textShadow = 'none';
                      (e.target as HTMLElement).style.transform = 'translateX(0) scale(1)';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sosiale ikoner */}
          <div>
            <h4
              className="text-sm font-semibold mb-5"
              style={{ color: '#D4AF37' }}
            >
              Følg oss
            </h4>
            <div className="flex items-center gap-3">
              {['twitter', 'instagram', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ease-out relative overflow-hidden"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'rgba(255, 255, 255, 0.30)',
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.03)',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(212, 175, 55, 0.15)';
                    (e.target as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.35)';
                    (e.target as HTMLElement).style.color = '#D4AF37';
                    (e.target as HTMLElement).style.boxShadow = 'inset 0 0 14px rgba(212,175,55,0.10), 0 0 20px rgba(212,175,55,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.03)';
                    (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.30)';
                    (e.target as HTMLElement).style.boxShadow = 'inset 0 0 10px rgba(255,255,255,0.03)';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="8" r="3" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Nedre footer */}
        <div
          className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 relative"
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <p
            className="text-xs"
            style={{ color: 'rgba(255, 255, 255, 0.20)' }}
          >
            © {year} {companyName}. Alle rettigheter reservert.
          </p>
          <p
            className="text-xs"
            style={{ color: 'rgba(255, 255, 255, 0.16)' }}
          >
            En rolig, privat plattform for ekte relasjoner.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;