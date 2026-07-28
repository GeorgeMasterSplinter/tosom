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
import JourneySection from '@/components/journey/JourneySection';

/* ====== Types ====== */

interface DashboardData {
  userName: string;
  matched: boolean;
  partnerName: string | null;
  daysTogether: number;
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

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 6) setGreeting('God natt');
    else if (hour < 12) setGreeting('God morgen');
    else if (hour < 18) setGreeting('God ettermiddag');
    else setGreeting('God kveld');

    // Mock-data
    setData({
      userName: 'Ane',
      matched: true,
      partnerName: 'Erik',
      daysTogether: 7,
      resonance: 72,
      currentDay: 7,
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
    <div className="min-h-screen w-full py-8 md:py-12" style={{ background: color.bg.primary }}>
      <div className="mx-auto max-w-[720px] space-y-10 px-4 md:px-0">
        
        {/* ====== Seksjon 1: Header ====== */}
        <div
          className="w-full rounded-2xl p-6 md:p-8 animate-fadeIn"
          style={glassVariant('default', 'medium')}
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

        {/* ====== Seksjon 2: Handlinger (3 knapper i horisontal rad) ====== */}
        {data.matched && (
          <div
            className="w-full rounded-xl p-6 animate-fadeIn"
            style={glassVariant('default', 'medium')}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {actionItems.map((item) => (
                <Link key={item.href} href={item.href} className="block w-full">
                  <PremiumButton
                    variant="secondary"
                    size="md"
                    className="w-full justify-center text-sm py-3 px-4 rounded-xl min-h-[52px]"
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

        {/* ====== Seksjon 3: Profil + Resonans + Partner ====== */}
        {data.matched ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Profil-kort */}
            <div
              className="w-full rounded-xl p-6 animate-fadeIn"
              style={glassVariant('default', 'medium')}
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
            <div className="flex flex-col items-center justify-center animate-fadeIn">
              <ResonanceMeter value={data.resonance} size="md" showLabel />
            </div>

            {/* Partner-kort */}
            <div
              className="w-full rounded-xl p-6 animate-fadeIn"
              style={glassVariant('gold', 'medium')}
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
          /* Ingen match — ventende kort */
          <div
            className="w-full rounded-xl p-8 text-center animate-fadeIn"
            style={glassVariant('default', 'medium')}
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

        {/* ====== Seksjon 4: Reise (JourneySection) ====== */}
        {data.matched && (
          <JourneySection
            currentDay={data.currentDay}
            daysCompleted={data.daysTogether - 1}
            phaseLabel={data.currentDay <= 14 ? 'Tillit' : 'Dybde'}
          />
        )}

      </div>
    </div>
  );
}