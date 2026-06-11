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
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-2xl mx-auto py-10 px-4 space-y-10">
          <div>
            <h1 className="text-3xl font-light text-white">Reisen deres</h1>
            <p className="text-gray-400 mt-1">Steg for steg, saman</p>
          </div>
          <div className="text-gray-400 text-sm text-center py-2">
            Reisen din lastast ikke riktig akkurat no.
          </div>
        </div>
      </div>
    );
  }

  const prev = journeyAPI.getPreviousDay(day);
  const next = journeyAPI.getNextDay(day);

  const phaseColorMap: Record<string, string> = {
    EARLY: "bg-white/5 border-white/10",
    BUILDING_TRUST: "bg-white/5 border-white/10",
    DEEPER: "bg-white/5 border-white/10",
    CHECKIN: "bg-white/5 border-white/10",
  };
  const phaseBg = phaseColorMap[phaseConfig.phase] ?? phaseColorMap.EARLY;

  const faseTekst = journeyState.journeyCompleted
    ? "Denne matchen er ferdig. Reisen varer i 35 dagar."
    : !journeyState.journeyActive
    ? "Reisen din er ikkje starta enno."
    : `Fase ${phaseConfig.phase === "EARLY" ? "1" : "2"}`;

  const faseUnderTekst = journeyState.journeyCompleted
    ? "Takk for at dere gav kvarandre 35 dagar."
    : !journeyState.journeyActive
    ? "Du kan starte reisen når du er klar."
    : journeyState.photosAllowed
    ? "Du kan no dele bilete med matchen din."
    : "Denne delen av reisen er utan bilete.";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto py-10 px-4 space-y-10">
        {/* Header */}
        <div className="sticky top-0 bg-gray-950/80 backdrop-blur-sm py-4 z-10 border-b border-white/10 -mx-4 px-4">
          <div>
            <h1 className="text-3xl font-light text-white">Reisen deres</h1>
            <p className="text-gray-400 mt-1">Steg for steg, saman</p>
          </div>
        </div>

        {/* Progresjon */}
        <JourneyTimeline day={day} />

        {/* Tittel + dagnummer */}
        <section className="space-y-2">
          <h2 className="text-xl font-light text-white">
            <span className="mr-2">{dayConfig.icon}</span>
            Dag {dayConfig.dayNumber}: {dayConfig.title}
          </h2>
          <p className="text-gray-300 leading-relaxed text-sm">
            {phaseConfig.description}
          </p>
        </section>

        {/* Fase-status */}
        <section className={`rounded-2xl p-4 border ${phaseBg} backdrop-blur-sm shadow-md shadow-black/20`}>
          <p className="text-sm text-gray-200 leading-relaxed font-medium">
            {faseTekst}
          </p>
          <p className="text-xs text-gray-400 leading-relaxed mt-1">
            {faseUnderTekst}
          </p>
        </section>

        {/* Systemmelding */}
        <section className="space-y-3">
          <h3 className="text-lg font-medium text-white">Systemmelding</h3>
          <SystemMessageBox messages={journeyState.messages} />
        </section>

        {/* Refleksjon */}
        <section className="space-y-3">
          <h3 className="text-lg font-medium text-white">Refleksjon</h3>
          <ReflectionBox
            reflectionText={dayConfig.reflectionPrompt}
            reflectionType="info"
          />
        </section>

        {/* Dagens innsikt */}
        <section className="space-y-3">
          <h3 className="text-lg font-medium text-white">Dagens innsikt</h3>
          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 shadow-md shadow-black/20 space-y-4">
            <p className="text-gray-300 leading-relaxed text-sm">
              {dayConfig.microInsight}
            </p>
          </div>
        </section>

        {/* Progresjonshint */}
        <section className="space-y-3">
          <h3 className="text-lg font-medium text-white">Progresjon</h3>
          <p className="text-gray-300 leading-relaxed text-sm">
            {dayConfig.progressionHint}
          </p>
        </section>

        {/* Progresjonskontroll */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => {
              // Navigasjon hanna av journey-engine
            }}
            disabled={day <= 1}
            className="w-full rounded-xl bg-white/10 border border-white/10 text-gray-200 py-3 hover:bg-white/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Tidlegare dag
          </button>
          <button
            onClick={() => {
              // Navigasjon hanna av journey-engine
            }}
            disabled={day >= 35}
            className="w-full rounded-xl bg-white text-gray-900 font-medium py-3 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Neste dag →
          </button>
        </div>
      </div>
    </div>
  );
}
