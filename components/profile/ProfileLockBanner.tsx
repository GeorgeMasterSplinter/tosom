'use client';

/**
 * Tosom — Profil-lås-banner
 * 
 * Viser at profilen er låst mens bruker har aktiv journey.
* Bruk: importer og render på /profile og /onboarding.
 */

import { radius, color } from '@/config/design-tokens';

interface ProfileLockBannerProps {
  /** Partnerens navn — vises i teksten */
  partnerName?: string;
  /** Dagen de er på (f.eks. 7 av 30) */
  currentDay?: number;
  /** Totalt antal dagar i reise */
  totalDays?: number;
}

export function ProfileLockBanner({
  partnerName = 'partneren din',
  currentDay = 1,
  totalDays = 30,
}: ProfileLockBannerProps) {
  return (
    <div
      className="w-full rounded-2xl p-6 mb-6 relative overflow-hidden"
      style={{
        background: 'rgba(212, 175, 55, 0.04)',
        border: '1px solid rgba(212, 175, 55, 0.15)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Bakgrunns glød */}
      <div
        className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.08), transparent)',
          borderRadius: '50%',
          transform: 'translate(30%, -30%)',
        }}
      />

      <div className="relative z-10 flex items-start gap-4">
        {/* Icon */}
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3
            className="mb-2 font-semibold"
            style={{
              fontSize: '17px',
              color: '#D4AF37',
            }}
          >
            Profil låst under reise 🔒
          </h3>

          <p
            style={{
              fontSize: '15px',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.55)',
              margin: 0,
            }}
          >
            Profilen din er låst mens du er i reise med {partnerName}. 
            Dag {currentDay} av {totalDays}. Du kan oppdatere profilen din igjen etter at reisa er fullført.
          </p>

          {/* Låst-indikator */}
          <div className="mt-3 flex items-center gap-2">
            <div
              className="h-1 rounded-full"
              style={{
                flex: '1',
                background: 'rgba(255, 255, 255, 0.06)',
                maxWidth: '120px',
              }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(currentDay / totalDays) * 100}%`,
                  background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
                }}
              />
            </div>
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.3)' }}>
              {Math.round((currentDay / totalDays) * 100)}% fullført
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * LockOverlay — blocker hele onboarding-seksjon med låst-beskjed
 */

export function JourneyLockOverlay() {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-6"
      style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-10 text-center"
        style={{
          background: 'rgba(11, 21, 32, 0.95)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          boxShadow: '0 16px 80px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: '2px solid rgba(212, 175, 55, 0.25)',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2
          className="mb-3 text-2xl font-bold"
          style={{ color: '#D4AF37' }}
        >
          Reisa di pågår 🔒
        </h2>

        <p
          style={{
            fontSize: '16px',
            lineHeight: '1.7',
            color: 'rgba(255, 255, 255, 0.5)',
            margin: 0,
          }}
        >
          Du kan ikke oppdatere profilen mens du er i reise. 
          Ta deg tid til å kjenne og forstå partneren din først.
        </p>

        <p
          className="mt-6 text-sm italic"
          style={{ color: 'rgba(255, 255, 255, 0.3)' }}
        >
          Når reisa er fullført kan du oppdatere profilen din og starte ei ny reise.
        </p>
      </div>
    </div>
  );
}