/**
 * ToSom UI 5.0 — Onboarding
 * 
 * Guidet profil-opprettning med steg-indikator
 * Rom, varm og fokusert
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui5/Header';
import { GlassPanel } from '@/components/ui5/GlassPanel';

/* ------ Steps ------ */

interface Step {
  title: string;
  text: React.ReactNode;
  buttonLabel: string;
}

const steps: Step[] = [
  {
    title: 'Velkommen til ToSom',
    text: 'ToSom er ein varm, guidet plattform for ekte relasjonar. Her går reisa di — steg for steg, samtale for samtale.',
    buttonLabel: 'Kom i gang',
  },
  {
    title: 'Kva er ToSom?',
    text: (
      <div className="space-y-3 text-left">
        <p>Guidet dating — ein reise for to</p>
        <p>Samtaler som byrjar med meining</p>
        <p>Fokuserer på djupde, ikke mengd</p>
        <p>Premium oppleving, aldri en gratis app</p>
      </div>
    ),
    buttonLabel: 'Neste',
  },
  {
    title: 'Korleis fungerer det?',
    text: (
      <div className="space-y-3 text-left">
        <p>Du får ein match</p>
        <p>Samtalen startar med ei guide</p>
        <p>Felles reise — tre steg mot nærare kjennskap</p>
        <p>Refleksjonar som gjer dere sterkare</p>
      </div>
    ),
    buttonLabel: 'Neste',
  },
  {
    title: 'Reise — deres felles reise',
    text: (
      <div className="space-y-3 text-left">
        <p>Reise er hjartet i ToSom. Kvart match startar med:</p>
        <p><strong>Steg 1:</strong> Start reisa — del noko enkelt</p>
        <p><strong>Steg 2:</strong> Litt djupare — kva ser du fram til?</p>
        <p><strong>Steg 3:</strong> Felles refleksjon — kva gjer at du trivst?</p>
      </div>
    ),
    buttonLabel: 'Finn din match',
  },
];

/* ------ Step indicator ------ */

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1 rounded-full transition-all duration-300"
          style={{
            width: i === current ? '32px' : '8px',
            background: i <= current ? '#D4AF37' : 'rgba(255, 255, 255, 0.1)',
          }}
        />
      ))}
    </div>
  );
}

/* ------ Main page ------ */

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        localStorage.setItem('tosom_onboarded', 'true');
      } catch {
        /* localStorage not available */
      }
      router.push('/dashboard');
    }
  };

  const step = steps[currentStep];

  return (
    <div className="min-h-screen flex items-center justify-center px-8" style={{ background: '#0B0E11' }}>
      <Header currentPath="/onboarding" />

      <div className="w-full max-w-[560px] py-12">
        {/* Step indicator */}
        <StepIndicator current={currentStep} total={steps.length} />

        {/* Content */}
        <GlassPanel goldBorder className="text-center">
          <h1
            className="text-[28px] lg:text-[32px] font-semibold mb-4"
            style={{
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}
          >
            {step.title}
          </h1>

          <div
            className="text-base mb-8"
            style={{
              color: 'rgba(255, 255, 255, 0.65)',
              lineHeight: '1.65',
            }}
          >
            {step.text}
          </div>

          <button
            onClick={handleNext}
            className="w-full px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out"
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
            {step.buttonLabel}
          </button>

          {/* Progress text */}
          <p
            className="text-xs mt-4"
            style={{ color: 'rgba(255, 255, 255, 0.25)' }}
          >
            {currentStep + 1} av {steps.length}
          </p>
        </GlassPanel>
      </div>
    </div>
  );
}