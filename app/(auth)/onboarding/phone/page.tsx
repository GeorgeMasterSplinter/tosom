/**
 * ToSom — Onboarding steg 3: Telefon
 * 
 * Brukeren skriv inn telefonnummer → får 6-sifret kode via SMS
 * Deretter verifiserer koden → redirect til /onboarding/payment
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Page() {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!cleanPhone || !/^\+?[0-9]{7,15}$/.test(cleanPhone)) {
      setError('Skriv inn eit gyldig telefonnummer (t.d. +4712345678)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/phone/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Kunne ikkje sende kode');
        return;
      }

      setSent(true);
      setStep('code');
    } catch (err) {
      setError('Nettverksfeil. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!code || code.length !== 6) {
      setError('Koden må vere 6 siffer');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.replace(/[\s-]/g, ''), code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ugyldig kode');
        return;
      }

      // Redirect skjer automatisk av /api/auth/phone/verify
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
        {step === 'phone' ? (
          <div>
            <h1 className="text-2xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>
              Telefonnummer
            </h1>
            <p className="mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Vi sender deg ei kode via SMS.
            </p>

            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <input
                  type="tel"
                  placeholder="+4712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  background: loading ? 'rgba(212,175,55,0.3)' : '#D4AF37',
                  color: '#0B1520',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  fontSize: '16px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Sendar kode...' : 'Send kode'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>
              Sjekk koden
            </h1>
            <p className="mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Vi har sendt ei kode til{' '}
              <strong style={{ color: '#FFFFFF' }}>{phone}</strong>
            </p>

            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full text-center text-2xl tracking-[0.5em] font-mono"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: '#FFFFFF',
                    fontSize: '24px',
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
                  maxLength={6}
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
                  background: loading ? 'rgba(212,175,55,0.3)' : '#D4AF37',
                  color: '#0B1520',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  fontSize: '16px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Verifiserer...' : 'Verifiser'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setSent(false); setError(''); }}
                  style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}
                >
                  ← Endre telefonnummer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tilbake */}
        <div className="mt-8 text-center">
          <Link href="/onboarding/start" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            ← Tilbake
          </Link>
        </div>
      </div>
    </div>
  );
}