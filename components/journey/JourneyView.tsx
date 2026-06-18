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
      <section className="section fade-in max-w-2xl mx-auto text-center">
        <h1 className="font-semibold text-[var(--color-text)] tracking-tight text-3xl">
          Reisen deres
        </h1>
        <p className="text-[var(--color-muted)] mt-[var(--space-sm)]">
          Reisen din lastast ikkje riktig akkurat no.
        </p>
      </section>
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
    <section className="section fade-in max-w-3xl mx-auto flex flex-col gap-[var(--space-xl)]">

      {/* Header */}
      <header className="fade-in">
        <h1 className="font-semibold text-[var(--color-text)] tracking-tight text-2xl">
          Reisen deres
        </h1>
        <p className="text-[var(--color-muted)] mt-[var(--space-xs)]">
          Steg for steg, saman
        </p>
      </header>

      {/* Progresjon */}
      <JourneyTimeline day={day} />

      {/* Tittel + dagnummer */}
      <section className="fade-in flex flex-col gap-[var(--space-sm)]">
        <h2 className="font-semibold text-[var(--color-text)] tracking-tight text-xl">
          <span className="mr-2">{dayConfig.icon}</span>
          Dag {dayConfig.dayNumber}: {dayConfig.title}
        </h2>
        <p className="text-[var(--color-muted)] leading-[var(--line-relaxed)] text-lg">
          {phaseConfig.description}
        </p>
      </section>

      {/* Fase-status */}
      <section
        className={`card fade-in flex flex-col gap-[var(--space-xs)] p-[var(--space-md)] ${phaseBg}`}
      >
        <p className="font-medium text-[var(--color-text)] leading-[var(--line-relaxed)]">
          {faseTekst}
        </p>
        <p className="text-[var(--color-muted)] text-sm leading-[var(--line-relaxed)]">
          {faseUnderTekst}
        </p>
      </section>

      {/* Systemmelding */}
      <section className="fade-in flex flex-col gap-[var(--space-sm)]">
        <h3 className="font-semibold text-[var(--color-text)] tracking-tight text-lg">
          Systemmelding
        </h3>
        <SystemMessageBox messages={journeyState.messages} />
      </section>

      {/* Refleksjon */}
      <section className="fade-in flex flex-col gap-[var(--space-sm)]">
        <h3 className="font-semibold text-[var(--color-text)] tracking-tight text-lg">
          Refleksjon
        </h3>
        <ReflectionBox
          reflectionText={dayConfig.reflectionPrompt}
          reflectionType="info"
        />
      </section>

      {/* Dagens innsikt */}
      <section className="fade-in flex flex-col gap-[var(--space-sm)]">
        <h3 className="font-semibold text-[var(--color-text)] tracking-tight text-lg">
          Dagens innsikt
        </h3>
        <div className="card fade-in p-[var(--space-lg)] space-y-[var(--space-sm)]">
          <p className="text-[var(--color-muted)] leading-[var(--line-relaxed)] text-lg">
            {dayConfig.microInsight}
          </p>
        </div>
      </section>

      {/* Progresjonshint */}
      <section className="fade-in flex flex-col gap-[var(--space-sm)]">
        <h3 className="font-semibold text-[var(--color-text)] tracking-tight text-lg">
          Progresjon
        </h3>
        <p className="text-[var(--color-muted)] leading-[var(--line-relaxed)] text-lg">
          {dayConfig.progressionHint}
        </p>
      </section>

      {/* Navigasjon */}
      <div className="fade-in flex justify-between gap-[var(--space-md)] pt-[var(--space-md)]">
        <button
          disabled={day <= 1}
          className="btn-secondary w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Tidlegare dag
        </button>

        <button
          disabled={day >= 35}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Neste dag →
        </button>
      </div>
    </section>
  );
}
