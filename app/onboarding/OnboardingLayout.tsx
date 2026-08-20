/**
 * Tosom — OnboardingLayout (simplified — no duplicate headers)
 * Kun container: progressbar + children.
 * Header (steg-indikator, tittel, undertittel, guidingText) vert rendera av hvart steg-komponent.
 */

'use client';

import { FC, ReactNode, useState, useEffect } from 'react';

/** Neste fredag 23:59:59 (siste sjanse til å være med på runden). */
function getNextFriday2359(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun … 5=Fri, 6=Sat
  let daysUntilFriday: number;
  if (day === 5) {
    const friday = new Date(now);
    friday.setHours(23, 59, 59, 0);
    if (friday > now) return friday;
    daysUntilFriday = 7;
  } else {
    daysUntilFriday = (5 - day + 7) % 7;
    if (daysUntilFriday === 0) daysUntilFriday = 7;
  }
  const result = new Date(now);
  result.setDate(result.getDate() + daysUntilFriday);
  result.setHours(23, 59, 59, 0);
  return result;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '0m';
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} d`);
  if (hours > 0) parts.push(`${hours} t`);
  parts.push(`${minutes} m`);
  return parts.join(' ');
}

/**
 * Rolig påminnelse om matcherunden — vises på alle onboarding-steg.
 * Lav kontrast, liten, i bunnen. Ingen press.
 */
function RoundReminder() {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const tick = () => {
      const diff = getNextFriday2359().getTime() - Date.now();
      setCountdown(formatCountdown(diff));
    };
    tick();
    const interval = setInterval(tick, 60000); // rolig: oppdater hver minutt
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="mt-10 mb-2 px-5 py-4 rounded-2xl"
      style={{
        background: 'rgba(212, 175, 55, 0.04)',
        border: '1px solid rgba(212, 175, 55, 0.12)',
      }}
    >
      <div className="flex items-center justify-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(212, 175, 55, 0.55)' }}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
        <p className="text-xs tabular-nums font-medium" style={{ color: 'rgba(212, 175, 55, 0.7)' }}>
          {countdown} til fredag 23:59
        </p>
      </div>
      <p className="text-center mt-2 text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
        Matcherunden kjører lørdag. Vær ferdig med profilen før fredag 23:59 for å være
        med på denne runden — eller la den ligge til neste lørdag.
      </p>
    </div>
  );
}

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
  progressPercent?: number;
  error?: string | null;
}

export const OnboardingLayout: FC<OnboardingLayoutProps> = ({
  currentStep,
  totalSteps,
  children,
  progressPercent,
  error,
}) => {
  const progress = progressPercent ?? ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full relative">
      {/* Error summary */}
      {error && (
        <div className="mb-4">
          <div className="rounded-xl p-4 border" style={{
            background: 'rgba(255, 77, 77, 0.08)',
            borderColor: 'rgba(255, 77, 77, 0.2)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}>
            <p className="text-sm font-medium mb-1" style={{ color: '#FF4D4D' }}>
              ✕ Det blei ein feil
            </p>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Children — glass-kortet renderast av OnboardingSlide (én kort, ikkje nestla) */}
      <div>{children}</div>

      {/* Rolig påminnelse om matcherunden — på alle steg */}
      <RoundReminder />
    </div>
  );
};
