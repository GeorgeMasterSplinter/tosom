'use client';

/**
 * Tosom — Admin Login Page 🔐
 * 
 * Premium login med glassmorphism, gull-aksenter, og bokmål.
 * Flytt oppover på sida med minimering av unødvendig luft nederst.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/* ─── Ambient Background — subtilt blå/gull lys ✨ */

function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Blå glød øverst i høyre hjørne */}
      <div
        className="absolute -top-48 -right-48"
        style={{
          width: '640px',
          height: '640px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 65%)',
        }}
      />
      {/* Blå glød nederst i venstre hjørne */}
      <div
        className="absolute -bottom-32 -left-32"
        style={{
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10,26,42,0.15) 0%, transparent 65%)',
        }}
      />
    </div>
  );
}

/* ─── Hovedkomponent — Premium Admin Login ✨ */

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

      router.push('/admin/dashboard');
    } catch {
      setError('Tilkoblingsfeil. Vennligst prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-start justify-center pt-16 sm:pt-20 px-4">
      {/* Ambient background glow */}
      <AmbientBackground />

      {/* Premium glass-kort */}
      <div className="w-full max-w-sm relative z-10">
        
        {/* Tosom Merke — gull-logo ✨ */}
        <div className="text-center mb-6">
          <div
            className="inline-flex w-12 h-12 rounded-xl items-center justify-center mb-3 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
              boxShadow: '0 4px 14px rgba(212,175,55,0.25)',
            }}
          >
            <span className="text-lg font-bold text-[#0A1A2A]">T</span>
          </div>
          <h1
            className="text-lg font-semibold tracking-tight"
            style={{ color: 'rgba(255,255,255,0.95)' }}
          >
            Admin-panelet
          </h1>
          <p
            className="text-xs mt-1"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            Kun autorisert personell
          </p>
        </div>

        {/* Login-form med glass-panel */}
        <form onSubmit={handleSubmit}>
          
          {/* Feilmelding */}
          {error && (
            <div className="mb-4 px-3 py-2.5 rounded-lg text-xs font-medium text-center"
              style={{ background: 'rgba(255,77,77,0.1)', color: '#FF4D4D', border: '1px solid rgba(255,77,77,0.2)' }}
            >
              {error}
            </div>
          )}

          {/* Felt — E-post og Passord */}
          <div className="space-y-3">
            {/* E-post */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium mb-1.5"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                E-postadresse
              </label>
              <input
                id="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="George eller george@tosom.no"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
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
                className="block text-xs font-medium mb-1.5"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                Passord
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'white',
                }}
              />
            </div>
          </div>

          {/* Inloggingsknapp */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              background: loading 
                ? 'linear-gradient(135deg, rgba(212,175,55,0.6) 0%, rgba(184,150,46,0.6) 100%)'
                : 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
              color: '#0A1A2A',
              boxShadow: loading 
                ? 'none'
                : '0 2px 10px rgba(212,175,55,0.2)',
            }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[rgba(10,26,42,0.3)] border-t-[#0A1A2A] rounded-full animate-spin" />
                Laster inn...
              </>
            ) : (
              'Logg inn'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>
          © 2026 Tosom AS — Alle rettigheter reservert
        </p>
      </div>
    </div>
  );
}