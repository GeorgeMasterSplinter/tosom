'use client';

/**
 * ToSom — Ventefase-dashbord ("Din match er på vei")
 * 
 * Vises når brukeren har fullført onboarding men ingen match ennå.
 * Har glass-panel med animasjon og rolig "match leter..."-følelse.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { radius, color, typography } from '@/config/design-tokens';

/* ====== Glass Animasjon ====== */

function PulsingOrb() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: '160px', height: '160px' }}>
      {/* Ytre ring — pulsere */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: '2px solid rgba(212, 175, 55, 0.15)',
          animation: 'pulse-ring 3s ease-in-out infinite',
        }}
      />
      {/* Midtre ring */}
      <div
        className="absolute inset-4 rounded-full"
        style={{
          border: '2px solid rgba(212, 175, 55, 0.25)',
          animation: 'pulse-ring 3s ease-in-out infinite 0.5s',
        }}
      />
      {/* Indre ring */}
      <div
        className="absolute inset-8 rounded-full"
        style={{
          border: '2px solid rgba(212, 175, 55, 0.4)',
          animation: 'pulse-ring 3s ease-in-out infinite 1s',
        }}
      />
      {/* Sentrum — gull glød */}
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.3), transparent)',
          animation: 'pulse-glow 2s ease-in-out infinite',
        }}
      >
        <span style={{ fontSize: '32px', lineHeight: 1 }}>💛</span>
      </div>

      {/* CSS-keyframes */}
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ====== Countdown Timer ====== */

function CountdownTimer() {
  const [seconds, setSeconds] = useState(() => Math.floor(Math.random() * 3600) + 7200); // 2-3 timer mock

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <span style={{ fontSize: `${typography.fontSize['2xl']}px`, fontWeight: typography.fontWeight.bold, color: 'rgba(212, 175, 55, 0.8)' }}>
        {String(hours).padStart(2, '0')}:{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  );
}

/* ====== Main Component ====== */

export function WaitingForMatch({ userName }: { userName: string }) {
  return (
    <div
      className="w-full rounded-2xl p-8 md:p-12 text-center animate-fadeIn relative overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(212, 175, 55, 0.12)',
        borderRadius: `${radius.xl}px`,
      }}
    >
      {/* Bakgrunns glød */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.06), transparent 70%)',
        }}
      />

      <div className="relative z-10">
        {/* Pulsing Orb */}
        <PulsingOrb />

        {/* Tittel */}
        <h2
          className="mt-8 mb-3"
          style={{
            fontSize: `${typography.fontSize['2xl']}px`,
            fontWeight: typography.fontWeight.semibold,
            background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Din match er på vei, {userName.split(' ')[0]} 💛
        </h2>

        {/* Undertekst */}
        <p
          className="mb-2"
          style={{
            fontSize: `${typography.fontSize.base}px`,
            color: 'rgba(255, 255, 255, 0.6)',
            maxWidth: '420px',
            margin: '0 auto',
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          Resonans-motoren leter etter din perfekte match. 
          Du vil motta en match innen 24 timer — vi ser til at det passer.
        </p>

        <p
          style={{
            fontSize: `${typography.fontSize.sm}px`,
            color: 'rgba(255, 255, 255, 0.35)',
            fontStyle: 'italic',
          }}
        >
          Hvert sekund nærmer du deg noen spesiell.
        </p>

        {/* Countdown (mock) */}
        <CountdownTimer />

        {/* Opdater profil-knapp — erstattet rå <a href> med next/link (STEG 4.1) */}
        <Link href="/onboarding" className="block w-full mt-8">
          <button
            type="button"
            className="w-full min-h-[52px] py-3.5 px-6 rounded-xl font-medium flex items-center justify-center transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
            style={{
              background: 'rgba(212, 175, 55, 0.08)',
              color: '#D4AF37',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: `${radius.lg}px`,
            }}
          >
            Oppdater profil for bedre match
          </button>
        </Link>
      </div>
    </div>
  );
}