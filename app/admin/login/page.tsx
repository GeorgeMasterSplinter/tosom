'use client';

/**
 * ToSom — Admin Login (Premium Nordic Gold 2026) 🟡⭐
 * 
 * Ren, roleg og trygg innlogging-side.
 * Design: ToSom Blue bakgrunn med ambient glow + glassmorphism kort + gull-aksentar.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      
      if (data.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Ugyldig brukernamn eller passord.');
      }
    } catch {
      setError('Netverksfeil. Ver venleg og prøv på nytt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0B1520, #121E2E, #0B1520)' }}
    >
      {/* Ambient glow-effektar — same som resten av ToSom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse_80%_60%_at_50%_30%, rgba(80,120,255,0.04), transparent 70%)',
          filter: 'blur(120px)',
        }}
      />
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.06), transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Login-kort */}
      <div
        className="w-full max-w-md relative z-10 animate-fadeIn"
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          boxShadow: '0 12px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Logo */}
        <div className="text-center pt-10 pb-6">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))',
              border: '1px solid rgba(212,175,55,0.3)',
              boxShadow: '0 0 32px rgba(212,175,55,0.15)',
            }}
          >
            <span className="text-2xl font-bold" style={{ color: '#D4AF37' }}>T</span>
          </div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: 'rgba(255,255,255,0.95)' }}
          >
            ToSom Admin
          </h1>
          <p
            className="text-sm tracking-wider uppercase"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Modashboard
          </p>
        </div>

        {/* Formular */}
        <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-5">
          {/* Brukernavn */}
          <div>
            <label
              className="block text-xs font-medium mb-2 tracking-wide"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              BRUKERNAMN
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.95)',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(212,175,55,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              required
              autoComplete="username"
            />
          </div>

          {/* Passord */}
          <div>
            <label
              className="block text-xs font-medium mb-2 tracking-wide"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              PASSORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.95)',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(212,175,55,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Feilmelding */}
          {error && (
            <p
              className="text-sm text-center py-2 rounded-lg"
              style={{
                color: 'rgba(255,77,77,0.8)',
                background: 'rgba(255,77,77,0.1)',
                border: '1px solid rgba(255,77,77,0.2)',
              }}
            >
              {error}
            </p>
          )}

          {/* Logg inn-knapp */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
            style={{
              background: loading
                ? 'rgba(212,175,55,0.4)'
                : 'linear-gradient(135deg, #D4AF37, #E8C766)',
              color: '#0B1520',
              border: 'none',
              boxShadow: loading
                ? 'none'
                : '0 6px 24px rgba(212,175,55,0.3)',
            }}
          >
            {loading ? 'Loggar inn...' : 'Logg inn'}
          </button>

          {/* Tilbake-knapp */}
          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full py-3 rounded-xl text-xs font-medium transition-all duration-300 hover:brightness-110"
            style={{
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            ← Tilbake til ToSom
          </button>
        </form>
      </div>

      {/* CSS animasjonar */}
      <style>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}