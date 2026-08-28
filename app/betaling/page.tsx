/**
 * Tosom — Start reisen (B4.2)
 *
 * BETA: Reisen er gratis for alle inviterte. Ingen betaling skjer her.
 * Betalingsvei er ikke implementert (config/features.ts kaster ved
 * PAYMENTS_ENABLED=true). Derfor vises ingen pris på denne siden.
 *
 * Ved lansering: første 5 000 gratis, deretter 349 kr per reise.
 * Prisinformasjon settes inn igjen samtidig som betaling aktiveres.
 *
 * B4.2: Samtykket om oppstart lagres som withdrawalWaiverAt. Teksten oppfyller
 * kravet i angrerettloven § 22 om uttrykkelig forhåndssamtykke og erkjennelse
 * av at angreretten faller bort. Under beta er tjenesten vederlagsfri, så
 * bestemmelsen har ingen økonomisk virkning ennå.
 *
 * Grensen går ved koblingen, ikke ved en dato — se config/legal.ts REFUND.
 */



'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BetalingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [withdrawalWaiver, setWithdrawalWaiver] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStartJourney() {
    setError(null);

    // B4.2: Begge avkrysninger kreves
    if (!termsAccepted) {
      setError('Du må akseptere vilkårene for bruk for å starte reisen.');
      return;
    }
    if (!withdrawalWaiver) {
      setError('Du må samtykke til at reisen starter straks for å fortsette.');
      return;
    }

    setLoading(true);
    try {
      // B4.3: Gratismodus — Vipps-nøkler kommer om ~2 uker
      // Inntil da: send brukeren direkte til kø
      const res = await fetch('/api/journey/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          termsAccepted: true,
          withdrawalWaiver: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Kunne ikke starte reisen');
      }

      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20" style={{ background: '#0B1520' }}>
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-semibold" style={{ color: '#D4AF37' }}>
            Tosom
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[32px] font-semibold mb-4" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Klar til å starte reisen?
          </h1>
          <p className="text-lg" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
            Tosom er i lukket beta. Reisen er gratis for deg som er invitert.
          </p>
        </div>

        {/* Pris-kort */}
        <div
          className="mb-8"
          style={{
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '20px',
            padding: '32px',
          }}
        >
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-medium" style={{ color: '#FFFFFF' }}>
              Én reise
            </h2>
            <p className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
              Gratis i beta
            </p>
          </div>
          <ul className="space-y-3">
            {[
              'Én match — koblet til deg, ikke valgt av deg',
              '30 dagers guidet reise sammen',
              'Bli kjent-spørsmål underveis',
              'Bilder fra dag 15',
              'Alt slettes ved reiseslutt',
            ].map((feature) => (
              <li key={feature} className="flex items-start text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <span className="mr-3 mt-0.5" style={{ color: '#D4AF37' }}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* B4.2: Vilkår-samtykke (kreves) */}
        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 rounded"
              style={{ accentColor: '#D4AF37' }}
            />
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
              Jeg har lest og aksepterer{' '}
              <Link href="/vilkar" className="underline" style={{ color: '#D4AF37' }}>
                vilkårene for bruk
              </Link>{' '}
              og{' '}
              <Link href="/personvern" className="underline" style={{ color: '#D4AF37' }}>
                personvernerklæringen
              </Link>
              . Jeg forstår at Tosom kobler meg til én person, og at samtalen slettes for begge hvis én av oss avslutter.
            </span>
          </label>
        </div>

        {/* B4.2: Angrerett-samtykke (kreves — ellers 14 dagers refusjonskrav) */}
        <div
          className="mb-8"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '16px',
          }}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={withdrawalWaiver}
              onChange={(e) => setWithdrawalWaiver(e.target.checked)}
              className="mt-1 w-5 h-5 rounded"
              style={{ accentColor: '#D4AF37' }}
            />
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
              Jeg samtykker til at reisen starter ved neste kobling, natt til lørdag, og forstår at
              angreretten bortfaller når koblingen er gjort. Fram til da kan jeg melde meg ut.
            </span>
          </label>
        </div>

        {/* Feilmelding */}
        {error && (
          <div
            className="mb-6 text-sm"
            style={{
              color: '#FF6B6B',
              background: 'rgba(255,77,77,0.1)',
              border: '1px solid rgba(255,77,77,0.2)',
              borderRadius: '8px',
              padding: '12px 16px',
            }}
          >
            {error}
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleStartJourney}
            disabled={loading || !termsAccepted || !withdrawalWaiver}
            className="font-medium transition-all duration-300 w-full"
            style={{
              background: loading || !termsAccepted || !withdrawalWaiver
                ? 'rgba(212,175,55,0.3)'
                : '#D4AF37',
              color: '#0B1520',
              borderRadius: '12px',
              padding: '16px 48px',
              fontSize: '17px',
              border: 'none',
              cursor: loading || !termsAccepted || !withdrawalWaiver ? 'not-allowed' : 'pointer',
              opacity: loading || !termsAccepted || !withdrawalWaiver ? 0.6 : 1,
            }}
          >
            {loading ? 'Starter reisen...' : 'Start reisen'}
          </button>

          <p className="mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Ingen betaling under beta. Du blir varslet i god tid før dette endrer seg.
          </p>

        </div>

        {/* Tilbake */}
        <div className="mt-12 text-center">
          <Link
            href="/onboarding"
            style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}
          >
            ← Tilbake
          </Link>
        </div>
      </div>
    </div>
  );
}