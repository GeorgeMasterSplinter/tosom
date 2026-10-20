/**
 * ToSom — ScrollAffordance
 *
 * Skroll-signaler på landing-sidene, for at folk skal se fort
 * at det er mer å lese nedover:
 *
 * 1. Leseforståelsesscale — tynn gull-linje i toppen som fyller
 *    med lesedetalget (0–100 %). Forteller hvor langt man er.
 * 2. Skroll-pil — gull chevron i bunnen av førstevisningen,
 *    fader ut etter ~120 px scrolling. Forteller at man kan scrolle.
 *
 * Vises kun på landing/offentlige sider (ekskluder-liste nedenfor),
 * aldri på app-tydelige fløyer (dashboard, chat, onboarding m.m.).
 *
 * pointer-events: none — elementene er aldri klikkbare.
 * prefers-reduced-motion: pila står stille, faderer likevel ut.
 */

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/* App-tydelige fløyer: ingen skroll-signaler */
const EXCLUDED = [
  '/dashboard',
  '/chat',
  '/settings',
  '/profile',
  '/admin',
  '/onboarding',
  '/questions',
  '/login',
  '/register',
  '/glemt-passord',
  '/nytt-passord',
  '/samtykke',
  '/betaling',
  '/dev-login',
];

export function ScrollAffordance() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [needed, setNeeded] = useState(false);

  const excluded =
    pathname.startsWith('/api') ||
    EXCLUDED.some((p) => pathname === p || pathname.startsWith(p + '/'));

  useEffect(() => {
    if (excluded) return;

    let frame = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
      setScrolled(y > 120);
      setNeeded(max > 40);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [excluded]);

  if (excluded) return null;

  return (
    <>
      {/* ===== LESEFORSTÅELSESCALE ===== */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full w-full origin-left"
          style={{
            transform: `scaleX(${progress})`,
            background: 'linear-gradient(90deg, rgba(212,175,55,0.5), #D4AF37)',
            boxShadow: '0 0 12px rgba(212,175,55,0.35)',
            opacity: progress > 0.01 ? 1 : 0,
            transition: 'opacity 400ms ease',
          }}
        />
      </div>

      {/* ===== SKROLL-PIL (førstevisning) ===== */}
      {needed && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
          aria-hidden="true"
          style={{ opacity: scrolled ? 0 : 1, transition: 'opacity 500ms ease' }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ts-arrow-drift"
          >
            <path d="M6 3 L12 9 L18 3" />
            <path d="M6 7.5 L12 13.5 L18 7.5" />
            <path d="M6 12 L12 18 L18 12" />
          </svg>
        </div>
      )}
    </>
  );
}

export default ScrollAffordance;