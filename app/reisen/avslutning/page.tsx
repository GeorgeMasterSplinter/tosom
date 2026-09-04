'use client';

/**
 * Tosom — Avslutnings-side (2 valg)
 *
 * Vises etter 30-dagers reise. Brukeren får 2 valg:
 * 1. "Vi fant hverandre" — `endJourney('completed')` → takkeside → IDLE
 * 2. "Start ny reise" — `endJourney('completed')` → betaling → profil → kø → IDLE
 *
 * B10: Begge kaller endJourney(). Forskjellen er kun hvor brukeren sendes etterpå.
 * Bekreftelsesdialog er påkrevd med ordrett tekst fra konseptet.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { color, typography } from '@/config/design-tokens';
import { csrfFetch } from '@/lib/api/csrfClient';

/* ====== Icons ====== */

function IconHeart() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#D4AF37">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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

/* ====== Confirmation Modal (B10 — påkrevd tekst) ====== */

function ConfirmModal({
  title,
  message,
  warningText,
  confirmText,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  warningText: string;
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

        <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '16px' }}>
          {message}
        </p>

        {/* B10 — påkrevd bekreftelsestekst */}
        <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'rgba(212, 175, 55, 0.8)', marginBottom: '24px', fontStyle: 'italic' }}>
          {warningText}
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
  const [loading, setLoading] = useState(false);
  const [journeyDay, setJourneyDay] = useState<number | null>(null);

  // Sjekk om dag 30 er nådd ved side-lasting
  useEffect(() => {
    const checkJourneyComplete = async () => {
      try {
        const res = await fetch('/api/dashboard/overview');
        if (res.ok) {
          const json = await res.json();
          if (json.journey) {
            const day = json.journey.day;
            setJourneyDay(day);
            if (day < 30 && day > 0) {
              // Ikke fullført enda — gå tilbake til dashboard
              router.push('/dashboard');
              return;
            } else if (day === 0 || !day) {
              // Ingen aktiv reise
              router.push('/dashboard');
            }
          }
        }
      } catch {
        console.log('Kan ikke sjekke journey-status');
      }
    };
    checkJourneyComplete();
  }, [router]);

  // B4.4: PDF-eksport — åpner samtalen som print-vennlig PDF før sletting (B-3)
  const [showPdfOffer, setShowPdfOffer] = useState(false);

  const handleExportPdf = () => {
    // B-3: Åpne den faktiske samtalen som print-HTML (Lagre som PDF) i nytt vindu
    window.open('/api/journey/export-pdf', '_blank', 'noopener,width=800,height=1000');
  };

  // B10: Begge valg kaller endJourney() med outcome 'completed'
  const confirmChoice = async () => {
    if (!selected) return;

    // B4.4: Ved "Vi fant hverandre" — tilby PDF-eksport FØR sletting
    if (selected === 1 && !showPdfOffer) {
      setShowPdfOffer(true);
      return;
    }

    setLoading(true);

    try {
      // B10: Begge bruker samme outcome — forskjellen er kun redirect etterpå
      const res = await csrfFetch('/api/journey/exit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: selected === 2 ? 'ny_reise' : 'found_each_other' }),
      });

      if (res.ok) {
        const data = await res.json();
        // B10: Valg 1 → takkeside; Valg 2 → tilbake til dashboard for ny reise
        if (selected === 1) {
          // "Vi fant hverandre" — takkeside (kan redirecte til /reisen/takk når den finnes)
          router.push('/dashboard?ended=together');
        } else {
          // "Ny reise" → tilbake til dashboard, brukeren kan starte ny reise
          router.push('/dashboard?ended=new_journey');
        }
      }
    } catch (err) {
      console.log('Feil ved journey-avslutning:', err);
    }

    setSelected(null);
    setShowPdfOffer(false);
    setLoading(false);
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
            Reisen din er fullført 🎉
          </h1>

          <p
            style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.5)',
              margin: 0,
            }}
          >
            30 dagene har gått. Hva vil du gjøre nå?
          </p>
        </div>

        {/* Choice Cards - 2 valg */}
        <div className="w-full space-y-5">

          {/* Valg 1: Vi fant hverandre */}
          <ChoiceCard
            title="Vi fant hverandre 💛"
            description="Dere møtes utenom Tosom. Lykke til! 🤍"
            icon={<IconHeart />}
            gradientFrom="#D4AF37"
            gradientTo="#E8C766"
            borderColor="rgba(212, 175, 55, 0.3)"
            onClick={() => setSelected(1)}
          />

          {/* Valg 2: Start ny reise */}
          <ChoiceCard
            title="Start ny reise 🔄"
            description="Ble ikke match. Prøv igjen med ny partner."
            icon={<IconRefresh />}
            gradientFrom="#A78BFA"
            gradientTo="#C4B5FD"
            borderColor="rgba(167, 139, 250, 0.3)"
            onClick={() => setSelected(2)}
          />

        </div>

        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-10 text-sm transition-all hover:opacity-80"
          style={{ color: 'rgba(255, 255, 255, 0.3)' }}
        >
          ← Tilbake til oversikt
        </button>

      </div>

      {/* B10 + B4.4: Confirm Modal med PDF-tilbud */}
      {selected === 1 && !showPdfOffer && (
        <ConfirmModal
          title="Vi fant hverandre?"
          message="Dere møtes utenom Tosom. Lykke til!"
          warningText="Dette sletter samtalen for dere begge. Det kan ikke angres."
          confirmText={loading ? "Behandler..." : "Ja, det var noe 💛"}
          onCancel={() => setSelected(null)}
          onConfirm={confirmChoice}
        />
      )}

      {/* B4.4: PDF-eksport modal — tilby nedlasting FØR sletting */}
      {selected === 1 && showPdfOffer && (
        <ConfirmModal
          title="Ta med deg minnet?"
          message="Du kan laste ned en PDF av samtalen deres før den slettes. Tosom sletter alt — men minnet er ditt."
          warningText="Etter nedlasting (eller hvis du velger å hoppe over) slettes samtalen og kontoen din permanent."
          confirmText={loading ? "Behandler..." : "Last ned PDF og avslutt 💛"}
          onCancel={() => { setShowPdfOffer(false); setSelected(null); }}
          onConfirm={() => {
            handleExportPdf();
            // Fortsett til sletting etter print-dialog
            confirmChoice();
          }}
        />
      )}

      {selected === 2 && (
        <ConfirmModal
          title="Start ny reise?"
          message="Onboarding låses opp. Du kan endre profil før ny match."
          warningText="Dette sletter samtalen for dere begge. Det kan ikke angres."
          confirmText={loading ? "Behandler..." : "Start ny reise 🔄"}
          onCancel={() => setSelected(null)}
          onConfirm={confirmChoice}
        />
      )}

    </main>
  );
}