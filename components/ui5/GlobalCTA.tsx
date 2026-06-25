/**
 * ToSom GlobalCTA — Reusable two-button CTA component
 * 
 * Gold button (Opprett konto) + Dark glass button (Logg inn)
 * Migrated to ToSom Design System.
 */

'use client';

import { ToSomSection, ToSomButton } from '../ui5/system';
import { typography, motion } from '@/design/tokens';

export function GlobalCTA() {
  return (
    <ToSomSection
      spotlight="cta"
      className="w-full py-40 md:py-52 pb-10 md:pb-16"
    >
      <div className="max-w-[900px] mx-auto text-center space-y-12 relative after:absolute after:inset-0 after:top-[60%] after:bg-white/5 after:blur-[100px] after:content-[''] after:pointer-events-none">
        <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] animate-riseIn">
          Klar til å starte?
        </h2>
        <p className="text-[22px] md:text-[26px] text-white/90 max-w-[700px] mx-auto leading-relaxed animate-fadeUp delay-[120ms]">
          Lag profilen din i ditt eget tempo og møt noen som faktisk passer deg – på ordentlig.
        </p>
        <div className="w-full space-y-8 pt-10 relative z-10">
          <ToSomButton
            href="/onboarding/start"
            variant="gold"
          >
            Opprett konto
          </ToSomButton>
          <ToSomButton
            href="/login"
            variant="dark"
          >
            Logg inn
          </ToSomButton>
        </div>
      </div>
    </ToSomSection>
  );
}

export default GlobalCTA;