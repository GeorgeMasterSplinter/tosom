'use client';

/**
 * ToSom — Avslutnings-side (ny reise / tosomhet)
 * 
 * Visast etter 30-dagers reise. Brukaren får 3 valg:
 * 1. "Ja til tosomheit" — fullfør relasjon, vis minne-album
 * 2. "Ikkje funnet det enda" — pause reise, prøv igjen seinare
 * 3. "Start ny reise" — reset journey, trigge ny match
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { radius, color, typography } from '@/config/design-tokens';

/* ====== Icons ====== */

function IconHeart() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#D4AF37">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ====== Choice Card ====== */

interface ChoiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  onClick: () => void;
}

function ChoiceCard({ title, description, icon, gradientFrom, gradientTo, borderColor, onClick }: ChoiceCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full rounded-2xl p-8 text-left transition-all duration-500 group relative overflow-hidden"
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${gradientFrom}20, ${gradientTo}10)`
          : 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${hovered ? borderColor : 'rgba(255, 255, 255, 0.06)'}`,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Bakgrunns glød */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 pointer-events-none transition-all duration-500"
        style={{
          background: `radial-gradient(circle, ${gradientFrom}15, transparent)`,
          transform: hovered ? 'scale(1.5)' : 'scale(1)',
          opacity: hovered ? 1 : 0.3,
        }}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className="mb-6 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}15, ${gradientTo}10)`,
            border: `1px solid ${borderColor}`,
            transform: hovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1)',
          }}
        >
          {icon}
        </div>

        {/* Title */}
        <h3
          className="mb-3 font-bold transition-all duration-300"
          style={{
            fontSize: `${typography.fontSize['2xl']}px`,
            background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'rgba(255, 255, 255, 0.5)' }}>
          {description}
        </p>
      </div>
    </button>
  );
}

/* ====== Confirmation Modal ====== */

function ConfirmModal({
  title,
  message,
  confirmText,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
      <div
        className="w-full max-w-sm rounded-3xl p-8 text-center relative"
        style={{
          background: 'rgba(11, 21, 32, 0.95)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          boxShadow: '0 20px 80px rgba(0,0,0,0.6)',
        }}
      >
        <button onClick={onCancel} className="absolute top-4 right-4">
          <IconX />
        </button>

        <h3
          className="mb-3 text-xl font-bold"
          style={{ color: '#D4AF37' }}
        >
          {title}
        </h3>

        <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '24px' }}>
          {message}
        </p>

        <button
          onClick={onConfirm}
          className="w-full py-4 rounded-xl font-semibold text-base transition-all hover:brightness-110 active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #D4AF37, #E8C766)',
            color: '#0B1520',
            boxShadow: '0 4px 24px rgba(212, 175, 55, 0.35)',
          }}
        >
          {confirmText}
        </button>

        <button
          onClick={onCancel}
          className="w-full mt-3 py-3 rounded-xl font-medium text-sm transition-all hover:opacity-80"
          style={{
            color: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          Avbryt
        </button>
      </div>
    </div>
  );
}

/* ====== Main Page ====== */

export default function AvslutningSide() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);

  // Confirmations for each choice
  const handleChoice1 = () => setSelected(1);
  const handleChoice2 = () => setSelected(2);
  const handleChoice3 = () => setSelected(3);

  const confirmChoice = () => {
    if (selected === 1) {
      router.push('/dashboard'); // Vis minne / fullført relasjon
    } else if (selected === 2) {
      router.push('/dashboard'); // Pause — tilbake til dashboard
    } else if (selected === 3) {
      // Clear test user, go to onboarding for new journey
      localStorage.removeItem('testUserId');
      router.push('/onboarding/start');
    }
    setSelected(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Bakgrunn */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 40%, #0B1520 100%)',
        }}
      />

      {/* Ambient glød */}
      <div
        className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.08), transparent 65%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[540px] mx-auto px-6 py-16 flex flex-col items-center">

        {/* Header */}
        <div className="text-center space-y-4 mb-12 w-full">
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 300,
              color: '#D4AF37',
              letterSpacing: '-0.02em',
              lineHeight: '1.1',
              margin: 0,
            }}
          >
            Reisa di er fullført 🎉
          </h1>

          <p
            style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.5)',
              margin: 0,
            }}
          >
            Tolvten dagane med [Partner] har gått. Kva vil du gjere no?
          </p>
        </div>

        {/* Choice Cards */}
        <div className="w-full space-y-5">

          {/* Choice 1: Ja til tosomheit */}
          <ChoiceCard
            title="Ja til tosomheit 💛"
            description="Fullfør relasjonen med [Partner]. Vis minnealbumet og del dere med verda."
            icon={<IconHeart />}
            gradientFrom="#D4AF37"
            gradientTo="#E8C766"
            borderColor="rgba(212, 175, 55, 0.3)"
            onClick={handleChoice1}
          />

          {/* Choice 2: Ikkje funnet det enda */}
          <ChoiceCard
            title="Ikkje funnet det enda ⏳"
            description="Ta ein pause. Du kan prøve igjen seinare med ein ny match når du er klar."
            icon={<IconClock />}
            gradientFrom="#6EC6CF"
            gradientTo="#8ED4DB"
            borderColor="rgba(110, 198, 207, 0.3)"
            onClick={handleChoice2}
          />

          {/* Choice 3: Start ny reise */}
          <ChoiceCard
            title="Start ei ny reise 🔄"
            description="Start ein ny reise frå toppen. Betal på nytt og vent på ny match."
            icon={<IconRefresh />}
            gradientFrom="#A78BFA"
            gradientTo="#C4B5FD"
            borderColor="rgba(167, 139, 250, 0.3)"
            onClick={handleChoice3}
          />

        </div>

        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-10 text-sm transition-all hover:opacity-80"
          style={{ color: 'rgba(255, 255, 255, 0.3)' }}
        >
          ← Tilbake til dashboard
        </button>

      </div>

      {/* Confirm Modal */}
      {selected === 1 && (
        <ConfirmModal
          title="Ja til tosomheit?"
          message="Du vil fullføre relasjonen og sjå minnealbumet. Kan du angre seinare."
          confirmText="Fullfør"
          onCancel={() => setSelected(null)}
          onConfirm={confirmChoice}
        />
      )}

      {selected === 2 && (
        <ConfirmModal
          title="Ta ein pause?"
          message="Du pauser reisa og kan prøve igjen seinare. Dashboardet viser 'match er på vei'."
          confirmText="Ta pause"
          onCancel={() => setSelected(null)}
          onConfirm={confirmChoice}
        />
      )}

      {selected === 3 && (
        <ConfirmModal
          title="Start ny reise?"
          message="Reisa di blir tilbakestilt. Du må betale på nytt og vente på ny match."
          confirmText="Start ny reise"
          onCancel={() => setSelected(null)}
          onConfirm={confirmChoice}
        />
      )}

    </main>
  );
}