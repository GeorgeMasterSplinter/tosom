"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import OnboardingScreen from "@/components/onboarding/OnboardingScreen";

const steps = [
  {
    title: "Velkommen til ToSom",
    text: "ToSom er en varm, guidet plattform for ekte relasjoner. Her går reisen din sammen — steg for steg, samtale for samtale.",
    buttonLabel: "Kom i gang",
  },
  {
    title: "Hva er ToSom?",
    text: (
      <div className="space-y-3 text-left">
        <p>🎯 Guidet dating — en reise for to</p>
        <p>💬 Samtaler som begynner med mening</p>
        <p>🌱 Fokuserer på dyp, ikke mengde</p>
        <p>✨ Premium opplevelse, aldri en gratis app</p>
      </div>
    ),
    buttonLabel: "Neste",
  },
  {
    title: "Hvordan fungerer det?",
    text: (
      <div className="space-y-3 text-left">
        <p>1️⃣ Du får en match</p>
        <p>2️⃣ Samtalen starter med en guide</p>
        <p>3️⃣ Felles journey — tre steg mot nærere kjennskap</p>
        <p>4️⃣ Refleksjoner som gjør dere sterkere</p>
      </div>
    ),
    buttonLabel: "Neste",
  },
  {
    title: "Journey — deres felles reise",
    text: (
      <div className="space-y-3 text-left">
        <p>Journey er hjertet i ToSom. Hver match starter med:</p>
        <p>🌿 <strong>Steg 1:</strong> Start reisen — del noe enkelt</p>
        <p>🔥 <strong>Steg 2:</strong> Litt dypere — hva ser du frem til?</p>
        <p>💛 <strong>Steg 3:</strong> Felles refleksjon — hva gjør at du trives?</p>
        <p className="text-[var(--color-gold)] pt-2">Etter steg 3 får dere en liten feiring 🎉</p>
      </div>
    ),
    buttonLabel: "Finn din match",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        localStorage.setItem("tosom_onboarded", "true");
      } catch {
        /* localStorage not available */
      }
      router.push("/dashboard");
    }
  };

  const step = steps[currentStep];

  return (
    <OnboardingLayout step={currentStep} totalSteps={steps.length}>
      <OnboardingScreen
        title={step.title}
        text={step.text}
        buttonLabel={step.buttonLabel}
        onNext={handleNext}
      />
    </OnboardingLayout>
  );
}
