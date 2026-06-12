"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import OnboardingScreen from "@/components/onboarding/OnboardingScreen";

const steps = [
  {
    title: "Velkommen til ToSom",
    text: "ToSom er ein varm, guidert plattform for ekte relasjonar. Her går reisen dykkar saman — steg for steg, samtal for samtal.",
    buttonLabel: "Kom i gang",
  },
  {
    title: "Kva er ToSom?",
    text: (
      <div className="space-y-3 text-left">
        <p>🎯 Guidert dating — ei reise for to</p>
        <p>💬 Samtal som byrjar med meining</p>
        <p>🌱 Fokuserer på djupne, ikkje mengd</p>
        <p>✨ Premium oppleving, aldri ein gratis app</p>
      </div>
    ),
    buttonLabel: "Neste",
  },
  {
    title: "Korleis fungerer det?",
    text: (
      <div className="space-y-3 text-left">
        <p>1️⃣ Du får ein match</p>
        <p>2️⃣ Samtalen startar med ein guide</p>
        <p>3️⃣ Felles journey — tre steg mot nærare kjenskap</p>
        <p>4️⃣ Refleksjonar som gjer dykkar sterkare</p>
      </div>
    ),
    buttonLabel: "Neste",
  },
  {
    title: "Journey — deres felles reise",
    text: (
      <div className="space-y-3 text-left">
        <p>Journey er hjartet i ToSom. Kvar match startar med:</p>
        <p>🌿 <strong>Steg 1:</strong> Start reisen — del noko enkelt</p>
        <p>🔥 <strong>Steg 2:</strong> Litt djupare — kva ser du fram til?</p>
        <p>💛 <strong>Steg 3:</strong> Felles refleksjon — kva gjer at du trivst?</p>
        <p className="text-gold pt-2">Etter steg 3 får dere ein liten feiring 🎉</p>
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
