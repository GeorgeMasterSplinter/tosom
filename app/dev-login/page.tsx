'use client';

import { useState, useEffect } from 'react';

interface TestUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  description: string;
}

export default function DevLogin() {
  const [users, setUsers] = useState<TestUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [devEnabled, setDevEnabled] = useState(false);

  useEffect(() => {
    // Hent tilgjengelige testbrukere fra API
    fetch('/api/dev-login/status')
      .then((res) => res.json())
      .then((data) => {
        setDevEnabled(data.enabled);
        return fetch('/api/dev-login/users');
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.users) {
          setUsers(data.users);
        }
      })
      .catch((err) => {
        console.error('Feil ved henting av testbrukere:', err);
        setError('Kan ikke koble til dev-login API. Sjekk at DEV_LOGIN_ENABLED=true.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async (userId: string, role: 'USER' | 'ADMIN') => {
    const redirect = role === 'ADMIN' ? '/admin' : '/dashboard';
    try {
      const res = await fetch('/api/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, redirect }),
      });

      if (res.ok) {
        window.location.href = redirect;
      } else {
        const data = await res.json();
        setError(data.error || 'Innlogging feilet');
      }
    } catch (err) {
      console.error('Login feilet:', err);
      setError('Netverksfeil. Sjekk at serveren kjører.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1520] flex flex-col items-center justify-center gap-6 text-white px-6">
        <h1 className="text-4xl font-semibold tracking-tight text-[#D4AF37]">
          Dev Login
        </h1>
        <p className="text-white/60 text-lg">Laster...</p>
      </div>
    );
  }

  if (!devEnabled) {
    return (
      <div className="min-h-screen bg-[#0B1520] flex flex-col items-center justify-center gap-6 text-white px-6">
        <h1 className="text-4xl font-semibold tracking-tight text-[#D4AF37]">
          Dev Login
        </h1>
        <div className="text-red-400 text-lg mb-4">
          Dev-login er ikke aktivert.
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-md">
          <p className="text-white/70 text-sm mb-2">
            For å aktivere dev-login:
          </p>
          <code className="bg-black/30 text-yellow-300 px-3 py-2 rounded block text-sm">
            DEV_LOGIN_ENABLED=true
          </code>
          <p className="text-white/50 text-xs mt-2">
            I din .env eller .env.local-fil
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1520] flex flex-col items-center justify-center gap-6 text-white px-6">
        <h1 className="text-4xl font-semibold tracking-tight text-[#D4AF37]">
          Dev Login
        </h1>
        <div className="text-red-400 text-center mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          Prøv igjen
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1520] flex flex-col items-center justify-center gap-6 text-white px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-[#D4AF37]">
        Dev Login
      </h1>
      <p className="text-white/60 text-lg mb-4">
        Velg en testbruker for å logge inn (DEV kun)
      </p>
      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => handleLogin(user.id, user.role)}
            className="px-8 py-4 bg-[#D4AF37] text-[#0A0F1A] rounded-lg text-lg font-medium hover:bg-[#E8C766] transition-colors duration-200 text-left shadow-[0_4px_12px_rgba(212,175,55,0.2)]"
          >
            <div>Logg inn som {user.name}</div>
            <div className="text-sm font-normal opacity-70">
              {user.email} · {user.role} · {user.description}
            </div>
          </button>
        ))}
      </div>
      <div className="text-white/40 text-xs mt-8">
        <code>DEV_LOGIN_ENABLED=true</code> kreves
      </div>
    </div>
  );
}
