/* ═══════════════════════════════════════════
   ToSom Premium — Journey Page (UI 4.2)
   Timeline with gold-glow milestones · Calm-gradient segments
   Gold progress bars · Glass-milestones
   ═══════════════════════════════════════════ */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JourneyMap, JourneyStep } from "@/components/journey/JourneyMap";
import { ResonanceMeter } from "@/components/ui/ResonanceMeter";
import { FadeIn } from "@/components/ui/FadeIn";

interface DayConfig {
  dayNumber: number;
  title: string;
  icon: string;
  reflectionPrompt: string;
  microInsight: string;
  progressionHint: string;
}

interface JourneyState {
  currentDay: number;
  journeyActive: boolean;
  journeyCompleted: boolean;
  photosAllowed: boolean;
}

// Demo journey steps
const demoSteps: JourneyStep[] = [
  { id: "1", title: "Introduksjon", description: "Oppdag om hverandre", status: "done", icon: "🤝" },
  { id: "2", title: "Trygghet", description: "Bygg grunnlag for tillit", status: "done", icon: "🛡" },
  { id: "3", title: "Åpne deg", description: "Del tanker og følelser", status: "active", icon: "🔓" },
  { id: "4", title: "Djupare samtalar", description: "Utforsk felles verdier", status: "locked" },
  { id: "5", title: "Sårbarheit", description: "Være autentisk sammen", status: "locked" },
  { id: "6", title: "Felles reise", description: "Bygg noe sammen", status: "locked" },
];

// Demo day config
const demoDayConfig: DayConfig = {
  dayNumber: 3,
  title: "Åpne deg",
  icon: "🔓",
  reflectionPrompt: "Hva er noe du sjeldent deler med andre? Hvorfor?",
  microInsight: "Sårbarhet er ikke svakhet — det er mot.",
  progressionHint: "I dag handler om å vise den ekte deg. Ikke den perfekte.",
};

export default function JourneyPage() {
  const router = useRouter();
  const [currentDay] = useState(3);
  const [journeyState] = useState<JourneyState>({
    currentDay,
    journeyActive: true,
    journeyCompleted: false,
    photosAllowed: false,
  });

  const [activeStep, setActiveStep] = useState<JourneyStep | null>(demoSteps[2]);

  const handleNextDay = () => {
    if (currentDay < 35) {
      router.push(`/journey?day=${currentDay + 1}`);
    }
  };

  const handlePrevDay = () => {
    if (currentDay > 1) {
      router.push(`/journey?day=${currentDay - 1}`);
    }
  };

  return (
    <div className="min-h-screen bg-ts-bg-primary text-ts-primary relative overflow-hidden">
      {/* UI 4.2: calm-gradient-gold subtle bg */}
      <div className="absolute inset-0 calm-gradient-gold opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-ts-bg-primary/60 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-section py-section relative z-10">
        {/* SectionHero — UI 4.2: display-xl + gold-glow-text */}
        <FadeIn duration={500}>
          <div className="text-center space-y-lg mb-4xl">
            <span className="text-ts-gold uppercase tracking-[0.25em] text-xs font-semibold">
              Reise
            </span>
            <h1 className="ts-display-xl text-gold-glow-text">
              Deres felles reise
            </h1>
            <p className="text-text-muted max-w-xl mx-auto">
              Guidet utvikling, refleksjon og dypere forbindelse
            </p>
          </div>
        </FadeIn>

        {/* JourneyMap — UI 4.2: ts-glass-strong + gold-glow-md */}
        <FadeIn duration={500} delay={100}>
          <div className="ts-glass-strong rounded-[var(--ts-radius-2xl)] p-xl shadow-lg mb-4xl gold-glow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-ts-gold-soft opacity-10 pointer-events-none" />
            <div className="relative z-10">
              <JourneyMap
                steps={demoSteps}
                onSelectStep={(step) => setActiveStep(step)}
              />
            </div>
          </div>
        </FadeIn>

        {/* ResonanceMeter — UI 4.2: centered + gold glow */}
        <FadeIn duration={500} delay={200}>
          <div className="flex justify-center mb-4xl">
            <div className="text-center">
              <ResonanceMeter score={72} label="Samlet resonans" size="lg" />
            </div>
          </div>
        </FadeIn>

        {/* Dagens oppgave — UI 4.2: calm-gradient-rose card */}
        <FadeIn duration={500} delay={300}>
          <div className="ts-glass-strong rounded-[var(--ts-radius-3xl)] p-2xl shadow-lg mb-4xl relative overflow-hidden">
            <div className="absolute inset-0 calm-gradient-rose opacity-15 pointer-events-none" />
            <div className="relative z-10 space-xl">
              <div className="flex items-center gap-lg mb-lg">
                <span className="text-3xl">{demoDayConfig.icon}</span>
                <h2 className="ts-font-heading-xl text-text-primary">
                  Dag {demoDayConfig.dayNumber}: {demoDayConfig.title}
                </h2>
              </div>
              <p className="text-text-secondary leading-relaxed mb-xl">{demoDayConfig.microInsight}</p>
              <button
                onClick={handleNextDay}
                className="inline-flex items-center justify-center rounded-[var(--ts-radius-md)] bg-ts-gold text-ts-bg-primary font-medium px-xl py-md hover:bg-ts-gold-light transition-all duration-[var(--ts-transition-normal)] gold-glow-md hover:gold-glow-lg"
              >
                Fortsett
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Refleksjon — UI 4.2: ts-glass + gold border */}
        <FadeIn duration={500} delay={400}>
          <div className="ts-glass rounded-[var(--ts-radius-xl)] p-xl shadow-soft mb-4xl border-ts-gold/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-ts-calm-warm/50 pointer-events-none" />
            <div className="relative z-10 space-lg">
              <h4 className="ts-font-heading-s text-ts-gold font-semibold mb-sm">Refleksjon</h4>
              <p className="text-text-secondary leading-relaxed">{demoDayConfig.reflectionPrompt}</p>
            </div>
          </div>
        </FadeIn>

        {/* Progresjon hint */}
        <FadeIn duration={500} delay={500}>
          <div className="ts-glass rounded-[var(--ts-radius-xl)] p-xl shadow-soft mb-4xl relative overflow-hidden">
            <div className="absolute inset-0 bg-ts-calm-warm/50 pointer-events-none" />
            <div className="relative z-10 space-lg">
              <h4 className="ts-font-heading-s text-ts-gold font-semibold mb-sm">Dagens tanke</h4>
              <p className="text-text-secondary leading-relaxed">{demoDayConfig.progressionHint}</p>
            </div>
          </div>
        </FadeIn>

        {/* Navigasjon — UI 4.2: gold-glow button */}
        <FadeIn duration={500} delay={600}>
          <div className="flex gap-lg">
            <button
              onClick={handlePrevDay}
              disabled={currentDay <= 1}
              className="flex-1 px-lg py-md rounded-[var(--ts-radius-md)] border border-ts-gold/20 text-ts-gold/70 text-sm font-medium hover:bg-ts-gold-soft hover:border-ts-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-[var(--ts-transition-fast)]"
            >
              ← Tidligere dag
            </button>
            <button
              onClick={handleNextDay}
              disabled={currentDay >= 35}
              className="flex-1 px-lg py-md rounded-[var(--ts-radius-md)] bg-ts-gold text-ts-bg-primary text-sm font-medium hover:bg-ts-gold-light disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-[var(--ts-transition-fast)] gold-glow-md hover:gold-glow-lg"
            >
              Neste dag →
            </button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
