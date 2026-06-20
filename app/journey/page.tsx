/* ═══════════════════════════════════════════
   ToSom Premium — Journey Page (Redesigned)
   SectionHero + JourneyMap + JourneyCard + ResonanceMeter
   ═══════════════════════════════════════════ */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader } from "@/components/ui/Section";
import { JourneyMap, JourneyStep } from "@/components/journey/JourneyMap";
import { JourneyCard } from "@/components/journey/JourneyCard";
import { ResonanceMeter } from "@/components/ui/ResonanceMeter";
import { Card } from "@/components/ui/Card";
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
    <div className="min-h-screen bg-gradient-to-b from-[var(--ts-bg-primary)] to-[#111827] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* SectionHero */}
        <FadeIn duration={500}>
          <SectionHeader
            badge="Reise"
            title="Deres felles reise"
            subtitle="Guidet utvikling, refleksjon og dypere forbindelse"
          />
        </FadeIn>

        {/* JourneyMap */}
        <FadeIn duration={500} delay={100}>
          <Card variant="glass" className="p-6 mb-8">
            <JourneyMap
              steps={demoSteps}
              onSelectStep={(step) => setActiveStep(step)}
            />
          </Card>
        </FadeIn>

        {/* ResonanceMeter */}
        <FadeIn duration={500} delay={200}>
          <div className="flex justify-center mb-10">
            <div className="text-center">
              <ResonanceMeter score={72} label="Samlet resonans" size="lg" />
            </div>
          </div>
        </FadeIn>

        {/* Dagens oppgave */}
        <FadeIn duration={500} delay={300}>
          <JourneyCard
            icon={demoDayConfig.icon}
            title={`Dag ${demoDayConfig.dayNumber}: ${demoDayConfig.title}`}
            description={demoDayConfig.microInsight}
            ctaLabel="Fortsett"
            ctaOnClick={handleNextDay}
            className="mb-6"
          />
        </FadeIn>

        {/* Refleksjon */}
        <FadeIn duration={500} delay={400}>
          <Card variant="glass" className="p-6 mb-6">
            <h4 className="text-sm font-medium text-white/60 mb-3">Refleksjon</h4>
            <p className="text-sm text-white/50 leading-relaxed">{demoDayConfig.reflectionPrompt}</p>
          </Card>
        </FadeIn>

        {/* Progresjon hint */}
        <FadeIn duration={500} delay={500}>
          <Card variant="glass" className="p-6 mb-8">
            <h4 className="text-sm font-medium text-white/60 mb-2">Dagens tanke</h4>
            <p className="text-sm text-white/50 leading-relaxed">{demoDayConfig.progressionHint}</p>
          </Card>
        </FadeIn>

        {/* Navigasjon */}
        <FadeIn duration={500} delay={600}>
          <div className="flex gap-3">
            <button
              onClick={handlePrevDay}
              disabled={currentDay <= 1}
              className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/[0.04] hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              ← Tidligere dag
            </button>
            <button
              onClick={handleNextDay}
              disabled={currentDay >= 35}
              className="flex-1 px-4 py-3 rounded-xl bg-[var(--ts-gold)] text-[var(--ts-bg-primary)] text-sm font-medium hover:bg-[var(--ts-gold-light)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              Neste dag →
            </button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}