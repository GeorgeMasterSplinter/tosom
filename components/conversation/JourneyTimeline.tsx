"use client";

import { journeyPhasesAPI } from "../../lib/journey/journeyPhases";
import { journeyAPI } from "../journey/journeyEngine";

/* ------ Fargepalett per fase ------ */

const phaseStyles: Record<string, { bg: string; accent: string; text: string; milestoneBg: string }> = {
  EARLY: {
    bg: "bg-[#F7F1E3]",
    accent: "bg-[#CBAA7A]",
    text: "text-[#4A4A4A]",
    milestoneBg: "bg-[#CBAA7A]/30",
  },
  BUILDING_TRUST: {
    bg: "bg-[#E7EEF4]",
    accent: "bg-[#7BA3C4]",
    text: "text-[#2F3A45]",
    milestoneBg: "bg-[#7BA3C4]/30",
  },
  DEEPER: {
    bg: "bg-[#E6F3EC]",
    accent: "bg-[#6BAA7E]",
    text: "text-[#2F4538]",
    milestoneBg: "bg-[#6BAA7E]/30",
  },
  CHECKIN: {
    bg: "bg-[#F0EBE1]",
    accent: "bg-[#8B7355]",
    text: "text-[#4A4A4A]",
    milestoneBg: "bg-[#8B7355]/30",
  },
};

/* ------ Nøkkeldagar ------ */

const milestones = [
  { day: 1, label: "Start" },
  { day: 15, label: "Nye bilete" },
  { day: 22, label: "Djupare" },
  { day: 35, label: "Slutt" },
];

/* ------ Komponent ------ */

export default function JourneyTimeline({ day }: { day: number }) {
  const phaseConfig = journeyPhasesAPI.getPhaseForDay(day);
  const phaseStyle = phaseStyles[phaseConfig.phase];
  const progress = Math.min((day / 35) * 100, 100);

  /* Moden reise — ingen systemimpulser lenger */
  if (day > 35) {
    return (
      <div className="mb-3 text-xs text-[#4A4A4A]">
        <span className="mr-1">✨</span>
        Moden reise — ingen systemimpulser lenger
      </div>
    );
  }

  return (
    <div className={`mb-3 rounded-xl p-3 ${phaseStyle.bg} border border-[#CBAA7A]/20`}>
      {/* Tittel + fase */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base leading-none">
          {journeyAPI.resolveTheme(day) === "intro" && "🌱"}
          {journeyAPI.resolveTheme(day) === "trygghet" && "🕊️"}
          {journeyAPI.resolveTheme(day) === "fordypning" && "🌊"}
          {journeyAPI.resolveTheme(day) === "modning" && "🌿"}
          {journeyAPI.resolveTheme(day) === "integrasjon" && "✨"}
        </span>
        <div className="text-xs font-medium text-[#4A4A4A]">
          Dag {day} av 35
        </div>
        <div className="ml-auto text-xs text-[#4A4A4A]/70">
          {phaseConfig.description}
        </div>
      </div>

      {/* Progresjonslinje */}
      <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
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
                    ? phaseStyle.accent
                    : phaseStyle.milestoneBg
                } border border-white`}
              />
              <div
                className={`mt-0.5 text-[9px] whitespace-nowrap ${
                  passed ? phaseStyle.text : "text-[#4A4A4A]/40"
                }`}
              >
                {m.label}
              </div>
            </div>
          );
        })}

        {/* Nå-måler */}
        <div
          className="absolute -top-0.5 w-3 h-3 rounded-full bg-white border-2 border-[#4A4A4A] shadow-sm"
          style={{ left: `${progress}%`, transform: "translateX(-50%)" }}
        />
      </div>
    </div>
  );
}
