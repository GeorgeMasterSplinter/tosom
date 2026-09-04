'use client';

/**
 * Tosom — Ventefase-dashbord ("Du er i venterommet")
 * 
 * Vises når brukeren har fullført onboarding men ingen match ennå.
 * Har glass-panel med animasjon og rolig "match leter..."-følelse.
 * B2.3: «Får du kalde føtter»-knapp — brukeren kan forlate køen så lenge hun er QUEUED.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { radius, color, typography } from '@/config/design-tokens';
import { PulsingOrb } from '@/components/ui/feedback/PulsingOrb';
import { csrfFetch } from '@/lib/api/csrfClient';

/* ====== Glass Animasjon (importert fra delt komponent) ====== */

/* ====== Countdown Timer ====== */


/* ====== Main Component ====== */

export function WaitingForMatch({ userName }: { userName: string }) {
  const router = useRouter();
  const [leavingQueue, setLeavingQueue] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [leavingJourney, setLeavingJourney] = useState(false);

  // B2.3: Forlat køen — DELETE /api/journey/queue
  const handleLeaveQueue = async () => {
    setLeavingQueue(true);
    try {
      const res = await csrfFetch('/api/journey/queue', { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Kunne ikke forlate køen. Prøv igjen.');
        setLeavingQueue(false);
        setShowConfirm(false);
      }
    } catch {
      alert('Kunne ikke forlate køen. Prøv igjen.');
      setLeavingQueue(false);
      setShowConfirm(false);
    }
  };

  // 1.3: Angrerett — POST /api/journey/exit (eksisterende utmeldingsflyt)
  const handleAngerett = async () => {
    setLeavingJourney(true);
    try {
      const res = await csrfFetch('/api/journey/exit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'angrerett' }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Kunne ikke melde deg ut. Prøv igjen.');
        setLeavingJourney(false);
      }
    } catch {
      alert('Kunne ikke melde deg ut. Prøv igjen.');
      setLeavingJourney(false);
    }
  };

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
          Du er i venterommet, {userName.split(' ')[0]}
        </h2>

        {/* Undertekst — natt til lørdag (masterplan v8.0 del 6.4) */}
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
          Vi kobler natt til lørdag. Da får du beskjed, og reisen starter.
        </p>

        {/* Countdown (mock) */}

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

        {/* B2.3: Får du kalde føtter — diskret knapp med bekreftelse */}
        <div className="mt-4">
          {showConfirm ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Du hopper over denne runden. Pengene går med, men du kan melde deg på igjen neste uke.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleLeaveQueue}
                  disabled={leavingQueue}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: 'rgba(255, 77, 77, 0.15)',
                    color: '#FF6B6B',
                    border: '1px solid rgba(255, 77, 77, 0.3)',
                  }}
                >
                  {leavingQueue ? 'Behandler...' : 'Ja, vent til neste runde'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  Avbryt
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="text-sm underline transition-all duration-200 hover:brightness-125"
              style={{ color: 'rgba(255, 255, 255, 0.35)' }}
            >
              Får du kalde føtter?
            </button>
          )}
        </div>

        {/* 1.3: Ombestemme deg — nedtonet lenke (masterplan v8.0 del 9.3) */}
        <div className="mt-6 text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
          <button
            type="button"
            onClick={handleAngerett}
            disabled={leavingJourney}
            className="underline underline-offset-2 transition-opacity duration-200 disabled:opacity-50 hover:opacity-80"
          >
            Ombestemme deg? Få pengene tilbake og slett kontoen.
          </button>
          <span className="block mt-1">Fra lørdag er dere to i gang. Vil du melde deg på igjen, starter du på nytt.</span>
        </div>
      </div>
    </div>
  );
}
