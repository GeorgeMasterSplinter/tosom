/**
 * ToSom — VIPPS Login Side
 * 
 * Placeholder for VIPPS-integrasjon.
 * Brukarar blir no redirecta til /register for vanleg innskriving.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/ui/layout/Footer';

export default function VippsLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect etter 3 sekund til /register
    const timer = setTimeout(() => {
      router.push('/register');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="min-h-screen relative" style={{ background: 'linear-gradient(180deg, #0E1218 0%, #1A1F26 100%)' }}>
        {/* Ambient glow */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 50% 30%, rgba(212,175,55,0.06), transparent 70%),
              radial-gradient(ellipse 80% 60% at 30% 70%, rgba(80,120,255,0.05), transparent 65%),
              linear-gradient(180deg, #0E1218 0%, #1A1F26 100%)
            `,
          }}
        />

        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div
            className="text-center space-y-6 p-8"
            style={{ animation: 'fadeUp 0.5s ease-out both' }}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
              <span className="text-[#D4AF37] text-3xl">✦</span>
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-white mb-2">
                VIPPS-innskriving
              </h1>
              <p className="text-white/60 max-w-md mx-auto">
                VIPPS-integrasjon kommer snart. Du kan likevel registrere deg med e-post under.
              </p>
            </div>

            <div className="flex gap-4 justify-center items-center">
              <button
                onClick={() => router.push('/register')}
                className="px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                style={{
                  background: '#D4AF37',
                  color: '#0B0E11',
                  boxShadow: '0 0 25px rgba(212,175,55,0.3), 0 4px 12px rgba(0,0,0,0.2)',
                  border: 'none',
                }}
              >
                Gå til registrering
              </button>

              <p className="text-white/40 text-sm">
                Omdirigerer om {3 - Math.floor((Date.now() % 3000) / 1000)}s...
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}