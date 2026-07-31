'use client';

/**
 * ToSom — Admin Login Page 🔐
 * 
 * Ren login-form med ambient glow, glassmorphism-kort, og gull-gradient knapp.
 * Ingen sidebar, ingen header — berre det som trengst for å logge inn.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* ─── Ambient Glow (berre for login-sida) ─── */

function AmbientGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Blå glow øvst i høgre hjørne */}
      <div
        className="absolute -top-32 -right-32"
        style={{
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
        }}
      />
      {/* Gullglow nedst i venstre hjørne */}
      <div
        className="absolute -bottom-32 -left-32"
        style={{
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10,26,42,0.1) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}

/* ─── Hovud-komponent — Login Page ─── */

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Feil ved innlogging');
        return;
      }

      // Suksess — redirect til dashboard
      router.push('/admin');
    } catch {
      setError('Tilkoplingsfeil. Prøv på nytt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Ambient glow */}
      <AmbientGlow />

      {/* Glassmorphism login-kort */}
      <div
        className="w-full max-w-md p-8 rounded-2xl relative z-10"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)' }}
          >
            <span className="text-xl font-bold text-[#0A1A2A]">T</span>
          </div>
        </div>

        {/* Overskrift */}
        <h1
          className="text-center text-xl font-bold mb-1"
          style={{ color: 'rgba(255,255,255,0.95)' }}
        >
          Admin-login
        </h1>
        <p
          className="text-center text-sm mb-8"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          Berre autorisert personell
        </p>

        {/* Feilmelding */}
        {error && (
          <div
            className="mb-6 px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(255,77,77,0.1)', color: '#FF4D4D' }}
          >
            {error}
          </div>
        )}

        {/* Login-form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium mb-2"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              E-post
            </label>
            <input
              id="email"
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="george@tosom.no"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'white',
              }}
            />
          </div>

          {/* Passord */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium mb-2"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              Passord
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'white',
              }}
            />
          </div>

          {/* Knapp */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: loading ? 'rgba(212,175,55,0.5)' : 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
              color: '#0A1A2A',
            }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[rgba(10,26,42,0.3)] border-t-[#0A1A2A] rounded-full animate-spin" />
                Logger inn...
              </>
            ) : (
              'Logg inn'
            )}
          </button>
        </form>

        {/* Tilbake-lenke */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs transition-colors duration-200"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
          >
            ← Tilbake til ToSom
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>
        ToSom Admin v1.0 — Auatorisert tilgang berre
      </p>
    </div>
  );
}