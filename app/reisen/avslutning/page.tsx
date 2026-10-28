'use client';

/**
 * Tosom — Avslutnings-side (2 valg)
 *
 * Vises etter 14-dagers reise. Hver deltaker velger for seg selv (RT1 D4):
 * 1. "Vi fant hverandre" — valget registreres. Når BEGGE har valgt:
 *    `found_each_other` → grace-period (24 t, PDF tilgjengelig) → takkeside.
 * 2. "Start ny reise" — valget registreres. Når begge har tatt stilling
 *    og utfallet ikke er mutual FOUND: reisen avsluttes, profil beholdes,
 *    ny onboarding (prefylt).
 *
 * Én deltakers valg slutter aldri reisen alene — resultatet avgjøres når
 * begge har valgt (WAITING i mellomtiden).
 * Begge valg kaller /api/journey/exit som mapper reason → utfall.
 * Bekreftelsesdialog er påkrevd.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { JOURNEY_TOTAL_DAYS } from '@/config/journey';
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'rgba(255, 255, 255, 0.6)' }}>
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

        <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '16px' }}>
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
            color: 'rgba(255, 255, 255, 0.6)',
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
  // "Vi fant hverandre" (D: grace-period) — kontoen overlever 24 t, så vi
  // viser en lokal takkeside med PDF-nedlasting + kontosletting.
  const [finishedTogether, setFinishedTogether] = useState(false);
  // RT1 (D4): mitt valg er registrert, men reisen er ikke avgjort enda
  // (partneren har ikke tatt stilling) — WAITING.
  const [waitingDecision, setWaitingDecision] = useState<string | null>(null);
  // RT1-final: ikke-mutual avgjort der JEG valgte «Vi fant hverandre» —
  // nøytral «Reisen er avsluttet»-side (partnerens valg eksponeres ikke).
  const [finishedAlone, setFinishedAlone] = useState(false);

  // Sjekk om dag 14 er nådd ved side-lasting
  useEffect(() => {
    const checkJourneyComplete = async () => {
      try {
        const res = await fetch('/api/dashboard/overview');
        if (res.ok) {
          const json = await res.json();
          if (json.journey) {
            const day = json.journey.day;
            setJourneyDay(day);

            // RT1 (D4): har jeg allerede tatt stilling?
            const completion = json.journey.completion as
              | { decision: string; mutualFound: boolean }
              | undefined;
            if (completion && completion.decision && completion.decision !== 'PENDING') {
              if (completion.mutualFound) {
                // Begge har valgt «Vi fant hverandre» → takkeside (PDF-vindu).
                setFinishedTogether(true);
              } else {
                // Mitt valg er registrert — reisen venter på partneren.
                setWaitingDecision(completion.decision);
              }
              return;
            }

            if (day < JOURNEY_TOTAL_DAYS && day > 0) {
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

  // Feil-feedback: uten dette lå brukeren "fast" uten noe tilbakemelding når
  // /api/journey/exit svarte med feil (t.d. 409/500) — nå viser vi meldingen.
  const [error, setError] = useState<string | null>(null);

  const handleExportPdf = async () => {
    // B-3: Åpne den faktiske samtalen som print-HTML (Lagre som PDF) i nytt vindu.
    // Vinduet åpnes FØRST (i gesten) så det ikke blir popup-blokkert, og HTML-et
    // hentes via same-origin fetch + skrives inn FØR slettingen starter (unngår race
    // der slettingen får bli ferdig før PDF-vinduet har lastet innholdet).
    const w = window.open('', '_blank', 'width=820,height=1000');
    try {
      const res = await fetch('/api/journey/export-pdf', { credentials: 'include' });
      const html = res.ok
        ? await res.text()
        : '<!doctype html><html><head><meta charset="utf-8"><title>PDF</title></head><body style="font-family:sans-serif;padding:40px"><h2>Kunne ikke laste samtalen</h2><p>Prøv igjen.</p></body></html>';
      if (w) {
        w.document.open();
        w.document.write(html);
        w.document.close();
      } else if (res.ok) {
        // Vinduet ble blokkert allerede -> fallback til anker (talt som brukergeste).
        const a = document.createElement('a');
        a.href = '/api/journey/export-pdf';
        a.target = '_blank';
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch {
      // Sist-resort fallback
      window.open('/api/journey/export-pdf', '_blank', 'noopener');
    }
  };

  // Begge valg kaller /api/journey/exit med riktig reason (RT1 D4 — bilateralt):
  //   "Vi fant hverandre" (1) → found_each_other → valget mitt registreres.
  //     Mutual (begge valgt) → takkeside med 24-timers PDF-vindu.
  //     Partner valgte ny reise → nøytral «Reisen er avsluttet»-side.
  //     Ellers → WAITING (partneren har ikke tatt stilling; senest 72 timer
  //     etter dag 14 lukker cronen reisen — kontoen beholdes).
  //   "Start ny reise"    (2) → ny_reise → valget mitt registreres.
  //     Avgjort (ikke mutual) → onboarding. Ellers → WAITING.
  const confirmChoice = async () => {
    if (!selected) return;

    setLoading(true);
    setError(null);

    try {
      const res = await csrfFetch('/api/journey/exit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: selected === 2 ? 'ny_reise' : 'found_each_other' }),
      });

      if (res.ok) {
        // Les utfallet fra serveren: 'found_each_other' (mutual), 'new_journey'
        // (avgjort ikke-mutual) eller 'waiting' (venter på partneren).
        let outcome: string | undefined;
        try {
          const j = await res.json();
          outcome = j?.outcome;
        } catch {
          /* ikke-JSON svar */
        }
        if (outcome === 'waiting') {
          setWaitingDecision(selected === 2 ? 'NEW_JOURNEY' : 'FOUND_EACH_OTHER');
        } else if (outcome === 'found_each_other') {
          // Mutual: reisen er fullført for begge — takkeside med PDF-vindu.
          setFinishedTogether(true);
        } else if (outcome === 'new_journey' && selected === 2) {
          // Ikke-mutual avgjort, jeg valgte «Start ny reise» — profilen er
          // beholdt og onboarding låst opp.
          // Gå til onboarding (prefylt fra profilen — de justerer, skriver ikke på nytt).
          router.push('/onboarding');
        } else if (outcome === 'new_journey') {
          // Ikke-mutual avgjort, jeg valgte «Vi fant hverandre» (partneren
          // valgte ny reise). Nøytral avslutning — partnerens valg
          // eksponeres ikke.
          setFinishedAlone(true);
        }
        return; // Naviger / byt side — ikke nullstill modaltasten.
      }

      // Feil: les server-meldingen og vis den (brukeren skal ikke være "fast" uten svar).
      let msg = 'Noe gikk galt med avslutningen. Prøv igjen.';
      try {
        const j = await res.json();
        if (j?.error) msg = j.error;
      } catch {
        /* ikke-JSON feilsvar */
      }
      setError(msg);
      setSelected(null);
    } catch (err) {
      console.error('Feil ved journey-avslutning:', err);
      setError('Nettverksfeil. Kontroller tilgangen og prøv igjen.');
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  // "Vi fant hverandre" (D: grace-period) — kontoen overlever 24 t.
  // Vis lokal takkeside med PDF-nedlasting + mulighet for umiddelbar kontosletting.
  if (finishedTogether) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 40%, #0B1520 100%)' }}
        />
        <div
          className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.08), transparent 65%)' }}
        />
        <div className="relative z-10 w-full max-w-[540px] mx-auto px-6 py-24 flex flex-col items-center text-center">
          <div className="mb-8">
            <IconHeart />
          </div>
          <h1
            style={{
              fontSize: '40px',
              fontWeight: 300,
              color: '#D4AF37',
              letterSpacing: '-0.02em',
              lineHeight: '1.15',
              margin: 0,
            }}
          >
            Lykke til! 💛
          </h1>
          <p
            style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: '20px 0 0',
            }}
          >
            Tusen takk for 14 dager med åpenhet. Minnet er deres — last ned
            teksten fra samtalen som PDF i løpet av 24 timer (bilder blir
            ikke med). Deretter slettes samtalen, bildene og reisen
            automatisk. Kontoen deres beholdes.
          </p>
          <button
            onClick={handleExportPdf}
            className="mt-10 w-full px-10 py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C766)', color: '#0B1520', fontWeight: 600 }}
          >
            Last ned minnet (PDF)
          </button>
          <button
            onClick={() => router.push('/settings')}
            className="mt-3 w-full px-10 py-3 rounded-2xl font-medium text-sm transition-all duration-300 hover:brightness-110"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Slett kontoen min (umiddelbart)
          </button>
          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)' }}>
            Kontoen din beholdes — bare reisen slettes automatisk etter 24 timer.
          </p>
        </div>
      </main>
    );
  }

  // RT1-final: ikke-mutual avgjort (jeg valgte «Vi fant hverandre»).
  // Nøytral avslutning — vi sier IKKE hva partneren valgte.
  if (finishedAlone) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 40%, #0B1520 100%)' }}
        />
        <div className="relative z-10 w-full max-w-[540px] mx-auto px-6 py-24 flex flex-col items-center text-center">
          <h1
            style={{
              fontSize: '40px',
              fontWeight: 300,
              color: '#D4AF37',
              letterSpacing: '-0.02em',
              lineHeight: '1.15',
              margin: 0,
            }}
          >
            Reisen er avsluttet 💛
          </h1>
          <p
            style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: '20px 0 0',
            }}
          >
            Tusen takk for 14 dager med åpenhet. Samtalen, bildene og reisen
            slettes — kontoen din beholdes, og du kan logge inn som vanlig.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-10 w-full px-10 py-3 rounded-2xl font-medium text-sm transition-all duration-300 hover:opacity-80"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Tilbake til oversikt
          </button>
        </div>
      </main>
    );
  }

  // RT1 (D4): WAITING — mitt valg er registrert, men partneren har ikke tatt
  // stilling enda. Reisen er fortsatt aktiv (verken slettet eller avsluttet).
  if (waitingDecision) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 40%, #0B1520 100%)' }}
        />
        <div className="relative z-10 w-full max-w-[540px] mx-auto px-6 py-24 flex flex-col items-center text-center">
          <div className="mb-8">
            {waitingDecision === 'FOUND_EACH_OTHER' ? <IconHeart /> : <IconRefresh />}
          </div>
          <h1
            style={{
              fontSize: '40px',
              fontWeight: 300,
              color: '#D4AF37',
              letterSpacing: '-0.02em',
              lineHeight: '1.15',
              margin: 0,
            }}
          >
            Valget ditt er registrert 💛
          </h1>
          <p
            style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: '20px 0 0',
            }}
          >
            Når begge har tatt stilling, avgjøres reisen — senest 72 timer
            etter dag 14. Dere hører mer i e-post.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-10 w-full px-10 py-3 rounded-2xl font-medium text-sm transition-all duration-300 hover:opacity-80"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Tilbake til oversikt
          </button>
        </div>
      </main>
    );
  }

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

        {/* Feil-banner (visast når /api/journey/exit svarte med feil) */}
        {error && (
          <div
            className="w-full mb-6 rounded-xl px-4 py-3 text-sm"
            role="alert"
            style={{
              background: 'rgba(220, 80, 80, 0.1)',
              border: '1px solid rgba(220, 80, 80, 0.3)',
              color: '#f2a6a6',
              lineHeight: 1.5,
            }}
          >
            ⚠️ {error}
          </div>
        )}

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
              color: 'rgba(255, 255, 255, 0.6)',
              margin: 0,
            }}
          >
            {JOURNEY_TOTAL_DAYS} dagene har gått. Hva vil du gjøre nå?
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
            description="Reisen avsluttes når begge har tatt stilling. Profilen din beholdes — du starter på nytt med en ny person."
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
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          ← Tilbake til oversikt
        </button>

      </div>

      {/* B10: Confirm Modal (valget registreres; avgjørelse når begge har valgt) */}
      {selected === 1 && (
        <ConfirmModal
          title="Vi fant hverandre?"
          message="Dere møtes utenom Tosom. Lykke til!"
          warningText="Valget ditt registreres. Når begge har valgt «Vi fant hverandre», får dere 24 timer til å laste ned teksten fra samtalen som PDF — bilder blir ikke med. Deretter slettes samtalen, bildene og reisen permanent. Kontoen deres beholdes."
          confirmText={loading ? "Behandler..." : "Ja, det var noe 💛"}
          onCancel={() => setSelected(null)}
          onConfirm={confirmChoice}
        />
      )}

      {selected === 2 && (
        <ConfirmModal
          title="Start ny reise?"
          message="Onboarding låses opp. Du kan endre profil før ny match."
          warningText="Valget ditt registreres. Når begge har tatt stilling — senest 72 timer etter dag 14 — avsluttes reisen, samtalen slettes og profilen din beholdes. Det kan ikke angres."
          confirmText={loading ? "Behandler..." : "Start ny reise 🔄"}
          onCancel={() => setSelected(null)}
          onConfirm={confirmChoice}
        />
      )}

    </main>
  );
}