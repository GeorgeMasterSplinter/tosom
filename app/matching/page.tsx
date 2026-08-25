/**
 * Tosom — Venterom (Waiting Room)
 *
 * Tre tilstander:
 * 1. I kø (mandag–fredag): Nedtelling til fredag 23:59, kan melde seg ut
 * 2. Låst (fredag 23:59 – lørdag 06:00): Vent på matchmotoren
 * 3. Ingen match (etter lørdag 06:00): Ærlig melding + valg
 *
 * Har aktiv match → redirect /dashboard
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Footer } from '@/components/ui/layout/Footer';
import { color, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';
import { PulsingOrb } from '@/components/ui/feedback/PulsingOrb';

/* ═══════════════════════════════════════
   TYPES
   ═══════════════════════════════════════ */

interface OverviewData {
  match: {
    id: string;
    name: string;
    age: number | null;
    distanceKm: number | null;
    resonanceLevel: string | null;
  } | null;
  journey: {
    day: number;
    totalDays: number;
    phase: string;
  } | null;
  // BUG 3: Sanne reise-tilstandar frå databasen (dashboard/overview)
  journeyState?: 'IDLE' | 'QUEUED' | 'MATCHED' | 'ON_JOURNEY' | 'COMPLETED';
  onboardingComplete?: boolean;
  matchQueuedAt?: string | null;
}

type QueueState = 'loading' | 'in_queue' | 'locked' | 'no_match' | 'start' | 'not_started';

/* ═══════════════════════════════════════
   COUNTDOWN HELPERS
   ═══════════════════════════════════════ */

/** Neste fredag 23:59:59 (siste sjanse å melde seg ut) */
function getNextFriday2359(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
  // Dager til neste fredag
  let daysUntilFriday: number;
  if (day === 5 && now.getHours() < 24) {
    // Er allerede fredag
    const friday = new Date(now);
    friday.setHours(23, 59, 59, 0);
    if (friday > now) return friday;
    // Er etter 23:59 fredag → neste uke
    daysUntilFriday = 7;
  } else {
    daysUntilFriday = (5 - day + 7) % 7;
    if (daysUntilFriday === 0) daysUntilFriday = 7; // Er før fredag 23:59
  }
  const result = new Date(now);
  result.setDate(result.getDate() + daysUntilFriday);
  result.setHours(23, 59, 59, 0);
  return result;
}

/** Neste lørdag 04:00 (når cron kjører) */
function getNextSaturday0400(): Date {
  const now = new Date();
  const day = now.getDay();
  let daysUntilSaturday: number;
  if (day === 6 && now.getHours() < 4) {
    // Er allerede lørdag før 04:00
    const sat = new Date(now);
    sat.setHours(4, 0, 0, 0);
    if (sat > now) return sat;
    daysUntilSaturday = 7;
  } else {
    daysUntilSaturday = (6 - day + 7) % 7;
    if (daysUntilSaturday === 0) daysUntilSaturday = 7;
  }
  const result = new Date(now);
  result.setDate(result.getDate() + daysUntilSaturday);
  result.setHours(4, 0, 0, 0);
  return result;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '0m';
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}t`);
  parts.push(`${minutes}m`);
  return parts.join(' ');
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'God morgen';
  if (h >= 12 && h < 17) return 'God ettermiddag';
  if (h >= 17 && h < 22) return 'God kveld';
  return 'God natt';
}

/* ═══════════════════════════════════════
   RESONANS LABELS (ord, ikke tall)
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

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */

export default function MatchingPage() {
  const [userName, setUserName] = useState('');
  // DEV: ?state= tvinger visningstilstand umiddelbart (bypass-er redirect)
  const [queueState, setQueueState] = useState<QueueState>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const forced = params.get('state');
      if (forced === 'in_queue' || forced === 'locked' || forced === 'no_match') {
        return forced;
      }
    }
    return 'loading';
  });
  const [countdown, setCountdown] = useState('');
  const [countdownLabel, setCountdownLabel] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [skipping, setSkipping] = useState(false);
  // BUG 3: «Start reisen»-knappen (IDLE + onboarding fullført)
  const [starting, setStarting] = useState(false);

  // Hvis state ble tvinget via query-param, hopp over hel load
  const forcedState = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('state')
    : null;

  // Hent sesjon + dashboard-data
  useEffect(() => {
    // Hvis state ble tvinget via query-param, sett state og hopp over hel load
    if (forcedState === 'in_queue' || forcedState === 'locked' || forcedState === 'no_match') {
      setQueueState(forcedState);
      return;
    }

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

        // Dashboard overview for match-status
        const overviewRes = await fetch('/api/dashboard/overview');
        if (overviewRes.ok) {
          const data: OverviewData = await overviewRes.json();

          // Har aktiv match → redirect til dashboard
          if (data.match && data.journey && data.journey.day > 0) {
            window.location.href = '/dashboard';
            return;
          }

          // Bestem kø-tilstand
          // BUG 3: Bruk SANNE reise-tilstandar frå databasen, ikkje vekeplan-gjett.
          // Tidlegare viste venterommet «Du er i kø» for ALLE innlogga brukarar,
          // uansett om dei faktisk stod i køen.
          const journeyState = data.journeyState ?? 'IDLE';

          // IDLE: ikkje i køen. Vis «Start reisen» (eller fullfør onboarding først).
          if (journeyState === 'IDLE') {
            setQueueState(data.onboardingComplete ? 'start' : 'not_started');
            return;
          }

          // MATCHED/ON_JOURNEY: reisen er i gang – dashboardet viser ho.
          if (journeyState === 'MATCHED' || journeyState === 'ON_JOURNEY') {
            window.location.href = '/dashboard';
            return;
          }

          // QUEUED (og COMPLETED → kan køre seg på nytt): kø-tilstand frå vekeplan
          const now = new Date();
          const day = now.getDay();
          const hour = now.getHours();

          // Lørdag 04:00 – 06:00: matchmotoren kjører (låst)
          if (day === 6 && hour >= 4 && hour < 6) {
            setQueueState('locked');
          }
          // Fredag 23:59 – Lørdag 04:00: låst
          else if ((day === 5 && hour >= 23) || (day === 6 && hour < 4)) {
            setQueueState('locked');
          }
          // Etter lørdag 06:00 uten match: ingen match denne runden
          else if (day === 6 && hour >= 6 && !data.match) {
            setQueueState('no_match');
          }
          // Mandag–fredag: i kø
          else {
            setQueueState('in_queue');
          }
        } else {
          setQueueState('in_queue');
        }
      } catch {
        setQueueState('in_queue');
      }
    }
    load();
  }, []);

  // Nedtelling (oppdaterer hvert sekund)
  useEffect(() => {
    if (queueState === 'loading') return;

    const interval = setInterval(() => {
      const now = new Date();
      if (queueState === 'locked') {
        const target = getNextSaturday0400();
        const diff = target.getTime() - now.getTime();
        setCountdown(formatCountdown(diff));
        setCountdownLabel('til lørdag 04:00');
      } else if (queueState === 'no_match') {
        const target = getNextFriday2359();
        const diff = target.getTime() - now.getTime();
        setCountdown(formatCountdown(diff));
        setCountdownLabel('til neste fredag 23:59');
      } else {
        const target = getNextFriday2359();
        const diff = target.getTime() - now.getTime();
        setCountdown(formatCountdown(diff));
        setCountdownLabel('til fredag 23:59');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [queueState]);

  // BUG 4 FIX: «Meld deg ut» i venterommet = forlate KØEN, ikkje avslutte reise.
  // Den gamle koden kalte POST /api/journey/exit, som avsluttar ein AKTIV reise
  // (matcha brukarar) og svarar 404 «Ingen aktiv reise funnet» for ein køende
  // brukar — knappa gjorde altså ingenting. DELETE /api/journey/queue set
  // journeyState tilbake til IDLE, som er rett semantikk her.
  const handleExit = useCallback(async () => {
    setExiting(true);
    try {
      const res = await fetch('/api/journey/queue', { method: 'DELETE' });
      if (!res.ok) {
        // 409: allereie matcha — då er venterommet feil staden å vere
        window.location.href = '/dashboard';
        return;
      }
      window.location.href = '/';
    } catch {
      setExiting(false);
      setShowExitConfirm(false);
    }
  }, []);

  const handleSkipRound = useCallback(async () => {
    setSkipping(true);
    try {
      await fetch('/api/journey/queue', { method: 'DELETE' });
      window.location.href = '/';
    } catch {
      setSkipping(false);
      setShowSkipConfirm(false);
    }
  }, []);

  // BUG 3: «Start reisen» — setter brukaren i match-køen (POST /api/journey/queue).
  // Idempotent på serveren; krev onboardingComplete (409 elles).
  const handleStartJourney = useCallback(async () => {
    setStarting(true);
    try {
      const res = await fetch('/api/journey/queue', { method: 'POST' });
      if (res.ok) {
        // Nå i køen — last om for å vise kø-tilstanden
        window.location.reload();
        return;
      }
      // 402: betaling krevst → betalingsfløte
      if (res.status === 402) {
        window.location.href = '/betaling';
        return;
      }
      // 409: onboarding ikkje fullført (eller annan tilstand)
      window.location.href = '/onboarding';
    } catch {
      setStarting(false);
    }
  }, []);

  const greeting = getGreeting();

  /* ═══ LOADING ═══ */
  if (queueState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #0B1520 0%, #0F1A26 100%)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(212,175,55,0.2)', borderTopColor: '#D4AF37' }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Laster…</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Bakgrunn */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)' }} />
      <div className="absolute top-20 right-0 w-[600px] h-[400px] pointer-events-none opacity-20" style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(80,120,255,0.04), transparent 70%)' }} />

      <div className="relative z-10 max-w-[640px] mx-auto px-6 pt-24 pb-16">

        {/* ═══ HEDDING ═══ */}
        <div className="text-center mb-12">
          <h1 style={{ ...typographyToStyle('hero'), fontSize: '36px', color: 'rgba(255,255,255,0.92)' }}>
            {greeting}, {userName}
          </h1>
          <p className="mt-3" style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.6' }}>
            Ta deg tid. Her møter du partneren din, steg for steg.
          </p>
        </div>

        {/* ═══ TILSTAND 1: I KØ ═══ */}
        {/* ═══ TILSTAND: KLAR TIL Å STARTE (IDLE + onboarding fullført) ═══ */}
        {queueState === 'start' && (
          <div className="space-y-8">
            <GlassCard className="text-center py-12 px-8">
              <div className="flex justify-center mb-4">
                <PulsingOrb size="lg" />
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: '#D4AF37' }}>
                Klar for å starte?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: '1.7' }}>
                Profilen din er fullført. Når du starter reisen, stiller du deg i
                køen – og lørdag morgen finn vi noen som passer deg.
              </p>
              <button
                onClick={handleStartJourney}
                disabled={starting}
                className="mt-8 px-10 py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:brightness-110 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C766)', color: '#0B1520', fontWeight: 600 }}
              >
                {starting ? 'Stiller deg i kø…' : 'Start reisen'}
              </button>
            </GlassCard>

            {/* Oppdater profil (valfritt før start) */}
            <GlassCard className="py-6 px-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', fontWeight: 500 }}>
                    Oppdater profil for betre match
                  </p>
                  <p className="mt-1" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                    Jo dypare profilen, jo betre kan vi matche deg.
                  </p>
                </div>
                <button
                  onClick={() => window.location.href = '/onboarding'}
                  className="shrink-0 px-5 py-3 rounded-2xl font-medium text-sm transition-all duration-300 hover:brightness-110"
                  style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}
                >
                  Gå til profil
                </button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ═══ TILSTAND: ONBOARDING IKKJE FULLFØRT (IDLE) ═══ */}
        {queueState === 'not_started' && (
          <div className="space-y-8">
            <GlassCard className="text-center py-12 px-8">
              <div className="flex justify-center mb-4">
                <PulsingOrb size="lg" />
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: '#D4AF37' }}>
                Fullfør profilen din først
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: '1.7' }}>
                Før du kan starte reisen må vi kjenne deg litt betre.
                Det tar nokre minutt – så kan du stille deg i køen.
              </p>
              <button
                onClick={() => window.location.href = '/onboarding'}
                className="mt-8 px-10 py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C766)', color: '#0B1520', fontWeight: 600 }}
              >
                Gå til onboarding
              </button>
            </GlassCard>
          </div>
        )}

        {queueState === 'in_queue' && (
          <div className="space-y-8">
            {/* Status-kort */}
            <GlassCard className="text-center py-10 px-8">
              <div className="flex justify-center mb-4">
                <PulsingOrb size="lg" />
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: '#D4AF37' }}>
                Du er i venterommet, {userName}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: '1.7' }}>
                Vi kobler deg til lørdag morgen. Da starter reisen.
              </p>

              {/* Nedtelling */}
              <div className="mt-8 px-6 py-4 rounded-2xl mx-auto max-w-[320px]" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <p className="text-3xl font-bold tabular-nums" style={{ color: '#D4AF37' }}>
                  {countdown}
                </p>
                <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {countdownLabel} — siste sjanse å ombestemme
                </p>
              </div>
            </GlassCard>

            {/* Oppdater profil */}
            <GlassCard className="py-6 px-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', fontWeight: 500 }}>
                    Oppdater profil for bedre match
                  </p>
                  <p className="mt-1" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                    Jo dypere profilen, jo bedre kan vi matche deg.
                  </p>
                </div>
                <button
                  onClick={() => window.location.href = '/onboarding'}
                  className="shrink-0 px-5 py-3 rounded-2xl font-medium text-sm transition-all duration-300 hover:brightness-110"
                  style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}
                >
                  Gå til profil
                </button>
              </div>
            </GlassCard>

            {/* Får du kalde føtter (ingen refund) */}
            <GlassCard className="py-6 px-6">
              <p className="font-medium" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                Får du kalde føtter
              </p>
              <p className="mt-2" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6' }}>
                Du kan velge å vente til neste runde. Pengene går med, men du beholder plassen din. Ingen press.
              </p>
              <button
                onClick={() => setShowSkipConfirm(true)}
                className="mt-4 px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-300 hover:bg-white/5"
                style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}
              >
                Vente til neste runde
              </button>
            </GlassCard>

            {/* Ombestemme deg (full refund) */}
            <GlassCard className="py-6 px-6">
              <p className="font-medium" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                Ombestemme deg
              </p>
              <p className="mt-2" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6' }}>
                Ombestemmer du deg før fredag 23:59, kan du melde deg ut og få pengene tilbake.
                Fra lørdag er dere to i gang. Vil du melde deg på igjen, starter du på nytt.
              </p>
              <button
                onClick={() => setShowExitConfirm(true)}
                className="mt-4 px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-300 hover:bg-red-500/10"
                style={{ border: '1px solid rgba(255,77,77,0.3)', color: 'rgba(255,77,77,0.8)' }}
              >
                Melde meg ut og få pengene tilbake
              </button>
            </GlassCard>
          </div>
        )}

        {/* ═══ TILSTAND 2: LÅST ═══ */}
        {queueState === 'locked' && (
          <div className="space-y-8">
            <GlassCard className="text-center py-12 px-8">
              <div className="flex justify-center mb-4">
                <PulsingOrb size="lg" />
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: '#D4AF37' }}>
                Du er i venterommet
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: '1.7' }}>
                Reisen starter lørdag morgen. Vi jobber med å finne noen som passer deg.
              </p>

              <div className="mt-8 px-6 py-4 rounded-2xl mx-auto max-w-[320px]" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <p className="text-3xl font-bold tabular-nums" style={{ color: '#D4AF37' }}>
                  {countdown}
                </p>
                <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {countdownLabel}
                </p>
              </div>

              <p className="mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Tålmodighet er ikke passivitet. Det er tillit.
              </p>
            </GlassCard>
          </div>
        )}

        {/* ═══ TILSTAND 3: INGEN MATCH ═══ */}
        {queueState === 'no_match' && (
          <div className="space-y-8">
            <GlassCard className="text-center py-12 px-8">
              <div className="flex justify-center mb-4">
                <PulsingOrb size="lg" />
              </div>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#D4AF37' }}>
                Vi fant ingen god nok match denne runden
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: '1.8', maxWidth: '480px', margin: '0 auto' }}>
                Vi vet at det kan være en skuffelse. Men vi mener på det sterkeste:
                det er bedre å vente på en god match enn å få en dårlig.
                Din neste match skal være verdt ventetiden.
              </p>
            </GlassCard>

            {/* Oppdater profil */}
            <GlassCard className="py-6 px-6">
              <p className="font-medium" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                Oppdater profilen din
              </p>
              <p className="mt-2" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6' }}>
                De detaljene du deler er alt vi har å gå etter.
                Jo dypere profilen, jo bedre kan vi matche deg.
              </p>
              <button
                onClick={() => window.location.href = '/onboarding'}
                className="mt-4 px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C766)', color: '#0B1520', fontWeight: 600 }}
              >
                Gå til onboarding
              </button>
            </GlassCard>

            {/* Vente på neste runde */}
            <GlassCard className="py-6 px-6">
              <p className="font-medium" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                Vente på neste runde
              </p>
              <p className="mt-2" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6' }}>
                Du er fortsatt i venterommet. Neste mulighet er fredag.
              </p>
              <div className="mt-4 px-5 py-3 rounded-2xl inline-block" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <p className="text-2xl font-bold tabular-nums" style={{ color: '#D4AF37' }}>
                  {countdown}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {countdownLabel}
                </p>
              </div>
            </GlassCard>

            {/* Trekk deg */}
            <GlassCard className="py-6 px-6">
              <p className="font-medium" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                Melde deg ut og få pengene tilbake
              </p>
              <p className="mt-2" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6' }}>
                Du har alltid muligheten. Hvis vi ikke finner en god nok match,
                er det ingen grunn å betale. Ingen spørsmål, ingen binding.
              </p>
              <button
                onClick={() => setShowExitConfirm(true)}
                className="mt-4 px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-300 hover:bg-red-500/10"
                style={{ border: '1px solid rgba(255,77,77,0.3)', color: 'rgba(255,77,77,0.8)' }}
              >
                Melde meg ut
              </button>
            </GlassCard>
          </div>
        )}

        {/* ═══ SETTINGS — synlig og rolig ═══ */}
        <div className="mt-12 text-center">
          <button
            onClick={() => window.location.href = '/settings'}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-base font-medium transition-all duration-300 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: 'rgba(255,255,255,0.6)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            }}
          >
            <span className="text-xl" aria-hidden="true">⚙️</span>
            Innstillinger
          </button>
        </div>

        {/* ═══ SKIP ROUND CONFIRM MODAL ═══ */}
        {showSkipConfirm && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
            <div className="w-full max-w-sm rounded-3xl p-8 text-center relative" style={{ background: 'rgba(11,21,32,0.97)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <button onClick={() => setShowSkipConfirm(false)} className="absolute top-4 right-4" style={{ color: 'rgba(255,255,255,0.4)' }}>✕</button>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Vente til neste runde?
              </h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Du hopper over denne runden. Pengene går med, men du kan melde deg på igjen neste uke.
              </p>
              <button
                onClick={handleSkipRound}
                disabled={skipping}
                className="w-full py-4 rounded-2xl font-bold text-base transition-all disabled:opacity-50"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}
              >
                {skipping ? 'Behandler...' : 'Ja, vent til neste runde'}
              </button>
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="w-full mt-3 py-3 rounded-xl text-sm transition-all hover:opacity-80"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Avbryt
              </button>
            </div>
          </div>
        )}

        {/* ═══ EXIT CONFIRM MODAL ═══ */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
            <div className="w-full max-w-sm rounded-3xl p-8 text-center relative" style={{ background: 'rgba(11,21,32,0.97)', border: '1px solid rgba(255,77,77,0.2)' }}>
              <button onClick={() => setShowExitConfirm(false)} className="absolute top-4 right-4" style={{ color: 'rgba(255,255,255,0.4)' }}>✕</button>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#FF4D4D' }}>
                Melde deg ut?
              </h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Du forlater køen – profilen din blir behalden.
                Når du er klar igjen, trykk «Start reisen» og still deg i køen på nytt.
              </p>
              <button
                onClick={handleExit}
                disabled={exiting}
                className="w-full py-4 rounded-2xl font-bold text-base transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #FF4D4D, #FF6B6B)', color: '#fff' }}
              >
                {exiting ? 'Behandler...' : 'Ja, melde meg ut'}
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full mt-3 py-3 rounded-xl text-sm transition-all hover:opacity-80"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Avbryt
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}