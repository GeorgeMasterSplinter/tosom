/**
 * ToSom UI 5.0 — Login
 * 
 * Rom, varm og enkel innlogging med Magic Link
 */

'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Header } from '@/components/ui5/Header';
import { GlassPanel } from '@/components/ui5/GlassPanel';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Skriv inn en gyldig e-postadresse.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signIn('email', { email, callbackUrl: '/' });
    } catch {
      setError('Kunne ikke sende innloggingslenke. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8" style={{ background: '#0B0E11' }}>
      <Header currentPath="/login" />

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
            Send ein magisk lenke til e-posten din
          </p>
        </div>

        {/* Form */}
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

        {/* Secondary */}
        <div className="text-center">
          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            Har du ingen konto?{' '}
            <a
              href="/register"
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