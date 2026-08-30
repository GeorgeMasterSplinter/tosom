/**
 * Tosom — Dashboard (Rebuild 2026)
 *
 * Rollo: Hoved-hub for aktiv reise.
 * - Velkommen + navn
 * - Match-revelasjon modal (første gang, 12 sek)
 * - Resonanse-kort (2 kort + ORD i midten)
 * - Knapper: [Samtale] [⚙]
 * - Kalendar (30 dager, 4 faser)
 * - Milepæler (gjeldende dag)
 * - Profil privat
 *
 * Ingen aktiv match → redirect /matching
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/ui/layout/Footer';
import { color, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';

/* ═══════════════════════════════════════
   TYPES
   ═══════════════════════════════════════ */

interface DashboardData {
  match: {
    id: string;
    name: string;
    age: number | null;
    distanceKm: number | null;
    resonanceLevel: string | null;
    bio: string | null;
  } | null;
  conversation: {
    conversationId: string;
  } | null;
  journey: {
    day: number;
    totalDays: number;
    phase: string;
    tittel: string;
    beskrivelse: string;
    bothSeenAt: string | null;
  } | null;
  bothJustMet: boolean;
}

/* ═══════════════════════════════════════
   PHASES
   ═══════════════════════════════════════ */

const PHASES = [
  { key: 'EARLY', name: 'Bryt isen', start: 1, end: 7, color: '#5B9BD5' },
  { key: 'BUILDING_TRUST', name: 'Bygg tillit', start: 8, end: 14, color: '#D4AF37' },
  { key: 'DEEPER', name: 'Dypere samtaler', start: 15, end: 21, color: '#4ECDC4' },
  { key: 'CHECKIN', name: 'Sjekk inn', start: 22, end: 30, color: '#E8875B' },
];

function getPhaseForDay(day: number) {
  return PHASES.find(p => day >= p.start && day <= p.end) ?? PHASES[0];
}

/* ═══════════════════════════════════════
   RESONANS LABELS
   ═══════════════════════════════════════ */

function getResonanceLabel(level: string | null | undefined): string {
  switch (level?.toUpperCase()) {
    case 'DEEP': return 'Dyp resonans';
    case 'STRONG': return 'Sterk resonans';
    case 'MODERATE': return 'God resonans';
    case 'GENTLE': return 'Rolig resonans';
    default: return 'Rolig resonans';
  }
}

function getResonanceGlow(level: string | null | undefined): string {
  switch (level?.toUpperCase()) {
    case 'DEEP': return '0 0 32px rgba(77,255,136,0.3)';
    case 'STRONG': return '0 0 24px rgba(212,175,55,0.3)';
    case 'MODERATE': return '0 0 18px rgba(255,184,108,0.2)';
    default: return '0 0 12px rgba(130,130,255,0.15)';
  }
}

/* ═══════════════════════════════════════
   GREETING
   ═══════════════════════════════════════ */

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'God morgen';
  if (h >= 12 && h < 17) return 'God ettermiddag';
  if (h >= 17 && h < 22) return 'God kveld';
  return 'God natt';
}

/* ═══════════════════════════════════════
   MATCH REVEAL MODAL
   ═══════════════════════════════════════ */

function MatchRevealModal({
  userName,
  partnerName,
  partnerAge,
  partnerDistance,
  resonanceLabel,
  onClose,
}: {
  userName: string;
  partnerName: string;
  partnerAge: number | null;
  partnerDistance: number | null;
  resonanceLabel: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 12000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6"
      style={{
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(20px)',
        animation: 'revealFadeIn 1s ease-out',
      }}
    >
      <style>{`
        @keyframes revealFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes revealPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      <div className="text-center max-w-md w-full relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-16 right-0 text-sm transition-all hover:opacity-70"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          Lukke →
        </button>

        {/* Heart */}
        <div
          className="mx-auto mb-8 w-20 h-20 rounded-full flex items-center justify-center text-4xl"
          style={{
            background: 'rgba(212,175,55,0.12)',
            border: '2px solid rgba(212,175,55,0.3)',
            boxShadow: '0 0 48px rgba(212,175,55,0.2)',
            animation: 'revealPulse 3s infinite ease-in-out',
          }}
        >
          💛
        </div>

        {/* Title */}
        <h2
          className="text-3xl font-semibold mb-3"
          style={{ color: '#D4AF37' }}
        >
          Din match er her
        </h2>

        {/* Two cards */}
        <div className="flex items-center justify-center gap-4 my-8">
          {/* User card */}
          <div
            className="flex-1 rounded-2xl p-5 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <p className="font-semibold text-lg" style={{ color: 'rgba(255,255,255,0.9)' }}>{userName}</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Deg</p>
          </div>

          {/* Resonance */}
          <div className="text-center px-2">
            <p className="text-sm font-medium tracking-wider" style={{ color: '#D4AF37', textShadow: getResonanceGlow(resonanceLabel) }}>
              {resonanceLabel}
            </p>
          </div>

          {/* Partner card */}
          <div
            className="flex-1 rounded-2xl p-5 text-center"
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}
          >
            <p className="font-semibold text-lg" style={{ color: 'rgba(255,255,255,0.9)' }}>{partnerName}</p>
            {partnerAge && <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{partnerAge} år</p>}
            {partnerDistance != null && <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>ca. {partnerDistance} km</p>}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Vi koblet dere basert på resonans — verdier, livsstil og emosjonell rytme.
        </p>
        <p className="text-sm mt-3 font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Reisen starter nå. 30 dager. Fire faser.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   JOURNEY CALENDAR
   ═══════════════════════════════════════ */

function JourneyCalendar({ currentDay }: { currentDay: number }) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  return (
    <div>
      {/* Phase labels */}
      <div className="grid grid-cols-4 gap-1 mb-2">
        {PHASES.map(phase => (
          <div
            key={phase.key}
            className="text-center py-1.5 rounded-lg"
            style={{
              background: currentDay >= phase.start && currentDay <= phase.end ? `${phase.color}18` : 'transparent',
              border: currentDay >= phase.start && currentDay <= phase.end ? `1px solid ${phase.color}40` : '1px solid transparent',
            }}
          >
            <p className="text-[10px] font-medium truncate px-1" style={{ color: phase.color }}>
              {phase.name}
            </p>
            <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
              dag {phase.start}–{phase.end}
            </p>
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
          const phase = getPhaseForDay(day);
          const isCurrent = day === currentDay;
          const isPast = day < currentDay;
          const isFuture = day > currentDay;

          return (
            <div
              key={day}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              className="aspect-square rounded-md flex items-center justify-center text-[10px] transition-all duration-200 cursor-default"
              style={{
                background: isCurrent
                  ? `${phase.color}30`
                  : isPast
                  ? `${phase.color}15`
                  : 'rgba(255,255,255,0.03)',
                border: isCurrent
                  ? `2px solid ${phase.color}`
                  : `1px solid ${isPast ? phase.color + '30' : 'rgba(255,255,255,0.06)'}`,
                color: isCurrent ? '#fff' : isPast ? phase.color + 'CC' : 'rgba(255,255,255,0.25)',
                fontWeight: isCurrent ? 700 : 400,
                boxShadow: isCurrent ? `0 0 12px ${phase.color}40` : 'none',
              }}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Hover tooltip */}
      {hoveredDay && (
        <div className="mt-3 text-center">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Dag {hoveredDay} — {getPhaseForDay(hoveredDay).name}
          </p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   MILESTONES
   ═══════════════════════════════════════ */

const MILESTONES: Array<{ day: number; label: string; description: string }> = [
  { day: 1, label: 'Reisen starter', description: 'Dag 1 begynner når dere begge har vært innom. Si hei til hverandre.' },
  { day: 5, label: 'Første oppgave', description: 'Del en liten ting fra dagen din. Noe enkelt, noe ærlig.' },
  { day: 10, label: 'Bygg tillit', description: 'Nå kan dere dele mer. Hva gjør at du føler deg trygg i en samtale?' },
  { day: 15, label: 'Bilder åpnes', description: 'Fra dag 15 kan dere dele bilder med hverandre. Grunnlaget er lagt.' },
  { day: 21, label: 'Dypere samtaler', description: 'Snakk om verdier, drømmer og hva som betyr mest for dere.' },
  { day: 25, label: 'Nærmere slutten', description: 'Reflekter over hva reisen har gitt dere. Hva tar dere med videre?' },
  { day: 30, label: 'Avslutning', description: 'Dag 30: Velg hvordan reisen skal ende.' },
];

function Milestones({ currentDay }: { currentDay: number }) {
  // Vis kun gjeldende + neste (ikke alle)
  const current = MILESTONES.find(m => m.day === currentDay);
  const next = MILESTONES.find(m => m.day > currentDay);

  return (
    <div className="space-y-4">
      {/* Dagens milestone */}
      {current ? (
        <div
          className="rounded-2xl p-5"
          style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}
        >
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#D4AF37' }}>
            I dag
          </p>
          <p className="font-semibold" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
            {current.label}
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {current.description}
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Ta dere tid i dag. Ingen oppgave. Bare å være sammen.
          </p>
        </div>
      )}

      {/* Neste milestone (kun hvis ikke i dag) */}
      {next && next.day !== currentDay && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <span className="text-xs font-medium tabular-nums w-12 shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Dag {next.day}
          </span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {next.label}
          </span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   PROFILE PRIVATE SECTION
   ═══════════════════════════════════════ */

function ProfilePrivateSection() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">🔒</span>
        <p className="font-medium text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Din profil er privat
        </p>
      </div>
      <div className="space-y-1.5">
        {[
          'Bare din match kan se profilen din. Ingen andre brukere har tilgang.',
          'Profildata er kryptert og lagret sikkert.',
          'Bilder deles først etter 14 dager.',
          'Du kan når som helst slette profilen din.',
          'Ingen deling med tredjepart.',
        ].map((text, i) => (
          <p key={i} className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════ */

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const revealedRef = useRef(false);

  useEffect(() => {
    async function load() {
      try {
        // Sesjon
        const sessionRes = await fetch('/api/auth/session');
        const session = sessionRes.ok ? await sessionRes.json() : null;
        if (!session?.user) {
          window.location.href = '/login';
          return;
        }
        setUserName(session.user.name || '');

        // Onboarding-guard: ny bruker må fullføre profil først
        const obRes = await fetch('/api/onboarding/progress');
        if (obRes.ok) {
          const ob = await obRes.json();
          if (!ob.onboardingComplete) {
            router.replace('/onboarding');
            return;
          }
        }

        // Dashboard data
        const res = await fetch('/api/dashboard/overview');
        if (!res.ok) throw new Error('No access');
        const json: DashboardData = await res.json();
        setData(json);

        // Ingen aktiv match/reise → redirect /matching.
        // MEN: hvis journeyState sier MATCHED/ON_JOURNEY, er dette et
        // data-innkonsistens problem (journeyState satt men match mangler).
        // Da redirect-er vi IKKE (ville forårsake loop) — viser feil i stedet.
        if (!json.match || !json.journey) {
          const js = (json as any).journeyState;
          if (js === 'MATCHED' || js === 'ON_JOURNEY') {
            setLoadError('Din reise er registrert, men dataene er ikke klare ennå. Vennligst kontakt support@tosom.no.');
            return;
          }
          router.replace('/matching');
          return;
        }

        // Match reveal modal (første gang)
        const revealKey = `tosom_revealed_${json.match.id}`;
        if (!revealedRef.current && !sessionStorage.getItem(revealKey)) {
          revealedRef.current = true;
          setShowReveal(true);
          sessionStorage.setItem(revealKey, '1');
        }
      } catch {
        // Ingen redirect her — ville forårsake loop om venterommet
        // sendte tilbake. Viser feil i stedet.
        setLoadError('Kunne ikke laste dashboard. Prøv igjen.');
        return;
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCloseReveal = useCallback(() => setShowReveal(false), []);

  /* ═══ LOADING ═══ */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #0B1520 0%, #0F1A26 100%)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(212,175,55,0.2)', borderTopColor: '#D4AF37' }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Laster din reise…</p>
        </div>
      </div>
    );
  }

  /* ═══ LOAD ERROR (data-innkonsistens) ═══ */
  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1520' }}>
        <div className="text-center max-w-md px-6">
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', lineHeight: '1.6' }}>{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}
          >
            Prøv igjen
          </button>
        </div>
      </div>
    );
  }

  /* ═══ INGEN DATA (should redirect, but fallback) ═══ */
  if (!data || !data.match || !data.journey) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1520' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Du har ingen aktiv reise.</p>
      </div>
    );
  }

  const { match, journey, conversation } = data;
  const currentDay = journey.day;
  // Dag 0: reisen er opprettet, men begge har ikke møtt opp enda
  const isDayZero = currentDay < 1;
  const displayDay = Math.max(1, currentDay);
  const currentPhase = getPhaseForDay(displayDay);
  const resonanceLabel = getResonanceLabel(match.resonanceLevel);
  const chatUrl = conversation?.conversationId ? `/chat/${conversation.conversationId}` : '/chat';

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Bakgrunn */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)' }} />
      <div className="absolute top-20 right-0 w-[600px] h-[400px] pointer-events-none opacity-15" style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(80,120,255,0.04), transparent 70%)' }} />

      <div className="relative z-10 max-w-[720px] mx-auto px-5 pt-6 pb-16">

        {/* ═══ HEADER ═══ */}
        <div className="mb-10">
          <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'rgba(255,255,255,0.92)' }}>
            {getGreeting()}, {userName}
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {isDayZero
              ? 'Reisen starter når dere begge har vært innom.'
              : `Dere er på dag ${currentDay} av ${journey.totalDays}. ${currentPhase.name}.`}
          </p>
        </div>

        {/* ═══ SAMTALE CTA (direkte ruting inn i chatten) ═══ */}
        <div className="mb-8">
          <button
            onClick={() => router.push(chatUrl)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-medium transition-transform hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.95), rgba(176,141,41,0.95))',
              color: '#0B1520',
              fontSize: '15px',
              boxShadow: '0 8px 32px rgba(212,175,55,0.15)',
            }}
          >
            💬 {isDayZero ? 'Møt matchen din' : 'Fortsett samtalen'}
          </button>
          {isDayZero && (
            <p className="text-center text-xs mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Dag 1 starter når {match.name} også har vært innom én gang.
            </p>
          )}
        </div>

        {/* ═══ RESONANSE KORT ═══ */}
        <GlassCard className="mb-8">
          <div className="flex items-center justify-center gap-6 py-6">
            {/* User card */}
            <div
              className="flex-1 max-w-[180px] rounded-2xl p-5 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <p className="font-semibold" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
                {userName}
              </p>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Deg</p>
            </div>

            {/* Resonance word */}
            <div className="text-center px-4 py-2 rounded-xl" style={{ boxShadow: getResonanceGlow(match.resonanceLevel) }}>
              <p
                className="font-semibold tracking-wide"
                style={{ color: '#D4AF37', fontSize: '16px' }}
              >
                {resonanceLabel}
              </p>
            </div>

            {/* Partner card */}
            <div
              className="flex-1 max-w-[180px] rounded-2xl p-5 text-center"
              style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <p className="font-semibold" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
                {match.name}
              </p>
              {match.age && <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{match.age} år</p>}
              {match.distanceKm != null && (
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>ca. {match.distanceKm} km</p>
              )}
            </div>
          </div>
        </GlassCard>

        {/* ═══ KALENDAR ═══ */}
        <GlassCard className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Deres reise
            </h2>
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={isDayZero
                ? { background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }
                : { background: `${currentPhase.color}15`, color: currentPhase.color, border: `1px solid ${currentPhase.color}30` }}
            >
              {isDayZero ? 'Dag 0 — starter' : currentPhase.name}
            </span>
          </div>
          <JourneyCalendar currentDay={currentDay} />
        </GlassCard>

        {/* ═══ MILEPÆLER ═══ */}
        <GlassCard className="mb-8">
          <h2 className="font-semibold text-lg mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Milepæler
          </h2>
          {isDayZero ? (
            <div
              className="rounded-2xl p-5"
              style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#D4AF37' }}>
                Neste
              </p>
              <p className="font-semibold" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                Reisen starter
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Dag 1 begynner når dere begge har vært innom. Si hei til hverandre i samtalen.
              </p>
            </div>
          ) : (
            <Milestones currentDay={currentDay} />
          )}
        </GlassCard>

        {/* ═══ PROFIL PRIVAT ═══ */}
        <ProfilePrivateSection />

      </div>

      {/* ═══ MATCH REVEAL MODAL ═══ */}
      {showReveal && (
        <MatchRevealModal
          userName={userName}
          partnerName={match.name}
          partnerAge={match.age}
          partnerDistance={match.distanceKm}
          resonanceLabel={resonanceLabel}
          onClose={handleCloseReveal}
        />
      )}

      <Footer />
    </main>
  );
}