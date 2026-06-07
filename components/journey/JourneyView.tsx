"use client";

import { journeyAPI } from "./journeyEngine";
import { journeyPhasesAPI } from "../../lib/journey/journeyPhases";
import { journeyStateAPI, dummyMatchContext } from "../../lib/journey/journeyStateEngine";
import JourneyTimeline from "../conversation/JourneyTimeline";
import SystemMessageBox from "../system/SystemMessageBox";
import ReflectionBox from "../dashboard/ReflectionBox";

/** JourneyView – dagvisning for Dag 1–35. */

interface JourneyViewProps {
  currentDay?: number;
}

export default function JourneyView({ currentDay }: JourneyViewProps) {
  const day = currentDay ?? journeyAPI.getCurrentDay();
  const journeyState = journeyStateAPI.getJourneyState({
    matchContext: dummyMatchContext,
    currentDay: day,
  });
  const dayConfig = journeyAPI.getDayConfig(day);
  const phaseConfig = journeyPhasesAPI.getPhaseForDay(day);

  // Fallback-visning
  if (!dayConfig || dayConfig.dayNumber === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-sm leading-relaxed text-[#4A4A4A]">
          Reisen din lastes ikkje riktig akkurat no.
        </p>
      </div>
    );
  }

  const prev = journeyAPI.getPreviousDay(day);
  const next = journeyAPI.getNextDay(day);

  // Fase-farger
  const phaseColorMap: Record<string, string> = {
    EARLY: "bg-[#F7F1E3] border-[#CBAA7A]/20",
    BUILDING_TRUST: "bg-[#E7EEF4] border-[#7BA3C4]/20",
    DEEPER: "bg-[#E6F3EC] border-[#6BAA7E]/20",
    CHECKIN: "bg-[#F0EBE1] border-[#8B7355]/20",
  };
  const phaseBg = phaseColorMap[phaseConfig.phase] ?? phaseColorMap.EARLY;

  // Fasevisning
  const faseTekst = journeyState.journeyCompleted
    ? "Denne matchen er ferdig. Reisa varer i 35 dagar."
    : !journeyState.journeyActive
    ? "Reisa di er ikkje starta ennå."
    : `Fase ${phaseConfig.phase === "EARLY" ? "1" : "2"}`;

  const faseUnderTekst = journeyState.journeyCompleted
    ? "Takk for at du gav kvarandre 35 dagar."
    : !journeyState.journeyActive
    ? "Du kan starte reisa når du er klar."
    : journeyState.photosAllowed
    ? "Du kan no dele bilete med matchen din."
    : "Denne delen av reisa er utan bilete.";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 scroll-smooth space-y-6">
      {/* Progresjon */}
      <JourneyTimeline day={day} />

      {/* Tittel + dagnummer */}
      <div className="space-y-2">
        <h2 className="text-lg font-medium text-[#2F3A45] leading-relaxed">
          <span className="mr-2">{dayConfig.icon}</span>
          Dag {dayConfig.dayNumber}: {dayConfig.title}
        </h2>
        <p className="text-sm text-[#4A4A4A] leading-relaxed">
          {phaseConfig.description}
        </p>
      </div>

      <div className="h-px bg-black/5" />

      {/* Fase-status */}
      <div className={`rounded-xl p-3 border ${phaseBg}`}>
        <p className="text-sm text-[#4A4A4A] leading-relaxed font-medium">
          {faseTekst}
        </p>
        <p className="text-xs text-[#4A4A4A] leading-relaxed mt-1">
          {faseUnderTekst}
        </p>
      </div>

      <div className="h-px bg-black/5" />

      {/* Systemmelding */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[#4A4A4A]">Systemmelding</h3>
        <SystemMessageBox messages={journeyState.messages} />
      </div>

      <div className="h-px bg-black/5" />

      {/* Refleksjon */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[#4A4A4A]">Refleksjon</h3>
        <ReflectionBox
          reflectionText={dayConfig.reflectionPrompt}
          reflectionType="info"
        />
      </div>

      <div className="h-px bg-black/5" />

      {/* Micro-innsikt */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[#4A4A4A]">Dagens innsikt</h3>
        <div className="bg-[#F7F1E3] p-3 rounded-lg text-sm leading-relaxed text-[#4A4A4A]">
          {dayConfig.microInsight}
        </div>
      </div>

      <div className="h-px bg-black/5" />

      {/* Progresjonshint */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[#4A4A4A]">Progresjon</h3>
        <p className="text-sm leading-relaxed text-[#4A4A4A]">
          {dayConfig.progressionHint}
        </p>
      </div>

      <div className="h-px bg-black/5" />

      {/* Progresjonskontroller */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            console.log("Forrige dag:", prev);
          }}
          disabled={day <= 1}
          className="px-4 py-2 rounded-full text-sm bg-[#F7F1E3] text-[#4A4A4A] hover:bg-black/5 disabled:opacity-40 disabled:cursor-default transition-colors"
        >
          ← Forrige dag
        </button>
        <button
          onClick={() => {
            console.log("Neste dag:", next);
          }}
          disabled={day >= 35}
          className="px-4 py-2 rounded-full text-sm bg-[#E7EEF4] text-[#2F3A45] hover:bg-black/5 disabled:opacity-40 disabled:cursor-default transition-colors"
        >
          Neste dag →
        </button>
      </div>
    </div>
  );
}
