/**
 * ToSom — Onboarding steg 2: E-post
 * 
 * Brukeren skriv inn e-postadressa di.
 * Vi sender ein magisk lenke som logger dei inn automatisk.
 * Deretter redirect til /onboarding/phone
 */

'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function Page() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Skriv inn ei gyldig e-postadresse');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Kunne ikkje sende lenke');
        return;
      }

      setSent(true);
    } catch (err) {
      setError('Nettverksfeil. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0B1520' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="text-3xl font-semibold" style={{ color: '#D4AF37' }}>
            ToSom
          </Link>
        </div>

        {/* Innhald */}
        {sent ? (
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4" style={{ color: '#FFFFFF' }}>
              Sjekk e-posten din
            </h1>
            <p className="mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Vi har sendt ei lenke til{' '}
              <strong style={{ color: '#FFFFFF' }}>{email}</strong>
            </p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Lenka gjeld i 1 time
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>
              Kom i gang
            </h1>
            <p className="mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Skriv inn e-postadressa di. Vi sender deg ei trygg lenke.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="din@epost.no"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  onFocus={(e) => {
                    e.target.style.borderColor = '#D4AF37';
                    e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.target.style.boxShadow = 'none';
                  }}
                  autoFocus
                />
              </div>

              {error && (
                <p style={{ color: '#FF4D4D', fontSize: '14px', margin: 0 }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full font-medium transition-all duration-300"
                style={{
                  background: '#D4AF37',
                  color: '#0B1520',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  fontSize: '16px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Sendar lenke...' : 'Send magisk lenke'}
              </button>
            </form>
          </div>
        )}

        {/* Tilbake */}
        <div className="mt-8 text-center">
          <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            ← Tilbake
          </Link>
        </div>
      </div>
    </div>
  );
}