"use client";

import { journeyAPI } from "./journeyEngine";
import { journeyPhasesAPI } from "../../lib/journey/journeyPhases";

const THEME_LABELS: Record<string, string> = {
  intro: "Utforsking",
  trygghet: "Trygghet",
  fordypning: "Fordypning",
  modning: "Modning",
  integrasjon: "Integrasjon",
};

const THEME_ICONS: Record<string, string> = {
  intro: "🌱",
  trygghet: "🕊️",
  fordypning: "🌊",
  modning: "🌿",
  integrasjon: "✨",
};

export default function JourneySummaryMini({
  currentDay,
}: {
  currentDay?: number;
}) {
  const day = currentDay ?? journeyAPI.getCurrentDay();
  const dayConfig = journeyAPI.getDayConfig(day);
  const phase = journeyPhasesAPI.getPhaseForDay(day);
  const phaseLabel =
    phase.phase === "EARLY"
      ? "Fase 1 — Utforsking"
      : phase.phase === "BUILDING_TRUST"
      ? "Fase 2 — Tillitsbyggende"
      : phase.phase === "DEEPER"
      ? "Fase 3 — Fordypning"
      : "Fase 4 — Oppsummering";

  const phaseInfo = journeyPhasesAPI.isJourneyActive(day)
    ? journeyPhasesAPI.isPhotosAllowed(day)
      ? "Bilder er tilgjengelige"
      : "Ingen bilder ennå"
    : "Reisen er ikke startet";

  const themeLabel = THEME_LABELS[dayConfig.theme] ?? "Utforsking";
  const icon = THEME_ICONS[dayConfig.theme] ?? "🌱";

  return (
    <div className="text-sm text-stone-600 leading-relaxed">
      <span className="font-medium">{icon}</span>{" "}
      Dag {dayConfig.dayNumber} av 35 — {themeLabel}. {phaseLabel}. {phaseInfo}.{" "}
      <span className="italic">{dayConfig.microInsight}</span>
    </div>
  );
}