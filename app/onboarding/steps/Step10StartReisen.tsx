/**
 * ToSom — Steg 10: Start reisen
 * Knappar: PremiumButton (med disabled/loading) + BackButton.
 * Lager fake match og navigerer til chat.
 */

'use client';

import { BackButton } from '@/components/onboarding/BackButton';
import { PremiumButton } from '@/components/onboarding/PremiumButton';
import { createFakeMatch } from '@/app/actions/createFakeMatch';

interface Props {
  step: number;
  goToStep: (s: number) => void;
  loading: boolean;
}

export default function Step10StartReisen({ step, goToStep, loading }: Props) {
  const handleStart = async () => {
    try {
      const convoId = await createFakeMatch();
      window.location.href = `/chat/${convoId}`;
    } catch (err) {
      console.error('Fake match failed:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{
          background: 'rgba(212, 175, 55, 0.15)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Du er klar. Vi matcher deg rolig og presist — basert på det du har delt.
        </p>
        <p className="mt-2 text-sm" style={{ color: 'rgba(212, 175, 55, 0.5)' }}>
          ✅ Du vil få én match innen 24 timer. Ingen swiping, ingen press.
        </p>
      </div>

      {/* Knappar */}
      <div className="space-y-4 mt-10">
        <BackButton onClick={() => goToStep(step - 1)} />
        <PremiumButton onClick={handleStart} disabled={loading}>
          {loading ? 'Matcher deg…' : 'Start reisen'}
        </PremiumButton>
      </div>

      <p className="text-center text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
        Når reisen starter kan du ikke endre svarene dine før etter 30 dager.
      </p>
    </div>
  );
}