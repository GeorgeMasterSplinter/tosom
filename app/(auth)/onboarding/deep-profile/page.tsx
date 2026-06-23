/**
 * ToSom — Djup Profil Onboarding
 * 
 * 10 steg: identitet, livssituasjon, livsstil, personlighet,
 * relasjonsstil, kommunikasjon, intimitet, framtidsvisjon, grenser, oppsummering.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

const DIMS = [
  { key: 'identityName', title: 'Kva skal du bli kalla?', desc: 'Namn du vil bli kjent med som', icon: '🌱' },
  { key: 'lifeSituation', title: 'Livssituasjon', desc: 'Jobb, bustad, kvardag', icon: '🏠' },
  { key: 'lifestyle', title: 'Livsstil', desc: 'Aktivitet, sosialt, helger', icon: '🌊' },
  { key: 'personality', title: 'Personlegheit', desc: 'Styrkar, trekk, natur', icon: '✨' },
  { key: 'relationshipStyle', title: 'Relasjonsstil', desc: 'Kva type relasjon søker du?', icon: '💛' },
  { key: 'communication', title: 'Kommunikasjon', desc: 'Korleis kommuniserer du best?', icon: '💬' },
  { key: 'intimacy', title: 'Intimitet & nærheit', desc: 'Modent svar på nærheitsbehov', icon: '🕊️' },
  { key: 'futureVision', title: 'Framtidsvisjon', desc: 'Mål, draumar, retning', icon: '🌅' },
  { key: 'boundaries', title: 'Grenser & behov', desc: 'Kva er viktig for deg?', icon: '🛡️' },
  { key: 'emotionalNeeds', title: 'Emosjonelle behov', desc: 'Kva treng du for å trive?', icon: '💎' },
];

export default function DeepProfilePage() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  function handleChange(key: string, val: any) {
    setValues(prev => ({ ...prev, [key]: val }));
  }

  function nextStep() {
    if (step < DIMS.length) setStep(step + 1);
  }

  async function handleFinish() {
    setLoading(true);
    // TODO: userId frå session
    // await fetch('/api/onboarding/deep-profile?userId=xxx', { method: 'POST', body: JSON.stringify(values) });
    setLoading(false);
  }

  const dim = DIMS[step];
  const progress = ((step + 1) / DIMS.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20" style={{ background: '#0B1520' }}>
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-semibold" style={{ color: '#D4AF37' }}>
            ToSom
          </Link>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <span>Steg {step + 1} av {DIMS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: '#D4AF37' }}
            />
          </div>
        </div>

        {/* Steg-innhald */}
        <div className="mb-12">
          <div className="text-4xl mb-6">{dim?.icon}</div>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>
            {dim?.title}
          </h1>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
            {dim?.desc}
          </p>

          {/* Input-område basert på type */}
          <div className="space-y-4">
            {step === 0 && (
              <input
                type="text"
                placeholder="Kva vil du bli kalla?"
                className="w-full"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  outline: 'none',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#D4AF37'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.25)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                onChange={(e) => handleChange('identityName', e.target.value)}
              />
            )}

            {step === 1 && (
              <textarea
                placeholder="Fortel litt om kvar du er i livet..."
                className="w-full"
                rows={4}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#D4AF37'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.25)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                onChange={(e) => handleChange('lifeSituation', e.target.value)}
              />
            )}

            {(step === 2 || step === 3) && (
              <div className="grid grid-cols-3 gap-3">
                {['Aktiv', 'Middels', 'Roelig'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleChange(step === 2 ? 'lifestyle' : 'personality', opt)}
                    className="py-3 text-sm transition-all duration-300"
                    style={{
                      background: values[step === 2 ? 'lifestyle' : 'personality'] === opt
                        ? 'rgba(212,175,55,0.15)'
                        : 'rgba(255,255,255,0.04)',
                      border: values[step === 2 ? 'lifestyle' : 'personality'] === opt
                        ? '1px solid rgba(212,175,55,0.5)'
                        : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {step >= 4 && (
              <textarea
                placeholder="Fortel oss meir..."
                className="w-full"
                rows={4}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#D4AF37'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.25)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                onChange={(e) => handleChange(dim.key, e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Navigasjon */}
        <div className="flex justify-between items-center">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}
            >
              ← Tidre
            </button>
          ) : (
            <div />
          )}

          {step < DIMS.length - 1 ? (
            <button
              onClick={nextStep}
              className="font-medium transition-all duration-300"
              style={{
                background: '#D4AF37',
                color: '#0B1520',
                borderRadius: '12px',
                padding: '12px 32px',
                fontSize: '16px',
                border: 'none',
              }}
            >
              Neste →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="font-medium transition-all duration-300"
              style={{
                background: loading ? 'rgba(212,175,55,0.3)' : '#D4AF37',
                color: '#0B1520',
                borderRadius: '12px',
                padding: '12px 32px',
                fontSize: '16px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Lagrar...' : 'Fullfør djup profil'}
            </button>
          )}
        </div>

        {/* Tilbake */}
        <div className="mt-12 text-center">
          <Link href="/betaling" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            ← Tilbake til betaling
          </Link>
        </div>
      </div>
    </div>
  );
}