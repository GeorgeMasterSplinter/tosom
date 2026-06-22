/**
 * ToSom — Onboarding steg 1: Start
 * 
 * Introduksjonsside. Brukeren klikkar "Kom i gang"
 * som går til /onboarding/email
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Page() {
  const [animating, setAnimating] = useState(false);

  function handleStart() {
    setAnimating(true);
    setTimeout(() => {
      window.location.href = '/onboarding/email';
    }, 400);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0B1520' }}>
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-16">
          <h1
            className="text-5xl font-semibold mb-4"
            style={{ color: '#D4AF37', letterSpacing: '-0.02em' }}
          >
            ToSom
          </h1>
          <p
            className="text-lg"
            style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}
          >
            Ein roleg start til noko ekte.
          </p>
        </div>

        {/* Knapp */}
        <button
          onClick={handleStart}
          disabled={animating}
          className="w-full font-medium transition-all duration-300"
          style={{
            background: animating ? 'rgba(212,175,55,0.3)' : '#D4AF37',
            color: '#0B1520',
            borderRadius: '12px',
            padding: '14px 20px',
            fontSize: '17px',
            border: 'none',
            cursor: animating ? 'not-allowed' : 'pointer',
            opacity: animating ? 0.6 : 1,
          }}
        >
          {animating ? '' : 'Kom i gang'}
        </button>

        {/* Eksisterande konto */}
        <div className="mt-8">
          <Link
            href="/login"
            style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}
          >
            Allereie ein konto? Logg inn
          </Link>
        </div>
      </div>
    </div>
  );
}