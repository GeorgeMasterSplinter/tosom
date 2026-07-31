/**
 * ToSom — Unified Premium Dashboard ("Rommet ditt")
 * 
 * Helhetlig side med profil, partner, resonans, handlinger og reise.
 * Design tokens konsekvent brukt. Bokmål tekstmodell.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ChatIcon from '@/components/icons/ChatIcon';
import ProfileIcon from '@/components/icons/ProfileIcon';
import SettingsIcon from '@/components/icons/SettingsIcon';
import { ResonanceMeter } from '@/components/ui/ResonanceMeter';
import { color, radius, shadow, typography, spacing, glassVariant } from '@/config/design-tokens';
import PremiumButton from '@/components/ui/PremiumButton';

// Journey-side komponentar — importert frå /journey
import { AmbientGlow, AmbientGlowStyles } from '@/components/atmosphere/AmbientGlow';
import { PulseGlowStyles } from '@/components/ui/PulseGlow';
import { GlassPanelStyles } from '@/components/ui/system/ToSomGlassPanel';
import { PremiumJourneyDayView, getDayContent } from '@/components/journey/PremiumJourneyDayView';
import { PremiumJourneyProgressTracker } from '@/components/journey/PremiumJourneyProgressTracker';
import { JourneyTimeline } from '@/components/journey/JourneyTimeline';
import { ImageShareLockBanner } from '@/components/journey/ImageShareLockBanner';
import { GradientOverlay } from '@/components/atmosphere/GradientOverlay';
import { WaitingForMatch } from '@/components/dashboard/WaitingForMatch';
import { ProfileLockBanner, JourneyLockOverlay } from '@/components/profile/ProfileLockBanner';

/* ====== Types ====== */

interface DashboardData {
  userName: string;
  matched: boolean;
  partnerName: string | null;
  daysTogether: number;
  daysCompleted: number;
  resonance: number;
  currentDay: number;
}

/* ====== ActionItems for handlinger-grid ====== */

const actionItems = [
  { label: 'Gå til samtalen', href: '/chat', icon: <ChatIcon className="w-6 h-6 flex-shrink-0" /> },
  { label: 'Oppdater profil', href: '/onboarding', icon: <ProfileIcon className="w-6 h-6 flex-shrink-0" /> },
  { label: 'Innstillinger', href: '/settings', icon: <SettingsIcon className="w-6 h-6 flex-shrink-0" /> },
];

/* ====== Hovedkomponent ====== */

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [greeting, setGreeting] = useState('');
  const [selectedDay, setSelectedDay] = useState<number>(7); // Starter på dag 7 (mock)

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 6) setGreeting('God natt');
    else if (hour < 12) setGreeting('God morgen');
    else if (hour < 18) setGreeting('God ettermiddag');
    else setGreeting('God kveld');

    // Bruk localStorage for testbrukar — elles mock
    const storedUser = localStorage.getItem('testUserId') || 'Brukar';
    const name = storedUser === 'test-user-1' ? 'Astrid' : storedUser === 'test-user-2' ? 'Magnus' : 'Ane';
    
    setData({
      userName: name,
      matched: false, // FALSE → viser "Venter på match"
      partnerName: null,
      daysTogether: 0,
      daysCompleted: 0,
      resonance: 0,
      currentDay: 0,
    });
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: color.bg.primary }}>
        <div className="text-white/40 text-lg animate-pulse">Laster rommet ditt...</div>
      </div>
    );
  }

  return (
    <>
      {/* Ambient bakgrunnseffektar — heile sida */}
      <AmbientGlow color="blue" position="top-right" intensity={0.08} speed={7} />
      <AmbientGlowStyles />
      <PulseGlowStyles />
      <GlassPanelStyles />
      <GradientOverlay color="hero" position="bottom" intensity={0.4} />

      <div
        className="min-h-screen w-full py-8 md:py-12 relative overflow-hidden"
        style={{ background: color.bg.primary }}
      >
        <div className="mx-auto max-w-[720px] space-y-6 px-4 md:px-0 relative z-10">
        
        {/* ====== Seksjon 1: Header ====== */}
        <div
          className="w-full rounded-2xl p-6 md:p-8 animate-fadeIn"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: `${radius.xl}px`,
          }}
        >
          <h1
            className="mb-2"
            style={{
              fontSize: `${typography.fontSize['3xl']}px`,
              fontWeight: typography.fontWeight.semibold,
              color: color.text.primary,
            }}
          >
            {greeting}, {data.userName.split(' ')[0]}
          </h1>
          <p
            style={{
              fontSize: `${typography.fontSize.lg}px`,
              lineHeight: typography.lineHeight.normal,
              color: color.text.secondary,
            }}
          >
            Ta deg tid. Her møter du partneren din, steg for steg.
          </p>
        </div>

        {/* ====== Seksjon 2: Handlinger (3 knapper i horisontal flex-rad) ====== */}
        {data.matched && (
          <div
            className="w-full rounded-xl p-6 animate-fadeIn"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: `${radius.xl}px`,
            }}
          >
            <p
              className="mb-4"
              style={{
                fontSize: `${typography.fontSize.lg}px`,
                fontWeight: typography.fontWeight.semibold,
                color: 'rgba(212, 175, 55, 0.6)',
              }}
            >
              Handlinger
            </p>
            <div className="flex gap-4">
              {actionItems.map((item) => (
                <Link key={item.href} href={item.href} className="flex-1 block">
                  <PremiumButton
                    variant="tertiary"
                    size="md"
                    className="w-full justify-center text-sm py-3.5 px-4 rounded-xl min-h-[52px]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                  </PremiumButton>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ====== Seksjon 3: Ventefase (ingen match enno) ====== */}
        {!data.matched && (
          <WaitingForMatch userName={data.userName} />
        )}

        {/* ====== Seksjon 3: Profil + Resonans + Partner (horisontal flex-row) — berre ved match ====== */}
        {data.matched ? (
          <div className="flex justify-between items-center gap-6 animate-fadeIn">
            
            {/* Profil-kort (venstre) */}
            <div
              className="flex-1 rounded-xl p-6"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: `${radius.xl}px`,
              }}
            >
              <p
                className="mb-2"
                style={{
                  fontSize: `${typography.fontSize.sm}px`,
                  fontWeight: typography.fontWeight.medium,
                  color: 'rgba(212, 175, 55, 0.6)',
                }}
              >
                Din profil
              </p>
              <h3
                style={{
                  fontSize: `${typography.fontSize.xl}px`,
                  fontWeight: typography.fontWeight.bold,
                  color: color.text.primary,
                }}
              >
                {data.userName}
              </h3>
              <p
                style={{
                  fontSize: `${typography.fontSize.base}px`,
                  color: color.text.secondary,
                }}
              >
                Profil fullført ✓
              </p>
            </div>

            {/* Resonans-sirkel (midten) */}
            <div className="flex flex-col items-center justify-center flex-shrink-0">
              <ResonanceMeter value={data.resonance} size="md" showLabel />
            </div>

            {/* Partner-kort (høgre) */}
            <div
              className="flex-1 rounded-xl p-6"
              style={{
                background: 'rgba(212, 175, 55, 0.06)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(212, 175, 55, 0.15)',
                borderRadius: `${radius.xl}px`,
              }}
            >
              <p
                className="mb-2"
                style={{
                  fontSize: `${typography.fontSize.sm}px`,
                  fontWeight: typography.fontWeight.medium,
                  color: 'rgba(212, 175, 55, 0.6)',
                }}
              >
                Partner
              </p>
              <h3
                style={{
                  fontSize: `${typography.fontSize.xl}px`,
                  fontWeight: typography.fontWeight.bold,
                  color: color.text.primary,
                }}
              >
                {data.partnerName || '—'}
              </h3>
              <p
                style={{
                  fontSize: `${typography.fontSize.base}px`,
                  color: color.text.secondary,
                }}
              >
                Dag {data.daysTogether} av 30
              </p>
            </div>

          </div>
        ) : (
          /* Ingen match — ventande kort */
          <div
            className="w-full rounded-xl p-8 text-center animate-fadeIn"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: `${radius.xl}px`,
            }}
          >
            <p
              style={{
                fontSize: `${typography.fontSize.lg}px`,
                color: color.text.secondary,
              }}
            >
              Venter på din match
            </p>
            <Link href="/profile" className="block w-full mt-4">
              <PremiumButton
                variant="secondary"
                size="lg"
                className="min-h-[64px] rounded-xl justify-center px-6 py-4 text-base font-semibold w-full"
              >
                Oppdater profil
              </PremiumButton>
            </Link>
          </div>
        )}

        {/* ====== Profil-lås-banner (berre når matched og journey aktivt) ====== */}
        {data.matched && data.currentDay > 0 && data.currentDay < 30 && (
          <ProfileLockBanner
            partnerName={data.partnerName || 'partneren din'}
            currentDay={data.currentDay}
            totalDays={30}
          />
        )}

        {/* ====== Seksjon 4: HEILE JOURNEY-SIDE (importert frå /journey) ====== */}
        {data.matched && (
          <>
            {/* Journey-container — same stil som resten av dashboardet */}
            <div
              className="w-full rounded-2xl p-6 md:p-8 relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(212, 175, 55, 0.12)',
                borderRadius: `${radius.xl}px`,
              }}
            >
              {/* Velkomst-tekst */}
              <div className="text-center mb-8">
                <h2
                  className="mb-2"
                  style={{
                    fontSize: `${typography.fontSize['2xl']}px`,
                    fontWeight: typography.fontWeight.semibold,
                    background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Velkommen til din reise
                </h2>
                <p
                  style={{
                    fontSize: `${typography.fontSize.base}px`,
                    color: 'rgba(255, 255, 255, 0.6)',
                    maxWidth: '500px',
                    margin: '0 auto',
                  }}
                >
                  Hver dag gir en ny mulighet — for å kjenne, forstå og nærme deg partneren din.
                </p>
              </div>

              {/* Journey Timeline — 30-dagers grid */}
              <div className="mb-8">
                <JourneyTimeline currentDay={data.currentDay} completedDays={Array.from({ length: data.daysCompleted }, (_, i) => i + 1)} />
              </div>

              {/* Progress Tracker */}
              <div className="text-center mb-8">
                <PremiumJourneyProgressTracker
                  completedDays={Array.from({ length: data.daysCompleted }, (_, i) => i + 1)}
                  currentDay={data.currentDay}
                  onDaySelect={(day) => setSelectedDay(day)}
                />
              </div>

              {/* Daily content card */}
              {(() => {
                const dayContent = getDayContent(selectedDay);
                return (
                <div
                  className="rounded-[18px] p-6 mb-6"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(212, 175, 55, 0.15)',
                  }}
                >
                  <PremiumJourneyDayView
                    content={{
                      day: selectedDay,
                      phase: selectedDay <= 14 ? 'Etablering' : 'Dybde',
                      theme: dayContent.theme,
                      title: dayContent.title,
                      reflection: dayContent.reflection,
                    }}
                  />

                  {/* Neste-dag-knapp */}
                  {data.currentDay < 30 && (selectedDay === data.currentDay || selectedDay < data.currentDay) && (
                    <button
                      className="w-full min-h-[48px] py-3 px-6 rounded-xl text-base font-medium flex items-center justify-center transition-all duration-300 mt-6"
                      style={{
                        background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
                        color: '#0B1520',
                        boxShadow: '0 0 24px rgba(212, 175, 55, 0.3)',
                      }}
                    >
                      Neste dag — utforsk sammen → Dag {data.currentDay + 1}
                    </button>
                  )}

                  {selectedDay !== data.currentDay && (
                    <button
                      onClick={() => setSelectedDay(data.currentDay)}
                      className="w-full min-h-[48px] py-3 px-6 rounded-xl text-sm font-medium flex items-center justify-center transition-all duration-300 mt-6"
                      style={{
                        background: 'rgba(212, 175, 55, 0.12)',
                        color: '#D4AF37',
                        border: '1px solid rgba(212, 175, 55, 0.35)',
                      }}
                    >
                      ← Tilbake til dag {data.currentDay}
                    </button>
                  )}

                  {data.currentDay >= 30 && (
                    <p
                      className="text-center text-base"
                      style={{ color: 'rgba(255, 255, 255, 0.6)', fontStyle: 'italic' }}
                    >
                      Reisen din er fullført. Ta deg tid til å reflektere over veien dere har gått sammen.
                    </p>
                  )}
                </div>
                );
              })()}

              {/* Bilde-lås-banner (valgfritt) — synleg frå dag 14 */}
              <div className="mt-4">
                <ImageShareLockBanner imageShareAllowedAt={selectedDay >= 14 ? new Date() : null} />
              </div>
            </div>
          </>
        )}

      </div>
    </div>
    </>
  );
}
