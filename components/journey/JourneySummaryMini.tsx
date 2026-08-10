"use client";

import { journeyAPI } from "@/lib/journey/engine";

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
  const phase = journeyAPI.getPhaseForDay(day);
  const phaseLabel =
    phase.phase === "EARLY"
      ? "Fase 1 — Utforsking"
      : phase.phase === "BUILDING_TRUST"
      ? "Fase 2 — Tillitsbyggende"
      : phase.phase === "DEEPER"
      ? "Fase 3 — Fordypning"
      : "Fase 4 — Oppsummering";

  const isJourneyActive = day >= 1 && day <= 30;
  const photosAllowed = day >= 15;
  const phaseInfo = isJourneyActive
    ? photosAllowed
      ? "Bilder er tilgjengelige"
      : "Ingen bilder ennå"
    : "Reisen er ikke startet";

  const themeLabel = THEME_LABELS[dayConfig.theme] ?? "Utforsking";
  const icon = THEME_ICONS[dayConfig.theme] ?? "🌱";

  return (
    <div className="text-sm text-stone-600 leading-relaxed">
      <span className="font-medium">{icon}</span>{" "}
      Dag {dayConfig.dayNumber} av 30 — {themeLabel}. {phaseLabel}. {phaseInfo}.{" "}
      <span className="italic">{dayConfig.microInsight}</span>
    </div>
  );
}