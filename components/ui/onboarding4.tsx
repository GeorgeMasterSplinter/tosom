/**
 * Tosom 4.0 — Onboarding Experience
 *
 * Full onboarding journey: welcome → personality → interests → goals → AI → finish.
 * Uses PageTransition + StaggeredChildren + GlowEffect + GuidedFlow.
 *
 * Usage:
 *   import { Onboarding4, useOnboarding4 } from '@/components/ui/onboarding4'
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

/* ── Onboarding Steps ── */
export type OnboardingStep =
  | 'welcome'
  | 'personality'
  | 'interests'
  | 'goals'
  | 'ai'
  | 'finish';

/* ── Onboarding State ── */
export interface OnboardingState {
  step: OnboardingStep;
  name: string;
  age: number | null;
  personality: string[];
  interests: string[];
  goals: string[];
  aiFeatures: string[];
  progress: number;
}

/* ── Default State ── */
const defaultState: OnboardingState = {
  step: 'welcome',
  name: '',
  age: null,
  personality: [],
  interests: [],
  goals: [],
  aiFeatures: [],
  progress: 0,
};

/* ── Context ── */
const OnboardingContext = createContext<{
  state: OnboardingState;
  next: () => void;
  back: () => void;
  skip: () => void;
  set: (partial: Partial<OnboardingState>) => void;
  complete: () => void;
}>({
  state: defaultState,
  next: () => {},
  back: () => {},
  skip: () => {},
  set: () => {},
  complete: () => {},
});

export function useOnboarding4() {
  return useContext(OnboardingContext);
}

/* ── Step Definitions ── */
const steps: OnboardingStep[] = ['welcome', 'personality', 'interests', 'goals', 'ai', 'finish'];

const personalityTraits = [
  { id: 'calm', label: 'Ro', emoji: '🍃', desc: 'Du finner ro i det stille' },
  { id: 'adventurous', label: 'Eventyrlysten', emoji: '🌊', desc: 'Du leter etter nye oppdagelser' },
  { id: 'thoughtful', label: 'Tankefull', emoji: '📖', desc: 'Du dykker dypere enn overflaten' },
  { id: 'passionate', label: 'Passjonert', emoji: '🔥', desc: 'Du lever med hjertet ditt' },
  { id: 'creative', label: 'Kreativ', emoji: '🎨', desc: 'Du ser skjønnhet overalt' },
  { id: 'grounded', label: 'Jordet', emoji: '🌱', desc: 'Du finner styrke i rotfest' },
];

const interestCategories = [
  { id: 'nature', label: 'Natur', emoji: '🌿' },
  { id: 'art', label: 'Kunst', emoji: '🎭' },
  { id: 'music', label: 'Musikk', emoji: '🎵' },
  { id: 'literature', label: 'Litteratur', emoji: '📚' },
  { id: 'cooking', label: 'Mat', emoji: '🍳' },
  { id: 'travel', label: 'Reise', emoji: '✈️' },
  { id: 'philosophy', label: 'Filosofi', emoji: '🤔' },
  { id: 'science', label: 'Vitenskap', emoji: '🔬' },
  { id: 'film', label: 'Film', emoji: '🎬' },
  { id: 'fitness', label: 'Trening', emoji: '💪' },
  { id: 'photography', label: 'Foto', emoji: '📷' },
  { id: 'gardening', label: 'Hagebruk', emoji: '🌻' },
];

const relationshipGoals = [
  { id: 'deepConnection', label: 'Dyp forbindelse', emoji: '♡', desc: 'Å finne noen som virkelig forstår deg' },
  { id: 'growth', label: 'Gemens vekst', emoji: '🌱', desc: 'Å vokse sammen med noen' },
  { id: 'companion', label: 'Livsreisefelle', emoji: '🗺️', desc: 'Noen å dele livet med' },
  { id: 'creative', label: 'Kreativt samarbeid', emoji: '🎨', desc: 'Å skape noe vakkert sammen' },
  { id: 'healing', label: 'Heling', emoji: '💛', desc: 'Å finne trygghet og varme' },
  { id: 'adventure', label: 'Felles eventyr', emoji: '⛰️', desc: 'Å utforske verden sammen' },
];

const aiFeatures = [
  { id: 'messageSuggestions', label: 'Meldingsforslag', emoji: '💌', desc: 'AI hjelper deg med å finne ordene' },
  { id: 'journeyGuide', label: 'Reiseveiledning', emoji: '🗺️', desc: 'AI guider dere gjennom reisen' },
  { id: 'insights', label: 'Personlige innsikter', emoji: '💡', desc: 'Innsikt i deres mønstre' },
  { id: 'icebreakers', label: 'Isbrytere', emoji: '🧊', desc: 'Meningsfulle spørsmål når du trenger det' },
  { id: 'moodCheck', label: 'Stemningssjekk', emoji: '🌤️', desc: 'AI sjekker hvordan dere har det' },
];

/* ── PageTransition ── */
const PageTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`animate-[fadeIn_0.6s_ease-out] ${className}`}>
    {children}
  </div>
);

/* ── StaggeredChildren ── */
const StaggeredChildren: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const childArray = React.Children.toArray(children);
  return (
    <div className={className}>
      {childArray.map((child, i) => (
        <div
          key={i}
          className="animate-[slideUp_0.5s_ease-out]"
          style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' } as React.CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

/* ── GlowEffect ── */
const GlowEffect: React.FC<{ className?: string; color?: string }> = ({ className = '', color = '#D4AF37' }) => (
  <div className={`absolute inset-0 pointer-events-none ${className}`}>
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl"
      style={{ backgroundColor: color }}
    />
  </div>
);

/* ── Welcome Screen ── */
const WelcomeScreen: React.FC = () => {
  const { state, next, set, complete } = useOnboarding4();

  return (
    <PageTransition className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <GlowEffect color="#D4AF37" />
      <StaggeredChildren className="relative z-10 text-center max-w-lg mx-auto">
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/8">
          <span className="text-5xl">♡</span>
        </div>
        <h1 className="text-white font-semibold text-4xl mb-4 leading-tight">
          Velkommen til<br /><span className="text-[#D4AF37]">Tosom</span>
        </h1>
        <p className="text-white/50 text-lg mb-2 leading-relaxed">
          To mennesker. Én reise.
        </p>
        <p className="text-white/30 text-sm mb-12 leading-relaxed">
          Her finnes det ingen swiping. Ingen rush. Bare deg og den som kommer.
        </p>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Hva heter du?"
            value={state.name}
            onChange={(e) => set({ name: e.target.value })}
            className="w-full bg-white/[0.04] border border-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 text-white placeholder:text-white/30 text-center focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2)] transition-all"
          />
          <button
            onClick={next}
            className="w-full bg-[#D4AF37] text-[#0B0E11] px-8 py-4 rounded-2xl font-semibold text-lg active:scale-[0.97] transition-transform"
          >
            Kom i gang
          </button>
          <button
            onClick={complete}
            className="text-white/20 text-sm hover:text-white/40 transition-colors"
          >
            Hopp over og utforsk senere
          </button>
        </div>
      </StaggeredChildren>
    </PageTransition>
  );
};

/* ── Personality Screen ── */
const PersonalityScreen: React.FC = () => {
  const { state, next, set } = useOnboarding4();

  return (
    <PageTransition className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden py-12">
      <GlowEffect color="#60A5FA" />
      <StaggeredChildren className="relative z-10 max-w-lg mx-auto w-full">
        <h2 className="text-white font-semibold text-2xl text-center mb-2">Hvordan beskriver du deg selv?</h2>
        <p className="text-white/40 text-sm text-center mb-10">Velg alt som føles riktig</p>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {personalityTraits.map((trait) => {
            const selected = state.personality.includes(trait.id);
            return (
              <button
                key={trait.id}
                onClick={() => {
                  const newP = selected
                    ? state.personality.filter((p) => p !== trait.id)
                    : [...state.personality, trait.id];
                  set({ personality: newP });
                }}
                className={`p-5 rounded-2xl border-2 transition-all text-left ${
                  selected
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                    : 'border-white/8 bg-white/[0.02] hover:border-white/15'
                }`}
              >
                <span className="text-3xl block mb-2">{trait.emoji}</span>
                <div className="text-white font-medium text-sm">{trait.label}</div>
                <div className="text-white/40 text-xs mt-1">{trait.desc}</div>
              </button>
            );
          })}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => state.personality.length >= 1 && next()}
            disabled={state.personality.length === 0}
            className="flex-1 bg-[#D4AF37] text-[#0B0E11] py-4 rounded-2xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.97] transition-all"
          >
            Neste
          </button>
        </div>
      </StaggeredChildren>
    </PageTransition>
  );
};

/* ── Interests Screen ── */
const InterestsScreen: React.FC = () => {
  const { state, next, set } = useOnboarding4();

  return (
    <PageTransition className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden py-12">
      <GlowEffect color="#F472B6" />
      <StaggeredChildren className="relative z-10 max-w-lg mx-auto w-full">
        <h2 className="text-white font-semibold text-2xl text-center mb-2">Hva er du interessert i?</h2>
        <p className="text-white/40 text-sm text-center mb-2">Velg minst 3</p>
        <p className="text-white/25 text-xs text-center mb-8">Dette hjelper oss med å finne resonans</p>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {interestCategories.map((cat) => {
            const selected = state.interests.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => {
                  const newI = selected
                    ? state.interests.filter((i) => i !== cat.id)
                    : [...state.interests, cat.id];
                  set({ interests: newI });
                }}
                className={`p-4 rounded-2xl border-2 transition-all text-center ${
                  selected
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                    : 'border-white/8 bg-white/[0.02] hover:border-white/15'
                }`}
              >
                <span className="text-2xl block mb-1">{cat.emoji}</span>
                <div className="text-white text-xs">{cat.label}</div>
              </button>
            );
          })}
        </div>
        <div className="flex gap-3">
          <button
            onClick={next}
            disabled={state.interests.length < 3}
            className="flex-1 bg-[#D4AF37] text-[#0B0E11] py-4 rounded-2xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.97] transition-all"
          >
            Neste ({state.interests.length}/3)
          </button>
        </div>
      </StaggeredChildren>
    </PageTransition>
  );
};

/* ── Goals Screen ── */
const GoalsScreen: React.FC = () => {
  const { state, next, set } = useOnboarding4();

  return (
    <PageTransition className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden py-12">
      <GlowEffect color="#34D399" />
      <StaggeredChildren className="relative z-10 max-w-lg mx-auto w-full">
        <h2 className="text-white font-semibold text-2xl text-center mb-2">Hva leter du etter i en relasjon?</h2>
        <p className="text-white/40 text-sm text-center mb-10">Velg det som føles ekte</p>
        <div className="grid grid-cols-1 gap-3 mb-8">
          {relationshipGoals.map((goal) => {
            const selected = state.goals.includes(goal.id);
            return (
              <button
                key={goal.id}
                onClick={() => {
                  const newG = selected
                    ? state.goals.filter((g) => g !== goal.id)
                    : [...state.goals, goal.id];
                  set({ goals: newG });
                }}
                className={`p-5 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                  selected
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                    : 'border-white/8 bg-white/[0.02] hover:border-white/15'
                }`}
              >
                <span className="text-3xl">{goal.emoji}</span>
                <div>
                  <div className="text-white font-medium text-sm">{goal.label}</div>
                  <div className="text-white/40 text-xs mt-0.5">{goal.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex gap-3">
          <button
            onClick={next}
            disabled={state.goals.length === 0}
            className="flex-1 bg-[#D4AF37] text-[#0B0E11] py-4 rounded-2xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.97] transition-all"
          >
            Neste
          </button>
        </div>
      </StaggeredChildren>
    </PageTransition>
  );
};

/* ── AI Screen ── */
const AIScreen: React.FC = () => {
  const { state, next, set } = useOnboarding4();

  return (
    <PageTransition className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden py-12">
      <GlowEffect color="#C084FC" />
      <StaggeredChildren className="relative z-10 max-w-lg mx-auto w-full">
        <h2 className="text-white font-semibold text-2xl text-center mb-2">AI-assistent for dere</h2>
        <p className="text-white/40 text-sm text-center mb-10">Velg hva du vil ha hjelp med</p>
        <div className="grid grid-cols-1 gap-3 mb-8">
          {aiFeatures.map((f) => {
            const selected = state.aiFeatures.includes(f.id);
            return (
              <button
                key={f.id}
                onClick={() => {
                  const newA = selected
                    ? state.aiFeatures.filter((a) => a !== f.id)
                    : [...state.aiFeatures, f.id];
                  set({ aiFeatures: newA });
                }}
                className={`p-5 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                  selected
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                    : 'border-white/8 bg-white/[0.02] hover:border-white/15'
                }`}
              >
                <span className="text-3xl">{f.emoji}</span>
                <div>
                  <div className="text-white font-medium text-sm">{f.label}</div>
                  <div className="text-white/40 text-xs mt-0.5">{f.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex gap-3">
          <button
            onClick={next}
            className="flex-1 bg-[#D4AF37] text-[#0B0E11] py-4 rounded-2xl font-semibold active:scale-[0.97] transition-all"
          >
            Neste
          </button>
        </div>
      </StaggeredChildren>
    </PageTransition>
  );
};

/* ── Finish Screen ── */
const FinishScreen: React.FC = () => {
  const { state } = useOnboarding4();

  return (
    <PageTransition className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden py-12">
      <GlowEffect color="#D4AF37" />
      <StaggeredChildren className="relative z-10 text-center max-w-lg mx-auto">
        <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-[#D4AF37]/20 to-[#E8C766]/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/8 animate-[popIn_0.6s_ease-out]">
          <span className="text-6xl">♡</span>
        </div>
        <h2 className="text-white font-semibold text-3xl mb-4">
          Du er klar, <span className="text-[#D4AF37]">{state.name || 'reisende'}</span>
        </h2>
        <p className="text-white/50 text-base mb-4 leading-relaxed">
          Din personlige reise er satt opp.
        </p>
        <p className="text-white/30 text-sm mb-12 leading-relaxed">
          Tre interesser • {state.goals.length} relasjonsmål • AI-hjelp
        </p>
        <button
          onClick={() => {}}
          className="bg-[#D4AF37] text-[#0B0E11] px-12 py-4 rounded-2xl font-semibold text-lg active:scale-[0.97] transition-transform"
        >
          Start reisen
        </button>
      </StaggeredChildren>
    </PageTransition>
  );
};

/* ── Progress Steps ── */
const OnboardingProgress: React.FC = () => {
  const { state } = useOnboarding4();
  const currentIndex = steps.indexOf(state.step);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-1.5 py-3 px-4 bg-[#0B0E11]/60 backdrop-blur-xl border-b border-white/5">
      {steps.map((s, i) => (
        <div
          key={s}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i < currentIndex ? 'bg-[#D4AF37]/60 w-6' : i === currentIndex ? 'bg-[#D4AF37] w-8' : 'bg-white/10 w-4'
          }`}
        />
      ))}
    </div>
  );
};

/* ── Main Onboarding4 Component ── */
const Onboarding4: React.FC<{ onComplete?: () => void; className?: string }> = ({ onComplete, className = '' }) => {
  const [state, setState] = useState<OnboardingState>(defaultState);

  const next = useCallback(() => {
    setState((prev) => {
      const idx = steps.indexOf(prev.step);
      if (idx < steps.length - 1) {
        const nextStep = steps[idx + 1];
        return { ...prev, step: nextStep, progress: ((idx + 1) / steps.length) * 100 };
      }
      return prev;
    });
  }, []);

  const back = useCallback(() => {
    setState((prev) => {
      const idx = steps.indexOf(prev.step);
      if (idx > 0) {
        const prevStep = steps[idx - 1];
        return { ...prev, step: prevStep, progress: (idx / steps.length) * 100 };
      }
      return prev;
    });
  }, []);

  const skip = useCallback(() => {
    setState((prev) => ({ ...prev, step: 'finish', progress: 100 }));
    onComplete?.();
  }, [onComplete]);

  const set = useCallback((partial: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const complete = useCallback(() => {
    setState((prev) => ({ ...prev, step: 'finish', progress: 100 }));
  }, []);

  const renderStep = () => {
    switch (state.step) {
      case 'welcome': return <WelcomeScreen />;
      case 'personality': return <PersonalityScreen />;
      case 'interests': return <InterestsScreen />;
      case 'goals': return <GoalsScreen />;
      case 'ai': return <AIScreen />;
      case 'finish': return <FinishScreen />;
    }
  };

  return (
    <OnboardingContext.Provider value={{ state, next, back, skip, set, complete }}>
      <div className={`relative min-h-screen bg-[#0B0E11] ${className}`}>
        <OnboardingProgress />
        <div className="pt-12">
          {renderStep()}
        </div>
      </div>
    </OnboardingContext.Provider>
  );
};

export { Onboarding4, PageTransition, StaggeredChildren, GlowEffect };
export default Onboarding4;