/**
 * Tosom Dashboard 2.0 — DashboardNavBar
 * Forenklet sticky top-navigasjon.
 * Kun logo + 2 handlinger: Samtale + Innstillinger.
 */

'use client';

import { FC } from 'react';
import Link from 'next/link';
import { ToSomLogo } from '@/components/global/ToSomLogo';

const G = {
  gold: '#D4AF37',
  goldSoft: 'rgba(212,175,55,0.08)',
  goldMuted: 'rgba(212,175,55,0.2)',
  goldBorder: 'rgba(212,175,55,0.35)',
};

export const DashboardNavBar: FC = () => {
  return (
    <nav className="w-full sticky top-0 z-40 bg-[var(--ts-bg)]/80 backdrop-blur-xl border-b-[var(--ts-border)] px-6 py-4 flex items-center justify-between ts-glass">
      {/* Logo */}
      <ToSomLogo href="/dashboard" showTagline={false} />

      {/* Høyre side: 1 knapp */}
      <div className="flex items-center gap-3">
        <Link
          href="/settings"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${G.goldSoft}, ${G.goldMuted})`,
            border: `1px solid ${G.goldBorder}`,
            color: G.gold,
          }}
        >
          ⚙ Innstillinger
        </Link>
      </div>

    </nav>
  );
};

export default DashboardNavBar;
