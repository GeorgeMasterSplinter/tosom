/**
 * ToSom — Login med Magic Link
 * 
 * Rolig, trygg innlogging utan passord.
 * Berre e-post + magisk lenke.
 */

'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { GlassPanel } from '@/components/ui5/GlassPanel';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Skriv inn en gyldig e-postadresse.');
      return;
    }
    setLoading(true);
    setError('');
    setSent(false);
    try {
      await signIn('email', {
        email,
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
              ? 'Sjekk e-posten din — vi sender deg en sikker lenke.'
              : 'Send en magisk lenke til e-posten din'}
          </p>
        </div>

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
                En innloggingslenke er sendt til <strong style={{ color: '#D4AF37' }}>{email}</strong>
              </p>
              <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                Lenken gjelder i 60 minutter. Ingen passord er nødvendig.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-sm underline hover:no-underline transition-colors duration-200"
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                Send til en annen e-post
              </button>
            </div>
          </GlassPanel>
        )}

        {/* Form */}
        {!sent && (
          <GlassPanel goldBorder className="mb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="text-xs uppercase tracking-widest font-semibold mb-2 block"
                  style={{ color: '#D4AF37' }}
                >
                  E-post
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="du@eksempel.no"
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
              </div>

              {error && (
                <p className="text-sm" style={{ color: '#FF4D4D' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
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
                {loading ? 'Sender lenke…' : 'Send innloggingslenke'}
              </button>
            </form>
          </GlassPanel>
        )}

        {/* Secondary */}
        <div className="text-center">
          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            {/* TODO: Koble til betalingssteg før full tilgang. */}
            Har du ingen konto?{' '}
            <a
              href="/onboarding"
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