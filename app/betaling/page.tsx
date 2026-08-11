/**
 * ToSom — Betaling
 * 
 * Premium-side for valg av betalingsplan.
 * Enkel, roleg, gull-aestetikk.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

const PLANS = [
  {
    id: 'weekly',
    name: 'Veke',
    price: '149',
    period: '/veke',
    description: 'Prøv ToSom med ei kort avtale.',
    features: ['Åpne for 1 match', 'Guidet reise i 7 dagar', 'Full tilgang'],
    highlighted: false,
  },
  {
    id: 'monthly',
    name: 'Månad',
    price: '299',
    period: '/månad',
    description: 'Den vanlege måten å oppleve ToSom på.',
    features: ['Åpne for 1 match per 24t', 'Guidet 30-dagers reise', 'Full tilgang til alt'],
    highlighted: true,
  },
  {
    id: 'quarterly',
    name: '3 månader',
    price: '699',
    period: '/3 mnd',
    description: 'Set spare dei mest og viser commitment.',
    features: ['Sparr 226 kr', 'Guidet 30-dagers reise', 'Full tilgang til alt'],
    highlighted: false,
  },
];

export default function BetalingPage() {
  const [selected, setSelected] = useState('monthly');
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    try {
      const res = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selected }),
      });
      if (!res.ok) throw new Error('Kunne ikke starte betaling');
      const { url } = await res.json();
      if (url) window.location.href = url;
      else setSelected(selected); // Fallback — redirect til bekreftelse
    } catch {
      // Silently fail for dev
      console.error('Betaling feila');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20" style={{ background: '#0B1520' }}>
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-semibold" style={{ color: '#D4AF37' }}>
            ToSom
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-[32px] font-semibold mb-4" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Fullfør profilen din
          </h1>
          <p className="text-lg" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
            Vel den planen som passar deg best.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className="text-left transition-all duration-300 w-full"
              style={{
                background: selected === plan.id
                  ? 'rgba(212,175,55,0.12)'
                  : 'rgba(255,255,255,0.04)',
                border: selected === plan.id
                  ? '1px solid rgba(212,175,55,0.5)'
                  : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '24px',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {plan.highlighted && (
                <span
                  className="text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{ color: '#D4AF37' }}
                >
                  Populær
                </span>
              )}
              <h3 className="text-xl font-medium mb-1" style={{ color: '#FFFFFF' }}>
                {plan.name}
              </h3>
              <p className="mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {plan.price}{plan.period}
              </p>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.5' }}>
                {plan.description}
              </p>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <span className="mr-2" style={{ color: '#D4AF37' }}>•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="font-medium transition-all duration-300"
            style={{
              background: loading ? 'rgba(212,175,55,0.3)' : '#D4AF37',
              color: '#0B1520',
              borderRadius: '12px',
              padding: '14px 48px',
              fontSize: '17px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Handlar...' : `Vel ${PLANS.find(p => p.id === selected)?.name} — ${PLANS.find(p => p.id === selected)?.price} kr${PLANS.find(p => p.id === selected)?.period}` }
          </button>

          <p className="mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Trygg betaling. Ingen binding. Avslutt når du vil.
          </p>
        </div>

        {/* Tilbake */}
        <div className="mt-12 text-center">
          <Link
            href="/onboarding/phone"
            style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}
          >
            ← Tilbake
          </Link>
        </div>
      </div>
    </div>
  );
}