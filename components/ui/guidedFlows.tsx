/**
 * ToSom 4.0 — Guided Flows System
 *
 * 5 guided flows with step-by-step progress indicators and warm transitions.
 *
 * Usage:
 *   import { GuidedFlow, type FlowType } from '@/components/ui/guidedFlows'
 */

import React, { useState } from 'react';

/* ── Flow Types ── */
export type FlowType =
  | 'matchToChat'
  | 'journeyOnboarding'
  | 'couplesMode'
  | 'memoryCreation'
  | 'aiInsights';

export interface FlowStep {
  title: string;
  description: string;
  icon: string;
}

export interface GuidedFlowProps {
  flow: FlowType;
  currentStep?: number;
  onComplete?: () => void;
  onSkip?: () => void;
  className?: string;
}

/* ── Flow Definitions ── */
const flows: Record<FlowType, FlowStep[]> = {
  matchToChat: [
    { title: 'Resonans funnet', description: 'Dere har en naturlig forbindelse. La oss utforske den.', icon: '💛' },
    { title: 'Bryt isen', description: 'Start med et enkelt, men meningsfullt spørsmål.', icon: '💌' },
    { title: 'Bygg broen', description: 'La samtalen flyte naturlig. Følg trådene dere deler.', icon: '🌉' },
    { title: 'Dypere kontakt', description: 'Når tryggheten vokser, gå dypere. Det er her magien skjer.', icon: '✨' },
  ],
  journeyOnboarding: [
    { title: 'Velkommen til reisen', description: 'Hver reise begynner med ett skjeget. Det er ditt neste.', icon: '🗺️' },
    { title: 'Kjenne hverandre', description: 'Dere starter med lette, koselige oppgaver.', icon: '🌱' },
    { title: 'Bygge tillit', description: 'Samtaler blir dypere. Minner blir lagret.', icon: '🏔️' },
    { title: 'Dypt forbindelse', description: 'Dere har bygd en grunnlag for noe vakert.', icon: '♡' },
  ],
  couplesMode: [
    { title: 'Koble sammen', description: 'Ta det første skjeget og koble dere til din partner.', icon: '🔗' },
    { title: 'Delte rom', description: 'Dere får tilgang til felles kalender, journal og minner.', icon: '🏠' },
    { title: 'Sette mål', description: 'Velg noe dere vil oppnå sammen.', icon: '🎯' },
    { title: 'Leve sammen', description: 'Dere er offisielt i Couples Mode. Ta vare på hverandre.', icon: '💑' },
  ],
  memoryCreation: [
    { title: 'Velg et øyeblikk', description: 'Tenk på noe spesielt dere delte.', icon: '📸' },
    { title: 'Beskriv det', description: 'Hva gjorde dere glad? Hva gjorde det spesielt?', icon: '✍️' },
    { title: 'Legg til detaljer', description: 'Bilder, steder, følelser — alt som hører med.', icon: '🎨' },
    { title: 'Lagret for alltid', description: 'Dette minnet vil alltid være her for dere.', icon: '💾' },
  ],
  aiInsights: [
    { title: 'AI observerer', description: 'Vi analyserer mønstre i deres interaksjon.', icon: '🔍' },
    { title: 'Mønster gjenkjent', description: 'Vi ser noe interessant i deres kommunikasjon.', icon: '🧠' },
    { title: 'Innsikt laget', description: 'Din personlige innsikt er klar.', icon: '💡' },
    { title: 'Del eller behold', description: 'Deler du innsikten med din partner?', icon: '🤝' },
  ],
};

/* ── Progress Bar ── */
const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="w-full h-1 bg-white/5 rounded-full mb-6 overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-[#D4AF37]/60 to-[#D4AF37]/30 rounded-full transition-all duration-500 ease-in-out"
      style={{ width: `${((current + 1) / total) * 100}%` }}
    />
  </div>
);

/* ── Step Indicator ── */
const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center justify-center gap-1.5 mb-4">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-[#D4AF37] w-6' : 'bg-white/15'}`}
      />
    ))}
  </div>
);

/* ── Step Content ── */
const StepContent: React.FC<{ step: FlowStep; index: number }> = ({ step, index }) => (
  <div className="animate-[fadeIn_0.4s_ease-out]">
    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#D4AF37]/15 to-transparent rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/8">
      <span className="text-4xl">{step.icon}</span>
    </div>
    <h3 className="text-white font-semibold text-xl text-center mb-2">{step.title}</h3>
    <p className="text-white/50 text-sm text-center max-w-xs leading-relaxed">{step.description}</p>
  </div>
);

/* ── Main GuidedFlow Component ── */
const GuidedFlow: React.FC<GuidedFlowProps> = ({
  flow,
  currentStep: propStep,
  onComplete,
  onSkip,
  className = '',
}) => {
  const steps = flows[flow];
  const [step, setStep] = useState(propStep ?? 0);
  const total = steps.length;

  const handleNext = () => {
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      onComplete?.();
    }
  };

  const handleSkip = () => {
    onSkip?.();
  };

  const currentFlowStep = steps[step];

  return (
    <div className={`flex flex-col items-center py-8 px-4 ${className}`}>
      <StepIndicator current={step} total={total} />
      <ProgressBar current={step} total={total} />
      <StepContent step={currentFlowStep} index={step} />
      <div className="flex items-center gap-3 mt-8">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="text-white/40 text-sm px-4 py-2 hover:text-white/70 transition-colors"
          >
            Tilbake
          </button>
        )}
        <button
          onClick={handleNext}
          className="bg-[#D4AF37] text-[#0B0E11] px-8 py-3 rounded-xl font-semibold text-sm active:scale-[0.97] transition-transform"
        >
          {step < total - 1 ? 'Neste' : 'Fullfør'}
        </button>
        <button
          onClick={handleSkip}
          className="text-white/30 text-sm px-4 py-2 hover:text-white/50 transition-colors"
        >
          Hopp over
        </button>
      </div>
    </div>
  );
};

/* ── Pre-built Flows ── */
export const MatchToChatFlow = (props: Omit<GuidedFlowProps, 'flow'>) => (
  <GuidedFlow flow="matchToChat" {...props} />
);

export const JourneyOnboardingFlow = (props: Omit<GuidedFlowProps, 'flow'>) => (
  <GuidedFlow flow="journeyOnboarding" {...props} />
);

export const CouplesModeFlow = (props: Omit<GuidedFlowProps, 'flow'>) => (
  <GuidedFlow flow="couplesMode" {...props} />
);

export const MemoryCreationFlow = (props: Omit<GuidedFlowProps, 'flow'>) => (
  <GuidedFlow flow="memoryCreation" {...props} />
);

export const AIInsightsFlow = (props: Omit<GuidedFlowProps, 'flow'>) => (
  <GuidedFlow flow="aiInsights" {...props} />
);

export { GuidedFlow };
export default GuidedFlow;