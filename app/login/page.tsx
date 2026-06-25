/**
 * ToSom — Login med Magic Link eller Telefonverifisering
 * 
 * Rolig, trygg innlogging utan passord.
 * E-post + magisk lenke ELLER verifisert telefonnummer.
 */

'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { GlassPanel } from '@/components/ui5/GlassPanel';

type LoginMethod = 'email' | 'phone';

export default function LoginPage() {
  const [method, setMethod] = useState<LoginMethod>('email');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [captchaDone, setCaptchaDone] = useState(false);

  // Invisible captcha placeholder — erstatt med实际 captcha-integrasjon (reCAPTCHA hCaptcha osv)
  const initCaptcha = () => {
    // TODO: Integre invisible captcha (Google reCAPTCHA v3 / hCaptcha invisible)
    setCaptchaDone(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || !input.includes('@')) {
      setError('Skriv inn en gyldig e-postadresse.');
      return;
    }
    if (!captchaDone) {
      setError('Vennligst fullfør sikkerhetsverifisering.');
      return;
    }
    setLoading(true);
    setError('');
    setSent(false);
    try {
      await signIn('email', {
        email: input,
        callbackUrl: '/dashboard',
        redirect: false,
      });
      setSent(true);
    } catch {
      setError('Kunne ikke sende innloggingslenke. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSend = async () => {
    if (!input) {
      setError('Skriv inn et gyldig telefonnummer (+f47...).');
      return;
    }
    if (!captchaDone) {
      setError('Vennligst fullfør sikkerhetsverifisering.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/phone/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: input }),
      });
      const data = await res.json();
      if (data.ok) {
        setSent(true);
      } else {
        setError(data.error || 'Kunne ikke sende verifiseringskode.');
      }
    } catch {
      setError('Kunne ikke sende verifiseringskode. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8" style={{ background: '#0B0E11' }}>
      <div className="w-full max-w-[440px] py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <span
            className="text-xs uppercase tracking-[0.25em] font-semibold mb-4 block"
            style={{ color: '#D4AF37' }}
          >
            Velkommen tilbake
          </span>
          <h1
            className="text-[32px] lg:text-[40px] font-semibold mb-3"
            style={{
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}
          >
            Logg inn
          </h1>
          <p
            className="text-base"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            {sent
              ? method === 'email'
                ? 'Sjekk e-posten din — vi sender deg en sikker lenke.'
                : 'Sjekk telefonen din — vi sendte en verifiseringskode.'
              : 'Velg innloggingsmetode nedenfor'}
          </p>
        </div>

        {/* Login Method Toggle */}
        {!sent && (
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMethod('email')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                method === 'email'
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-white/[0.03] text-white/50 hover:bg-white/[0.06]'
              }`}
              style={
                method === 'email'
                  ? { border: '1px solid rgba(212,175,55,0.3)' }
                  : { border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              E-post
            </button>
            <button
              type="button"
              onClick={() => setMethod('phone')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                method === 'phone'
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-white/[0.03] text-white/50 hover:bg-white/[0.06]'
              }`}
              style={
                method === 'phone'
                  ? { border: '1px solid rgba(212,175,55,0.3)' }
                  : { border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              Telefon
            </button>
          </div>
        )}

        {/* Success State */}
        {sent && (
          <GlassPanel goldBorder className="mb-6 text-center">
            <div className="flex flex-col items-center gap-4 py-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 8L10.5 15.5L21 6M5.5 19L9.5 15L13 18.5L21 10"
                  stroke="#4DFF88"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                {method === 'email' ? (
                  <>
                    En innloggingslenke er sendt til <strong style={{ color: '#D4AF37' }}>{input}</strong>
                  </>
                ) : (
                  <>
                    En verifiseringskode er sendt til <strong style={{ color: '#D4AF37' }}>{input}</strong>
                  </>
                )}
              </p>
              <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                {method === 'email'
                  ? 'Lenken gjelder i 60 minutter. Ingen passord er nødvendig.'
                  : 'Koden gjelder i 10 minutter. Ingen passord er nødvendig.'}
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-sm underline hover:no-underline transition-colors duration-200"
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                Send til en annen {method === 'email' ? 'e-post' : 'telefon'}
              </button>
            </div>
          </GlassPanel>
        )}

        {/* Form */}
        {!sent && (
          <GlassPanel goldBorder className="mb-6">
            <div className="space-y-6">
              {/* Input */}
              <div>
                <label
                  className="text-xs uppercase tracking-widest font-semibold mb-2 block"
                  style={{ color: '#D4AF37' }}
                >
                  {method === 'email' ? 'E-post' : 'Telefonnummer'}
                </label>
                <input
                  type={method === 'email' ? 'email' : 'tel'}
                  autoComplete={method === 'email' ? 'email' : 'tel'}
                  required
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={method === 'email' ? 'du@eksempel.no' : '+47 XXX XX XXX'}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 ease-out"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.5)';
                    (e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    (e.target as HTMLElement).style.boxShadow = 'none';
                  }}
                />
                {method === 'phone' && (
                  <p className="mt-2 text-xs" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                    Norsk nummer med +47_prefiks
                  </p>
                )}
              </div>

              {/* Invisible Captcha Placeholder */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={captchaDone}
                  onChange={(e) => setCaptchaDone(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#D4AF37' }}
                />
                <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Bekreft at du er et menneske (captcha)
                </span>
              </div>

              {error && (
                <p className="text-sm" style={{ color: '#FF4D4D' }}>
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={method === 'email' ? handleEmailSubmit : handlePhoneSend}
                className="w-full px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out"
                style={{
                  background: loading ? 'rgba(212, 175, 55, 0.3)' : '#D4AF37',
                  color: loading ? 'rgba(212, 175, 55, 0.7)' : '#0B0E11',
                }}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    (e.target as HTMLElement).style.background = '#E8C766';
                    (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = loading ? 'rgba(212, 175, 55, 0.3)' : '#D4AF37';
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {loading
                  ? (method === 'email' ? 'Sender lenke…' : 'Sender kode…')
                  : (method === 'email' ? 'Send innloggingslenke' : 'Send verifiseringskode')}
              </button>
            </div>
          </GlassPanel>
        )}

        {/* Secondary */}
        <div className="text-center">
          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            Har du ingen konto?{' '}
            <a
              href="/onboarding/start"
              className="text-[#D4AF37] hover:text-[#E8C766] transition-colors duration-200 underline"
            >
              Opprett konto
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
