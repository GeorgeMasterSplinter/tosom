"use client";

import { journeyPhasesAPI } from "../../lib/journey/journeyPhases";
import { journeyAPI } from "../journey/journeyEngine";

const phaseStyles: Record<string, { accent: string; text: string }> = {
  EARLY: {
    accent: "bg-white/10",
    text: "text-gray-200",
  },
  BUILDING_TRUST: {
    accent: "bg-white/10",
    text: "text-gray-200",
  },
  DEEPER: {
    accent: "bg-white/10",
    text: "text-gray-200",
  },
  CHECKIN: {
    accent: "bg-white/10",
    text: "text-gray-200",
  },
};

const milestones = [
  { day: 1, label: "Start" },
  { day: 15, label: "Bilder" },
  { day: 22, label: "Djupare" },
  { day: 35, label: "Slutt" },
];

export default function JourneyTimeline({ day }: { day: number }) {
  const phaseConfig = journeyPhasesAPI.getPhaseForDay(day);
  const phaseStyle = phaseStyles[phaseConfig.phase];
  const progress = Math.min((day / 35) * 100, 100);

  if (day > 35) {
    return (
      <div className="text-center text-gray-400 text-sm py-2">
        Reisa er fullført.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-4 shadow-md shadow-black/20">
      {/* Tittel + fase */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base leading-none">
          {journeyAPI.resolveTheme(day) === "intro" && "🌱"}
          {journeyAPI.resolveTheme(day) === "trygghet" && "🕊️"}
          {journeyAPI.resolveTheme(day) === "fordypning" && "🌊"}
          {journeyAPI.resolveTheme(day) === "modning" && "🌿"}
          {journeyAPI.resolveTheme(day) === "integrasjon" && "✨"}
        </span>
        <div className={`text-sm font-medium ${phaseStyle.text}`}>
          Dag {day} av 35
        </div>
        <div className="ml-auto text-sm text-gray-400">
          {phaseConfig.description}
        </div>
      </div>

      {/* Progresjonslinje */}
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${phaseStyle.accent} rounded-full transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Nøkkeldagar */}
      <div className="relative mt-2 h-4">
        {milestones.map((m) => {
          const left = `${(m.day / 35) * 100}%`;
          const passed = day >= m.day;

          return (
            <div
              key={m.day}
              className="absolute -top-0.5 flex flex-col items-center"
              style={{ left, transform: "translateX(-50%)" }}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  passed
                    ? "bg-green-400"
                    : "bg-white/10"
                } border border-gray-950`}
              />
              <div
                className={`mt-0.5 text-[9px] whitespace-nowrap ${
                  passed ? "text-green-400" : "text-gray-500"
                }`}
              >
                {m.label}
              </div>
            </div>
          );
        })}

        {/* Nå-måler */}
        <div
          className="absolute -top-0.5 w-3 h-3 rounded-full bg-white border-2 border-gray-950 shadow-sm"
          style={{ left: `${progress}%`, transform: "translateX(-50%)" }}
        />
      </div>
    </div>
  );
}
