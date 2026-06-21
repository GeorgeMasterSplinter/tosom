/**
 * ToSom UI 5.0 — Dashboard
 * 
 * Rom med:
 * - Aktiv match (resonans, dag, fase)
 * - Reise-status (dag 1-30)
 * - Neste match-tid
 * - Hurtigtilgang: Chat, Reise, Profil
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui5/Header';
import { GlassPanel } from '@/components/ui5/GlassPanel';

/* ------ Types ------ */

interface DashboardOverview {
  matchStatus: 'no_match' | 'pending' | 'matched';
  partner: { id: string; profile: { identityName: string | null } } | null;
  conversationId: string | null;
  resonance: number | null;
  imageShareStatus: { allowed: boolean; daysRemaining: number } | null;
  journey: {
    day: number;
    phase: string;
    completedDays: number;
    nextDayAt: string | null;
    startedAt: string | null;
    endedAt: string | null;
  } | null;
  nextMatchTimer: {
    locked: boolean;
    readyAt: string | null;
    hoursRemaining: number;
  };
}

/* ------ Helpers ------ */

function formatTimer(hours: number): string {
  if (hours <= 0) return 'Klar';
  if (hours < 24) return `${hours} timar att`;
  const d = Math.floor(hours / 24);
  const h = hours % 24;
  return `${d}d ${h}t att`;
}

function phaseLabel(phase: string): string {
  const map: Record<string, string> = {
    EARLY: 'Introduksjon',
    BUILDING_TRUST: 'Tryggleik',
    DEEPER: 'Djupare samtalar',
    CHECKIN: 'Felles reise',
  };
  return map[phase] || phase;
}

/* ------ Main Page ------ */

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard/overview');
        if (!res.ok) return;
        const ov = await res.json();
        if (!cancelled) setOverview(ov);
      } catch {
        // Silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDashboard();
    return () => { cancelled = true; };
  }, []);

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0E11' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderTopColor: '#D4AF37',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
           Lastar dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0B0E11' }}>
      <Header currentPath="/dashboard" />

      <main className="mx-auto max-w-[1200px] px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-[32px] font-semibold mb-2"
            style={{
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}
          >
            Ditt rom
          </h1>
          <p
            className="text-base"
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              lineHeight: '1.5',
            }}
          >
            Alt du treng for reisen deres
          </p>
        </div>

        {/* Match Section */}
        {overview?.matchStatus === 'matched' && overview?.partner && (
          <GlassPanel goldBorder className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Partner info */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-medium"
                  style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '2px solid rgba(212, 175, 55, 0.25)',
                    color: '#D4AF37',
                  }}
                >
                  {overview.partner.profile?.identityName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <p
                    className="font-semibold text-lg"
                    style={{ color: '#FFFFFF' }}
                  >
                    {overview.partner.profile?.identityName || 'Ingen partner'}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    {overview.journey
                      ? `Dag ${overview.journey.day} · ${phaseLabel(overview.journey.phase)}`
                      : 'Aktiv match'}
                  </p>
                </div>
              </div>

              {/* Resonance + Actions */}
              <div className="flex items-center gap-6">
                {overview.resonance !== null && (
                  <div className="text-center">
                    <p
                      className="text-xs mb-1"
                      style={{ color: 'rgba(255, 255, 255, 0.45)' }}
                    >
                      Resonans
                    </p>
                    <p
                      className="text-2xl font-semibold"
                      style={{ color: '#D4AF37' }}
                    >
                      {overview.resonance}/10
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push('/chat')}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out"
                    style={{
                      background: '#D4AF37',
                      color: '#0B0E11',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = '#E8C766';
                      (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = '#D4AF37';
                      (e.target as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => router.push('/journey')}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out"
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      color: 'rgba(255, 255, 255, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.07)';
                      (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.14)';
                      (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.04)';
                      (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      (e.target as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    Reise
                  </button>
                </div>
              </div>
            </div>
          </GlassPanel>
        )}

        {/* Next Match Timer */}
        {overview?.nextMatchTimer.locked && (
          <GlassPanel className="mb-8 text-center">
            <p
              className="text-base"
              style={{ color: 'rgba(255, 255, 255, 0.5)' }}
            >
              Neste match om{' '}
              <span style={{ color: '#D4AF37', fontWeight: 500 }}>
                {formatTimer(overview.nextMatchTimer.hoursRemaining)}
              </span>
            </p>
          </GlassPanel>
        )}

        {/* Image Share Status */}
        {overview?.imageShareStatus && !overview.imageShareStatus.allowed && (
          <GlassPanel className="mb-8 text-center">
            <p
              className="text-base"
              style={{ color: 'rgba(255, 255, 255, 0.5)' }}
            >
              Bilder er tilgjengeleg om{' '}
              <span style={{ color: '#D4AF37', fontWeight: 500 }}>
                {overview.imageShareStatus.daysRemaining} dagar
              </span>
            </p>
          </GlassPanel>
        )}

        {/* Journey Progress */}
        {overview?.journey && (
          <GlassPanel goldBorder className="mb-8">
            <h3
              className="text-sm font-medium mb-4"
              style={{ color: 'rgba(255, 255, 255, 0.5)' }}
            >
              Reise-status
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Dag', value: `${overview.journey.day} / 30` },
                { label: 'Fase', value: phaseLabel(overview.journey.phase) },
                { label: 'Fullført', value: `${overview.journey.completedDays} dagar` },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>{item.label}</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
              {/* Progress bar */}
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round((overview.journey.completedDays / 30) * 100)}%`,
                    background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
                  }}
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => router.push('/journey')}
                className="w-full px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out"
                style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  color: '#D4AF37',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = 'rgba(212, 175, 55, 0.15)';
                  (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = 'rgba(212, 175, 55, 0.1)';
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                Fortsett reisen
              </button>
            </div>
          </GlassPanel>
        )}

        {/* No match yet */}
        {overview?.matchStatus === 'no_match' && (
          <GlassPanel className="mb-8 text-center py-12">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              className="mx-auto mb-4"
              style={{ color: 'rgba(212, 175, 55, 0.2)' }}
            >
              <circle cx="20" cy="24" r="14" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="28" cy="24" r="14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <p
              className="text-base mb-6"
              style={{ color: 'rgba(255, 255, 255, 0.45)' }}
            >
              Ingen match ennå
            </p>
            <button
              onClick={() => router.push('/onboarding')}
              className="px-8 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out"
              style={{
                background: '#D4AF37',
                color: '#0B0E11',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = '#E8C766';
                (e.target as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = '#D4AF37';
                (e.target as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              Fullfør profilen
            </button>
          </GlassPanel>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: 'Chat',
              href: '/chat',
              icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 10C3 6 6 3 10 3C14 3 17 6 17 10C17 14 14 17 10 17L6 19L7 17C6 16 5 15 5 10Z" stroke="#D4AF37" strokeWidth="1.5" />
                </svg>
              ),
            },
            {
              label: 'Reise',
              href: '/journey',
              icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10C4 6.5 6.5 4 10 4C13.5 4 16 6.5 16 10C16 13.5 13.5 16 10 16" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M10 7V10L12 12" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              label: 'Profil',
              href: '/profile',
              icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="7" r="3.5" stroke="#D4AF37" strokeWidth="1.5" />
                  <path d="M3 17C3 13.5 5.5 11 10 11C14.5 11 17 13.5 17 17" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ),
            },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => router.push(action.href)}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-200 ease-out"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.04)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.15)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.02)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.04)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {action.icon}
              <span className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}