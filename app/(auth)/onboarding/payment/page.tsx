/**
 * Tosom — Onboarding steg: Betaling
 * 
 * Ro, trygg betalingsside med Tosom-tone.
 * Viser planer, priser og gir mulighet til å velge abonnement.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    id: 'monthly',
    name: 'Månadsvis',
    price: '149',
    period: '/mnd',
    features: [
      'Én match per reise',
      '30-dagers guidet reise',
      'Refleksjoner og oppgaver',
      'Full tilgang til chat',
    ],
    highlighted: false,
  },
  {
    id: 'quarterly',
    name: 'Kvartal',
    price: '129',
    period: '/mnd',
    features: [
      'Alt i månadsvis',
      '3 månader — sparer 30%',
      'Prioritert support',
      'Tidlig tilgang til nye funksjonar',
    ],
    highlighted: true,
    badge: 'Mest populær',
  },
  {
    id: 'annual',
    name: 'Årsabonnement',
    price: '99',
    period: '/mnd',
    features: [
      'Alt i hvartal',
      '12 månader — sparer 33%',
      'VIP-brukarprofil',
      'Eksklusive arrangement-tilgang',
    ],
    highlighted: false,
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>('quarterly');
  const [loading, setLoading] = useState(false);

  // ST2.3: /api/payment/create-checkout-session fjernet (ruten finnes ikke)
  function handlePayment() {
    router.push('/onboarding');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: '#0B1520' }}>
      <div className="w-full max-w-xl">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-semibold tracking-tight" style={{ color: '#D4AF37' }}>
            Tosom
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight mb-3" style={{ color: '#FFFFFF' }}>
            Vel den som passar deg
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Tosom er en investering i verkelege relasjonar. 
            Ingen binding — se opp når du ønskjer det.
          </p>
        </div>

        {/* Plan-kort */}
        <div className="space-y-4 mb-10">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className="w-full text-left transition-all duration-300 rounded-2xl overflow-hidden group"
              style={{
                background: selectedPlan === plan.id
                  ? 'rgba(212,175,55,0.08)'
                  : 'rgba(255,255,255,0.03)',
                border: selectedPlan === plan.id
                  ? '1px solid rgba(212,175,55,0.4)'
                  : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-base" style={{ color: '#FFFFFF' }}>
                        {plan.name}
                      </h3>
                      {plan.badge && (
                        <span
                          className="text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{
                            background: 'rgba(212,175,55,0.15)',
                            color: '#D4AF37',
                          }}
                        >
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>
                        kr {plan.price}
                      </span>
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Velg-indikator */}
                  <div
                    className="w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center"
                    style={{
                      background: selectedPlan === plan.id ? '#D4AF37' : 'rgba(255,255,255,0.08)',
                      border: `1px solid ${selectedPlan === plan.id ? '#D4AF37' : 'rgba(255,255,255,0.15)'}`,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6L5 8.5L9.5 3.5" stroke={selectedPlan === plan.id ? '#0B1520' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                        <path d="M3 8.5L6 11.5L13 4.5" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          ))}
        </div>

        {/* Tryggleiksinformasjon */}
        <div className="flex items-center gap-3 p-4 rounded-xl mb-8" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
            <path d="M10 2L4 5V9C4 13.5 6.5 17.5 10 19C13.5 17.5 16 13.5 16 9V5L10 2Z" stroke="rgba(212,175,55,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.5 10L9.5 12L12.5 8" stroke="rgba(212,175,55,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Trygg betaling med VIPPS. Se opp når du vil — ingen skjulte kostnader.
          </p>
        </div>

        {/* Knapper */}
        <div className="flex gap-4">
          <Link
            href="/betaling"
            className="flex-1 text-center font-medium transition-all duration-300 py-3 rounded-xl"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
            }}
          >
            Tilbake
          </Link>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-[2] font-medium transition-all duration-300 py-3 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: loading ? 'rgba(212,175,55,0.3)' : 'linear-gradient(135deg, #D4AF37, #E8C766)',
              color: loading ? 'rgba(255,255,255,0.4)' : '#0B1520',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Behandler...' : `Bli med på Tosom — kr ${PLANS.find(p => p.id === selectedPlan)?.price}⁰${PLANS.find(p => p.id === selectedPlan)?.period || '/mnd'}`}
            <span style={{ fontSize: '18px' }}>→</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Ved å holde fram godtek du vilkår for bruk og personvern.
            Du har rettleien om å få refusjon innen 14 dager.
          </p>
        </div>

      </div>
    </div>
  );
}