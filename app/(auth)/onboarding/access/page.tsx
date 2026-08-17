/**
 * Tosom — Onboarding steg: Tilgangskontroll
 * 
 * Visar kven som kan bruke Tosom, tryggleikskriteria og gir brukaren
 * moglegheit til å bekrefte at dei oppfyller kravene før vidare.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CHECKS = [
  { icon: '🌱', title: 'Du er 21 år eller eldre', desc: 'Tosom er laga for vaksne som meiningsfull kontakt.' },
  { icon: '💛', title: 'Du søker seriøst forhold', desc: 'Plattforma er for dei som vil verkeleg dybde, ikke overfladisk kontakt.' },
  { icon: '🛡️', title: 'Du respektar andrar grenser', desc: 'Grenser og respekt er grunnlaget for ein trygg prosess.' },
];

export default function AccessPage() {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const canProceed = confirmed && agreeTerms;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: '#0B1520' }}>
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-semibold tracking-tight" style={{ color: '#D4AF37' }}>
            Tosom
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight mb-3" style={{ color: '#FFFFFF' }}>
            Trygghet først
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Tosom er bygd for voksne som ønskjer ein dypare måte å møte noen på. 
            Desse kriteria gjeld for alle brukere.
          </p>
        </div>

        {/* Kriterier */}
        <div className="space-y-5 mb-10">
          {CHECKS.map((c, i) => (
            <div
              key={i}
              className="flex gap-4 items-start"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                padding: '20px',
              }}
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{c.icon}</span>
              <div>
                <h3 className="font-medium text-sm mb-1" style={{ color: '#FFFFFF' }}>{c.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bekreftelse */}
        <div className="space-y-4 mb-10">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-5 h-5 flex-shrink-0 rounded cursor-pointer"
              style={{ accentColor: '#D4AF37' }}
            />
            <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Eg bekreftar at eg oppfyller desse kriteria.
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-5 h-5 flex-shrink-0 rounded cursor-pointer"
              style={{ accentColor: '#D4AF37' }}
            />
            <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Eg har lese og godtek{' '}
              <Link href="/vilkar" className="underline hover:no-underline" style={{ color: '#D4AF37' }}>
                vilkår for bruk
              </Link>{' '}
              og{' '}
              <Link href="/personvern" className="underline hover:no-underline" style={{ color: '#D4AF37' }}>
                personvern
              </Link>.
            </span>
          </label>
        </div>

        {/* Knappar */}
        <div className="flex gap-4">
          <Link
            href="/register"
            className="flex-1 text-center font-medium transition-all duration-300 py-3 rounded-xl"
            style={{
              background: agreeTerms ? 'rgba(255,255,255,0.06)' : 'transparent',
              border: `1px solid ${agreeTerms ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)'}`,
              color: 'rgba(255,255,255,0.5)',
              cursor: agreeTerms ? 'pointer' : 'default',
            }}
          >
            Tilbake
          </Link>

          <button
            onClick={() => router.push('/onboarding/start')}
            disabled={!canProceed}
            className="flex-[2] font-medium transition-all duration-300 py-3 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: canProceed ? 'linear-gradient(135deg, #D4AF37, #E8C766)' : 'rgba(212,175,55,0.15)',
              color: canProceed ? '#0B1520' : 'rgba(255,255,255,0.25)',
              border: canProceed ? 'none' : '1px solid rgba(212,175,55,0.15)',
              cursor: canProceed ? 'pointer' : 'not-allowed',
              opacity: canProceed ? 1 : 0.5,
            }}
          >
            Fortsett
            <span style={{ fontSize: '18px' }}>→</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Tosom bruker verifisering og moderering for å halde samfunnet trygt.
          </p>
        </div>

      </div>
    </div>
  );
}